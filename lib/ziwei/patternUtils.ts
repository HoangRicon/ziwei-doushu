/**
 * Dịch các chuỗi điều kiện cục diện từ Trung sang Việt
 * Dùng để hiển thị conditions.required / bonus / breaking
 */

import { vnStar, vnPalace, vnBranch } from './starNames';
import { BRANCHES } from './constants';

const BRANCH_VN_NAMES: Record<string, string> = {
  '子': 'Tử', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão',
  '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi',
  '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
};

export function translateCondition(text: string): string {
  let result = text;
  // Dịch tên sao
  for (const [cn, vn] of Object.entries({
    '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương',
    '武曲': 'Võ Khúc', '天同': 'Thiên Đồng', '廉贞': 'Liêm Truyền',
    '天府': 'Thiên Phủ', '太阴': 'Thái Âm', '贪狼': 'Đam Lang',
    '巨门': 'Cử Môn', '天相': 'Thiên Tương', '天梁': 'Thiên Lương',
    '七杀': 'Thất Sát', '破军': 'Phá Quân',
    '文昌': 'Văn Xương', '文曲': 'Văn Khúc',
    '左辅': 'Tả Phụ', '右弼': 'Hữu Phụ',
    '天魁': 'Thiên Khôi', '天钺': 'Thiên Võ',
    '禄存': 'Lộc Tồn', '天马': 'Thiên Mã',
    '擎羊': 'Kình Dương', '陀罗': 'Đà La',
    '火星': 'Hỏa Tinh', '铃星': 'Linh Tinh',
    '地空': 'Địa Không', '地劫': 'Địa Kiếp',
    '化禄': 'hóa Lộc', '化权': 'hóa Quyền', '化科': 'hóa Khoa', '化忌': 'hóa Kỵ',
  })) {
    result = result.split(cn).join(vn);
  }
  // Dịch tên cung
  for (const [cn, vn] of Object.entries({
    '命宫': 'Mệnh Cung', '兄弟宫': 'Huynh Đệ Cung', '夫妻宫': 'Phu Tân Cung',
    '子女宫': 'Tử Nữ Cung', '财帛宫': 'Tài Bạch Cung', '疾厄宫': 'Tật Ách Cung',
    '迁移宫': 'Thiên Di Cung', '交友宫': 'Cát Diêu Cung', '官禄宫': 'Quan Lộc Cung',
    '田宅宫': 'Điền Trạch Cung', '福德宫': 'Phước Đức Cung', '父母宫': 'Phụ Mẫu Cung',
    '命': 'Mệnh', '身': 'Thân', '迁': 'Thiên Di',
  })) {
    result = result.split(cn).join(vn);
  }
  // Dịch địa chi đơn lẻ
  for (const [cn, vn] of Object.entries(BRANCH_VN_NAMES)) {
    result = result.split(`${cn}宫`).join(`${vn} Cung`);
  }
  // Dịch các từ kỹ thuật
  for (const [cn, vn] of Object.entries({
    '入命': 'nhập Mệnh', '同宫': 'đồng cung', '同入': 'đồng nhập',
    '会照': 'hội chiếu', '分居': 'phân cư', '齐入': 'tề nhập',
    '三星': 'tam sao', '四星': 'tứ sao',
    '魁钺': 'Khôi Võ', '辅弼': 'Tả Hữu Phụ Tịch', '昌曲': 'Văn Xương Văn Khúc',
    '双煞': 'song sát', '煞星': 'sát tinh',
    '空劫': 'Không Kiếp', '日月': 'Nhật Nguyệt', '日月双美': 'nhật nguyệt song mỹ',
    '魁贵人': 'Khôi quý nhân', '贵人加照': 'quý nhân gia chiếu',
    '羊陀': 'Dương Đà', '再会': 'tái hội', '再遇': 'tái ngộ',
    '火贪': 'Hỏa Đam', '铃贪': 'Linh Đam',
    '动得': 'động đắc',
    '石中隐玉': 'Thạch Trung Ẩn Ngọc', '玉藏深泥': 'ngọc tàng thâm nê',
    '石中隐玉得明': 'Thạch Trung Ẩn Ngọc đắc minh',
    '珠光': 'trân quang', '明珠出海': 'Minh Châu Xuất Hải',
  })) {
    result = result.split(cn).join(vn);
  }
  return result;
}

export function translateConditions(arr: string[]): string[] {
  return arr.map(translateCondition);
}

export function translateDescription(text: string): string {
  return translateCondition(text);
}
