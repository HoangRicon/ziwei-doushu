'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';

// ─── Wrapper vào trang cuộn ──────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // Phiên bản trước có đường liền 1px + bóng gradient 12px, khi chuyển đổi theme tạo thành đường kẻ ngang rõ ràng rất cứng.
  // Đổi thành gradient 24px mềm hơn + opacity thấp, các section nối tiếp tự nhiên hơn.
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── Nút chuyển đổi theme ──────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Chuyển sang theme sáng' : 'Chuyển sang theme tối'
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </motion.button>
  );
}

// ─── Dữ liệu Chính tinh ─────────────────────────────────────
const STARS = [
  { name: 'Tử Vi' }, { name: 'Thiên Cơ' }, { name: 'Thái Dương' }, { name: 'Vũ Khúc' },
  { name: 'Thiên Đồng' }, { name: 'Liêm Trinh' }, { name: 'Thiên Phủ' }, { name: 'Thái Âm' },
  { name: 'Đam Lang' }, { name: 'Cử Môn' }, { name: 'Thiên Xương' }, { name: 'Thiên Lương' },
  { name: 'Thập Sát' }, { name: 'Phá Quân' },
];

// ─── Mô-đun tính năng ──────────────────────────────────────
const FEATURES = [
  {
    tag: 'Hệ thống sắp bản đồ',
    title: 'Tử Vi Đẩu Số chính thống\ncủa Nị Hải Hạ',
    subtitle: 'Không phải phiên bản đơn giản, tuân thủ nghiêm ngặt truyền thừa từ thầy Nị Hải Hạ',
    points: [
      'Na ẩm Ngũ hành cục sắp bản đồ, không sử dụng thuật toán đơn giản trên mạng',
      'Mệnh cung đếm ngược theo thời sinh, Thân cung đếm thuận theo thời sinh, nghiêm ngặt theo quy tắc giảng dạy',
      '14 Chính tinh và Tứ hóa phi tinh theo pháp nguyên, cấu trúc hoàn chỉnh có thể kiểm chứng',
    ],
  },
  {
    tag: 'Trình bày bản đồ',
    title: '14 Chính tinh đầy đủ\nTứ hóa phi tinh',
    subtitle: 'Cấu trúc rõ ràng, nhìn một lần là hiểu chủ đạo và trọng điểm',
    points: [
      '14 Chính tinh nhập cung đầy đủ, quan hệ Chính tinh rõ ràng dễ đọc',
      'Phụ tinh và Sát tinh cùng hiển thị, tránh thiếu thông tin quan trọng',
      'Phân cấp độ sáng Miêu Vượng Lợi Hãm, nhanh chóng nhận diện mạnh yếu',
      'Nhấp vào bất kỳ Chính tinh nào để xem giải đoán chi tiết của thầy Nị Hải Hạ về tinh đó',
    ],
  },
  {
    tag: 'Giải đoán AI',
    title: 'Giải đoán sâu\nKhông chỉ tính toán',
    subtitle: 'Cơ sở tri thức hệ thống Nị Hải Hạ × Claude AI',
    points: [
      'Phân tích mệnh cục: Từ Chính tinh Mệnh cung, kết hợp Tam phương Tứ chính, đưa ra phán đoán toàn diện về tính cách và cục diện cuộc đời',
      'Giải đoán 6 chiều: Hướng sự nghiệp, hôn nhân tình cảm, mô hình tài vận, sức khỏe cần lưu ý, quan hệ gia đình, duyên con cái',
      'Theo dõi Đại hạn Lưu niên: Trọng điểm Đại hạn 10 năm hiện tại, nhắc nhở cụ thể và đề xuất hành động cho cung Lưu niên năm nay',
      'Đặt câu hỏi tự do: Hỏi trực tiếp về bản đồ của bạn, "Năm nay có đổi công việc được không", "Khi nào vận hôn nhân tốt nhất"',
    ],
  },
  {
    tag: 'Nhận diện cục diện',
    title: 'Tự động phát hiện\nCục diện bản đồ',
    subtitle: 'Khám phá định mệnh định sẵn từ kết hợp tinh diệu',
    points: [
      'Tự động nhận diện 11 loại cục diện kinh điển: Tử Phủ đồng cung, Sát Phá Lang cục, Cơ Nguyệt đồng lương, Liêm Tương cục, Vũ Khúc Thập Sát, v.v.',
      'Các cục diện đặc biệt như Phụ Ỷ giáp Mệnh, Nhật Nguyệt giáp Mệnh được phát hiện chính xác, đồng thời đưa ra giải đoán tiêu chuẩn theo hệ thống Nị Hải Hạ',
      'Các tình trạng đặc biệt của Tứ hóa nhập Mệnh cung Di chuyển cung được tự động ghi chú, nhắc nhở các vấn đề cuộc đời cần chú ý',
      'Cục diện được phân lớp theo cấp độ hung cát, giúp bạn nắm rõ ưu điểm và thách thức trong bản đồ',
    ],
  },
];

