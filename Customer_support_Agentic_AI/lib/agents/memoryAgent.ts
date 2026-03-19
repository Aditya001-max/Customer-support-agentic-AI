// lib/agents/memoryAgent.ts — Agent 5: Session context management
import type { ChatMessage } from '../claude';

interface SessionData {
  messages: ChatMessage[];
  lastActivity: number;
  customerName: string;
  customerEmail: string;
}

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CONTEXT_MESSAGES = 6;

// In-memory session store (server-side singleton via module scope)
const sessions = new Map<string, SessionData>();

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Initialize or update a session with customer info
 */
export function initSession(
  sessionId: string,
  customerName: string,
  customerEmail: string
): void {
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.customerName = customerName;
    existing.customerEmail = customerEmail;
    existing.lastActivity = Date.now();
  } else {
    sessions.set(sessionId, {
      messages: [],
      lastActivity: Date.now(),
      customerName,
      customerEmail,
    });
  }
}

/**
 * Add a message to the session history
 */
export function addMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.messages.push({ role, content });
  session.lastActivity = Date.now();
}

/**
 * Get the last N messages as context for Claude
 */
export function getContext(sessionId: string): ChatMessage[] {
  const session = sessions.get(sessionId);
  if (!session) return [];

  // Check if session has expired
  if (Date.now() - session.lastActivity > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return [];
  }

  session.lastActivity = Date.now();
  return session.messages.slice(-MAX_CONTEXT_MESSAGES);
}

/**
 * Get customer info from session
 */
export function getSessionInfo(sessionId: string): {
  customerName: string;
  customerEmail: string;
} | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  if (Date.now() - session.lastActivity > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return null;
  }

  return {
    customerName: session.customerName,
    customerEmail: session.customerEmail,
  };
}

/**
 * Clean up stale sessions (call periodically)
 */
export function cleanupStaleSessions(): number {
  const now = Date.now();
  let cleaned = 0;

  Array.from(sessions.entries()).forEach(([sessionId, session]) => {
    if (now - session.lastActivity > SESSION_TTL_MS) {
      sessions.delete(sessionId);
      cleaned++;
    }
  });

  return cleaned;
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupStaleSessions, 5 * 60 * 1000);
}
