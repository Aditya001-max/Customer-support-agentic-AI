'use client';

// components/ChatMessage.tsx — Individual message bubble (user/AI)
import Image from 'next/image';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, timestamp, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 animate-fadeIn`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
          : 'bg-slate-700 p-1'
      }`}>
        {isUser ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        ) : (
          <Image src="/bot-avatar.svg" alt="AI" width={24} height={24} />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
              : 'bg-slate-700/70 text-slate-200 rounded-bl-md border border-slate-600/50'
          } ${isStreaming ? 'animate-pulse-subtle' : ''}`}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 animate-blink rounded-full align-middle" />
          )}
        </div>

        {timestamp && (
          <p className={`text-[11px] text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