// ─── 4 mô-đun học tập chính (thanh thời gian sau hero)────────────────────
const SECTIONS = [
  {
    key: 'ziwei',
    name: 'Tử Vi',
    en: 'Zi Wei',
    desc: '14 Chính tinh · 13 Cung · Giải đoán AI',
    status: 'ready' as const,
    when: '5 tháng',
    icon: '◉',  // Tròn đặc + điểm bên trong, visual tinh Tử Vi
    note: '',
  },
  {
    key: 'tianji',
    name: 'Thiên Kỷ',
    en: 'Tian Ji',
    desc: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
    status: 'soon' as const,
    when: '6 tháng',
    icon: '⊙',  // Tròn + điểm bên trong (chữ "nhật" cổ), cùng độ rộng ký tự với ◉
    note: '',
  },
  {
    key: 'diji',
    name: 'Địa Kỷ',
    en: 'Di Ji',
    desc: 'Di sản chưa hoàn thành của Nị sư · Bổ chú của hậu bối',
    status: 'soon' as const,
    when: '6 tháng',
    icon: '⊞',  // Vuông + giếng (visual địa/điền), cùng độ rộng ký tự với ⊙
    note: 'Nghiên cứu bản thảo',
  },
  {
    key: 'renji',
    name: 'Nhân Kỷ',
    en: 'Ren Ji',
    desc: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm Cứu',
    status: 'soon' as const,
    when: '7 tháng',
    icon: '⊕',  // Tròn + chữ thập (y đạo/cân bằng âm dương), cùng độ rộng với ⊙/⊞
    note: '',
  },
];

// ─── Giáo điều cốt lõi của Nị Hải Hạ ──────────────────────
const NI_TEACHINGS = [
  {
    title: 'Mệnh cung là gốc, Tam phương là dụng',
    body: 'Nị sư luôn nhấn mạnh, xem mệnh trước phải xem Mệnh cung. Chính tinh Mệnh cung quyết định cục diện cơ bản và tính cách bẩm sinh của một người, Tam phương (Tài bạch, Quan lộc, Di chuyển) quyết định "nơi dùng võ" của người đó. Bốn cung liên động mới là bức tranh toàn diện của cuộc đời.',
  },
  {
    title: 'Đối cung mượn tinh, không thể bỏ qua',
    body: 'Điểm độc đáo của Nị sư là coi trọng "đối cung". Bất kỳ cung nào nếu trống, phải mượn tinh diệu đối cung để luận đoán, Mệnh cung đối diện là Di chuyển cung, hai cung này tương tác lẫn nhau, đây là chìa khóa dễ bị người mới bỏ qua.',
  },
  {
    title: 'Tứ hóa mới là bàn tay định mệnh',
    body: 'Tinh diệu chỉ là nền tảng, Tứ hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là yếu tố quyết định vận may tốt xấu. Cùng một tinh, có Hóa Lộc và có Hóa Kỵ, quỹ tích cuộc đời có thể hoàn toàn khác nhau. Nị sư nhấn mạnh đi tục: Không xem tứ hóa, bản đồ chỉ giải được một nửa.',
  },
  {
    title: 'Đại hạn mười năm, vận số có nhịp',
    body: 'Nị sư chia cuộc đời thành 12 Đại hạn, mỗi Đại hạn 10 năm. Ông cho rằng con người trong các cung Đại hạn khác nhau, số phận hoàn toàn khác. Hiểu rõ Đại hạn nào mình đang đi, cung đó có tinh diệu gì, mới có thể nắm bắt vận số hiện tại thực sự.',
  },
];

