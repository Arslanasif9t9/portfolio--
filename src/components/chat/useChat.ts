import { useCallback, useEffect, useState } from 'react';

export type ChatRole = 'user' | 'assistant' | 'admin';
export interface ChatMsg {
  role: ChatRole;
  content: string;
}

const GUEST_KEY = 'a9-guest-id';
const HISTORY_KEY = 'a9-chat-history';
const HISTORY_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours, same as arslanai9t9
const MAX_CONTEXT = 20; // last N messages sent to the model

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getGuestId(): string {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `Guest_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}

function loadHistory(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { savedAt: number; messages: ChatMsg[] };
    if (Date.now() - parsed.savedAt > HISTORY_TTL_MS) {
      localStorage.removeItem(HISTORY_KEY);
      return [];
    }
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMsg[]>(loadHistory);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ savedAt: Date.now(), messages }));
    } catch {
      /* storage full/unavailable — history just won't persist */
    }
  }, [messages]);

  const send = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text || sending) return;
      setError(null);

      const userMsg: ChatMsg = { role: 'user', content: text };
      const context = [...messages, userMsg].slice(-MAX_CONTEXT);
      setMessages((prev) => [...prev, userMsg]);
      setSending(true);

      try {
        const res = await fetch(FN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ANON_KEY}`,
            apikey: ANON_KEY,
          },
          body: JSON.stringify({ guestId: getGuestId(), messages: context }),
        });
        const data = (await res.json()) as {
          reply?: string | null;
          providerUsed?: string;
          error?: string;
          aiDisabled?: boolean;
        };

        if (data.reply) {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.reply! }]);
        } else if (data.aiDisabled) {
          setError('The assistant is taking a short break — please use the contact form below!');
        } else if (data.error === 'rate_limited') {
          setError("You've sent quite a few messages — please wait a bit before sending more.");
        } else if (data.error === 'blocked') {
          setError('This chat session is unavailable.');
        } else {
          setError('The assistant is unavailable right now. Please try again later.');
        }
      } catch {
        setError('Connection problem — please check your internet and try again.');
      } finally {
        setSending(false);
      }
    },
    [messages, sending]
  );

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { messages, send, sending, error, clear };
}
