// app/api/escalate/route.ts — Manual escalation trigger
import { NextRequest } from 'next/server';
import { sendEscalationEmail } from '@/lib/agents/emailAgent';
import { readLogs, appendLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, reason } = body;

    if (!ticketId || !reason) {
      return Response.json(
        { error: 'ticketId and reason are required' },
        { status: 400 }
      );
    }

    // Find the original log entry
    const logs = readLogs();
    const originalEntry = logs.find((log) => log.id === ticketId);

    if (!originalEntry) {
      return Response.json(
        { error: `Ticket ${ticketId} not found` },
        { status: 404 }
      );
    }

    // Send escalation email
    const emailResult = await sendEscalationEmail({
      customerName: originalEntry.customerName,
      customerEmail: originalEntry.customerEmail,
      originalQuestion: originalEntry.message,
      aiResponse: originalEntry.aiResponse,
      ticketId,
      category: originalEntry.category,
      escalationReason: `Manual escalation: ${reason}`,
      confidence: originalEntry.confidence,
    });

    // Log the manual escalation
    await appendLog({
      id: `${ticketId}-manual-escalation`,
      timestamp: new Date().toISOString(),
      customerName: originalEntry.customerName,
      customerEmail: originalEntry.customerEmail,
      category: originalEntry.category,
      message: originalEntry.message,
      aiResponse: originalEntry.aiResponse,
      confidence: originalEntry.confidence,
      suggestedActions: originalEntry.suggestedActions,
      emailSent: emailResult.success,
      emailError: emailResult.error,
      escalated: true,
      escalationReason: `Manual: ${reason}`,
      channel: originalEntry.channel,
    });

    return Response.json({
      success: true,
      ticketId,
      escalated: true,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error('Escalation API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
