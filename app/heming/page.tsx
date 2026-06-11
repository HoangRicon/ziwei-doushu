/**
 * /heming — Trang Hằng sao (Ghép bản đồ Tử Vi)
 * Phân tích hợp cục dựa trên lá số của hai người
 */

'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import { formToBirthInfo } from '@/lib/ziwei/share';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import { useTheme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} style={{ paddingTop: i === 0 ? 0 : '16px', paddingBottom: '6px' }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-accent)',
                letterSpacing: '0.04em'
              }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} style={{ height: '8px' }} />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--color-text-body)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '17px',
          background: 'var(--color-accent)',
          opacity: 0.5,
          borderRadius: '2px',
          animation: 'pulse 1s ease-in-out infinite',
          verticalAlign: 'middle',
          marginLeft: '2px',
        }} />
      )}
    </div>
  );
}

export default function HemingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage = isDark ? '#0C0A08' : '#FDFCF8';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const bg1 = isDark ? '#141210' : '#F7F5F0';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textSecondary = isDark ? '#D8D0C0' : '#2D2820';
  const textBody = isDark ? '#A09888' : '#5A5248';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  const [chartA, setChartA] = useState<ZiweiChart | null>(null);
  const [chartB, setChartB] = useState<ZiweiChart | null>(null);
  const [formA, setFormA] = useState<BirthFormState | null>(null);
  const [formB, setFormB] = useState<BirthFormState | null>(null);

  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [question, setQuestion] = useState('');
  const [analysisError, setAnalysisError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const generateChart = useCallback(async (info: BirthInfo): Promise<ZiweiChart | null> => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  const isFormReady = (f: BirthFormState | null): boolean =>
    !!(f && f.year && f.month && f.day && f.gender && (f.unknownTime || f.shichen !== undefined));

  const runAnalysis = useCallback(async (q?: string) => {
    setFormError(null);
    if (!isFormReady(formA) || !isFormReady(formB)) {
      setFormError('Vui lòng điền đầy đủ thông tin sinh của cả hai bên');
      return;
    }
    setAnalyzing(true);
    setAnalysis('');
    setAnalysisError(false);

    try {
      let cA = chartA;
      let cB = chartB;
      const [newA, newB] = await Promise.all([
        cA ? Promise.resolve(cA) : generateChart(formToBirthInfo(formA!)),
        cB ? Promise.resolve(cB) : generateChart(formToBirthInfo(formB!)),
      ]);
      cA = newA;
      cB = newB;
      if (!cA || !cB) {
        setAnalysisError(true);
        setAnalyzing(false);
        return;
      }
      if (!chartA) setChartA(cA);
      if (!chartB) setChartB(cB);

      const res = await fetch('/api/heming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartA: cA, chartB: cB, question: q ?? undefined }),
      });
      if (!res.ok || !res.body) throw new Error();

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
            setAnalysis(text);
          } catch { /* skip */ }
        }
      }
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setAnalysisError(true);
    } finally {
      setAnalyzing(false);
    }
  }, [chartA, chartB, formA, formB, generateChart]);

  return (
    <div style={{ minHeight: '100vh', background: bgPage }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: isDark ? 'rgba(12,10,8,0.92)' : 'rgba(253,252,248,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        height: '56px',
        gap: '16px',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: textMuted,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = accent)}
          onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
        >
          <span style={{ fontSize: '18px' }}>‹</span>
          <span> Quay lại</span>
        </button>

        <div className="w-px h-5" style={{ background: borderColor }} />

        <span style={{ fontSize: '12px', color: accent, letterSpacing: '0.15em', fontWeight: 500 }}>
          HẰNG SAO
        </span>

        <div style={{ flex: 1 }} />

        <span className="hidden md:inline text-xs" style={{ color: textMuted }}>
          Tình cảm · Hợp tác · Cha con · Bạn bè
        </span>
      </header>

      {/* Main Content */}
      <div className="container-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Title Section */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${borderGold})` }} />
              <span className="text-xs tracking-widest font-medium" style={{ color: accent }}>GHÉP BẢN ĐỒ TỬ VI</span>
              <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${borderGold})` }} />
            </div>

            <h1 className="heading-1 mb-4" style={{ color: textPrimary }}>
              Hằng sao
            </h1>

            <p className="body max-w-2xl mx-auto" style={{ color: textBody }}>
              Phân tích hợp cục dựa trên lá số. Nhập thông tin sinh của hai người để AI phân tích duyên khớp, tình cảm và đề xuất cách hòa thuận theo hệ thống Nị Hải Hạ.
            </p>
          </div>
        </FadeIn>

        {/* Two Column Forms */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {/* Form A */}
            <div className="p-6 md:p-8 transition-all duration-200"
              style={{
                background: bgCard,
                border: `1px solid ${borderColor}`,
                borderRadius: '16px',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = borderGold)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = borderColor)}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.1)', color: accent }}>
                    A
                  </div>
                  <span className="text-xs tracking-widest" style={{ color: textMuted }}>BÊN A</span>
                </div>
                <div className="text-sm" style={{ color: textMuted }}>Nhập thông tin sinh của người thứ nhất</div>
              </div>
              <BirthForm
                hideSubmit
                onSubmit={() => {}}
                onFormSave={setFormA}
              />
            </div>

            {/* Form B */}
            <div className="p-6 md:p-8 transition-all duration-200"
              style={{
                background: bgCard,
                border: `1px solid ${borderColor}`,
                borderRadius: '16px',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = borderGold)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = borderColor)}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.1)', color: accent }}>
                    B
                  </div>
                  <span className="text-xs tracking-widest" style={{ color: textMuted }}>BÊN B</span>
                </div>
                <div className="text-sm" style={{ color: textMuted }}>Nhập thông tin sinh của người thứ hai</div>
              </div>
              <BirthForm
                hideSubmit
                onSubmit={() => {}}
                onFormSave={setFormB}
              />
            </div>
          </div>
        </FadeIn>

        {/* Analysis Card */}
        <FadeIn delay={0.2}>
          <div ref={analysisRef} className="p-8 md:p-10 transition-all duration-200"
            style={{
              background: bgCard,
              border: `1px solid ${borderColor}`,
              borderRadius: '20px',
              minHeight: '320px',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = borderGold)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = borderColor)}>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full" style={{ background: accent, opacity: 0.6 }} />
              <span className="text-xs tracking-widest" style={{ color: textMuted }}>
                PHÂN TÍCH HỢP CỤC · HẰNG SAO
              </span>
            </div>

            {/* Empty State */}
            {!analysis && !analyzing && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="text-5xl mb-4" style={{ opacity: 0.3 }}>☯</div>
                </div>
                <div className="body max-w-lg mx-auto mb-8" style={{ color: textBody }}>
                  Sau khi điền đầy đủ thông tin sinh của hai bên, nhấn nút bên dưới để AI phân tích sâu duyên khớp dựa trên hệ thống Nị Hải Hạ.
                </div>

                {formError && (
                  <div className="mb-6 p-4 rounded-lg text-sm"
                    style={{
                      background: isDark ? 'rgba(220,38,38,0.1)' : 'rgba(220,38,38,0.05)',
                      color: '#dc2626',
                      border: '1px solid rgba(220,38,38,0.2)',
                    }}>
                    {formError}
                  </div>
                )}

                <button
                  onClick={() => runAnalysis()}
                  className="btn-primary"
                  style={{
                    padding: '16px 48px',
                    fontSize: '16px',
                    letterSpacing: '0.05em',
                  }}
                >
                  Bắt đầu phân tích hợp cục
                </button>
              </div>
            )}

            {/* Loading State */}
            {analyzing && !analysis && (
              <div className="flex flex-col items-center justify-center py-16">
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid',
                  borderColor: borderColor,
                  borderTopColor: accent,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '16px',
                }} />
                <div className="text-sm" style={{ color: textMuted }}>
                  Đang so sánh bản đồ của hai bên…
                </div>
              </div>
            )}

            {/* Analysis Result */}
            {analysis && <AiContent text={analysis} streaming={analyzing} />}

            {/* Error State */}
            {analysisError && (
              <div className="p-4 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${borderColor}`,
                  color: textBody,
                  marginTop: '16px',
                }}>
                Phân tích tạm thời không khả dụng, vui lòng thử lại sau.
              </div>
            )}
          </div>
        </FadeIn>

        {/* Follow-up Questions */}
        {analysis && (
          <FadeIn delay={0.1}>
            <div className="mt-6 p-6 rounded-xl" style={{
              background: bg1,
              border: `1px solid ${borderColor}`,
            }}>
              <div className="mb-4">
                <div className="text-xs tracking-widest mb-2" style={{ color: textMuted }}>
                  TIẾP TỤC ĐẶT CÂU HỎI
                </div>
                <div className="text-sm" style={{ color: textBody }}>
                  Đặt câu hỏi thêm về phép ghép bản đồ này
                </div>
              </div>

              {/* Quick Questions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  'Khớp tình cảm như thế nào?',
                  'Có phù hợp hợp tác không?',
                  'Hai người kết hôn phù hợp không?',
                  'Khía cạnh nào dễ xung đột?',
                  'Tài vận có bổ sung nhau không?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setQuestion(q); runAnalysis(q); }}
                    disabled={analyzing}
                    className="text-sm px-4 py-2 transition-all"
                    style={{
                      borderRadius: '20px',
                      border: `1px solid ${borderColor}`,
                      background: 'transparent',
                      color: textBody,
                      cursor: analyzing ? 'not-allowed' : 'pointer',
                      opacity: analyzing ? 0.5 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!analyzing) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = borderGold;
                        el.style.color = accent;
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = borderColor;
                      el.style.color = textBody;
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input + Submit */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !analyzing) runAnalysis(question || undefined); }}
                  placeholder="Tiếp tục đặt câu hỏi, ví dụ: Những năm nào là thời kỳ quan trọng trong tình cảm của hai người?"
                  disabled={analyzing}
                  className="input-base"
                  style={{ fontSize: '15px', flex: 1 }}
                />
                <button
                  onClick={() => runAnalysis(question || undefined)}
                  disabled={analyzing}
                  className="btn-primary"
                  style={{
                    padding: '14px 24px',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {analyzing ? 'Đang phân tích…' : 'Hỏi thêm'}
                </button>
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .heming-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
