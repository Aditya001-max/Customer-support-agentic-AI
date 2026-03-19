// lib/agents/intakeAgent.ts — Agent 1: Validation + Classification

export interface IntakeInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export type Category = 'billing' | 'technical' | 'general' | 'refund' | 'shipping';

export interface IntakeResult {
  valid: boolean;
  errors: string[];
  category: Category;
  sanitizedInput: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  billing: ['bill', 'billing', 'invoice', 'payment', 'charge', 'subscription', 'pricing', 'plan', 'cost', 'fee'],
  technical: ['bug', 'error', 'crash', 'broken', 'not working', 'issue', 'technical', 'api', 'integration', 'code', 'deploy', 'server', 'loading', 'slow', 'login'],
  refund: ['refund', 'money back', 'cancel', 'cancellation', 'return', 'reimburse', 'chargeback'],
  shipping: ['shipping', 'delivery', 'ship', 'track', 'tracking', 'package', 'order', 'arrived', 'delayed', 'lost'],
  general: [],
};

function classifyCategory(text: string): Category {
  const lower = text.toLowerCase();
  let bestCategory: Category = 'general';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'general') continue;
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as Category;
    }
  }

  return bestCategory;
}

/**
 * Validate and classify incoming customer input
 */
export function processIntake(input: IntakeInput): IntakeResult {
  const errors: string[] = [];

  const name = (input.name || '').trim();
  const email = (input.email || '').trim();
  const subject = (input.subject || '').trim();
  const message = (input.message || '').trim();

  if (!name) errors.push('Name is required');
  if (!email) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  }
  if (!message) errors.push('Message is required');

  const combinedText = `${subject} ${message}`;
  const category = classifyCategory(combinedText);

  return {
    valid: errors.length === 0,
    errors,
    category,
    sanitizedInput: { name, email, subject: subject || 'Support Request', message },
  };
}
