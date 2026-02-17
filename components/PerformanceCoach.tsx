
import React, { useState, useRef, useEffect } from 'react';
import { createFitnessCoachChat, calculateMacros } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';

const PerformanceCoach: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "I am the Apex AI Coach. Ready to build an elite physique? Ask me anything about training, nutrition, or your stack." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createFitnessCoachChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = fullText;
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to the coaching mainframe. Check your connection and try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="syncopate text-3xl md:text-5xl font-bold text-white mb-4 uppercase text-glow">
          ELITE AI <span className="text-orange-500">COMMAND</span>
        </h2>
        <p className="text-slate-400 font-medium">Your 24/7 high-performance bodybuilding intelligence unit.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl backdrop-blur-xl">
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-orange-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 px-5 py-3 rounded-2xl rounded-tl-none border border-slate-700">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for a macro split, workout routine, or supplement advice..."
              className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-widest text-center">
            AI can make mistakes. Always verify with health professionals for serious dietary changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCoach;
