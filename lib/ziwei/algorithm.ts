/**
 * Thuật toán Tử Vi Đẩu Số - Dựa trên thư viện mã nguồn mở iztro
 * https://github.com/SylarLong/iztro
 *
 * File này chứa thuật toán lập bản đồ tử vi cho Tử Vi Đẩu Số,
 * bao gồm: tính toán cung mệnh, đại hạn, vị trí sao, và các thông tin liên quan.
 */

import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';
import type { BirthInfo, LunarInfo, Star, Palace, DaXian, DaXianSiHua, ZiweiChart } from './types';
import { BRANCHES, STEMS, JU_NAMES } from './constants';
// Cong cu phat tinh bay chi la export, khong con goi khi lap ban do (Nhu Su "Tien Ki 03": Tu hoa sao vinh vinh co dinh)
// import { detectSelfSihua, getSiHuaByStem } from './sihua';

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

// ─── Anh xa loai sao ───────────────────────────────────────────────
const SHA_STARS = new Set(['擎羊', '陀罗', '火星', '铃星', '地空', '地劫',
  '天空', '旬空', '截路', '大耗', '天使', '天伤']);
const LUCKY_STARS = new Set(['文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '禄存', '天马', '天官', '天福', '天才', '天寿', '三台', '八座', '恩光',
  '天贵', '台辅', '龙池', '凤阁', '红鸾', '天喜', '孤辰', '寡宿']);

function mapStarType(starName: string, iztroType: string): Star['type'] {
  if (SHA_STARS.has(starName)) return 'sha';
  if (LUCKY_STARS.has(starName)) return 'lucky';
  const t = (iztroType ?? '').toLowerCase();
  if (t === '主星' || t === 'major') return 'major';
  if (t === '煞星' || t === 'tough') return 'sha';
  if (t === '吉星' || t === 'soft' || t === '禄存' || t === '天马') return 'lucky';
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
        name:       s.name as string,
        type:       'major' as const,
        brightness: mapBrightness(s.brightness as string),
        siHua:      s.mutagen as Star['siHua'],
      })),
      ...(p.minorStars ?? []).map(s => ({
        name:  s.name as string,
        type:  mapStarType(s.name as string, s.type as string),
        siHua: s.mutagen as Star['siHua'],
      })),
      ...(p.adjectiveStars ?? []).map(s => ({
        name:  s.name as string,
        type:  'minor' as const,
        siHua: s.mutagen as Star['siHua'],
      })),
    ];

    const range = p.decadal?.range;
    return {
      branch:        branch >= 0 ? branch : 0,
      stem:          stem >= 0 ? stem : 0,
      name:          p.name as string,
      stars:         allStars,
      daXianAge:     range ? [range[0], range[1]] as [number, number] : undefined,
      isMingGong:    p.name === '命宫',
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
  const ziweiPalace = palaces.find(p => p.stars.some(s => s.name === '紫微' && s.type === 'major'));
  const ziweiPos    = ziweiPalace?.branch ?? 0;

  // ── Mang dai han (Nhu Su chinh thong: Tu hoa vinh vinh co dinh, dai han chi nhin cong vi chuyen) ──
  // Khong con tao daXians[].siHua / stemIndex / stemName (truong phai sanh da xuong)
  const daXians: DaXian[] = palaces
    .filter(p => p.daXianAge)
    .sort((a, b) => a.daXianAge![0] - b.daXianAge![0])
    .map(p => ({
      startAge:    p.daXianAge![0],
      endAge:      p.daXianAge![1],
      palaceBranch: p.branch,
      palaceName:   p.name,
    }));

  // Cong tu hoa da xuong (Nhu Su khong chu tri phai sanh cua cong tu hoa)

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
