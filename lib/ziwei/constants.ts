// Thiên Can (10 Thiên Can)
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// Địa Chi (12 Địa Chi)
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Thập Nhị Thì (Thời gian tương ứng với Địa Chi)
export const SHICHEN = [
  { branch: 0, name: '子时', range: '23:00-01:00' },
  { branch: 1, name: '丑时', range: '01:00-03:00' },
  { branch: 2, name: '寅时', range: '03:00-05:00' },
  { branch: 3, name: '卯时', range: '05:00-07:00' },
  { branch: 4, name: '辰时', range: '07:00-09:00' },
  { branch: 5, name: '巳时', range: '09:00-11:00' },
  { branch: 6, name: '午时', range: '11:00-13:00' },
  { branch: 7, name: '未时', range: '13:00-15:00' },
  { branch: 8, name: '申时', range: '15:00-17:00' },
  { branch: 9, name: '酉时', range: '17:00-19:00' },
  { branch: 10, name: '戌时', range: '19:00-21:00' },
  { branch: 11, name: '亥时', range: '21:00-23:00' },
];

// Tên Thập Nhị Cung, theo thứ tự từ Mệnh Cung顺时针
export const PALACE_NAMES_ORDER = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

// Na Âm Ngũ Hành (Ngũ hành của 30 cặp Thiên Can-Địa Chi)
export const NAYIN_ELEMENTS = [
  '金','火','木','土','金','火','水','土','金','木',
  '水','土','火','木','水','金','火','木','土','金',
  '火','水','土','金','木','水','土','火','木','水'
];

// Ngũ Hành → Số Cục
export const ELEMENT_TO_JU: Record<string, number> = {
  '水': 2, '木': 3, '金': 4, '土': 5, '火': 6
};

// Tên Số Cục
export const JU_NAMES: Record<number, string> = {
  2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục'
};

// Bảng Tứ Hóa (Năm Thiên Can → [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ])
export const SI_HUA_TABLE: Record<number, [string, string, string, string]> = {
  0: ['廉贞', '破军', '武曲', '太阳'],   // 甲
  1: ['天机', '天梁', '紫微', '太阴'],   // 乙
  2: ['天同', '天机', '文昌', '廉贞'],   // 丙
  3: ['太阴', '天同', '天机', '巨门'],   // 丁
  4: ['贪狼', '太阴', '右弼', '天机'],   // 戊
  5: ['武曲', '贪狼', '天梁', '文曲'],   // 己
  6: ['太阳', '武曲', '太阴', '天同'],   // 庚
  7: ['巨门', '太阳', '文曲', '文昌'],   // 辛
  8: ['天梁', '紫微', '左辅', '武曲'],   // 壬
  9: ['破军', '巨门', '太阴', '贪狼'],   // 癸
};

// Bảng Thiên Khôi Thiên Vượng (Năm Thiên Can → [Thiên Khôi branch, Thiên Vượng branch])
export const TIANKUI_TABLE: Record<number, [number, number]> = {
  0: [1, 7],   // 甲: 魁丑 钺未
  1: [0, 8],   // 乙: 魁子 钺申
  2: [11, 9],  // 丙: 魁亥 钺酉
  3: [11, 9],  // 丁: 魁亥 钺酉
  4: [1, 7],   // 戊: 魁丑 钺未
  5: [0, 8],   // 己: 魁子 钺申
  6: [1, 7],   // 庚: 魁丑 钺未
  7: [6, 2],   // 辛: 魁午 钺寅
  8: [3, 5],   // 壬: 魁卯 钺巳
  9: [3, 5],   // 癸: 魁卯 钺巳
};

// Bảng Lộc Tồn (Năm Thiên Can → Lộc Tồn branch)
export const LUCUN_TABLE: Record<number, number> = {
  0: 2,   // 甲: 寅
  1: 3,   // 乙: 卯
  2: 5,   // 丙: 巳
  3: 6,   // 丁: 午
  4: 5,   // 戊: 巳
  5: 6,   // 己: 午
  6: 8,   // 庚: 申
  7: 9,   // 辛: 酉
  8: 11,  // 壬: 亥
  9: 0,   // 癸: 子
};

