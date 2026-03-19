'use client';

// components/ChatWidget.tsx — Floating chatbot bubble component
import { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'chat'>('intro');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStep('chat');
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi ${name}! 👋 I'm your AI support assistant. How can I help you today?`,
        timestamp: getTimestamp(),
      },
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          name,
          email,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream available');

      const assistantId = `assistant-${Date.now()}`;
      let fullContent = '';
      let isFirstChunk = true;

      // Add empty assistant message for streaming
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', timestamp: getTimestamp() },
      ]);
      setIsLoading(false);

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          if (line === 'data: [DONE]') continue;

          try {
            const data = JSON.parse(line.substring(6));

            // First chunk contains sessionId
            if (isFirstChunk && data.sessionId) {
              setSessionId(data.sessionId);
              isFirstChunk = false;
              continue;
            }

            if (data.token) {
              fullContent += data.token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullContent } : m
                )
              );
            }
          } catch {
            // skip unparseable chunks
          }
        }
      }

      // Clean metadata from displayed message
      const cleanContent = fullContent.replace(/<!--METADATA:[\s\S]*?-->/, '').trim();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: cleanContent } : m
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or contact our support team directly.',
          timestamp: getTimestamp(),
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      <button
        id="chat-widget-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          isOpen
            ? 'bg-slate-700 rotate-0'
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse-glow'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <img src="/bot-avatar.svg" alt="Chat" className="w-10 h-10" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-ping-slow" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] flex flex-col bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full p-1.5 flex items-center justify-center">
            <img src="/bot-avatar.svg" alt="AI" className="w-full h-full" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">AI Support Agent</h3>
            <p className="text-indigo-200 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
              Online — Typically replies instantly
            </p>
          </div>
        </div>

        {step === 'intro' ? (
          /* Intro Form */
          <form onSubmit={handleStartChat} className="flex-1 p-5 flex flex-col justify-center gap-4">
            <div className="text-center mb-2">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-3 border border-indigo-500/30">
                <img src="/bot-avatar.svg" alt="AI" className="w-10 h-10" />
              </div>
              <h4 className="text-white font-semibold text-lg">Welcome! 👋</h4>
              <p className="text-slate-400 text-sm mt-1">Enter your details to start chatting</p>
            </div>

            <div>
              <label htmlFor="chat-name" className="text-slate-400 text-xs font-medium uppercase tracking-wider">Name</label>
              <input
                id="chat-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="chat-email" className="text-slate-400 text-xs font-medium uppercase tracking-wider">Email</label>
              <input
                id="chat-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Start Chatting →
            </button>
          </form>
        ) : (
          /* Chat Area */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-[300px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  isStreaming={msg.content === '' && msg.role === 'assistant'}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-700/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="chat-message-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