// ─── Hàm helper màu chủ đề ─────────────────────────────────────
function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    // nav dùng cùng màu không trong suốt với bgBase, tránh lớp bán trong suốt chồng lên tạo dải màu lệch
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    // Chữ sáng dùng hệ lạnh xám (phương án A cốt lõi): nền ấm + chữ lạnh → không mỏi mắt thị giác
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    // Accent màu lạnh (phương án B cốt lõi): tương thích với xanh quan trong chế độ tối; dùng cho glow trang trí / liên kết / nhấn
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    // Glow sáng thực sự dùng xanh / tím——thêm điểm nhấn màu lạnh cho bầu không khí tổng thể
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── Dữ liệu giới thiệu Tứ hóa ─────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Hóa Lộc': { attr: 'Cát hóa·Tăng ích', brief: 'Phúc tinh đến cung, chủ tài vận và phúc khí tăng ích. Cung có cùng sự vật thuận lợi, năng lực tăng cường, là tinh hóa được chào đón nhất trong bản đồ.' },
  'Hóa Quyền': { attr: 'Cát hóa·Quyền uy', brief: 'Tinh quyền đến cung, chủ khống chế và lãnh đạo. Cung chủ mạnh mẽ và quyết đoán, thích hợp nhập Quan lộc cung và Mệnh cung, chủ sự nghiệp có thực quyền.' },
  'Hóa Khoa': { attr: 'Cát hóa·Danh vọng', brief: 'Tinh khoa danh đến cung, chủ danh vọng và quý nhân duyên. Cung chủ văn danh và thi cử, có quý nhân giúp đỡ, thích hợp học thuật, thi cử và các dịp công khai.' },
  'Hóa Kỵ': { attr: 'Hung hóa·Trở ngại', brief: 'Tinh kiếp số đến cung, chủ ám niệm và trở ngại. Cung cần đặc biệt chú ý, vấn đề cuộc đời của cung đó sẽ trở thành thử thách quan trọng.' },
};