// Bảng Thiên Mã (Tam Hợp năm Địa Chi → Thiên Mã branch)
// 寅午戌→申, 申子辰→寅, 巳酉丑→亥, 亥卯未→巳
export const TIANMA_TABLE: Record<number, number> = {
  2: 8,   // 寅年 → 申
  6: 8,   // 午年 → 申
  10: 8,  // 戌年 → 申
  8: 2,   // 申年 → 寅
  0: 2,   // 子年 → 寅
  4: 2,   // 辰年 → 寅
  5: 11,  // 巳年 → 亥
  9: 11,  // 酉年 → 亥
  1: 11,  // 丑年 → 亥
  11: 5,  // 亥年 → 巳
  3: 5,   // 卯年 → 巳
  7: 5,   // 未年 → 巳
};

// Bảng Độ sáng Sao Chính [branch]: Ánh sáng của Sao Chính
// 庙(bright) 旺(bright) 利(normal) 平(normal) 不利(dim) 陷(dim)
export const STAR_BRIGHTNESS: Record<string, Record<number, string>> = {
  '紫微': { 2:   'bright', 5: 'bright', 8: 'bright', 11: 'bright',
            1: 'normal', 4: 'normal', 7: 'bright', 10: 'normal',
            0: 'normal', 3: 'dim', 6: 'dim', 9: 'normal' },
  '天机': { 5: 'bright', 11: 'bright', 3: 'bright', 9: 'bright',
            1: 'normal', 7: 'normal', 2: 'dim', 8: 'dim',
            0: 'normal', 4: 'normal', 6: 'normal', 10: 'normal' },
  '太阳': { 3: 'bright', 4: 'bright', 5: 'bright', 6: 'bright',
            7: 'normal', 8: 'normal', 9: 'normal', 10: 'dim',
            11: 'dim', 0: 'dim', 1: 'dim', 2: 'normal' },
  '武曲': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
            0: 'normal', 3: 'normal', 6: 'normal', 9: 'normal',
            1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
  '天同': { 0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',
            2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
            1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
  '廉贞': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
            0: 'normal', 3: 'normal', 6: 'normal', 9: 'normal',
            1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
};

// Mô tả Sao Chính (Hệ thống Nhu Hải Hạ)
export const STAR_DESCRIPTIONS: Record<string, { keywords: string; nature: string; element: string }> = {
  '紫微': { keywords: 'Đế Quý·Tôn Quý·Độc Lập', nature: 'Trung tính Thiện', element: 'Thổ' },
  '天机': { keywords: 'Trí Huệ·Cơ Biến·Mưu Lược', nature: 'Cát Tinh', element: 'Mộc' },
  '太阳': { keywords: 'Dương Cương·Quan Quý·Khảng Đại', nature: 'Cát Tinh', element: 'Hỏa' },
  '武曲': { keywords: 'Tài Phú·Cương Nghị·Quyết Đoán', nature: 'Trung Tính', element: 'Kim' },
  '天同': { keywords: 'Ôn Hòa·Hưởng Phước·Tùy Duyên', nature: 'Cát Tinh', element: 'Thủy' },
  '廉贞': { keywords: 'Tài Nghệ·Hình Sự·Đào Hoa', nature: 'Hung Trung Hóa Cát', element: 'Hỏa' },
  '天府': { keywords: 'Tài Khố·Ổn Định·Bảo Thủ', nature: 'Cát Tinh', element: 'Thổ' },
  '太阴': { keywords: 'Nhu Mỹ·Tài Phú·Âm Nhu', nature: 'Cát Tinh', element: 'Thủy' },
  '贪狼': { keywords: 'Dục Vọng·Đào Hoa·Đa Tài', nature: 'Trung Tính', element: 'Mộc' },
  '巨门': { keywords: 'Khẩu Thị·Thị Phi·Thiện Biện', nature: 'Hung Trung Hóa Cát', element: 'Thủy' },
  '天相': { keywords: 'Phụ Tác·Hành Chính·Ấn Thụ', nature: 'Cát Tinh', element: 'Thủy' },
  '天梁': { keywords: 'Ầm Hộ·Y Học·Trưởng Bối', nature: 'Cát Tinh', element: 'Thổ' },
  '七杀': { keywords: 'Tướng Tinh·Quyết Quyết·Cô Khắc', nature: 'Hung Tinh', element: 'Kim' },
  '破军': { keywords: 'Khai Sáng·Biến Động·Phá Hủy', nature: 'Hung Tinh', element: 'Thủy' },
};
