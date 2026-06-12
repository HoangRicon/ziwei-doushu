/**
 * SEO Trang kiến thức — Helper dữ liệu
 *
 * 14 Sao chính × 13 topic = 182 URL SEO độc lập
 * Mỗi trang là 4 đoạn markers tương ứng trong STAR_DB (một câu định điệu/chân lý cốt lõi/căn cứ lá số/tác phẩm kinh điển)
 */

import { STAR_DB } from '@/lib/ziwei/db-analysis';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';

export const ALL_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

// Ánh xạ tên sao chính → slug pinyin (dùng slug cho URL, tránh vấn đề URL tiếng Trung trên Vercel/CDN)
export const STAR_TO_SLUG: Record<string, string> = {
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_TO_SLUG).map(([k, v]) => [v, k])
);

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

interface StarContent {
  menhCung: string;
  tinhCach: string;
  huynhDe?: string;
  phuThe: string;
  tuNu?: string;
  taiBach: string;
  tichY: string;
  dienTrach?: string;
  giaoTu?: string;
  nhanTai?: string;
  quanLuc: string;
  taiSan?: string;
  phucDuc?: string;
  phuMu?: string;
}

const TOPIC_TO_FIELD: Record<TopicKey, keyof StarContent> = {
  overview:    'menhCung',
  personality: 'tinhCach',
  love:        'phuThe',
  career:      'quanLuc',
  wealth:      'taiBach',
  health:      'tichY',
  family:      'huynhDe' as keyof StarContent,
  children:    'tuNu' as keyof StarContent,
  move:        'dienTrach' as keyof StarContent,
  friends:     'giaoTu' as keyof StarContent,
  home:        'taiSan' as keyof StarContent,
  spirit:      'phucDuc' as keyof StarContent,
  parents:     'phuMu' as keyof StarContent,
};

interface ParsedContent {
  dinhDieu: string;
  chanLy: string;
  canCu: string;
  kinhDien: string;
  raw: string;
  hasMarkers: boolean;
}

function parseStarContent(content: string): ParsedContent {
  const out: ParsedContent = { dinhDieu: '', chanLy: '', canCu: '', kinhDien: '', raw: content, hasMarkers: false };
  if (!content) return out;
  if (!content.includes('**【定调】**') && !content.includes('**【一句】**') &&
      !content.includes('**【论断】**') && !content.includes('**【核心论断】**') &&
      !content.includes('**【一句话定调】**')) {
    out.chanLy = content;
    return out;
  }
  out.hasMarkers = true;
  const re = /\*\*【([^】]+)】\*\*/g;
  const parts: { name: string; markerEnd: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    parts.push({ name: m[1], start: m.index, markerEnd: m.index + m[0].length });
  }
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const end = i + 1 < parts.length ? parts[i + 1].start : content.length;
    const text = content.slice(p.markerEnd, end).trim();
    // Hỗ trợ cả marker tiếng Trung (STAR_DB gốc) và tiếng Việt
    if (['一句话定调', '一句', '定调', 'Định điệu'].includes(p.name)) out.dinhDieu = text;
    else if (['核心论断', '论断', 'Chân lý'].includes(p.name)) out.chanLy = text;
    else if (['命盘依据', 'Căn cứ'].includes(p.name)) out.canCu = text;
    else if (['经典出处', 'Kinh điển'].includes(p.name)) out.kinhDien = text;
  }
  return out;
}

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  parsed: ParsedContent;
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const profile = STAR_DB[star] as StarContent | undefined;
  const field = TOPIC_TO_FIELD[topic];
  const content = profile && field ? (profile[field] as string | undefined) ?? '' : '';
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: TOPIC_PALACE_NAME[topic],
    parsed: parseStarContent(content),
    exists: Boolean(content),
  };
}

/** Tạo toàn bộ 14×13 tổ hợp (dùng cho generateStaticParams) */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      const data = getKnowledge(star, topic);
      if (data.exists) routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}

/** Giới thiệu ngắn gọn thuộc tính sao chính (dùng cho phần "Tìm hiểu sao XX" trong trang SEO) */
export const STAR_BRIEF_SEO: Record<string, string> = {
  '紫微': 'Tử Vi là sao Đế, chủ về quý trọng, hóa khí là tôn. Người có sao này trong mệnh có khí thế lãnh đạo, thích hợp vị trí cao trên nền tảng lớn.',
  '天机': 'Thiên Cơ là sao trí tuệ, chủ về biến hóa linh mẫn, hóa khí là thiện. Người có sao này trong mệnh thông minh biến hóa, thích hợp hỗ trợ quy hoạch.',
  '太阳': 'Thái Dương là sao quý cho nam, chủ về danh vọng công vụ, hóa khí là quý. Người có sao này trong mệnh quang minh lỗi lạc, thích hợp công vụ danh vọng.',
  '武曲': 'Vũ Khúc là sao tài, chủ về cương nghị quyết đoán, hóa khí là tài. Người có sao này trong mệnh có khả năng quản lý tài chính mạnh, thích hợp thực nghiệp tài chính.',
  '天同': 'Thiên Đồng là sao phước, chủ về ôn hòa hưởng lạc, hóa khí là phước. Người có sao này trong mệnh tính tình ôn hòa, có phước.',
  '廉贞': 'Liêm Trinh là sao tài nghệ đào hoa, chủ về tài năng kiến thức, hóa khí là kỵ. Người có sao này trong mệnh đa tài đa nghệ, tình cảm phong phú.',
  '天府': 'Thiên Phủ là sao Nam Đế giữ của, chủ về ổn trọng bảo thủ, hóa khí là lệnh. Người có sao này trong mệnh hạnh kiểm ngay thẳng, giỏi giữ kho tài.',
  '太阴': 'Thái Âm là sao mặt trăng giàu quý, chủ về điền trạch giàu sang, hóa khí là phú. Người có sao này trong mệnh tình cảm tinh tế, nữ mệnh là tốt nhất.',
  '贪狼': 'Tham Lang là sao hồ đào dục vọng, đa tài đa giao tiếp, hóa khí là hồ đào. Người có sao này trong mệnh đa tài nghệ, giao tiếp rộng.',
  '巨门': 'Cự Môn là sao phong phi khẩu tài, chủ về biện luận truyền thông, hóa khí là ám. Người có sao này trong mệnh khẩu tài tốt, thích hợp luật sư giáo viên.',
  '天相': 'Thiên Tướng là sao ấn tướng phụ tá, chủ về trung hậu thật thà, hóa khí là ấn. Người có sao này trong mệnh hạnh kiểm ngay thẳng, thích hợp hành chính pháp vụ.',
  '天梁': 'Thiên Lương là sao lão nhân ấm sao, thiện gặp hung hóa cát, hóa khí là ấm. Người có sao này trong mệnh từ bi thiện lương, thích hợp luật pháp y học.',
  '七杀': 'Thất Sát là sao tướng, chủ về cô độc quyết đoán mạo hiểm, hóa khí là túc sát. Người có sao này trong mệnh cương nghị quyết đoán, thích hợp quân cảnh sáng tạo.',
  '破军': 'Phá Quân là sao phá hoại sáng tạo, chủ về lục thân duyên mỏng, hóa khí là hao. Người có sao này trong mệnh sáng tạo biến động, thích hợp chuyên môn kỹ thuật.',
};
