// lib/agents/escalationAgent.ts — Agent 4: Escalation detection + alert

import { sendEscalationEmail, type EscalationEmailParams } from './emailAgent';
import { appendLog, type LogEntry } from '../logger';

const ESCALATION_KEYWORDS = [
  'urgent',
  'lawyer',
  'refund',
  'broken',
  'fraud',
  'legal',
  'sue',
  'complaint',
  'unacceptable',
  'scam',
  'stolen',
  'hack',
  'breach',
];

const CONFIDENCE_THRESHOLD = 0.7;

export interface EscalationCheckInput {
  customerName: string;
  customerEmail: string;
  message: string;
  aiResponse: string;
  confidence: number;
  category: string;
  ticketId: string;
  suggestedActions: string[];
  sessionId?: string;
  channel: 'chat' | 'contact';
}

export interface EscalationResult {
  shouldEscalate: boolean;
  reason: string;
  keywordsFound: string[];
}

/**
 * Check if a conversation should be escalated
 */
export function checkEscalation(message: string, confidence: number): EscalationResult {
  const lowerMessage = message.toLowerCase();
  const keywordsFound = ESCALATION_KEYWORDS.filter((kw) => lowerMessage.includes(kw));

  const lowConfidence = confidence < CONFIDENCE_THRESHOLD;
  const hasKeywords = keywordsFound.length > 0;

  if (!lowConfidence && !hasKeywords) {
    return { shouldEscalate: false, reason: '', keywordsFound: [] };
  }

  const reasons: string[] = [];
  if (lowConfidence) reasons.push(`Low AI confidence (${(confidence * 100).toFixed(0)}%)`);
  if (hasKeywords) reasons.push(`Escalation keywords detected: ${keywordsFound.join(', ')}`);

  return {
    shouldEscalate: true,
    reason: reasons.join(' | '),
    keywordsFound,
  };
}

/**
 * Process escalation: send alert email and log the entry
 */
export async function processEscalation(input: EscalationCheckInput): Promise<{
  escalated: boolean;
  reason: string;
  emailSent: boolean;
}> {
  const escalation = checkEscalation(input.message, input.confidence);

  // Always log the conversation
  const logEntry: LogEntry = {
    id: input.ticketId,
    timestamp: new Date().toISOString(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    category: input.category,
    message: input.message,
    aiResponse: input.aiResponse,
    confidence: input.confidence,
    suggestedActions: input.suggestedActions,
    emailSent: false, // Will be updated by email agent
    escalated: escalation.shouldEscalate,
    escalationReason: escalation.reason || undefined,
    sessionId: input.sessionId,
    channel: input.channel,
  };

  await appendLog(logEntry);

  if (!escalation.shouldEscalate) {
    return { escalated: false, reason: '', emailSent: false };
  }

  // Send escalation email
  const emailParams: EscalationEmailParams = {
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    originalQuestion: input.message,
    aiResponse: input.aiResponse,
    ticketId: input.ticketId,
    category: input.category,
    escalationReason: escalation.reason,
    confidence: input.confidence,
  };

  const emailResult = await sendEscalationEmail(emailParams);

  return {
    escalated: true,
    reason: escalation.reason,
    emailSent: emailResult.success,
  };
}
