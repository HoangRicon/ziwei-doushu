/**
 * Bản đồ dịch tên sao / cung từ Trung sang Việt
 * Dùng cho UI hiển thị
 */

export const STAR_NAME_VN: Record<string, string> = {
  // Sao Chính
  '紫微': 'Tử Vi',
  '天机': 'Thiên Cơ',
  '太阳': 'Thái Dương',
  '武曲': 'Võ Khúc',
  '天同': 'Thiên Đồng',
  '廉贞': 'Liêm Truyền',
  '天府': 'Thiên Phủ',
  '太阴': 'Thái Âm',
  '贪狼': 'Đam Lang',
  '巨门': 'Cử Môn',
  '天相': 'Thiên Tương',
  '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát',
  '破军': 'Phá Quân',
  // Cát Tinh
  '文昌': 'Văn Xương',
  '文曲': 'Văn Khúc',
  '左辅': 'Tả Phụ',
  '右弼': 'Hữu Phụ',
  '天魁': 'Thiên Khôi',
  '天钺': 'Thiên Võ',
  '禄存': 'Lộc Tồn',
  '天马': 'Thiên Mã',
  '天官': 'Thiên Quan',
  '天福': 'Thiên Phúc',
  '天才': 'Thiên Tài',
  '天寿': 'Thiên Thọ',
  '三台': 'Tam Đài',
  '八座': 'Bát Tọa',
  '恩光': 'Ân Quang',
  '天贵': 'Thiên Quý',
  '台辅': 'Đài Phụ',
  '龙池': 'Long Trì',
  '凤阁': 'Phượng Các',
  '红鸾': 'Hồng Loan',
  '天喜': 'Thiên Hỷ',
  '孤辰': 'Cô Thần',
  '寡宿': 'Quả Túc',
  // Sát Tinh
  '擎羊': 'Kình Dương',
  '陀罗': 'Đà La',
  '火星': 'Hỏa Tinh',
  '铃星': 'Linh Tinh',
  '地空': 'Địa Không',
  '地劫': 'Địa Kiếp',
  '天空': 'Thiên Không',
  '旬空': 'Tuần Không',
  '截路': 'Tiết Lộ',
  '大耗': 'Đại Hao',
  '天使': 'Thiên Sứ',
  '天伤': 'Thiên Thương',
};

export const PALACE_NAME_VN: Record<string, string> = {
  '命宫': 'Mệnh Cung',
  '兄弟宫': 'Huynh Đệ Cung',
  '夫妻宫': 'Phu Tân Cung',
  '子女宫': 'Tử Nữ Cung',
  '财帛宫': 'Tài Bạch Cung',
  '疾厄宫': 'Tật Ách Cung',
  '迁移宫': 'Thiên Di Cung',
  '交友宫': 'Cát Diêu Cung',
  '官禄宫': 'Quan Lộc Cung',
  '田宅宫': 'Điền Trạch Cung',
  '福德宫': 'Phước Đức Cung',
  '父母宫': 'Phụ Mẫu Cung',
};

export function vnStar(name: string): string {
  return STAR_NAME_VN[name] ?? name;
}

export function vnPalace(name: string): string {
  return PALACE_NAME_VN[name] ?? name;
}

export const SI_HUA_VN: Record<string, string> = {
  '禄': 'Lộc',
  '权': 'Quyền',
  '科': 'Khoa',
  '忌': 'Kỵ',
};

export function vnSiHua(s: string): string {
  return SI_HUA_VN[s] ?? s;
}

export const BRANCH_VN: Record<string, string> = {
  '子': 'Tử', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão',
  '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi',
  '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
};

export function vnBranch(b: string): string {
  return BRANCH_VN[b] ?? b;
}

export const STEM_VN: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh',
  '戊': 'Mậu', '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân',
  '壬': 'Nhâm', '癸': 'Quý',
};

export function vnStem(s: string): string {
  return STEM_VN[s] ?? s;
}

export const LIFE_PHASE_VN: Record<number, string> = {
  0: 'Tràng sinh',
  1: 'Mộc dục',
  2: 'Duyệt',
  3: 'Thai',
  4: 'Suy',
  5: 'Bệnh',
  6: 'Tử',
  7: 'Mộ',
  8: 'Tuyệt',
  9: 'Đế vượng',
};

export function vnLifePhase(stemIndex: number): string {
  return LIFE_PHASE_VN[stemIndex] ?? '';
}
