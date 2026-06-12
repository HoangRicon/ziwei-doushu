// Thiên Can (10 Thiên Can)
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// Địa Chi (12 Địa Chi)
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Thập Nhị Thì (Thời gian tương ứng với Địa Chi)
export const SHICHEN = [
  { branch: 0, name: 'Tử Thì', range: '23:00-01:00' },
  { branch: 1, name: 'Sửu Thì', range: '01:00-03:00' },
  { branch: 2, name: 'Dần Thì', range: '03:00-05:00' },
  { branch: 3, name: 'Mão Thì', range: '05:00-07:00' },
  { branch: 4, name: 'Thìn Thì', range: '07:00-09:00' },
  { branch: 5, name: 'Tỵ Thì', range: '09:00-11:00' },
  { branch: 6, name: 'Ngọ Thì', range: '11:00-13:00' },
  { branch: 7, name: 'Mùi Thì', range: '13:00-15:00' },
  { branch: 8, name: 'Thân Thì', range: '15:00-17:00' },
  { branch: 9, name: 'Dậu Thì', range: '17:00-19:00' },
  { branch: 10, name: 'Tuất Thì', range: '19:00-21:00' },
  { branch: 11, name: 'Hợi Thì', range: '21:00-23:00' },
];

// Tên Thập Nhị Cung, theo thứ tự từ Mệnh Cung thuận chiều kim đồng hồ
export const PALACE_NAMES_ORDER = [
  'Mệnh Cung', 'Huynh Đệ Cung', 'Phu Thê Cung', 'Tử Nữ Cung',
  'Tài Bạch Cung', 'Tật Ách Cung', 'Thiên Di Cung', 'Nô Bộc Cung',
  'Quan Lộc Cung', 'Điền Trạch Cung', 'Phúc Đức Cung', 'Phụ Mẫu Cung',
];

// Na Âm Ngũ Hành (Ngũ hành của 30 cặp Thiên Can-Địa Chi)
export const NAYIN_ELEMENTS = [
  'Kim','Hỏa','Mộc','Thổ','Kim','Hỏa','Thủy','Thổ','Kim','Mộc',
  'Thủy','Thổ','Hỏa','Mộc','Thủy','Kim','Hỏa','Mộc','Thổ','Kim',
  'Hỏa','Thủy','Thổ','Kim','Mộc','Thủy','Thổ','Hỏa','Mộc','Thủy',
];

// Ngũ Hành → Số Cục
export const ELEMENT_TO_JU: Record<string, number> = {
  'Thủy': 2, 'Mộc': 3, 'Kim': 4, 'Thổ': 5, 'Hỏa': 6
};

// Tên Số Cục
export const JU_NAMES: Record<number, string> = {
  2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục'
};

