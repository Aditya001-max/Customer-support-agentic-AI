'use client';

// components/TypingIndicator.tsx — Animated dots while AI responds

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 animate-fadeIn">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 p-1 flex items-center justify-center">
        <img src="/bot-avatar.svg" alt="AI" className="w-6 h-6" />
      </div>

      {/* Typing Dots */}
      <div className="bg-slate-700/70 border border-slate-600/50 rounded-2xl rounded-bl-md px-5 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-dot" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce-dot" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
