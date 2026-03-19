// lib/agents/demoResponseAgent.ts — Fallback demo responses when no API key is configured
import type { Category } from './intakeAgent';

const DEMO_RESPONSES: Record<Category, string[]> = {
  billing: [
    "Thank you for reaching out about your billing concern! I completely understand how important it is to have clarity on your charges.\n\nI've reviewed the common billing scenarios, and here's what I can help with:\n\n1. **Subscription charges** — Our billing cycles are monthly, and charges typically appear 1-2 business days after the renewal date.\n2. **Unexpected charges** — Sometimes prorated amounts appear when you upgrade or change your plan mid-cycle.\n3. **Invoice requests** — You can download invoices directly from your account settings under Billing → Invoice History.\n\nIf you need a specific charge investigated, please share the charge date and amount. Our billing team can look into it within 24 hours.\n\nIs there anything else I can help you with?",
  ],
  technical: [
    "Thanks for reporting this technical issue! I understand how frustrating it can be when things don't work as expected.\n\nBased on common technical issues, here are some steps that often resolve things:\n\n1. **Clear your browser cache** — Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac) and clear cached files.\n2. **Try an incognito window** — This rules out browser extension conflicts.\n3. **Check your internet connection** — Try loading other sites to confirm connectivity.\n4. **Update your browser** — Ensure you're on the latest version of Chrome, Firefox, or Edge.\n\nIf the issue persists after trying these steps, our engineering team can investigate further. We typically resolve technical issues within 4-8 hours.\n\nWould you like me to create a priority support ticket for this?",
  ],
  refund: [
    "I understand you'd like to discuss a refund, and I want to make sure we handle this properly for you.\n\nHere's our general refund process:\n\n1. **Within 30 days of purchase** — Full refunds are typically processed without issue.\n2. **30-90 days** — Partial refunds or account credits may be available depending on usage.\n3. **Processing time** — Approved refunds appear in your account within 5-10 business days.\n\n⚠️ Since refund requests require account verification, I'm flagging this for our billing team to review your specific case. A human agent will reach out to you within 2-4 hours with next steps.\n\nIn the meantime, could you provide your order/transaction ID? This will help speed up the process.\n\nIs there anything else I can assist you with?",
  ],
  shipping: [
    "Thank you for reaching out about your shipping concern! Let me help you get this sorted.\n\nHere's what I can tell you about our shipping:\n\n1. **Standard shipping** — Typically 5-7 business days within the US.\n2. **Express shipping** — 2-3 business days for priority orders.\n3. **International** — 10-15 business days depending on the destination.\n\n**To track your order**: Check your confirmation email for a tracking link, or log into your account → Orders → Track Shipment.\n\nIf your package appears to be delayed or lost, our logistics team can initiate a trace with the carrier. We usually resolve shipping issues within 48 hours.\n\nCould you share your order number so I can look into the specific status?",
  ],
  general: [
    "Thanks for reaching out! I'm happy to help you with your question.\n\nHere are some resources that might be useful:\n\n1. **Help Center** — Our documentation covers most common questions and includes step-by-step guides.\n2. **Community Forum** — Connect with other users who may have experienced similar situations.\n3. **Account Settings** — Many common account changes can be made directly from your dashboard.\n\nIf you need more specific assistance, I'm here to help! Just let me know more details about what you're looking for, and I'll do my best to provide a thorough answer.\n\nIs there a particular topic you'd like me to dive deeper into?",
  ],
};

function getDemoResponse(category: Category, customerName: string): string {
  const responses = DEMO_RESPONSES[category];
  const response = responses[Math.floor(Math.random() * responses.length)];
  return `Hi ${customerName}! 👋\n\n${response}`;
}

/**
 * Check if we're in demo mode (no API key configured)
 */
export function isDemoMode(): boolean {
  return !process.env.ANTHROPIC_API_KEY;
}

/**
 * Generate a simulated streaming response for demo mode
 */
export function getDemoStreamingResponse(
  customerName: string,
  category: Category,
): ReadableStream<Uint8Array> {
  const fullResponse = getDemoResponse(category, customerName);
  const encoder = new TextEncoder();

  // Split into words to simulate streaming
  const words = fullResponse.split(' ');

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const token = (i === 0 ? '' : ' ') + words[i];
        const data = JSON.stringify({ token });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        // Small delay for realistic streaming feel
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

/**
 * Get a complete demo response (non-streaming, for contact form)
 */
export function getDemoCompleteResponse(
  customerName: string,
  category: Category,
): { aiResponse: string; confidence: number; suggestedActions: string[] } {
  const aiResponse = getDemoResponse(category, customerName);

  const suggestedActionsByCategory: Record<Category, string[]> = {
    billing: ['Check your billing dashboard for invoice details', 'Contact billing@support.com for specific charge inquiries'],
    technical: ['Clear browser cache and try again', 'Check the status page for any ongoing incidents', 'Submit a bug report with screenshots'],
    refund: ['Prepare your order/transaction ID', 'Review the refund policy in our Help Center'],
    shipping: ['Track your order using the link in your confirmation email', 'Contact the carrier directly for real-time updates'],
    general: ['Visit our Help Center for detailed guides', 'Join our community forum for peer support'],
  };

  return {
    aiResponse,
    confidence: category === 'refund' ? 0.6 : 0.88,
    suggestedActions: suggestedActionsByCategory[category],
  };
}
