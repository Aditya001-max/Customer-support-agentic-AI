// lib/claude.ts — Anthropic SDK singleton + streaming helper
import Anthropic from '@anthropic-ai/sdk';
import { config } from './config';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: config.anthropic.apiKey() });
  }
  return client;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Stream a chat response from Claude.
 * Returns a ReadableStream suitable for SSE responses.
 */
export async function streamChatResponse(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const anthropic = getClient();

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const data = JSON.stringify({ token: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Get a complete (non-streaming) response from Claude.
 */
export async function getChatResponse(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}