// ─── Dữ liệu giới thiệu Chính tinh ─────────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Tử Vi': { attr: 'Thổ·Tinh đế vương', brief: 'Tinh thiên hoàng quý, thống ngự chư tinh. Người nhập mệnh có khí cô đơn kiêu ngạo, chủ quyền uy hiển đạt, bẩm sinh có khí chất lãnh đạo, thích hợp vị trí lãnh đạo độc lập.' },
  'Thiên Cơ': { attr: 'Mộc·Tinh trí tuệ', brief: 'Tinh ích thọ, chủ trí mưu và biến động. Thông tuệ cơ trí, giỏi lập kế hoạch, tâm tư tinh tế, thích hợp công việc quy hoạch, tư vấn, kỹ thuật.' },
  'Thái Dương': { attr: 'Hỏa·Chủ quan lộc', brief: 'Tinh chủ quan lộc, chủ danh vọng và tiếng tăm. Hào phóng rộng lượng, coi trọng hình tượng công khai, thuận lợi cho quan trường và công vụ, nam mệnh mạnh, khi vào miếu sáng suốt chính trực.' },
  'Vũ Khúc': { attr: 'Kim·Chủ tài bạch', brief: 'Tinh chủ tài bạch, chủ tài vận và quyết định. Ý chí kiên định, hành động quyết đoán, thích hợp tài chính, ngân hàng, quân cảnh, công chức, tinh cô đơn hung, thuận lợi kết hôn muộn.' },
  'Thiên Đồng': { attr: 'Thủy·Tinh phúc đức', brief: 'Tinh đức chủ, chủ hưởng lạc và nhân duyên. Tính tình ôn hòa, nhân duyên cực tốt, coi trọng chất lượng cuộc sống, tình cảm tinh tế, vận số cuối đời tốt.' },
  'Liêm Trinh': { attr: 'Hỏa·Tinh tài nghệ', brief: 'Tinh thứ hoa, chủ tài nghệ và tình dục. Tài hoa xuất chúng, tình cảm phong phú, thích hợp nghệ thuật, chính trị, đa tài đa nghệ nhưng cần phòng hoa phiếm thịnh.' },
  'Thiên Phủ': { attr: 'Thổ·Tinh tài khố', brief: 'Tinh Nam đấu chủ, chủ tài khố và tích lũy. Ôn thận bảo thủ, năng lực tài chính mạnh, là lực lượng ổn định trong bản đồ, thích hợp quản lý tài chính và hành chính.' },
  'Thái Âm': { attr: 'Thủy·Chủ điền trạch', brief: 'Tinh chủ điền trạch, chủ tài vận và âm nhu. Tinh tế nhuyễn nhiệt, năng lực cảm nhận mạnh, nữ mệnh đặc biệt tốt, thuận lợi bất động sản và tích lũy, thích hợp văn nghệ hoặc dịch vụ.' },
  'Đam Lang': { attr: 'Mộc Thủy·Hoa đào', brief: 'Tinh hoa đào, chủ dục vọng và tài năng. Đa tài đa nghệ, dục vọng mạnh, giao tiếp sôi nổi, thích hợp nghệ thuật, quan hệ công cộng, kinh doanh, nhân duyên cực tốt.' },
  'Cử Môn': { attr: 'Thủy·Tinh thị phi', brief: 'Tinh ám, chủ khẩu tài và thị phi. Khẩu tài xuất chúng, tư duy biện luận mạnh, thích hợp luật sư, giáo dục, truyền thông, chú ý thị phi khẩu tài, lập thân bằng biện tài.' },
  'Thiên Xương': { attr: 'Thủy·Tinh ấn', brief: 'Tinh ấn, chủ phụ giúp và ấn nã. Giỏi điều hòa, coi trọng lễ tiết, chính trực tuân pháp, thích hợp mưu trì, hành chính, luật pháp, vận quý nhân tốt.' },
  'Thiên Lương': { attr: 'Thổ·Tinh ấm', brief: 'Tinh ấm, chủ lão thành và che chở. Chính trực ổn định, từ bi, Trời sẽ phù hộ, thích hợp y tế, công tác xã hội, lĩnh vực tôn giáo.' },
  'Thập Sát': { attr: 'Kim Hỏa·Tinh tướng', brief: 'Tinh tướng, chủ cương liệt và sáng tạo. Tính cách cương nghị, hành động mạnh mẽ, dũng cảm thử thách, thích hợp khởi nghiệp, quân cảnh, ngành cạnh tranh, hóa hung thành kiết.' },
  'Phá Quân': { attr: 'Thủy·Tinh hao', brief: 'Tinh hao, chủ biến động và khai phá. Dũng cảm đột phá, không sợ thay đổi, một đời biến động lớn nhưng có khí phách, thích hợp công việc khai phá, đi con đường chưa ai đi.' },
};

