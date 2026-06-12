'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  shichen: number;
  unknownTime: boolean;
  gender: 'male' | 'female';
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** Ẩn nút "Sắp lá số" (trong trường hợp chart ghép, component cha kiểm soát việc submit) */
  hideSubmit?: boolean;
}

const SHICHEN_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/** Kiểm tra tính hợp lệ của ngày tháng */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Màu sắc theo chế độ
  const isDarkMode = theme === 'dark';
  const textPrimary = isDarkMode ? '#F0EBE0' : '#1A1510';
  const textMuted = isDarkMode ? '#6A6258' : '#8A8078';
  const accent = isDarkMode ? '#D4A843' : '#9A7A1A';
  const accentLight = isDarkMode ? '#F0C060' : '#C8A030';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(26,21,16,0.14)';
  const inputBg = isDarkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,252,240,0.6)';
  const errorColor = '#ef4444';

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    shichen: initialData?.shichen ?? 0,
    unknownTime: initialData?.unknownTime ?? false,
    gender: initialData?.gender ?? 'male',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Đồng bộ trạng thái form với component cha
  useEffect(() => {
    onFormSave?.({ ...form });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const shichenInfo = SHICHEN[form.shichen];

  // ─── Validation logic ───────────────────────────────────────
  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;

  const errors = {
    name: !form.name.trim() ? 'Vui lòng nhập họ và tên' : '',
    year: !form.year ? 'Vui lòng chọn năm sinh'
      : y < 1900 || y > 2026 ? 'Phạm vi năm: 1900–2026'
      : '',
    month: !form.month ? 'Vui lòng chọn tháng' : '',
    day: !form.day ? 'Vui lòng chọn ngày'
      : form.year && form.month && !isValidDate(y, m, d) ? `Tháng ${m} không có ngày ${d}`
      : '',
  };
  const hasError = Object.values(errors).some(Boolean);

  // ─── Completion (cho thanh tiến độ) ───────────────────────────
  const steps = [
    !!form.year && !!form.month && !!form.day && !errors.year && !errors.month && !errors.day,
    form.unknownTime || !!form.shichen,
    true, // gender has default
  ];
  const completedSteps = steps.filter(Boolean).length;

  // ─── Hiển thị tóm tắt khi đã điền đủ ──
  const showSummary = steps[0] && steps[1] && !hasError;
  const summaryText = showSummary
    ? [
        `${d}/${m}/${y}`,
        form.unknownTime ? 'Giờ không rõ' : `Giờ ${SHICHEN_NAMES[form.shichen]}`,
        form.gender === 'male' ? 'Nam' : 'Nữ',
      ].filter(Boolean).join(' · ')
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ name: true, year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form });
    onSubmit({ year: y, month: m, day: d, hour: form.unknownTime ? 0 : form.shichen, gender: form.gender, name: form.name });
  };

  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: `1.5px solid ${borderColor}`,
    color: textPrimary,
    borderRadius: 'var(--radius-lg)',
    padding: '14px 18px',
    fontSize: '17px',
    width: '100%',
    outline: 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    fontFamily: 'var(--primitive-font-sans)',
  };

  const inputFocusStyle: React.CSSProperties = {
    borderColor: accent,
    boxShadow: `0 0 0 3px ${isDarkMode ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.10)'}`,
  };

  function FieldError({ msg }: { msg: string }) {
    return (
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: errorColor, fontSize: '15px', marginTop: '6px' }}
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Tiêu đề ── */}
      <div className="text-center mb-8">
        <h3 className="heading-3 mb-2" style={{ color: accent }}>Nhập thông tin sinh</h3>
        <p className="body" style={{ color: textMuted, fontSize: '17px', lineHeight: 1.75 }}>
          Lá số sẽ được sắp dựa trên ngày tháng năm sinh theo múi giờ Việt Nam.
        </p>
      </div>

      {/* ── Thanh tiến độ ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {steps.map((done, i) => (
          <motion.div
            key={i}
            animate={{
              background: done
                ? (isDarkMode ? '#d4a843' : '#9A7A1A')
                : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(26,21,16,0.08)'),
            }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, height: '3px', borderRadius: '3px' }}
          />
        ))}
      </div>

      {/* ── Họ tên ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '16px',
          fontWeight: 500,
          color: textPrimary,
          marginBottom: '8px',
        }}>
          Họ và tên (*)
        </label>
        <input
          type="text"
          placeholder="Nhập họ và tên người xem lá số"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { Object.assign(e.target.style, inputFocusStyle); }}
          onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
        />
        <FieldError msg={showErr('name') ? errors.name : ''} />
      </div>

      {/* ── Ngày sinh ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '16px',
          fontWeight: 500,
          color: textPrimary,
          marginBottom: '8px',
        }}>
          Ngày sinh (Dương lịch)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <select
              value={form.year}
              onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }}
              style={showErr('year') && errors.year ? { ...inputStyle, borderColor: errorColor } : inputStyle}
              onFocus={e => { Object.assign(e.target.style, inputFocusStyle); }}
              onBlur={e => { e.target.style.borderColor = showErr('year') && errors.year ? errorColor : borderColor; e.target.style.boxShadow = 'none'; }}
              required
            >
              <option value="">Năm</option>
              {Array.from({ length: 127 }, (_, i) => 2026 - i).map(yr => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
            <FieldError msg={showErr('year') ? errors.year : ''} />
          </div>
          <div>
            <select
              value={form.month}
              onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
              style={showErr('month') && errors.month ? { ...inputStyle, borderColor: errorColor } : inputStyle}
              onFocus={e => { Object.assign(e.target.style, inputFocusStyle); }}
              onBlur={e => { e.target.style.borderColor = showErr('month') && errors.month ? errorColor : borderColor; e.target.style.boxShadow = 'none'; }}
              required
            >
              <option value="">Tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => (
                <option key={mo} value={String(mo)}>Tháng {mo}</option>
              ))}
            </select>
            <FieldError msg={showErr('month') ? errors.month : ''} />
          </div>
          <div>
            <select
              value={form.day}
              onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
              style={showErr('day') && errors.day ? { ...inputStyle, borderColor: errorColor } : inputStyle}
              onFocus={e => { Object.assign(e.target.style, inputFocusStyle); }}
              onBlur={e => { e.target.style.borderColor = showErr('day') && errors.day ? errorColor : borderColor; e.target.style.boxShadow = 'none'; }}
              required
            >
              <option value="">Ngày</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => (
                <option key={dy} value={String(dy)}>Ngày {dy}</option>
              ))}
            </select>
            <FieldError msg={showErr('day') ? errors.day : ''} />
          </div>
        </div>
      </div>

      {/* ── Giờ sinh ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '16px',
          fontWeight: 500,
          color: textPrimary,
          marginBottom: '8px',
        }}>
          Giờ sinh (Canh giờ)
        </label>
        <div style={{
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,250,235,0.5)',
          border: `1px solid ${borderColor}`,
          opacity: form.unknownTime ? 0.5 : 1,
          pointerEvents: form.unknownTime ? 'none' : 'auto',
          transition: 'opacity var(--transition-base)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {SHICHEN.map((info, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => setForm({ ...form, shichen: idx })}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: `1.5px solid ${form.shichen === idx ? accent : 'transparent'}`,
                  background: form.shichen === idx
                    ? (isDarkMode ? 'rgba(212,168,67,0.12)' : 'rgba(154,122,26,0.08)')
                    : 'transparent',
                  color: form.shichen === idx ? accent : textMuted,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Giờ {SHICHEN_NAMES[idx]}
                <br />
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.7 }}>{info.range}</span>
              </motion.button>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <span style={{ fontSize: '15px', color: accent, fontWeight: 500 }}>
              Giờ {SHICHEN_NAMES[form.shichen]} · {shichenInfo?.range}
            </span>
          </div>
        </div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '18px', height: '18px', borderRadius: '4px', cursor: 'pointer', accentColor: accent }}
          />
          <span style={{ fontSize: '15px', color: textMuted }}>
            Không biết giờ sinh, dùng giờ Tý (23:00–01:00) để sắp lá số
          </span>
        </label>
      </div>

      {/* ── Giới tính ── */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '16px',
          fontWeight: 500,
          color: textPrimary,
          marginBottom: '8px',
        }}>
          Giới tính
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            const genderColor = isMale ? (isDarkMode ? '#60a5fa' : '#2563eb') : (isDarkMode ? '#f472b6' : '#db2777');
            return (
              <motion.button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, gender: g })}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '17px',
                  fontWeight: 500,
                  border: `1.5px solid ${active ? genderColor : borderColor}`,
                  background: active
                    ? (isDarkMode ? `${genderColor}15` : `${genderColor}10`)
                    : inputBg,
                  color: active ? genderColor : textMuted,
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
              >
                {isMale ? 'Nam' : 'Nữ'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Tóm tắt thông tin ── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              background: isDarkMode ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)',
              border: `1px solid ${isDarkMode ? 'rgba(212,168,67,0.20)' : 'rgba(154,122,26,0.15)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '16px', color: accent }}>✓</span>
              <span style={{ fontSize: '15px', color: textPrimary, flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nút Sắp lá số ── */}
      {!hideSubmit && (
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.01 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          style={{
            width: '100%',
            padding: '16px 32px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? (isDarkMode ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.15)')
              : `linear-gradient(135deg, ${accent}, ${accentLight})`,
            color: loading
              ? (isDarkMode ? 'rgba(212,168,67,0.4)' : 'rgba(154,122,26,0.4)')
              : '#FFFFFF',
            boxShadow: loading ? 'none' : `0 4px 20px ${isDarkMode ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.30)'}`,
            transition: 'all var(--transition-fast)',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                }}
              />
              Đang sắp lá số...
            </span>
          ) : 'Sắp lá số'}
        </motion.button>
      )}
    </motion.form>
  );
}
