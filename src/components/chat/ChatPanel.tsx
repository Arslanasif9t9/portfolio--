import { useEffect, useRef, useState } from 'react';
import { Bot, RotateCcw, Send, X } from 'lucide-react';
import { useChat } from './useChat';
import ChatMessage from './ChatMessage';

interface ChatPanelProps {
  onClose: () => void;
}

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

const ChatPanel = ({ onClose }: ChatPanelProps) => {
  const { messages, send, sending, error, clear } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, error]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    send(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl md:rounded-2xl md:border md:border-primary/30 md:shadow-[0_0_40px_hsl(var(--primary)/0.25)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground">
            <Bot size={22} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-foreground leading-tight">Arslan's AI Assistant</p>
          <p className="text-xs text-muted-foreground">Ask me anything about Arslan</p>
        </div>
        <button
          onClick={clear}
          aria-label="Clear chat"
          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-foreground max-w-[85%]">
              👋 Hi! I'm <strong>Arslan's AI assistant</strong>. Ask me about his skills, projects,
              or how to get in touch!
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        {sending && <TypingIndicator />}
        {error && (
          <p className="text-center text-xs text-destructive/90 px-4">{error}</p>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            maxLength={2000}
            className="flex-1 bg-muted/40 border border-border rounded-full px-4 py-2.5 text-sm text-foreground
                       placeholder:text-muted-foreground focus:outline-none focus:border-primary/60
                       focus:ring-1 focus:ring-primary/40 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground
                       shadow-[0_0_20px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.55)]
                       transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
