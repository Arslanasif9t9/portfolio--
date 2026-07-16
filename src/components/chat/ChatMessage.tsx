import type { ChatMsg } from './useChat';
import { cn } from '@/lib/utils';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// NUL sentinel can never appear in user/model text, so block placeholders are collision-safe
const S = String.fromCharCode(0);

/** Minimal markdown → HTML (escape-first, so model output can't inject markup). */
function renderMarkdown(text: string): string {
  const blocks: string[] = [];
  let t = text.replace(/```(?:\w*\n)?([\s\S]*?)```/g, (_m, code: string) => {
    blocks.push(code);
    return `${S}BLOCK${blocks.length - 1}${S}`;
  });
  t = escapeHtml(t);
  t = t.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
  t = t.replace(
    /`([^`\n]+)`/g,
    '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono">$1</code>'
  );
  t = t.replace(/^### (.+)$/gm, '<span class="block font-bold text-base mt-2 mb-1">$1</span>');
  t = t.replace(/^## (.+)$/gm, '<span class="block font-bold text-lg mt-2 mb-1">$1</span>');
  t = t.replace(/^# (.+)$/gm, '<span class="block font-bold text-xl mt-2 mb-1">$1</span>');
  t = t.replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  t = t.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  t = t.replace(
    /(https?:\/\/[^\s&<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 break-all">$1</a>'
  );
  t = t.replace(/\n/g, '<br/>');
  t = t.replace(new RegExp(`${S}BLOCK(\\d+)${S}`, 'g'), (_m, i: string) => {
    const escaped = escapeHtml(blocks[parseInt(i, 10)] ?? '');
    return `<pre class="bg-black/50 border border-border p-3 rounded-lg text-xs font-mono overflow-x-auto my-2"><code>${escaped}</code></pre>`;
  });
  return t;
}

const ChatMessage = ({ message }: { message: ChatMsg }) => {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words',
          isUser
            ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-sm'
            : 'glass-card text-foreground rounded-bl-sm'
        )}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
      />
    </div>
  );
};

export default ChatMessage;
