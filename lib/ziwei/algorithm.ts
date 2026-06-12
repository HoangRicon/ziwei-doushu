/**
 * Thuật toán Tử Vi Đẩu Số - Dựa trên thư viện mã nguồn mở iztro
 * https://github.com/SylarLong/iztro
 *
 * File này chứa thuật toán lập bản đồ tử vi cho Tử Vi Đẩu Số,
 * bao gồm: tính toán cung mệnh, đại hạn, vị trí sao, và các thông tin liên quan.
 */

import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';
import type { BirthInfo, LunarInfo, Star, Palace, DaXian, DaXianSiHua, ZiweiChart, SiHua } from './types';
import { BRANCHES, STEMS, JU_NAMES } from './constants';

// ─── Bản đồ ngược: Tên Trung → Việt (dùng cho iztro output) ────────────────
const STAR_CN_TO_VN: Record<string, string> = {
  '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương',
  '武曲': 'Vũ Khúc', '天同': 'Thiên Đồng', '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ', '太阴': 'Thái Âm', '贪狼': 'Tham Lang',
  '巨门': 'Cự Môn', '天相': 'Thiên Tướng', '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát', '破军': 'Phá Quân',
  '文昌': 'Văn Xương', '文曲': 'Văn Khúc',
  '左辅': 'Tả Phụ', '右弼': 'Hữu Bật',
  '天魁': 'Thiên Khôi', '天钺': 'Thiên Việt',
  '禄存': 'Lộc Tồn', '天马': 'Thiên Mã',
  '擎羊': 'Kình Dương', '陀罗': 'Đà La',
  '火星': 'Hỏa Tinh', '铃星': 'Linh Tinh',
  '地空': 'Địa Không', '地劫': 'Địa Kiếp',
  '天空': 'Thiên Không', '旬空': 'Tuần Không',
  '截路': 'Tiết Lộ', '大耗': 'Đại Hao',
  '天使': 'Thiên Sứ', '天伤': 'Thiên Thương',
  '天官': 'Thiên Quan', '天福': 'Thiên Phúc',
  '天才': 'Thiên Tài', '天寿': 'Thiên Thọ',
  '三台': 'Tam Đài', '八座': 'Bát Tọa',
  '恩光': 'Ân Quang', '天贵': 'Thiên Quý',
  '台辅': 'Đài Phụ', '龙池': 'Long Trì',
  '凤阁': 'Phượng Các', '红鸾': 'Hồng Loan',
  '天喜': 'Thiên Hỷ', '孤辰': 'Cô Thần', '寡宿': 'Quả Tú',
};

const PALACE_CN_TO_VN: Record<string, string> = {
  '命宫': 'Mệnh Cung', '兄弟宫': 'Huynh Đệ Cung',
  '夫妻宫': 'Phu Thê Cung', '子女宫': 'Tử Nữ Cung',
  '财帛宫': 'Tài Bạch Cung', '疾厄宫': 'Tật Ách Cung',
  '迁移宫': 'Thiên Di Cung', '交友宫': 'Nô Bộc Cung',
  '官禄宫': 'Quan Lộc Cung', '田宅宫': 'Điền Trạch Cung',
  '福德宫': 'Phúc Đức Cung', '父母宫': 'Phụ Mẫu Cung',
};

function vn(name: string): string {
  return STAR_CN_TO_VN[name] ?? name;
}
function vnPalace(name: string): string {
  return PALACE_CN_TO_VN[name] ?? name;
}

// ─── Thong tin am lich (tuong thich giu lai) ────────────────────────
export function getLunarInfo(year: number, month: number, day: number): LunarInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const yearStem = STEMS.indexOf(lunar.getYearGan());
  const yearBranch = BRANCHES.indexOf(lunar.getYearZhi());
  const rawMonth = lunar.getMonth();
  return {
    lunarYear: lunar.getYear(),
    lunarMonth: Math.abs(rawMonth),
    lunarDay: lunar.getDay(),
    yearStem: yearStem >= 0 ? yearStem : 0,
    yearBranch: yearBranch >= 0 ? yearBranch : 0,
    isLeapMonth: rawMonth < 0,
  };
}

// ─── Anh xa do sang ─────────────────────────────────────────────────
function mapBrightness(b?: string): 'bright' | 'normal' | 'dim' {
  if (!b) return 'normal';
  if (b === '庙' || b === '旺') return 'bright';
  if (b === '陷' || b === '不') return 'dim';
  return 'normal';
}

const SIHUA_CN_TO_VN: Record<string, SiHua> = {
  '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ',
};

// ─── Anh xa loai sao ───────────────────────────────────────────────
const SHA_STARS = new Set(['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp',
  'Thiên Không', 'Tuần Không', 'Tiết Lộ', 'Đại Hao', 'Thiên Sứ', 'Thiên Thương']);
const LUCKY_STARS = new Set(['Văn Xương', 'Văn Khúc', 'Tả Phụ', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt',
  'Lộc Tồn', 'Thiên Mã', 'Thiên Quan', 'Thiên Phúc', 'Thiên Tài', 'Thiên Thọ', 'Tam Đài', 'Bát Tọa',
  'Ân Quang', 'Thiên Quý', 'Đài Phụ', 'Long Trì', 'Phượng Các', 'Hồng Loan', 'Thiên Hỷ', 'Cô Thần', 'Quả Tú']);

