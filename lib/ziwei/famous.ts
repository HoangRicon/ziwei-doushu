/**
 * Cơ sở dữ liệu bản đồ nổi tiếng
 * Dựa trên hồ sơ công khai về ngày sinh, thời gian sinh là ước tính (một số có ghi chép trong tài liệu)
 */

export interface FamousPerson {
  id: string;
  name: string;
  category: 'Thương Gia' | 'Văn Nghệ' | 'Lịch Sử' | 'Thể Thao' | 'Khoa Học';
  description: string;           // Giới thiệu một câu về danh tính
  year: number;
  month: number;
  day: number;
  hour: number;                  // Chỉ số thập nhị thì 0-11
  gender: 'male' | 'female';
  notable: string;               // Điểm nổi bật của bản đồ tử vi (khơi dậy sự quan tâm của người dùng)
}

export const FAMOUS_PERSONS: FamousPerson[] = [
  // ─── Huyền thoại Thương Gia ─────────────────────────────────────────────
  {
    id: 'ma-yun',
    name: '马云',
    category: 'Thương Gia',
    description: 'Người sáng lập Alibaba',
    year: 1964, month: 9, day: 10, hour: 5,  // Ước tính ngọ thì
    gender: 'male',
    notable: 'Bản đồ cho thấy năng lực phá cục tái kiến rất mạnh, sao trong Quan Lộc Cung tương ứng cao với đế chế thương mại internet',
  },
  {
    id: 'li-jiacheng',
    name: '李嘉诚',
    category: 'Thương Gia',
    description: 'Tỷ phú Hồng Kông, người sáng lập Tập đoàn Cheung Kong',
    year: 1928, month: 7, day: 29, hour: 3,  // Ước tính dần thì
    gender: 'male',
    notable: 'Tứ Hóa trong Tài Bạch Cung là case study tuyệt vời để nghiên cứu bản đồ tử vi của các tỷ phú Đông Phương, Lộc Tồn giữ tài, càng ngày càng dày',
  },
  {
    id: 'ren-zhengfei',
    name: '任正非',
    category: 'Thương Gia',
    description: 'Người sáng lập Huawei',
    year: 1944, month: 10, day: 25, hour: 3, // Dần thì
    gender: 'male',
    notable: 'Thất Sát nhập mệnh, cả đời ngược gió, càng bị đàn áp càng mạnh mẽ, tài liệu sống về lý thuyết Thất Sát của Nhu Sư',
  },

  // ─── Người nổi tiếng Văn Nghệ ─────────────────────────────────────────────
  {
    id: 'zhang-ailing',
    name: '张爱玲',
    category: 'Văn Nghệ',
    description: 'Đại văn hào văn học hiện đại Trung Quốc',
    year: 1920, month: 9, day: 30, hour: 1, // Sửu thì
    gender: 'female',
    notable: 'Sự kết hợp sao cô độc trong bản đồ tạo sự đối chiếu kỳ lạ với cuộc đời tình cảm ly kỳ và thành tựu văn học của bà',
  },
  {
    id: 'jay-chou',
    name: '周杰伦',
    category: 'Văn Nghệ',
    description: 'Thiên vương nhạc pop Hoa ngữ',
    year: 1979, month: 1, day: 18, hour: 1,  // Sửu thì (theo báo cáo sinh đêm)
    gender: 'male',
    notable: 'Sự kết hợp Văn Khúc và Đam Lang, vận mệnh tài năng thiên bẩm, bản đồ giải thích tại sao anh có thể vượt qua mọi thể loại nhạc',
  },
  {
    id: 'wang-fei',
    name: '王菲',
    category: 'Văn Nghệ',
    description: 'Nữ ca sĩ huyền thoại nhất của làng nhạc Hoa ngữ',
    year: 1969, month: 8, day: 8, hour: 4,   // Mão thì
    gender: 'female',
    notable: 'Sao trong Phu Tân Cung tương ứng cao với hai cuộc hôn nhân huyền thoại, cục diện tình cảm có giá trị nghiên cứu cao',
  },
  {
    id: 'lin-zhiling',
    name: '林志玲',
    category: 'Văn Nghệ',
    description: 'Mẫu diễn viên Đài Loan',
    year: 1974, month: 11, day: 29, hour: 5, // Ngọ thì
    gender: 'female',
    notable: 'Thái Âm thủ mệnh là hình mẫu nhan sắc nữ giới, bản đồ minh chứng hoàn hảo cho luận điểm của Nhu Sư "Con gái Thái Âm nhập mệnh xinh đẹp nhất"',
  },

  // ─── Tinh anh Khoa Học ─────────────────────────────────────────────
  {
    id: 'steve-jobs',
    name: '乔布斯',
    category: 'Khoa Học',
    description: 'Đồng sáng lập Apple',
    year: 1955, month: 2, day: 24, hour: 6,  // Ngọ thì
    gender: 'male',
    notable: 'Phá Quân nhập mệnh, bị cha mẹ ruột bỏ rơi lại sáng lập đế chế Apple, mẫu hình bản đồ phá nhi lập',
  },
  {
    id: 'elon-musk',
    name: '马斯克',
    category: 'Khoa Học',
    description: 'Người sáng lập Tesla, SpaceX',
    year: 1971, month: 6, day: 28, hour: 4,  // Mão thì
    gender: 'male',
    notable: 'Biểu hiện cực điểm của cục diện Sát Phá Lang, Thiên Mã cung mệnh sung túc, cả đời thay đổi ranh giới tương lai của nhân loại',
  },

  // ─── Sao Thể Thao ─────────────────────────────────────────────
  {
    id: 'yao-ming',
    name: '姚明',
    category: 'Thể Thao',
    description: 'Huyền thoại NBA, đại sứ bóng rổ Trung Quốc',
    year: 1980, month: 9, day: 12, hour: 5,  // Ngọ thì
    gender: 'male',
    notable: 'Thiên Lương thủ mệnh, uy nghi đường bệ, sao trong Quan Lộc Cung phù hợp cao với thành tựu nghề nghiệp',
  },
  {
    id: 'li-na',
    name: '李娜',
    category: 'Thể Thao',
    description: 'Vô địch Grand Slam quần vợt Trung Quốc',
    year: 1982, month: 2, day: 26, hour: 2,  // Dần thì
    gender: 'female',
    notable: 'Thất Sát hóa khí, số mệnh định sẵn cạnh tranh, đại hạn lưu niên tương ứng chính xác với thời điểm vô địch Pháp Mở Rộng',
  },
];

/** Lấy người nổi tiếng theo phân loại */
export function getFamousByCategory(category: FamousPerson['category']): FamousPerson[] {
  return FAMOUS_PERSONS.filter(p => p.category === category);
}

/** Lấy tất cả phân loại */
export const FAMOUS_CATEGORIES: FamousPerson['category'][] = [
  'Thương Gia', 'Văn Nghệ', 'Khoa Học', 'Thể Thao',
];
