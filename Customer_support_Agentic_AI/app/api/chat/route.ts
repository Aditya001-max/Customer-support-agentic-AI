// app/api/chat/route.ts — Streaming chat endpoint (Agent 1 + 2 + 5)
import { NextRequest } from 'next/server';
import { processIntake } from '@/lib/agents/intakeAgent';
import { getStreamingResponse, parseResponse } from '@/lib/agents/responseAgent';
import { isDemoMode, getDemoStreamingResponse } from '@/lib/agents/demoResponseAgent';
import {
  initSession,
  addMessage,
  getContext,
  getSessionInfo,
  generateSessionId,
} from '@/lib/agents/memoryAgent';
import { processEscalation } from '@/lib/agents/escalationAgent';
import { generateTicketId } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId: rawSessionId, name, email } = body;

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Session management
    const sessionId = rawSessionId || generateSessionId();
    const sessionInfo = getSessionInfo(sessionId);

    const customerName = name || sessionInfo?.customerName || 'Customer';
    const customerEmail = email || sessionInfo?.customerEmail || '';

    // Initialize/update session
    if (customerName && customerEmail) {
      initSession(sessionId, customerName, customerEmail);
    }

    // Agent 1: Intake — classify the message
    const intake = processIntake({
      name: customerName,
      email: customerEmail || 'chat@session.local',
      message,
    });

    // Agent 5: Memory — add user message and get context
    addMessage(sessionId, 'user', message);
    const conversationHistory = getContext(sessionId);

    // Agent 2: Response — stream from Claude (or demo fallback)
    const demoMode = isDemoMode();
    const stream = demoMode
      ? getDemoStreamingResponse(customerName, intake.category)
      : await getStreamingResponse(
          customerName,
          intake.category,
          message,
          conversationHistory.slice(0, -1)
        );

    // Collect the full response for memory + escalation while streaming to client
    let fullResponse = '';
    const encoder = new TextEncoder();

    const transformedStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = stream.getReader();
        try {
          // Send sessionId + category as the first event
          const sessionEvent = JSON.stringify({
            sessionId,
            category: intake.category,
            demoMode,
          });
          controller.enqueue(encoder.encode(`data: ${sessionEvent}\n\n`));

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Parse the SSE data to collect full response
            const text = new TextDecoder().decode(value);
            const lines = text.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const parsed = JSON.parse(line.substring(6));
                  if (parsed.token) {
                    fullResponse += parsed.token;
                  }
                } catch {
                  // ignore parse errors
                }
              }
            }

            controller.enqueue(value);
          }

          controller.close();

          // After streaming is done, save to memory
          const parsed = parseResponse(fullResponse);
          addMessage(sessionId, 'assistant', parsed.aiResponse);

          // Agent 4: Escalation check (background, non-blocking)
          if (!demoMode && customerEmail && customerEmail !== 'chat@session.local') {
            processEscalation({
              customerName,
              customerEmail,
              message,
              aiResponse: parsed.aiResponse,
              confidence: parsed.confidence,
              category: intake.category,
              ticketId: generateTicketId(),
              suggestedActions: parsed.suggestedActions,
              sessionId,
              channel: 'chat',
            }).catch(console.error);
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(transformedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Session-Id': sessionId,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
