// lib/agents/responseAgent.ts — Agent 2: Claude-powered response generation
import { streamChatResponse, getChatResponse, type ChatMessage } from '../claude';
import type { Category } from './intakeAgent';

const SUPPORT_SYSTEM_PROMPT = `You are a highly professional, empathetic, and helpful AI customer support agent for a technology company. Your role is to:

1. Address the customer by their name when provided
2. Acknowledge their concern with empathy
3. Provide clear, accurate, and actionable answers
4. Suggest next steps or additional resources when helpful
5. Maintain a warm but professional tone throughout

Guidelines:
- Be concise but thorough — aim for 2-4 paragraphs
- If you're unsure about something, be transparent and suggest human escalation
- Never make up specific policy details — instead direct to the support team
- For billing/refund issues, be extra careful and empathetic
- Always end with an offer to help further

IMPORTANT: At the very end of your response, on a new line, output a JSON metadata block in the following exact format:
<!--METADATA:{"confidence":0.85,"suggestedActions":["action1","action2"]}-->

The confidence score should be between 0 and 1:
- 0.9-1.0: Very confident in the answer
- 0.7-0.89: Reasonably confident
- 0.5-0.69: Somewhat uncertain, might need human review
- Below 0.5: Low confidence, should escalate

The suggestedActions should be 1-3 specific follow-up actions the customer could take.`;

function buildUserMessage(
  customerName: string,
  category: Category,
  message: string
): string {
  return `Customer Name: ${customerName}
Category: ${category}
Customer Message: ${message}`;
}

export interface ParsedResponse {
  aiResponse: string;
  confidence: number;
  suggestedActions: string[];
}

/**
 * Parse the AI response to extract metadata
 */
export function parseResponse(fullResponse: string): ParsedResponse {
  const metadataRegex = /<!--METADATA:([\s\S]*?)-->/;
  const match = fullResponse.match(metadataRegex);

  let confidence = 0.8;
  let suggestedActions: string[] = [];
  let aiResponse = fullResponse;

  if (match) {
    try {
      const metadata = JSON.parse(match[1]);
      confidence = metadata.confidence || 0.8;
      suggestedActions = metadata.suggestedActions || [];
      aiResponse = fullResponse.replace(metadataRegex, '').trim();
    } catch {
      // Failed to parse metadata, use defaults
    }
  }

  return { aiResponse, confidence, suggestedActions };
}

/**
 * Get a streaming response from Claude (for chat widget)
 */
export async function getStreamingResponse(
  customerName: string,
  category: Category,
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ReadableStream<Uint8Array>> {
  const userMessage = buildUserMessage(customerName, category, message);

  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  return streamChatResponse(SUPPORT_SYSTEM_PROMPT, messages);
}

/**
 * Get a complete response from Claude (for contact form)
 */
export async function getCompleteResponse(
  customerName: string,
  category: Category,
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ParsedResponse> {
  const userMessage = buildUserMessage(customerName, category, message);

  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  const fullResponse = await getChatResponse(SUPPORT_SYSTEM_PROMPT, messages);
  return parseResponse(fullResponse);
}
