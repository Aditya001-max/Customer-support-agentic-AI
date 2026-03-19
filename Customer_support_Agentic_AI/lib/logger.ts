// lib/logger.ts — Append structured entries to support-logs.json
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'support-logs.json');

export interface LogEntry {
  id: string;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  subject?: string;
  category: string;
  message: string;
  aiResponse: string;
  confidence: number;
  suggestedActions: string[];
  emailSent: boolean;
  emailError?: string;
  escalated: boolean;
  escalationReason?: string;
  sessionId?: string;
  channel: 'chat' | 'contact';
}

/**
 * Generate a unique ticket ID
 */
export function generateTicketId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

/**
 * Append a log entry to support-logs.json
 */
export async function appendLog(entry: LogEntry): Promise<void> {
  try {
    let logs: LogEntry[] = [];

    if (fs.existsSync(LOG_FILE)) {
      const raw = fs.readFileSync(LOG_FILE, 'utf-8');
      try {
        logs = JSON.parse(raw);
      } catch {
        // If file is corrupted, start fresh
        logs = [];
      }
    }

    logs.push(entry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write log entry:', error);
  }
}

/**
 * Read all log entries
 */
export function readLogs(): LogEntry[] {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const raw = fs.readFileSync(LOG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}
