'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean;
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh cách' },
  { key: 'love',        label: 'Tình duyên' },
  { key: 'career',      label: 'Sự nghiệp' },
  { key: 'wealth',      label: 'Tài vận' },
  { key: 'health',      label: 'Sức khỏe' },
  { key: 'personality', label: 'Tính cách' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Hãy tạo tổng quan mệnh cách, theo cấu trúc sau để xuất:

**【Định tính mệnh cách】**
Dùng một câu tóm tắt cục diện cốt lõi của lá số này và khí chất bẩm sinh của người có mệnh.

**【Giải đoán chủ tinh】**
Đặc tính cốt lõi của chủ tinh mệnh cung, trích dẫn lời nguyên của Thầy Ni Hải Hạ hoặc quan điểm.

**【Tam phương tứ chính】**
Phân tích liên động của tam phương (tài, quan, thiên di) và cục diện tổng thể.

**【Đại hạn hiện tại】**
Hướng vận của đại hạn hiện tại và những điều đáng được chú ý nhất.

**【Thế mạnh và Lưu ý】**
Thế mạnh bẩm sinh của lá số, cũng như những rủi ro hoặc bài học cần chú ý.`,

  love: `Hãy phân tích sâu vận tình duyên hôn nhân, theo cấu trúc sau để xuất:

**【Cục diện tình cảm】**
Một câu định tính lá số tình cảm.

**【Phân tích Phu Thê Cung】**
Chủ tinh của Phu Thê Cung, tứ hóa, và giải đoán cụ thể theo hệ thống Thầy Ni Hải Hạ.

**【Liên động tam phương】**
Ảnh hưởng của các cung liên quan đến tình cảm.

**【Vận tình duyên đại hạn hiện tại】**
Hướng tình cảm 10 năm hiện tại và các điểm then chốt.

**【Lời khuyên thực tế】**
Những lời khuyên tình cảm cụ thể có thể thực hiện.`,

  career: `Hãy phân tích sâu vận sự nghiệp, theo cấu trúc sau để xuất:

**【Cục diện sự nghiệp】**
Một câu định tính lá số sự nghiệp, thích hợp làm công việc ổn định hay khởi nghiệp.

**【Phân tích Quan Lộc Cung】**
Chủ tinh của Quan Lộc Cung, tứ hóa, và Thầy Ni đánh giá về cấu hình này.

**【Liên động Tài Bạch Cung】**
Mối quan hệ giữa tài vận và sự nghiệp, phân tích nguồn tài vận.

**【Vận sự nghiệp đại hạn hiện tại】**
Hướng sự nghiệp 10 năm hiện tại.

**【Lời khuyên thực tế】**
Hướng, ngành nghề và chiến lược phù hợp.`,

  wealth: `Hãy phân tích sâu vận tài vận, theo cấu trúc sau để xuất:

**【Cục diện tài vận】**
Một câu định tính mô hình tài vận, là tài chủ động hay thụ động.

**【Phân tích Tài Bạch Cung】**
Chủ tinh của Tài Bạch Cung, tứ hóa, mô hình nguồn và lưu chuyển tài sản.

**【Điền Trạch Cung (tài khố)】**
Khả năng tích lũy và phân tích vận bất động sản.

**【Vận tài vận đại hạn hiện tại】**
Hướng tài vận hiện tại và những lưu ý.

**【Lời khuyên tài chính】**
Những lời khuyên tài chính cụ thể.`,

  health: `Hãy phân tích vận sức khỏe, theo cấu trúc sau để xuất:

**【Chủ tinh Tật Ách Cung】**
Sao trong Tật Ách Cung và ý nghĩa sức khỏe.

**【Rủi ro chính】**
Kết hợp lý thuyết Tử Ngọc Lưu Chú của Thầy Ni Hải Hạ, phân tích các rủi ro sức khỏe chính và các bộ phận cần được chú ý.

**【Xu hướng sức khỏe đại hạn】**
Xu hướng sức khỏe hiện tại và các khoảng thời gian then chốt.

**【Lời khuyên phòng ngừa】**
Những lưu ý cụ thể và hướng dưỡng sinh.`,

  personality: `Hãy phân tích sâu đặc tính tính cách, theo cấu trúc sau để xuất:

**【Tính cách chủ tinh Mệnh Cung】**
Đặc tính tính cách cốt lõi của chủ tinh Mệnh Cung, trích dẫn lời Thầy Ni.

**【Tổng hợp tính cách tam phương】**
Ảnh hưởng của tam phương (tài, quan, thiên di) đến tính cách, bức tranh toàn diện.

**【Mô hình quan hệ quần chúng】**
Cách tương tác với người khác, phong cách đối nhân xử thế.

**【Thế mạnh và bài học cuộc đời】**
Thế mạnh bẩm sinh, cũng như bài học cuộc đời cần đối mặt.`,
};

const PALACE_ROLES: Record<string, string> = {
  'Mệnh Cung':   'Bản thân, tính cách, mệnh cách thiên bẩm',
  'Huynh Đệ Cung': 'Quan hệ huynh đệ, đối tác',
  'Phu Thê Cung': 'Quan hệ tình cảm, tình trạng hôn nhân',
  'Tử Nữ Cung': 'Duyên con cái, quan hệ cấp dưới',
  'Tài Bạch Cung': 'Nguồn tài vận, cách thu nhập',
  'Tật Ách Cung': 'Sức khỏe thể chất, tai nạn',
  'Thiên Di Cung': 'Cơ hội xuất ngoại, tinh thần nhân duyên',
  'Nô Bộc Cung': 'Bạn bè, quý nhân, tiểu nhân',
  'Quan Lộc Cung': 'Sự nghiệp thành tựu, địa vị xã hội',
  'Điền Trạch Cung': 'Bất động sản, môi trường gia đình',
  'Phúc Đức Cung': 'Hưởng thụ tinh thần, phúc đức nội tâm',
  'Phụ Mẫu Cung': 'Quan hệ cha mẹ, văn thư hợp đồng',
};

function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-1 first:pt-0">
              <span
                className="text-[15px] font-bold tracking-wide"
                style={{ color: 'var(--color-accent)' }}
              >
                【{sectionMatch[1]}】
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
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]);
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';
  const bgPage = isDark ? '#0C0A08' : '#FDFCF8';
  const bg1 = isDark ? '#141210' : '#F7F5F0';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textSecondary = isDark ? '#D8D0C0' : '#2D2820';
  const textBody = isDark ? '#A09888' : '#5A5248';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderMed = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,21,16,0.14)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []);

  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? ' hóa ' + s.siHua : ''}`).join(', ')
      : 'Không cung (mượn đối cung)';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const prompt = `Hãy phân tích trọng điểm 【${selectedPalace.name}】 (quản: ${role}), chủ tinh cung này là ${starDesc}, theo cấu trúc sau để xuất:

**【Định tính cung vị】**
Ý nghĩa của ${selectedPalace.name} trong lá số, và đánh giá tổng thể về cấu hình sao tinh này.

**【Giải đoán chủ tinh】**
Giải đoán theo hệ thống Thầy Ni Hải Hạ về chủ tinh tại cung này, trích dẫn quan điểm cụ thể.

**【Liên động tam phương tứ chính】**
Ảnh hưởng của tam phương tứ chính đối với cung này.

**【Lời khuyên thực tế】**
Những lời khuyên cụ thể dựa trên cung này.`;

    sendMessage(prompt, true);
  }, [selectedPalace]);

  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? 'Cung không xác định';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';

    const prompt = `Hãy phân tích 【${viewLabel} ${selectedSiHua.starName} hóa ${selectedSiHua.siHua}】 ảnh hưởng phiên hóa, theo cấu trúc sau để xuất:

**【Ý nghĩa cơ bản của hóa ${selectedSiHua.siHua}】**
Ý nghĩa cốt lõi của hóa ${selectedSiHua.siHua} trong hệ thống Thầy Ni Hải Hạ, và ý nghĩa đặc biệt của ${selectedSiHua.starName} hóa ${selectedSiHua.siHua}.

**【Ảnh hưởng nhập cung】**
${selectedSiHua.starName} hóa ${selectedSiHua.siHua} rơi vào 【${palaceName}】, lĩnh vực mà cung này quản chịu bị ảnh hưởng như thế nào, Thầy Ni giải đoán ra sao.

**【Đường đi phiên hóa tam phương tứ chính】**
Sau khi hóa ${selectedSiHua.siHua} nhập ${palaceName}, ảnh hưởng liên động đối với tam phương tứ chính (đối cung, hai cung tam hợp) của nó.

**【Ảnh hưởng vận hiện tại】**
Trong chiều thời gian ${viewLabel}, ảnh hưởng cụ thể của hóa ${selectedSiHua.siHua} đối với vận gần của người có mệnh.

**【Lời khuyên thực tế】**
Những lời khuyên có thể thực hiện được cụ thể dựa trên tứ hóa này.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]);

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có luồng phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Giải đoán thất bại, vui lòng thử lại sau.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{
        background: bg1,
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)',
            border: `1px solid ${borderGold}`,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <h3 className="text-[17px] font-semibold" style={{ color: textPrimary }}>
            Giải Đoán AI
          </h3>
          <p className="text-[13px]" style={{ color: textMuted }}>
            Thầy Ni Hải Hạ · Phân tích trí tuệ
          </p>
        </div>
      </div>

      {/* Topic Tabs */}
      <div
        className="flex-shrink-0 px-4 pt-3 pb-0"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <div className="flex gap-1.5 overflow-x-auto pb-3">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="relative px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap disabled:opacity-40"
                style={{
                  background: isActive
                    ? (isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF')
                    : 'transparent',
                  color: isActive ? accent : textMuted,
                  border: isActive
                    ? `1px solid ${borderGold}`
                    : `1px solid transparent`,
                }}
              >
                {t.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 min-h-0">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div style={{ color: accent, opacity: 0.2 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <p className="text-[15px] leading-relaxed mt-4" style={{ color: textMuted }}>
              Chọn một chủ đề<br />và bắt đầu trò chuyện
            </p>
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              if (msg.role === 'user' && msg.hidden) return null;

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
                      className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3"
                      style={{
                        background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)',
                        border: `1px solid ${borderGold}`,
                        color: textPrimary,
                      }}
                    >
                      <p className="text-[15px] leading-relaxed">{msg.content}</p>
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
                  className="flex gap-3"
                >
                  <div
                    className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                      border: `1px solid ${borderColor}`,
                    }}
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
      <div
        className="flex-shrink-0 px-4 pb-4 pt-3"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        <div className="flex gap-2.5 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi về lá số của bạn..."
            disabled={loading}
            rows={1}
            className="flex-1 rounded-xl px-4 py-3 text-[15px] resize-none focus:outline-none transition-colors"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              border: `1px solid ${borderMed}`,
              color: textPrimary,
              minHeight: '48px',
              maxHeight: '120px',
              fontFamily: 'inherit',
              lineHeight: '1.5',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: accent,
              color: '#FFFFFF',
              boxShadow: `0 2px 8px ${isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)'}`
            }}
            aria-label="Gửi tin nhắn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