function mapStarType(starName: string, iztroType: string): Star['type'] {
  if (SHA_STARS.has(starName)) return 'sha';
  if (LUCKY_STARS.has(starName)) return 'lucky';
  const t = (iztroType ?? '').toLowerCase();
  if (t === '主星' || t === 'major') return 'major';
  if (t === '煞星' || t === 'tough') return 'sha';
  if (t === '吉星' || t === 'soft' || starName === 'Lộc Tồn' || starName === 'Thiên Mã') return 'lucky';
  return 'minor';
}

// ─── Ten cua tu hanh so thanh so ────────────────────────────────
function parseWuxingJu(name: string): number {
  if (name.includes('二')) return 2;
  if (name.includes('三')) return 3;
  if (name.includes('四')) return 4;
  if (name.includes('五')) return 5;
  if (name.includes('六')) return 6;
  return 3;
}

// ─── Ham chinh: Tao ban do ──────────────────────────────────────────
export function generateChart(birthInfo: BirthInfo): ZiweiChart {
  const { year, month, day, hour, gender } = birthInfo;

  // Goi iztro lap ban do
  const solarDate = `${year}-${month}-${day}`;
  const iztroGender = gender === 'male' ? '男' : '女';
  const astrolabe = astro.bySolar(solarDate, hour, iztroGender, true, 'zh-CN');

  // ── Tao 12 cong ──
  const palaces: Palace[] = astrolabe.palaces.map(p => {
    const branch = BRANCHES.indexOf(p.earthlyBranch as string);
    const stem   = STEMS.indexOf(p.heavenlyStem as string);

    // Gop tat ca sao: chu sao + tri sao + tap yeu
    const allStars: Star[] = [
      ...(p.majorStars ?? []).map(s => ({
        name:       vn(s.name as string),
        type:       'major' as const,
        brightness: mapBrightness(s.brightness as string),
        siHua:      (s.mutagen ? SIHUA_CN_TO_VN[s.mutagen] : undefined) as Star['siHua'],
      })),
      ...(p.minorStars ?? []).map(s => ({
        name:  vn(s.name as string),
        type:  mapStarType(vn(s.name as string), s.type as string),
        siHua: (s.mutagen ? SIHUA_CN_TO_VN[s.mutagen] : undefined) as Star['siHua'],
      })),
      ...(p.adjectiveStars ?? []).map(s => ({
        name:  vn(s.name as string),
        type:  'minor' as const,
        siHua: (s.mutagen ? SIHUA_CN_TO_VN[s.mutagen] : undefined) as Star['siHua'],
      })),
    ];

    const range = p.decadal?.range;
    return {
      branch:        branch >= 0 ? branch : 0,
      stem:          stem >= 0 ? stem : 0,
      name:          vnPalace(p.name as string),
      stars:         allStars,
      daXianAge:     range ? [range[0], range[1]] as [number, number] : undefined,
      isMingGong:    vnPalace(p.name as string) === 'Mệnh Cung',
      isShenGong:    p.isBodyPalace ?? false,
      isCurrentDaXian: false,
    };
  });

  // ── Tuoi hien tai & Dai han ──
  const currentYear = new Date().getFullYear();
  const currentAge  = currentYear - year;

  palaces.forEach(p => {
    if (p.daXianAge && currentAge >= p.daXianAge[0] && currentAge <= p.daXianAge[1]) {
      p.isCurrentDaXian = true;
    }
  });

  // ── Cau truc doi cung (tranh tra cuu tu van ban) ──
  palaces.forEach(p => {
    p.oppositeBranch = (p.branch + 6) % 12;
    const mainStars = p.stars.filter(s => s.type === 'major');
    p.isEmpty = mainStars.length === 0;
    if (p.isEmpty) {
      const oppPalace = palaces.find(q => q.branch === p.oppositeBranch);
      if (oppPalace) {
        p.borrowedFromBranch = oppPalace.branch;
        p.borrowedFromName = oppPalace.name;
        p.borrowedStars = oppPalace.stars.filter(s => s.type === 'major').map(s => s.name);
      }
    }
  });

  // ── Chi so cong chi ──
  const mingGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfSoulPalace as string);
  const shenGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfBodyPalace as string);
  const wuxingJuNameCN = astrolabe.fiveElementsClass as string;
  const wuxingJu       = parseWuxingJu(wuxingJuNameCN);
  const wuxingJuName   = JU_NAMES[wuxingJu] ?? wuxingJuNameCN;

  // ── Vi tri Tu Vi ──
  const ziweiPalace = palaces.find(p => p.stars.some(s => s.name === 'Tử Vi' && s.type === 'major'));
  const ziweiPos    = ziweiPalace?.branch ?? 0;

  // ── Mang dai han (Nhu Su chinh thong: Tu hoa vinh vinh co dinh, dai han chi nhin cong vi chuyen) ──
  const daXians: DaXian[] = palaces
    .filter(p => p.daXianAge)
    .sort((a, b) => a.daXianAge![0] - b.daXianAge![0])
    .map(p => ({
      startAge:    p.daXianAge![0],
      endAge:      p.daXianAge![1],
      palaceBranch: p.branch,
      palaceName:   p.name,
    }));

  const currentDaXianIndex = daXians.findIndex(
    dx => currentAge >= dx.startAge && currentAge <= dx.endAge,
  );

  // ── Thong tin am lich ──
  const lunarInfo = getLunarInfo(year, month, day);

  return {
    birthInfo,
    lunarInfo,
    mingGongBranch: mingGongBranch >= 0 ? mingGongBranch : 0,
    shenGongBranch: shenGongBranch >= 0 ? shenGongBranch : 0,
    wuxingJu,
    wuxingJuName,
    ziweiPos,
    palaces,
    daXians,
    currentAge,
    currentDaXianIndex,
  };
}