// Bảng Tứ Hóa (Năm Thiên Can → [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ])
export const SI_HUA_TABLE: Record<number, [string, string, string, string]> = {
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

// Bảng Thiên Khôi Thiên Việt (Năm Thiên Can → [Thiên Khôi branch, Thiên Việt branch])
export const TIANKUI_TABLE: Record<number, [number, number]> = {
  0: [1, 7],   // Giáp: Khôi Sửu  Võ Mùi
  1: [0, 8],   // Ất: Khôi Tử  Võ Thân
  2: [11, 9],  // Bính: Khôi Hợi  Võ Dậu
  3: [11, 9],  // Đinh: Khôi Hợi  Võ Dậu
  4: [1, 7],   // Mậu: Khôi Sửu  Võ Mùi
  5: [0, 8],   // Kỷ: Khôi Tử  Võ Thân
  6: [1, 7],   // Canh: Khôi Sửu  Võ Mùi
  7: [6, 2],   // Tân: Khôi Ngọ  Võ Dần
  8: [3, 5],   // Nhâm: Khôi Mão  Võ Tỵ
  9: [3, 5],   // Quý: Khôi Mão  Võ Tỵ
};

// Bảng Lộc Tồn (Năm Thiên Can → Lộc Tồn branch)
export const LUCUN_TABLE: Record<number, number> = {
  0: 2,   // Giáp: Dần
  1: 3,   // Ất: Mão
  2: 5,   // Bính: Tỵ
  3: 6,   // Đinh: Ngọ
  4: 5,   // Mậu: Tỵ
  5: 6,   // Kỷ: Ngọ
  6: 8,   // Canh: Thân
  7: 9,   // Tân: Dậu
  8: 11,  // Nhâm: Hợi
  9: 0,   // Quý: Tử
};

// Bảng Thiên Mã (Tam Hợp năm Địa Chi → Thiên Mã branch)
// Dần Ngọ Tuất → Thân, Thân Tử Thìn → Dần, Tỵ Dậu Sửu → Hợi, Hợi Mão Mùi → Tỵ
export const TIANMA_TABLE: Record<number, number> = {
  2: 8,   // Dần niên → Thân
  6: 8,   // Ngọ niên → Thân
  10: 8,  // Tuất niên → Thân
  8: 2,   // Thân niên → Dần
  0: 2,   // Tử niên → Dần
  4: 2,   // Thìn niên → Dần
  5: 11,  // Tỵ niên → Hợi
  9: 11,  // Dậu niên → Hợi
  1: 11,  // Sửu niên → Hợi
  11: 5,  // Hợi niên → Tỵ
  3: 5,   // Mão niên → Tỵ
  7: 5,   // Mùi niên → Tỵ
};

// Bảng Độ sáng Sao Chính [branch]: Ánh sáng của Sao Chính
// Miếu(bright) Vượng(bright) Lợi(normal) Bình(normal) Bất(bất) Nhập(dim)
export const STAR_BRIGHTNESS: Record<string, Record<number, string>> = {
  'Tử Vi': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
             1: 'normal', 4: 'normal', 7: 'bright', 10: 'normal',
             0: 'normal', 3: 'dim', 6: 'dim', 9: 'normal' },
  'Thiên Cơ': { 5: 'bright', 11: 'bright', 3: 'bright', 9: 'bright',
                1: 'normal', 7: 'normal', 2: 'dim', 8: 'dim',
                0: 'normal', 4: 'normal', 6: 'normal', 10: 'normal' },
  'Thái Dương': { 3: 'bright', 4: 'bright', 5: 'bright', 6: 'bright',
                  7: 'normal', 8: 'normal', 9: 'normal', 10: 'dim',
                  11: 'dim', 0: 'dim', 1: 'dim', 2: 'normal' },
  'Vũ Khúc': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
               0: 'normal', 3: 'normal', 6: 'normal', 9: 'normal',
               1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
  'Thiên Đồng': { 0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',
                  2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
                  1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
  'Liêm Trinh': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
                  0: 'normal', 3: 'normal', 6: 'normal', 9: 'normal',
                  1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
};

// Mô tả Sao Chính (Hệ thống Nhu Hải Hạ)
export const STAR_DESCRIPTIONS: Record<string, { keywords: string; nature: string; element: string }> = {
  'Tử Vi': { keywords: 'Đế Quý·Tôn Quý·Độc Lập', nature: 'Trung tính Thiện', element: 'Thổ' },
  'Thiên Cơ': { keywords: 'Trí Huệ·Cơ Biến·Mưu Lược', nature: 'Cát Tinh', element: 'Mộc' },
  'Thái Dương': { keywords: 'Dương Cương·Quan Quý·Khảng Đại', nature: 'Cát Tinh', element: 'Hỏa' },
  'Vũ Khúc': { keywords: 'Tài Phú·Cương Nghị·Quyết Đoán', nature: 'Trung Tính', element: 'Kim' },
  'Thiên Đồng': { keywords: 'Ôn Hòa·Hưởng Phước·Tùy Duyên', nature: 'Cát Tinh', element: 'Thủy' },
  'Liêm Trinh': { keywords: 'Tài Nghệ·Hình Sự·Đào Hoa', nature: 'Hung Trung Hóa Cát', element: 'Hỏa' },
  'Thiên Phủ': { keywords: 'Tài Khố·Ổn Định·Bảo Thủ', nature: 'Cát Tinh', element: 'Thổ' },
  'Thái Âm': { keywords: 'Nhu Mỹ·Tài Phú·Âm Nhu', nature: 'Cát Tinh', element: 'Thủy' },
  'Tham Lang': { keywords: 'Dục Vọng·Đào Hoa·Đa Tài', nature: 'Trung Tính', element: 'Mộc' },
  'Cự Môn': { keywords: 'Khẩu Thị·Thị Phi·Thiện Biện', nature: 'Hung Trung Hóa Cát', element: 'Thủy' },
  'Thiên Tướng': { keywords: 'Phụ Tác·Hành Chính·Ấn Thụ', nature: 'Cát Tinh', element: 'Thủy' },
  'Thiên Lương': { keywords: 'Ầm Hộ·Y Học·Trưởng Bối', nature: 'Cát Tinh', element: 'Thổ' },
  'Thất Sát': { keywords: 'Tướng Tinh·Quyết Quyết·Cô Khắc', nature: 'Hung Tinh', element: 'Kim' },
  'Phá Quân': { keywords: 'Khai Sáng·Biến Động·Phá Hủy', nature: 'Hung Tinh', element: 'Thủy' },
};
