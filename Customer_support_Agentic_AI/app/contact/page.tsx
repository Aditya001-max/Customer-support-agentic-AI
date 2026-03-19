import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Support — AI Support Agent",
  description:
    "Submit a support request and get an instant AI-generated response. We handle billing, technical, shipping, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] bg-grid bg-radial-glow relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <img src="/bot-avatar.svg" alt="Logo" className="w-7 h-7" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            AI<span className="text-indigo-400">Support</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </nav>

      {/* Page Content */}
      <main className="relative z-10 px-6 lg:px-16 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-slideDown">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-indigo-300 text-sm font-medium">AI Agent Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              How can we <span className="text-gradient">help you?</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Describe your issue below. Our AI will analyze, respond, and email you a detailed answer.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 animate-slideUp">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-5 animate-slideUp" style={{ animationDelay: "150ms" }}>
              {/* How it works */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  How It Works
                </h3>
                <ol className="space-y-3">
                  {[
                    "Submit your question via this form",
                    "Our AI classifies and analyzes it",
                    "Get an instant response on screen",
                    "Receive a detailed email follow-up",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                      <span className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Categories */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  We Handle
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Billing", "Technical", "Refunds", "Shipping", "General"].map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Response time */}
              <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-2xl border border-indigo-500/20 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">&lt; 10s</div>
                <div className="text-indigo-300 text-sm font-medium">Average Response Time</div>
                <div className="text-slate-500 text-xs mt-1">Powered by Claude AI</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
