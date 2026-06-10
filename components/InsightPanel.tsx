'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
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

**【Phân tích Phu Tân Cung】**
Chủ tinh của Phu Tân Cung, tứ hóa, và giải đoán cụ thể theo hệ thống Thầy Ni Hải Hạ.

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

**【Lời khuyên tài chính】】
Những lời khuyên tài chính cụ thể.`,

  health: `Hãy phân tích vận sức khỏe, theo cấu trúc sau để xuất:

**【Chủ tinh Tật Ách Cung】】
Sao trong Tật Ách Cung và ý nghĩa sức khỏe.

**【Rủi ro chính】】
Kết hợp lý thuyết Tử Ngọc Lưu Chú của Thầy Ni Hải Hạ, phân tích các rủi ro sức khỏe chính và các bộ phận cần được chú ý.

**【Xu hướng sức khỏe đại hạn】】
Xu hướng sức khỏe hiện tại và các khoảng thời gian then chốt.

**【Lời khuyên phòng ngừa】】
Những lưu ý cụ thể và hướng dưỡng sinh.`,

  personality: `Hãy phân tích sâu đặc tính tính cách, theo cấu trúc sau để xuất:

**【Tính cách chủ tinh Mệnh Cung】】
Đặc tính tính cách cốt lõi của chủ tinh Mệnh Cung, trích dẫn lời Thầy Ni.

**【Tổng hợp tính cách tam phương】**
Ảnh hưởng của tam phương (tài, quan, thiên di) đến tính cách, bức tranh toàn diện.

**【Mô hình quan hệ quần chúng】**
Cách tương tác với người khác, phong cách đối nhân xử thế.

**【Thế mạnh và bài học cuộc đời】】
Thế mạnh bẩm sinh, cũng như bài học cuộc đời cần đối mặt.`,
};

const PALACE_ROLES: Record<string, string> = {
  'Mệnh Cung':   'Bản thân, tính cách, mệnh cách thiên bẩm',
  'Huynh Đệ Cung': 'Quan hệ huynh đệ, đối tác',
  'Phu Tân Cung': 'Quan hệ tình cảm, tình trạng hôn nhân',
  'Tử Nữ Cung': 'Duyên con cái, quan hệ cấp dưới',
  'Tài Bạch Cung': 'Nguồn tài vận, cách thu nhập',
  'Tật Ách Cung': 'Sức khỏe thể chất, tai nạn',
  'Thiên Di Cung': 'Cơ hội xuất ngoại, tinh thần nhân duyên',
  'Cát Diêu Cung': 'Bạn bè, quý nhân, tiểu nhân',
  'Quan Lộc Cung': 'Sự nghiệp thành tựu, địa vị xã hội',
  'Điền Trạch Cung': 'Bất động sản, môi trường gia đình',
  'Phước Đức Cung': 'Hưởng thụ tinh thần, phúc đức nội tâm',
  'Phụ Mẫu Cung': 'Quan hệ cha mẹ, văn thư hợp đồng',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--color-accent)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--color-accent)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate mệnh cách overview on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
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
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject sự phân tích tứ hóa phiên hóa
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // Tìm cung chứa sao đó
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
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

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
    // Capture current messages synchronously via ref (avoids stale closure)
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
    <div className="flex flex-col h-full rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-1)' }}>

      {/* ── Topic Tabs ── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="relative px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all duration-150 whitespace-nowrap disabled:opacity-40"
                style={{
                  background: isActive ? 'var(--color-bg-card)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
              >
                {t.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: 'var(--color-accent)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 min-h-0">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-3xl mb-3" style={{ color: 'var(--color-accent)', opacity: 0.3 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Chọn một chủ đề và bắt đầu trò chuyện
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div
                      className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5"
                      style={{
                        background: 'var(--color-accent)',
                        color: '#fff',
                      }}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              }

              // Assistant message
              const isLastMsg = i === messages.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  {/* Star avatar */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>

                  {/* Message bubble */}
                  <div
                    className="flex-1 rounded-2xl rounded-tl-md px-4 py-3"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                  >
                    <AiContent text={msg.content} streaming={loading && isLastMsg} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => {
              setInput(e.target.value);
              // Auto-grow
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi về bản đồ của bạn..."
            disabled={loading}
            rows={1}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none transition-colors"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              minHeight: '44px',
              maxHeight: '120px',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
