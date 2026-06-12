'use client';
// components/dashboard/InterpretationPanel.tsx
import { useState, useRef, useEffect, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BirthInfoForPanel {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: string;
}

interface InterpretationPanelProps {
  chartId: string;
  savedOverview?: string | null;
  savedChatHistory?: ChatMessage[];
  birthInfo: BirthInfoForPanel;
}

const AiContent: FC<{ text: string; streaming?: boolean }> = ({ text, streaming }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*(【.+?】)\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-1 first:pt-0">
              <span className="text-[15px] font-bold tracking-wide" style={{ color: 'var(--color-accent)' }}>
                {sectionMatch[1]}
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--color-accent)', opacity: 0.7 }}
        />
      )}
    </div>
  );
};

const SHICHEN_SHORT = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export default function InterpretationPanel({
  chartId,
  savedOverview,
  savedChatHistory = [],
  birthInfo,
}: InterpretationPanelProps) {
  const { theme } = useTheme();
  const [overview, setOverview] = useState<string>(savedOverview ?? '');
  const [overviewLoading, setOverviewLoading] = useState(!savedOverview);
  const [overviewCollapsed, setOverviewCollapsed] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(savedChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>(savedChatHistory);
  const loadingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const overviewGenerated = useRef(!!savedOverview);

  const isDark = theme === 'dark';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textSecondary = isDark ? '#D8D0C0' : '#2D2820';
  const textBody = isDark ? '#A09888' : '#5A5248';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderMed = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,21,16,0.14)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const bg1 = isDark ? '#141210' : '#F7F5F0';

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate overview on mount if not saved
  useEffect(() => {
    if (overviewGenerated.current) return;
    overviewGenerated.current = true;
    setOverviewLoading(true);

    fetch(`/api/charts/${chartId}/overview`, { method: 'POST' })
      .then(async (res) => {
        if (!res.ok || !res.body) throw new Error('Failed');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const delta = JSON.parse(data).delta?.text ?? '';
              text += delta;
              setOverview(text);
            } catch { /* skip */ }
          }
        }
      })
      .catch(() => {
        setOverview('Không thể tải luận giải. Vui lòng thử lại.');
      })
      .finally(() => {
        setOverviewLoading(false);
      });
  }, [chartId]);

  const handleSend = () => {
    if (!input.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg = input;
    const apiMessages = [...messagesRef.current].map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    fetch(`/api/charts/${chartId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg }),
    })
      .then(async (res) => {
        if (!res.ok || !res.body) throw new Error('Failed');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const delta = JSON.parse(data).delta?.text ?? '';
              assistantText += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                return updated;
              });
            } catch { /* skip */ }
          }
        }
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Giải đoán thất bại, vui lòng thử lại sau.' }]);
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ background: bg1, border: `1px solid ${borderColor}` }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)', border: `1px solid ${borderGold}` }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <h3 className="text-[17px] font-semibold" style={{ color: textPrimary }}>Giải Đoán</h3>
          <p className="text-[13px]" style={{ color: textMuted }}>
            Thầy Ni Hải Hạ · {birthInfo.name}
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <button
          onClick={() => setOverviewCollapsed((v) => !v)}
          className="w-full px-5 py-3 flex items-center justify-between"
          style={{ background: 'transparent' }}
        >
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="text-[14px] font-semibold" style={{ color: accent }}>Luận Giải Tổng Quan</span>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke={textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: overviewCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <AnimatePresence>
          {!overviewCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4">
                {overviewLoading ? (
                  <div className="space-y-2 py-2">
                    {[80, 95, 70, 88, 60].map((w, i) => (
                      <div
                        key={i}
                        className="h-4 rounded-full animate-pulse"
                        style={{ width: `${w}%`, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26,21,16,0.06)' }}
                      />
                    ))}
                    <p className="text-[13px] mt-1" style={{ color: textMuted }}>Đang luận giải...</p>
                  </div>
                ) : overview ? (
                  <div className="rounded-xl p-4" style={{ background: bgCard, border: `1px solid ${borderColor}` }}>
                    <AiContent text={overview} />
                  </div>
                ) : (
                  <p className="text-[13px]" style={{ color: textMuted }}>Chưa có luận giải tổng quan.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Birth info strip */}
        <div
          className="flex-shrink-0 px-5 py-2.5 text-[12px]"
          style={{
            color: textMuted,
            borderBottom: `1px solid ${borderColor}`,
            background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ color: accent }}>
            {birthInfo.year}/{String(birthInfo.month).padStart(2, '0')}/{String(birthInfo.day).padStart(2, '0')}
          </span>
          {' · '}
          {SHICHEN_SHORT[birthInfo.hour] ?? '?'}
          {' · '}
          {birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 min-h-0">

          {messages.length === 0 && !overviewLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div style={{ color: accent, opacity: 0.2 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-[14px] leading-relaxed mt-3" style={{ color: textMuted }}>
                Hỏi sâu hơn về<br />lá số của bạn
              </p>
            </div>
          )}

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                if (msg.role === 'user') {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-end"
                    >
                      <div
                        className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3"
                        style={{
                          background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)',
                          border: `1px solid ${borderGold}`,
                          color: textPrimary,
                        }}
                      >
                        <p className="text-[14px] leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  );
                }

                const isLastMsg = i === messages.length - 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2.5"
                  >
                  <div
                    className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3"
                    style={{ background: bgCard, border: `1px solid ${borderColor}` }}
                  >
                    <AiContent text={msg.content} streaming={loading && isLastMsg} />
                  </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-4 pb-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Hỏi sâu hơn về lá số..."
              disabled={loading}
              rows={1}
              className="flex-1 rounded-xl px-4 py-3 text-[14px] resize-none focus:outline-none transition-colors"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                border: `1px solid ${borderMed}`,
                color: textPrimary,
                minHeight: '46px',
                maxHeight: '120px',
                fontFamily: 'inherit',
                lineHeight: '1.5',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: accent,
                color: '#FFFFFF',
                boxShadow: `0 2px 8px ${isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)'}`,
              }}
              aria-label="Gửi tin nhắn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
