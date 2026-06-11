'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

const STARS = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc',
  'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ', 'Thái Âm',
  'Đam Lang', 'Cử Môn', 'Thiên Xương', 'Thiên Lương',
  'Thập Sát', 'Phá Quân',
];

const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Tử Vi': {
    attr: 'Thổ · Tinh đế vương',
    brief: 'Tinh thiên hoàng quý, thống ngự chư tinh. Người nhập mệnh có khí cô đơn kiêu ngạo, chủ quyền uy hiển đạt.',
  },
  'Thiên Cơ': {
    attr: 'Mộc · Tinh trí tuệ',
    brief: 'Tinh ích thọ, chủ trí mưu và biến động. Thông tuệ cơ trí, giỏi lập kế hoạch.',
  },
  'Thái Dương': {
    attr: 'Hỏa · Chủ quan lộc',
    brief: 'Tinh chủ quan lộc, chủ danh vọng và tiếng tăm. Hào phóng rộng lượng, coi trọng hình tượng công khai.',
  },
  'Vũ Khúc': {
    attr: 'Kim · Chủ tài bạch',
    brief: 'Tinh chủ tài bạch, chủ tài vận và quyết định. Ý chí kiên định, hành động quyết đoán.',
  },
  'Thiên Đồng': {
    attr: 'Thủy · Tinh phúc đức',
    brief: 'Tinh đức chủ, chủ hưởng lạc và nhân duyên. Tính tình ôn hòa, nhân duyên cực tốt.',
  },
  'Liêm Trinh': {
    attr: 'Hỏa · Tinh tài nghệ',
    brief: 'Tinh thứ hoa, chủ tài nghệ và tình dục. Tài hoa xuất chúng, tình cảm phong phú.',
  },
  'Thiên Phủ': {
    attr: 'Thổ · Tinh tài khố',
    brief: 'Tinh Nam đấu chủ, chủ tài khố và tích lũy. Ôn thận bảo thủ, năng lực tài chính mạnh.',
  },
  'Thái Âm': {
    attr: 'Thủy · Chủ điền trạch',
    brief: 'Tinh chủ điền trạch, chủ tài vận và âm nhu. Tinh tế nhuyễn nhiệt, năng lực cảm nhận mạnh.',
  },
  'Đam Lang': {
    attr: 'Mộc Thủy · Hoa đào',
    brief: 'Tinh hoa đào, chủ dục vọng và tài năng. Đa tài đa nghệ, giao tiếp sôi nổi.',
  },
  'Cử Môn': {
    attr: 'Thủy · Tinh thị phi',
    brief: 'Tinh ám, chủ khẩu tài và thị phi. Khẩu tài xuất chúng, tư duy biện luận mạnh.',
  },
  'Thiên Xương': {
    attr: 'Thủy · Tinh ấn',
    brief: 'Tinh ấn, chủ phụ giúp và ấn nã. Giỏi điều hòa, coi trọng lễ tiết, chính trực tuân pháp.',
  },
  'Thiên Lương': {
    attr: 'Thổ · Tinh ấm',
    brief: 'Tinh ấm, chủ lão thành và che chở. Chính trực ổn định, từ bi, Trời sẽ phù hộ.',
  },
  'Thập Sát': {
    attr: 'Kim Hỏa · Tinh tướng',
    brief: 'Tinh tướng, chủ cương liệt và sáng tạo. Tính cách cương nghị, hành động mạnh mẽ, dũng cảm thử thách.',
  },
  'Phá Quân': {
    attr: 'Thủy · Tinh hao',
    brief: 'Tinh hao, chủ biến động và khai phá. Dũng cảm đột phá, không sợ thay đổi, một đời biến động lớn.',
  },
};

