/**
 * Các kiểu TypeScript cho Tử Vi Đẩu Số
 */

// ─── Thông tin sinh ─────────────────────────
export interface BirthInfo {
  year: number;      // Năm dương lịch
  month: number;     // Tháng dương lịch (1-12)
  day: number;       // Ngày dương lịch
  hour: number;      // Chỉ số thập nhị thì (0=Tử, 1=Sửu, ... 11=Hợi)
  gender: 'male' | 'female';
  name: string;       // bắt buộc khi tạo mới
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;    // Dương = tháng bình thường, Âm = tháng nhuận
  lunarDay: number;
  yearStem: number;      // 0-9 (Giáp Ất Bính Đinh Mậu Kỷ Canh Tân Nhâm Quý)
  yearBranch: number;    // 0-11 (Tử Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi)
  isLeapMonth: boolean;
}

// ─── Loại Tứ Hóa ─────────────────────────
export type SiHua = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';

// ─── Sao ─────────────────────────
export interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  siHua?: SiHua;
  brightness?: 'bright' | 'normal' | 'dim';  // Miếu Vượng Lợi Nhập
}

// ─── Tự hóa ─────────────────────────
export interface SelfSihuaMark {
  siHua: SiHua;       // Lộc/Quyền/Khoa/Kỵ
  starName: string;   // Sao tự hóa
}

// ─── Cung ─────────────────────────
export interface Palace {
  branch: number;      // 0-11 (chỉ số địa chi)
  stem: number;        // 0-9 (chỉ số thiên can)
  name: string;        // Tên cung
  stars: Star[];
  daXianAge?: [number, number];   // Độ tuổi đại hạn
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  /** Tự hóa cung cung (cốt lõi hệ thống Nhu Sư) */
  selfSihua?: SelfSihuaMark[];
  /** Chỉ số địa chi đối cung (luôn = (branch + 6) % 12) */
  oppositeBranch?: number;
  /** Có phải không cung (vô chủ tinh) */
  isEmpty?: boolean;
  /** Nếu là không cung, mượn từ chỉ số địa chi cung nào = oppositeBranch */
  borrowedFromBranch?: number;
  /** Nếu là không cung, mượn từ tên cung nào */
  borrowedFromName?: string;
  /** Nếu là không cung, danh sách tên chủ tinh mượn được từ đối cung (dữ liệu cấu trúc, lớp văn bản không cần từ văn bản phản chiếu) */
  borrowedStars?: string[];
}

// ─── Đại hạn Tứ Hóa ─────────────────────────
export interface DaXianSiHua {
  stemIndex: number;
  stemName: string;
  lu: string;    // Tên sao hóa Lộc
  quan: string;  // Tên sao hóa Quyền
  ke: string;    // Tên sao hóa Khoa
  ji: string;    // Tên sao hóa Kỵ
}

// ─── Đại hạn ─────────────────────────
export interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;
  palaceName: string;
  stemIndex?: number;    // Chỉ số thiên can cung đại hạn (dùng cho đại hạn tứ hóa)
  stemName?: string;
  siHua?: DaXianSiHua;   // Tứ hóa đại hạn (dựa trên cung cung)
}

// ─── Bản đồ Tử Vi ─────────────────────────
export interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: LunarInfo;
  mingGongBranch: number;    // Địa chi Mệnh Cung
  shenGongBranch: number;    // Địa chi Thân Cung
  wuxingJu: number;          // Ngũ Hành Cục (2,3,4,5,6)
  wuxingJuName: string;      // Ví dụ: 'Thủy Nhị Cục'
  ziweiPos: number;          // Vị trí sao Tử Vi
  palaces: Palace[];         // 12 cung, theo thứ tự địa chi 0-11
  daXians: DaXian[];
  currentAge: number;
  currentDaXianIndex: number;
}
