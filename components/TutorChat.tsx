
import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';
import { UserProfile, ChatMessage } from '../types';

interface TutorChatProps {
  profile: UserProfile;
}

const TutorChat: React.FC<TutorChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hello ${profile.name}! I'm your AI Programming Tutor. What language or concept would you like to master today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await getTutorResponse(userMessage, messages, profile);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't generate a response." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to my brain. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-5xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none'
            }`}>
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700">
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none p-5 flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <form onSubmit={handleSend} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Ask me anything: 'Explain pointers in C++' or 'How do I use React hooks?'"
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-100 resize-none min-h-[80px]"
            rows={2}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-4 bottom-4 p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-500 transition-colors"
          >
            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-2">
          Press Shift+Enter for new line. I'm trained on most modern languages.
        </p>
      </div>
    </div>
  );
};

export default TutorChat;