function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    accent:       d ? '#D4A843'                               : '#9A7A1A',
    accentLight:  d ? '#F0C060'                               : '#C8A030',
    accentDim:    d ? 'rgba(212,168,67,0.7)'                  : 'rgba(154,122,26,0.7)',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(154,122,26,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.75)'                 : 'rgba(154,122,26,0.8)',
    textPrimary:  d ? '#F0EBE0'                               : '#1A1510',
    textSecondary:d ? '#D8D0C0'                               : '#2D2820',
    textBody:     d ? '#A09888'                               : '#5A5248',
    textMuted:    d ? '#6A6258'                               : '#8A8078',
    cardBg:       d ? 'rgba(255,255,255,0.04)'               : 'rgba(255,255,255,0.92)',
    cardBorder:   d ? 'rgba(255,255,255,0.07)'               : 'rgba(154,122,26,0.14)',
    cardBorderHov:d ? 'rgba(212,168,67,0.30)'                : 'rgba(154,122,26,0.28)',
    cardShadow:   d ? '0 2px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)'
                     : '0 2px 12px rgba(154,122,26,0.07), 0 1px 3px rgba(0,0,0,0.05)',
    cardShadowHov:d ? '0 6px 28px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.35)'
                     : '0 6px 28px rgba(154,122,26,0.12), 0 2px 6px rgba(0,0,0,0.08)',
    sectionBg:    d ? 'rgba(255,255,255,0.02)'               : 'rgba(253,252,248,0.5)',
    elementBg:    d ? 'rgba(212,168,67,0.06)'                : 'rgba(154,122,26,0.07)',
    elementBorder:d ? 'rgba(212,168,67,0.20)'                : 'rgba(154,122,26,0.20)',
  };
}

export default function StarPreviewCards() {
  const { theme } = useTheme();
  const c = useColors(theme);

  return (
    <section
      className="relative z-10 px-6 md:px-10 lg:px-14 py-20 md:py-24"
      style={{ background: c.sectionBg }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>

        {/* Section Header */}
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span
              className="text-[13px] tracking-[0.18em] uppercase font-semibold"
              style={{ color: c.tagText }}
            >
              14 Tinh diệu
            </span>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <h2
            className="heading-2 mb-4"
            style={{ color: c.textPrimary }}
          >
            14 Chính Tinh
          </h2>
          <p
            className="body max-w-2xl mx-auto"
            style={{ color: c.textBody }}
          >
            14 tinh diệu chính yếu trong Tử Vi Đẩu Số — mỗi tinh mang một nguyên khí và ý nghĩa riêng
          </p>
        </FadeIn>

        {/* Star Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STARS.map((star, i) => {
            const info = STAR_BRIEF[star];
            return (
              <FadeIn key={star} delay={i * 0.04}>
                <Link href="/knowledge" className="block">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-xl p-5 h-full cursor-pointer group"
                    style={{
                      background: c.cardBg,
                      border: `1px solid ${c.cardBorder}`,
                      boxShadow: c.cardShadow,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = c.cardBorderHov;
                      el.style.boxShadow = c.cardShadowHov;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = c.cardBorder;
                      el.style.boxShadow = c.cardShadow;
                    }}
                  >
                    {/* Star name row */}
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="text-[16px] font-bold tracking-wide"
                        style={{ color: c.accent }}
                      >
                        {star}
                      </div>
                      <div
                        className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                        style={{
                          color: c.tagText,
                          border: `1px solid ${c.elementBorder}`,
                          background: c.elementBg,
                        }}
                      >
                        {info.attr.split('·')[0].trim()}
                      </div>
                    </div>

                    {/* Element + Attribute */}
                    <div
                      className="text-[13px] font-medium tracking-wider mb-3"
                      style={{ color: c.accent, opacity: 0.7 }}
                    >
                      {info.attr}
                    </div>

                    {/* Brief description */}
                    <p
                      className="text-[14px] leading-relaxed line-clamp-2"
                      style={{ color: c.textBody }}
                    >
                      {info.brief}
                    </p>
                  </motion.div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
