/**
 * Công cụ Tứ Hóa - Phiên bản đã chuẩn hóa tên sao sang tiếng Việt
 */

import type { ZiweiChart, Palace, SiHua } from './types';
import { SI_HUA_TABLE, STEMS } from './constants';
import { STAR_NAME_VN } from './starNames';

// Bảng Tứ Hóa đã phiên Việt: chỉ số Thiên Can → [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]
const SI_HUA_TABLE_VN: Record<number, [string, string, string, string]> = {
  0: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],   // Giáp
  1: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],        // Ất
  2: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],  // Bính
  3: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],         // Đinh
  4: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],          // Mậu
  5: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],     // Kỷ
  6: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],     // Canh
  7: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],       // Tân
  8: ['Thiên Lương', 'Tử Vi', 'Tả Phụ', 'Vũ Khúc'],          // Nhâm
  9: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],           // Quý
};

// ─── 1) Từ chỉ số Thiên Can lấy Tứ Hóa tứ sao ───────────────────────────────────
/** Chỉ số Thiên Can 0-9 → { Lộc, Quyền, Khoa, Kỵ } tương ứng tên sao */
export function getSiHuaByStem(stemIndex: number): Record<SiHua, string> {
  const arr = SI_HUA_TABLE_VN[stemIndex];
  if (!arr) return { Lộc: '', Quyền: '', Khoa: '', Kỵ: '' };
  return { Lộc: arr[0], Quyền: arr[1], Khoa: arr[2], Kỵ: arr[3] };
}

/** Ten sao → Loai tu hoa (do mot thien can xac dinh) */
export function buildStarSiHuaMap(stemIndex: number): Record<string, SiHua> {
  const arr = SI_HUA_TABLE_VN[stemIndex];
  if (!arr) return {};
  return {
    [arr[0]]: arr[0] as SiHua,
    [arr[1]]: arr[1] as SiHua,
    [arr[2]]: arr[2] as SiHua,
    [arr[3]]: arr[3] as SiHua,
  };
}

// ─── 2) Từ năm dương lịch → chỉ số Thiên Can năm ──────────────────────────────────
/** Năm dương lịch → chỉ số Thiên Can năm (0=Giáp, ... 9=Quý) */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** Năm dương lịch → chỉ số Địa Chi năm (0=Tử, ... 11=Hợi) */
export function getYearBranchIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

// ─── 3) Tứ Hóa đại hạn: Lấy cung cung cung thiên can (không phải thiên can năm sinh)───────────────
/**
 * Tứ Hóa cung đại hạn
 * @param chart Bản đồ tử vi
 * @param dxIndex Chỉ số đại hạn (chart.daXians[dxIndex])
 * @returns Tứ hóa tứ sao của đại hạn đó
 */
export function getDaXianSiHua(
  chart: ZiweiChart,
  dxIndex: number,
): { stemIndex: number; stemName: string; transforms: Record<SiHua, string> } | null {
  const dx = chart.daXians[dxIndex];
  if (!dx) return null;
  const dxPalace = chart.palaces.find(p => p.branch === dx.palaceBranch);
  if (!dxPalace) return null;
  const stemIndex = dxPalace.stem;
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 4) Tứ Hóa lưu niên ──────────────────────────────────────────────
export function getLiuNianSiHua(year: number): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
} {
  const stemIndex = getYearStemIndex(year);
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 5) Tứ Hóa lưu nguyệt (Thiên can nguyệt cung, từ năm can + thứ tự tháng suy) ───────────────
/**
 * Thiên can lưu nguyệt (Ngũ Hổ Độn: Giáp Kỷ niên khởi Bính Dần, Ất Canh niên khởi Nhâm Dần, Bính Tân niên khởi Canh Dần, Đinh Tân niên khởi Nhâm Dần, Ất Quý niên khởi Giáp Dần)
 * month: Tháng âm lịch 1-12
 */
export function getLiuYueStemIndex(yearStem: number, month: number): number {
  // Ngu Ho Don: Thang chinh (Dần) thien can
  const startStemOfYin: Record<number, number> = {
    0: 2, 5: 2,  // Giáp Kỷ → Bính
    1: 4, 6: 4,  // Ất Canh → Mậu
    2: 6, 7: 6,  // Bính Tân → Canh
    3: 8, 8: 8,  // Đinh Nhâm → Nhâm
    4: 0, 9: 0,  // Mậu Quý → Giáp
  };
  const yinStem = startStemOfYin[yearStem] ?? 0;
  // Tu Dần (thang chinh) den thang dich (month lay 1-12)
  return (yinStem + ((month - 1) % 12) + 10) % 10;
}

