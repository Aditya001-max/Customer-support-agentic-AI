// app/api/contact/route.ts — Contact form submission (Agent 1 + 2 + 3 + 4)
import { NextRequest } from 'next/server';
import { processIntake } from '@/lib/agents/intakeAgent';
import { getCompleteResponse } from '@/lib/agents/responseAgent';
import { isDemoMode, getDemoCompleteResponse } from '@/lib/agents/demoResponseAgent';
import { sendCustomerEmail } from '@/lib/agents/emailAgent';
import { processEscalation } from '@/lib/agents/escalationAgent';
import { generateTicketId, appendLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Agent 1: Intake — validate and classify
    const intake = processIntake({ name, email, subject, message });

    if (!intake.valid) {
      return Response.json(
        { error: 'Validation failed', details: intake.errors },
        { status: 400 }
      );
    }

    const ticketId = generateTicketId();
    const demoMode = isDemoMode();

    // Agent 2: Response — get AI response (or demo fallback)
    let aiResponse: string;
    let confidence: number;
    let suggestedActions: string[];

    if (demoMode) {
      const demo = getDemoCompleteResponse(
        intake.sanitizedInput.name,
        intake.category
      );
      aiResponse = demo.aiResponse;
      confidence = demo.confidence;
      suggestedActions = demo.suggestedActions;
    } else {
      const result = await getCompleteResponse(
        intake.sanitizedInput.name,
        intake.category,
        intake.sanitizedInput.message
      );
      aiResponse = result.aiResponse;
      confidence = result.confidence;
      suggestedActions = result.suggestedActions;
    }

    // Agent 3: Email — send customer reply (skip in demo mode)
    let emailSent = false;
    if (!demoMode) {
      const emailResult = await sendCustomerEmail({
        customerName: intake.sanitizedInput.name,
        customerEmail: intake.sanitizedInput.email,
        originalQuestion: intake.sanitizedInput.message,
        aiResponse,
        ticketId,
        category: intake.category,
      });
      emailSent = emailResult.success;
    }

    // Agent 4: Escalation — check and process (skip email in demo mode)
    const escalated = !demoMode
      ? (await processEscalation({
          customerName: intake.sanitizedInput.name,
          customerEmail: intake.sanitizedInput.email,
          message: intake.sanitizedInput.message,
          aiResponse,
          confidence,
          category: intake.category,
          ticketId,
          suggestedActions,
          channel: 'contact',
        })).escalated
      : confidence < 0.7;

    // Log the conversation
    await appendLog({
      id: ticketId,
      timestamp: new Date().toISOString(),
      customerName: intake.sanitizedInput.name,
      customerEmail: intake.sanitizedInput.email,
      subject: intake.sanitizedInput.subject,
      category: intake.category,
      message: intake.sanitizedInput.message,
      aiResponse,
      confidence,
      suggestedActions,
      emailSent,
      escalated,
      escalationReason: escalated ? 'Auto-detected' : undefined,
      channel: 'contact',
    });

    return Response.json({
      success: true,
      ticketId,
      aiResponse,
      category: intake.category,
      suggestedActions,
      emailSent,
      escalated,
      demoMode,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
