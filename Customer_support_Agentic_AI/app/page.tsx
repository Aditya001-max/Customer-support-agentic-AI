'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] bg-grid bg-radial-glow relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <img src="/bot-avatar.svg" alt="Logo" className="w-7 h-7" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            AI<span className="text-indigo-400">Support</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/contact"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            Contact
          </Link>
          <a
            href="#features"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            Features
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 lg:px-16 pt-16 lg:pt-28 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 animate-slideDown">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-indigo-300 text-sm font-medium">
              AI-Powered Support — Available 24/7
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-slideUp">
            Customer Support{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">Reimagined with AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slideUp" style={{ animationDelay: '100ms' }}>
            Get instant, intelligent responses to your questions. Our multi-agent AI system handles classification, responses, email delivery, and escalation — all automatically.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '200ms' }}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
              Submit a Request
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={() => {
                const btn = document.getElementById('chat-widget-toggle');
                if (btn) btn.click();
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 text-white font-semibold rounded-xl border border-slate-700/50 hover:bg-slate-700/80 hover:border-slate-600 transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Try Live Chat
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <section id="features" className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "🧠",
              title: "Smart Classification",
              desc: "Auto-categorizes inquiries into billing, technical, refund, shipping, or general.",
              gradient: "from-blue-600/20 to-cyan-600/20",
              border: "border-blue-500/20",
            },
            {
              icon: "⚡",
              title: "Instant AI Responses",
              desc: "Claude-powered answers streamed in real-time with professional empathy.",
              gradient: "from-indigo-600/20 to-purple-600/20",
              border: "border-indigo-500/20",
            },
            {
              icon: "📧",
              title: "Auto Email Delivery",
              desc: "Responses sent to customer inbox with branded HTML templates automatically.",
              gradient: "from-purple-600/20 to-pink-600/20",
              border: "border-purple-500/20",
            },
            {
              icon: "🚨",
              title: "Smart Escalation",
              desc: "Low-confidence or urgent messages auto-escalated to human agents.",
              gradient: "from-red-600/20 to-orange-600/20",
              border: "border-red-500/20",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-2xl p-6 border ${feature.border} hover:scale-[1.03] transition-all duration-300 animate-slideUp`}
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Architecture Section */}
        <section className="max-w-4xl mx-auto mt-32 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Multi-Agent Architecture</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            Five specialized AI agents work together to deliver a seamless support experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { num: "01", name: "Intake", desc: "Validates & classifies", color: "indigo" },
              { num: "02", name: "Response", desc: "AI-powered answers", color: "purple" },
              { num: "03", name: "Email", desc: "Auto email delivery", color: "violet" },
              { num: "04", name: "Escalation", desc: "Priority detection", color: "red" },
              { num: "05", name: "Memory", desc: "Context retention", color: "cyan" },
            ].map((agent, i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group animate-slideUp"
                style={{ animationDelay: `${500 + i * 80}ms` }}
              >
                <div className={`text-xs font-bold text-${agent.color}-400 mb-1 tracking-widest`}>
                  AGENT {agent.num}
                </div>
                <div className="text-white font-semibold text-sm mb-1">{agent.name}</div>
                <div className="text-slate-500 text-xs">{agent.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="max-w-3xl mx-auto mt-32 text-center">
          <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-3xl border border-indigo-500/20 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get help?</h2>
            <p className="text-slate-400 mb-8">
              Click the chat bubble or submit a support request. Our AI is standing by.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-8 px-6 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} AI Support Agent. Built with Next.js, Claude AI, and Nodemailer.
        </p>
      </footer>
    </div>
  );
}