export function getLiuYueSiHua(yearStem: number, month: number): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
} {
  const stemIndex = getLiuYueStemIndex(yearStem, month);
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 6) Kiểm tra tự hóa cung ──────────────────────────────────────────
/**
 * Tự hóa: Tứ hóa do cung cung gây ra, sao bị hóa vừa đúng tại cung này
 * Ví dụ: Cung cung là Giáp (Liêm Phá Võ Dương), nếu cung này chủ tinh có "Liêm Trinh", thì cung đó có "tự hóa Lộc"
 */
export interface SelfSihua {
  siHua: SiHua;        // Lộc/Quyền/Khoa/Kỵ
  starName: string;    // Sao bị hóa
}

export function detectSelfSihua(palace: Palace): SelfSihua[] {
  const transforms = getSiHuaByStem(palace.stem);
  const found: SelfSihua[] = [];
  const palaceStarNames = new Set(palace.stars.map(s => s.name));
  (['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const).forEach(sh => {
    const starName = transforms[sh];
    if (starName && palaceStarNames.has(starName)) {
      found.push({ siHua: sh, starName });
    }
  });
  return found;
}

// ─── 7) Truy vết lai nhân cung ────────────────────────────────────────────
/**
 * Lai nhân cung: Đối với sao nào đó có hóa nào đó, truy vết là cung cung nào "bay" qua
 *
 * Hệ thống Nhu Sư thường dùng: Cung lai nhân của hóa Kỵ——hóa Kỵ do cung cung nào gây ra, cung đó chính là cung gốc của vấn đề
 *
 * @param chart Bản đồ tử vi
 * @param starName Sao bị hóa (ví dụ "Thái Âm")
 * @param sihua  Loại tứ hóa (ví dụ "Kỵ")
 * @returns Mảng cung vị gây ra hóa đó (thông thường chỉ một, nhưng nếu nhiều cung cung cùng thiên can có thể nhiều)
 */
export function findIncomingPalaces(
  chart: ZiweiChart,
  starName: string,
  sihua: SiHua,
): Palace[] {
  const result: Palace[] = [];
  chart.palaces.forEach(p => {
    const transforms = getSiHuaByStem(p.stem);
    if (transforms[sihua] === starName) {
      result.push(p);
    }
  });
  return result;
}

/**
 * Tính toán hàng loạt danh sách tự hóa của tất cả cung vị trên bản đồ
 */
export function buildAllSelfSihua(chart: ZiweiChart): Record<number, SelfSihua[]> {
  const result: Record<number, SelfSihua[]> = {};
  chart.palaces.forEach(p => {
    const list = detectSelfSihua(p);
    if (list.length > 0) result[p.branch] = list;
  });
  return result;
}

// ─── 8) Phủ định tổng hợp (overlay): Hiệu ứng sau khi chồng lấp nhiều tầng Tứ Hóa ──────────
/**
 * Tạo góc nhìn tổng hợp của sao nào đó → Nhiều tầng Tứ Hóa
 * Dùng để trên cung vị đồng thời hiển thị: Bản mệnh hóa / Đại hạn hóa / Lưu niên hóa
 * Ưu tiên: Bản mệnh < Đại hạn < Lưu niên (nhưng đều đánh dấu ra)
 */
export interface SiHuaOverlay {
  native?: SiHua;    // Bản mệnh (năm can)
  daXian?: SiHua;    // Đại hạn
  liuNian?: SiHua;   // Lưu niên
  liuYue?: SiHua;    // Lưu nguyệt
}

export function buildOverlayForStar(
  starName: string,
  nativeMap: Record<string, SiHua>,
  daXianMap?: Record<string, SiHua>,
  liuNianMap?: Record<string, SiHua>,
  liuYueMap?: Record<string, SiHua>,
): SiHuaOverlay {
  return {
    native: nativeMap[starName],
    daXian: daXianMap?.[starName],
    liuNian: liuNianMap?.[starName],
    liuYue: liuYueMap?.[starName],
  };
}
