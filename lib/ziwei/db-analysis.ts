/**
 * lib/ziwei/db-analysis —— Phiên bản nguồn mở (nội dung bình luận không nằm trong phạm vi nguồn mở)
 *
 * Phiên bản trực tuyến đầy đủ chứa 14 Sao Chính × 13 ngữ cảnh cung để bình luận chi tiết
 * (một câu định hướng / bình luận cốt lõi / cơ sở bản đồ tử vi / nguồn cổ điển),
 * là nội dung cốt lõi, không công khai cùng với engine排盘. File này chỉ giữ lại
 * "Loại + nhãn cung/nội dung" cần thiết cho khung trang kiến thức SEO
 * (Thuật ngữ chung của Tử Vi Đẩu Số, không phải nội dung độc quyền),
 * Cơ sở dữ liệu bình luận STAR_DB để trống —— Do đó trang chi tiết kiến thức
 * sẽ tạo 0 tuyến tĩnh.
 *
 * Lõi排盘 (thuật toán安星, Tứ Hóa, nhận diện cục, văn bản cổ điển) hoàn toàn mở,
 * xem lib/ziwei/algorithm.ts / patterns.ts / sihua.ts.
 */

export type TopicKey =
  | 'overview' | 'personality' | 'love' | 'career' | 'wealth' | 'health'
  | 'family' | 'children' | 'move' | 'friends' | 'home' | 'spirit' | 'parents';

// iztro zh-CN tên cung: Mệnh Cung giữ chữ "Cung", các cung khác không có "Cung", "Giao Bằng" trong iztro gọi là "Túc Y"
export const TOPIC_PALACE_NAME: Record<TopicKey, string> = {
  overview:    '命宫',
  personality: '命宫',
  love:        '夫妻',
  career:      '官禄',
  wealth:      '财帛',
  health:      '疾厄',
  family:      '兄弟',
  children:    '子女',
  move:        '迁移',
  friends:     '仆役',
  home:        '田宅',
  spirit:      '福德',
  parents:     '父母',
};

export const TOPIC_LABEL: Record<TopicKey, string> = {
  overview:    'Tổng Quan Mệnh Cách',
  personality: 'Tính Cách Đặc Trưng',
  love:        'Tình Cảm Hôn Nhân',
  career:      'Sự Nghiệp Công Danh',
  wealth:      'Tài Lộc Vận Trình',
  health:      'Sức Khỏe Tình Trạng',
  family:      'Huynh Đệ Hợp Tác',
  children:    'Tử Nữ Duyên Phận',
  move:        'Di Quan Ngoại',
  friends:     'Nhân Tài Quý Nhân',
  home:        'Điền Trạch Bất Động Sản',
  spirit:      'Tinh Thần Phước Đức',
  parents:     'Phụ Mẫu Trưởng Bối',
};

/**
 * Cơ sở dữ liệu bình luận (14 Sao Chính × các ngữ cảnh cung) —— Nội dung cốt lõi, không nằm trong phạm vi nguồn mở.
 * Đặt trống tại đây; Trang SEO kiến thức do `exists=false` tạo 0 tuyến chi tiết tĩnh, nhưng khung danh sách vẫn có thể chạy.
 */
export const STAR_DB: Record<string, unknown> = {};
