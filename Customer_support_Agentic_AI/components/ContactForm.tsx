'use client';

// components/ContactForm.tsx — Full contact form component
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SubmitResult {
  success: boolean;
  ticketId: string;
  aiResponse: string;
  category: string;
  suggestedActions: string[];
  emailSent: boolean;
  escalated: boolean;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details?.join(', ') || data.error || 'Something went wrong');
        return;
      }

      setResult(data);
    } catch {
      setError('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold">Request Submitted!</h3>
            <p className="text-emerald-100 text-sm mt-1">Ticket #{result.ticketId}</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Category:</span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider border border-indigo-500/30">
                {result.category}
              </span>
              {result.escalated && (
                <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full uppercase tracking-wider border border-red-500/30">
                  🚨 Escalated
                </span>
              )}
            </div>

            {/* AI Response */}
            <div>
              <h4 className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-3">AI Response</h4>
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result.aiResponse}</p>
              </div>
            </div>

            {/* Suggested Actions */}
            {result.suggestedActions.length > 0 && (
              <div>
                <h4 className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-3">Suggested Next Steps</h4>
                <ul className="space-y-2">
                  {result.suggestedActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Email Status */}
            <div className="flex items-center gap-2 text-sm">
              {result.emailSent ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-400">Response emailed to your inbox</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-400">Email could not be sent (check SMTP config)</span>
                </>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 space-y-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white">Get Support</h2>
          <p className="text-slate-400 text-sm mt-1">
            Fill out the form below and our AI agent will respond instantly
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Name *
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Subject
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="">Select a topic...</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Billing Question">Billing Question</option>
            <option value="Refund Request">Refund Request</option>
            <option value="Shipping Issue">Shipping Issue</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Bug Report">Bug Report</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Message *
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe your issue or question in detail..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing with AI...</span>
            </>
          ) : (
            <>
              <span>Submit Request</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-slate-500 text-xs">
          Your message will be analyzed by our AI agent. A response will be sent to your email.
        </p>
      </form>
    </div>
  );
}