// ─── Trang trí thị giác tính năng ─────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>Phương pháp sắp bản đồ Nị Hải Hạ</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Hệ Tử Vi', stars: ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh'] },
          { group: 'Hệ Thiên Phủ', stars: ['Thiên Phủ', 'Thái Âm', 'Đam Lang', 'Cử Môn', 'Thiên Xương', 'Thiên Lương', 'Thập Sát', 'Phá Quân'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>Tứ hóa phi tinh</div>
          <div className="flex gap-2 flex-wrap">
            {[['Hóa Lộc', 'rgba(52,211,153,0.7)'], ['Hóa Quyền', 'rgba(96,165,250,0.7)'], ['Hóa Khoa', 'rgba(250,204,21,0.7)'], ['Hóa Kỵ', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Vận số sự nghiệp của tôi năm nay thế nào?' },
      { role: 'ai', text: 'Mệnh cung Thiên Cơ Hóa Lộc, năm nay Đại hạn đi qua Quan lộc cung, Tam phương có Tả Phụ giúp đỡ, sự nghiệp có quý nhân nâng đỡ, thích hợp chủ động mở rộng…' },
      { role: 'user', text: 'Khi nào vận tình cảm tốt nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Sát Phá Lang cục', desc: 'Mệnh khởi sáng tạo', ok: true },
      { name: 'Liêm Tương cục',   desc: 'Cục hành chính ấn nã', ok: true },
      { name: 'Hóa Kỵ nhập Mệnh', desc: 'Cần chú ý vấn đề tâm lý', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          Tự động nhận diện 11 loại cục diện kinh điển
        </div>
      </div>
    );
  }

  return null;
}

// ─── Trang chủ ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Đồng bộ nền body/html thành màu chủ đề home, loại bỏ dải màu lệch do nav bán trong suốt lộ #fafaf9
  // useLayoutEffect đảm bảo đồng bộ cập nhật trước khi trình duyệt vẽ, tránh không đồng bộ với transition của div gốc
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* Thông báo cho người dùng——phủ toàn màn hình khi truy cập lần đầu, chỉ vào trang chủ sau khi đóng */}
      <AnnouncementModal />

      <StarField />

      {/* Ánh sáng toàn cục */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── Thanh điều hướng trên ── nav cùng màu với hero (c.bgBase), không blur không viền, không có dải màu lệch */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
        style={{
          background: c.navBg,
        }}>
        <div className="text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] font-medium transition-colors duration-300 flex-shrink-0"
          style={{ color: c.goldSolid }}>
          Bản đồ Tử Vi
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
            Ghép bản đồ
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
            Sắp bản đồ ngay
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* Hàng nhãn */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.45em] transition-colors duration-300" style={{ color: c.tagText }}>
              Tử Vi Đẩu Số · Hệ thống Nị Hải Hạ
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* Tiêu đề chính */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-none mb-5`}
              style={{
                fontSize: 'clamp(56px, 10vw, 124px)',
                letterSpacing: '0.07em',
              }}>
              Bản đồ Tử Vi
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.18em] mb-2"
            style={{ color: c.textSecond, fontWeight: 500 }}>
            Tử Vi là cửa · Trời Đất Nhân là đường · Nị Hải Hạ là thầy
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.3em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}>
            AI trả lời · Tri thức hành động hợp nhất
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}>
            Nhập ngày tháng năm sinh, tạo bản đồ Tử Vi Đẩu Số riêng cho bạn — Các mô-đun học tập Thiên Kỷ, Địa Kỷ, Nhân Kỷ sẽ lần lượt mở cửa.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              Sắp bản đồ ngay
            </motion.button>
          </motion.div>

          {/* 14 Chính tinh chủ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[540px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-wide" style={{ color: c.starText }}>{star.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Thông báo mở bán - ghi chú dán (desktop định vị tuyệt đối bên phải) */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            right: 'clamp(2%, 6vw, 8%)',
            top: '54%',
            maxWidth: '240px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(196,90,45,0.18), 0 2px 6px rgba(196,90,45,0.1)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '14px' }}>5/1 — 5/8</span>
              <span> Ưu đãi giới hạn</span>
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              Toàn bộ chức năng + AI đặt câu hỏi
              <strong style={{ color: '#c45a2d' }}> Hoàn toàn miễn phí</strong>
            </div>
          </div>
        </motion.div>

        {/* Thông báo mở bán - ghi chú dán (điện thoại hiển thị bình thường theo luồng, dưới hero căn giữa) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:hidden mx-auto mt-8 mb-2 pointer-events-none"
          style={{
            maxWidth: 'min(280px, 84vw)',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 6px 18px rgba(196,90,45,0.16), 0 2px 4px rgba(196,90,45,0.08)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '13px' }}>5/1 — 5/8</span>
              <span> Ưu đãi giới hạn</span>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              Toàn bộ chức năng + AI <strong style={{ color: '#c45a2d' }}>Hoàn toàn miễn phí</strong>
            </div>
          </div>
        </motion.div>

        {/* Gợi ý cuộn (định vị tuyệt đối, không ảnh hưởng tính toán opacity hero) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: c.scrollText }}>Khám phá thêm</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ Lời引言 triết học ═════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>Mệnh</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>Mệnh · Vận · Quan</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc dòm trước vận mệnh', size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { text: 'Không nằm ở chỗ biết trước tương lai', size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { text: 'Mà nằm ở chỗ không ngừng nhận thức bản thân', size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wider" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.05em', lineHeight: 1.35 }}>
              Cuối cùng viết nên kịch bản cuộc đời thuộc về bạn
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 4 mô-đun học tập chính thanh thời gian ══════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>Curriculum</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.15em]" style={{ color: c.textPrimary }}>
            Phương pháp của Nị sư · Lần lượt triển khai
          </div>
          <div className="text-xs lg:text-sm tracking-[0.1em]" style={{ color: c.textMuted }}>
            Từ Tử Vi làm điểm khởi đầu, từ từ mở cửa các mô-đun học tập Thiên Kỷ / Địa Kỷ / Nhân Kỷ
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          {/* Đường kết nối ngang (chỉ desktop)*/}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />

          {/* Đường kết nối dọc (chỉ điện thoại) — điểm tròn sát đường, làm style "bản đồ đường sắt" */}
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  {/* Vòng tròn nút */}
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#10b981', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* Nhóm chữ: điện thoại xếp một cột bên phải; desktop xếp giữa theo cột */}
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    {/* Hàng trên: nhãn thời gian + tên mô-đun + ghi chú (điện thoại inline; desktop vẫn xếp hàng riêng) */}
                    <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-[0.25em] lg:mb-1.5"
                        style={{ color: ready ? '#10b981' : c.textMuted, fontWeight: 500 }}>
                        {s.when}
                      </div>
                      <div className="text-base lg:text-xl font-semibold tracking-[0.15em]"
                        style={{ color: c.textPrimary }}>
                        {s.name}
                      </div>
                      {s.note && (
                        <div className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {s.note}
                        </div>
                      )}
                    </div>
                    {/* Ghi chú riêng cho desktop (điện thoại đã hiển thị inline ở hàng trên)*/}
                    {s.note && (
                      <div className="hidden lg:block text-[9px] tracking-[0.15em] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {s.note}
                      </div>
                    )}
                    {/* Giới thiệu */}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Giới thiệu chi tiết tính năng ═══════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Khu vực chữ */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* Khu vực trang trí thị giác */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ Lý thuyết ba phần Thiên · Địa · Nhân ═════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                天 · 地 · 人
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                倪海夏老师的核心命运观：命运从来不是人生的全部。<br />
                他将影响人生的力量分为三个同等重要的维度。
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: '天', label: '先天命运', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: '紫微斗数所揭示的，是一个人的先天命盘格局——出生时间决定的星曜布局、五行局数、命宫主星。这只是命运的三分之一，是人生的底色，而非全貌。', sub: '命盘 · 星曜 · 五行' },
              { glyph: '地', label: '地理环境', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: '你所在的地理环境、城市、国家、风水格局，乃至家庭背景与社会结构，共同构成了命运的第二个维度。同一命盘，生在不同地方，际遇可以天壤之别。', sub: '地域 · 风水 · 环境' },
              { glyph: '人', label: '人心意念', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: '个人的意志、心态、选择与行动，才是改变命运最主动的力量。倪师强调：了解命盘是为了更好地做人，而不是坐等命运安排。精进自己，是最强的破局之道。', sub: '意志 · 选择 · 行动' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                「命运不是人生的全部，加上地理位置和人念，才是。」
              </p>
              <p className="mt-2 text-[10px] tracking-widest" style={{ color: c.tagText }}>— 倪海夏</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ Giới thiệu Nị Hải Hạ ═══════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                倪海夏老师
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                当代华人圈最具影响力的中医与术数大家之一<br />
                美国汉唐中医学院创办人 ·「人纪」「天纪」两大教学体系传世
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: '生于', value: '1954年', sub: '台湾' },
                  { label: '离世', value: '2012年', sub: '1月31日 · 享年58' },
                  { label: '传承', value: '紫微斗数', sub: '经方中医 · 易经' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>生平履历</strong>：
                  倪海夏先生（1954–2012）出生于台湾，早年师承多位中医名家，专研经方派（《伤寒论》传承）。
                  中年赴美行医，在美国创立<strong>汉唐中医学院</strong>，二十余年间系统传授中医与传统术数。
                  2012 年 1 月 31 日因肝癌在台湾离世，享年 58 岁。
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>教学体系</strong>：
                  倪师将毕生所学整理为两大公开教学系列。
                  <strong>「人纪」</strong>涵盖《针灸大成》《神农本草经》《黄帝内经》《伤寒论》《金匮要略》——
                  这是「人之纪」，奠定中医学习的完整路径；
                  <strong>「天纪」</strong>涵盖紫微斗数与《易经》——这是「天之纪」，是术数研究的体系化成果。
                  两者相合，是倪师留给后世最完整的传承。
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>紫微立场</strong>：
                  倪师在紫微斗数上明确属<strong>南派三合派</strong>，主张「以命宫为本、以三方四正为用、以四化为纲」。
                  他在《天纪》课程中明言：「<em>飞星（四化）飞来飞去太复杂，不搞这个，毕竟大道至简</em>」——
                  这一立场将其与繁琐的飞星派清晰区分。
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>治学态度</strong>：
                  倪师反对死记硬背口诀，强调「理解原理胜过背诵」「逻辑可复核胜过神秘玄学」。
                  这种态度让紫微斗数从师徒密传的封闭体系，走向系统化、可验证、可学习的现代知识体系。
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>当代影响</strong>：
                  倪师的讲课视频在 B 站、YouTube 与各大平台广泛流传，是新一代命理与中医爱好者公认的入门必修。
                  他不仅是紫微斗数的传承者，更是把传统命理与中医带入现代知识体系的关键人物之一。
                </p>
                <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                  本平台所有解读基于倪师《天纪》公开教学讲义、《紫微斗数全书》明版、传统三合派古籍整理而成，
                  仅作文化与个人成长参考。倪师本人与本平台无任何商业关联。
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Lối vào hợp bản đồ ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Compatibility · Analysis</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                Tử Vi hợp bản đồ
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                Nhập thông tin sinh của hai người, AI dựa trên hệ thống Nị Hải Hạ phân tích duyên khớp, tình cảm và đề xuất cách hòa thuận,<br className="hidden md:block" />
                Đưa ra điểm hòa hợp tình cảm, khả năng hợp tác và đề xuất cách sống chung tốt nhất.
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {['Phân tích điểm hòa hợp tình cảm', 'Đánh giá khởi nghiệp hợp tác', 'Giải đoán duyên cha con', 'Đánh giá tương xứng trước hôn nhân'].map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                Bắt đầu phân tích hợp bản đồ
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ CTA cuối cùng ══════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.6em] uppercase mb-6" style={{ color: c.tagText }}>Bắt đầu hành trình bản đồ của bạn</p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Bản đồ Tử Vi của bạn<br />Đang chờ bạn giải đoán
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Nhập ngày tháng năm sinh, trong vài giây tạo bản đồ riêng cho bạn<br />
            Sau đó AI dựa trên hệ thống Nị Hải Hạ giải đoán sâu cho bạn
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Sắp bản đồ miễn phí
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              ✦ Cơ sở tri thức Tử Vi Đẩu Số →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              📜 Kho cổ thư nguyên tác →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>

      {/* 4 mô-đun hướng dẫn thanh toán (đã triển khai + sắp mở) */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-[0.3em] text-center mb-4 uppercase"
            style={{ color: c.textMuted, opacity: 0.6 }}>
            Phương pháp của Nị sư · Hệ thống học thuật
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.5,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-semibold mb-0.5 tracking-[0.1em]"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {s.name}
                  </div>
                  <div className="text-[9px] tracking-wider"
                    style={{ color: ready ? '#10b981' : c.textMuted }}>
                    {ready ? '✓ Đã triển khai' : `${s.when} mở`}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.footerText }}>
            Bản đồ Tử Vi · Dựa trên hệ thống chính thống của Nị Hải Hạ · Chỉ để tham khảo, vận mệnh nằm trong tay bạn
          </p>
          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            Nền tảng này dựa trên nghiên cứu văn hóa truyền thống Trung Quốc, chỉ cung cấp để tham khảo học tập.<br className="sm:hidden" />
            Nền tảng này không đưa ra bất kỳ lời khuyên y tế, đầu tư, pháp lý hoặc quyết định quan trọng nào.
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>Điều khoản dịch vụ</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>Chính sách bảo mật</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
