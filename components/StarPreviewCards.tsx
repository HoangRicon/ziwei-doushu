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
  'Tử Vi': { attr: 'Thổ·Tinh đế vương', brief: 'Tinh thiên hoàng quý, thống ngự chư tinh. Người nhập mệnh có khí cô đơn kiêu ngạo, chủ quyền uy hiển đạt.' },
  'Thiên Cơ': { attr: 'Mộc·Tinh trí tuệ', brief: 'Tinh ích thọ, chủ trí mưu và biến động. Thông tuệ cơ trí, giỏi lập kế hoạch.' },
  'Thái Dương': { attr: 'Hỏa·Chủ quan lộc', brief: 'Tinh chủ quan lộc, chủ danh vọng và tiếng tăm. Hào phóng rộng lượng, coi trọng hình tượng công khai.' },
  'Vũ Khúc': { attr: 'Kim·Chủ tài bạch', brief: 'Tinh chủ tài bạch, chủ tài vận và quyết định. Ý chí kiên định, hành động quyết đoán.' },
  'Thiên Đồng': { attr: 'Thủy·Tinh phúc đức', brief: 'Tinh đức chủ, chủ hưởng lạc và nhân duyên. Tính tình ôn hòa, nhân duyên cực tốt.' },
  'Liêm Trinh': { attr: 'Hỏa·Tinh tài nghệ', brief: 'Tinh thứ hoa, chủ tài nghệ và tình dục. Tài hoa xuất chúng, tình cảm phong phú.' },
  'Thiên Phủ': { attr: 'Thổ·Tinh tài khố', brief: 'Tinh Nam đấu chủ, chủ tài khố và tích lũy. Ôn thận bảo thủ, năng lực tài chính mạnh.' },
  'Thái Âm': { attr: 'Thủy·Chủ điền trạch', brief: 'Tinh chủ điền trạch, chủ tài vận và âm nhu. Tinh tế nhuyễn nhiệt, năng lực cảm nhận mạnh.' },
  'Đam Lang': { attr: 'Mộc Thủy·Hoa đào', brief: 'Tinh hoa đào, chủ dục vọng và tài năng. Đa tài đa nghệ, giao tiếp sôi nổi.' },
  'Cử Môn': { attr: 'Thủy·Tinh thị phi', brief: 'Tinh ám, chủ khẩu tài và thị phi. Khẩu tài xuất chúng, tư duy biện luận mạnh.' },
  'Thiên Xương': { attr: 'Thủy·Tinh ấn', brief: 'Tinh ấn, chủ phụ giúp và ấn nã. Giỏi điều hòa, coi trọng lễ tiết, chính trực tuân pháp.' },
  'Thiên Lương': { attr: 'Thổ·Tinh ấm', brief: 'Tinh ấm, chủ lão thành và che chở. Chính trực ổn định, từ bi, Trời sẽ phù hộ.' },
  'Thập Sát': { attr: 'Kim Hỏa·Tinh tướng', brief: 'Tinh tướng, chủ cương liệt và sáng tạo. Tính cách cương nghị, hành động mạnh mẽ, dũng cảm thử thách.' },
  'Phá Quân': { attr: 'Thủy·Tinh hao', brief: 'Tinh hao, chủ biến động và khai phá. Dũng cảm đột phá, không sợ thay đổi, một đời biến động lớn.' },
};

function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'              : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
  };
}

export default function StarPreviewCards() {
  const { theme } = useTheme();
  const c = useColors(theme);

  return (
    <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20"
      style={{ background: c.altSection }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Ziwei Stars</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <h2 className="font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: c.textPrimary }}>
            14 Chính Tinh
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            14 tinh diệu chính yếu trong Tử Vi Đẩu Số — mỗi tinh mang một nguyên khí và ý nghĩa riêng
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STARS.map((star, i) => {
            const info = STAR_BRIEF[star];
            return (
              <FadeIn key={star} delay={i * 0.05}>
                <Link href="/knowledge" className="block">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl p-5 h-full"
                    style={{
                      background: c.cardBg,
                      border: `1px solid ${c.cardBorder}`,
                      boxShadow: c.cardShadow,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-sm font-semibold tracking-wide" style={{ color: c.goldSolid }}>
                        {star}
                      </div>
                      <div className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          color: c.tagText,
                          border: `1px solid ${c.goldLine}`,
                          background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.1)',
                        }}>
                        {info.attr.split('·')[0]}
                      </div>
                    </div>

                    <div className="text-[10px] tracking-wider mb-2" style={{ color: c.goldSolid, opacity: 0.7 }}>
                      {info.attr}
                    </div>

                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: c.textMuted }}>
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
