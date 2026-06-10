# Cơ Sở Cốt Lõi — Nền Tảng Hệ Thống Tử Vi

> Tài liệu này trích xuất nền tảng hệ thống tử vi từ mã nguồn TypeScript trong thư mục `lib/` của dự án `ziwei-doushu`. Toàn bộ nội dung được trích trực tiếp từ mã nguồn.

---

## 1. Kiến Trúc Hệ Thống

```
ziwei-doushu/lib/
├── ziwei/          # Lõi tử vi — thuật toán, hằng số, quy luật
│   ├── algorithm.ts   # Thuật toán xếp bàn (dùng iztro)
│   ├── constants.ts   # Hằng số ngũ hành, tứ hoá, thập nhị cung
│   ├── types.ts       # Kiểu dữ liệu BirthInfo, Palace, Star...
│   ├── patterns.ts    # Nhận diện 30+ cục diện
│   ├── sihua.ts       # Tứ hoá: bản mệnh, đại hạn, lưu niên, lưu tháng
│   ├── heming-knowledge.ts  # Tri thức hợp bàn
│   ├── famous.ts       # Cơ sở 14 nhân vật nổi tiếng
│   ├── cities.ts      # Danh sách 350+ thành phố Trung Quốc + kinh độ
│   ├── share.ts        # Công cụ tính chính thời, phân tích URL
│   ├── db-analysis.ts  # SEO knowledge page (khung rỗng)
│   └── history.ts      # Lịch sử tra cứu localStorage
├── classics/        # Cơ sở kinh điển — 3 bộ sách cổ
│   ├── index.ts       # API tìm kiếm toàn văn
│   ├── types.ts       # Kiểu Book, Chapter, Paragraph
│   └── data/
│       ├── gusuifu.ts     # 《Tủy Cốt Phú》
│       ├── quanji.ts      # 《Tử Vi Đấu Số Toàn Tập》
│       └── quanshu.ts     # 《Tử Vi Đấu Số Toàn Thư》
└── nihai/           # Hệ thống Nguỵ Hải厦 tam kỷ
    ├── index.ts          # Tiểu sử + ba category
    ├── types.ts          # NiModule, Hexagram, NiChapter...
    ├── tianji.ts         # Thiên Kỷ
    ├── renji.ts          # Nhân Kỷ
    └── diji.ts           # Địa Kỷ
```

---

## 2. Cơ Sở Dữ Liệu Tử Vi (`lib/ziwei`)

### 2.1 Hằng Số Ngũ Hành (`constants.ts`)

| Nhóm | Nội dung | Chi tiết |
|-------|----------|----------|
| **Thập Can** | Giáp Ất Bính Đinh Mậu Kỷ Canh Tân Nhâm Quý | 10 thiên can |
| **Thập Nhị Chi** | Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi | 12 địa chi |
| **Thập Nhị Cung** | Mệnh Cung, Huynh Đệ, Phu Thê, Tử Nữ, Tài Bạch, Tật Khoa, Diên Niên, Hữu Nghĩa, Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu | 12 cung theo thứ tự thuận |
| **Na Ấm Ngũ Hành** | 30 cặp can-chi → 30 ngũ hành (Kim Hỏa Mộc Thổ...) | Công thức: 10×3 |
| **Ngũ Hành → Cục** | Thủy=2 cục, Mộc=3 cục, Kim=4 cục, Thổ=5 cục, Hỏa=6 cục | Định cục số |
| **Tứ Hoá Bảng** | 10 năm can → [Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kị] | Bảng tứ hoá theo năm |
| **Thiên Khôi Thiên Vũ** | 10 can → [khôi branch, vũ branch] | Bảng quý nhân |
| **Lộc Tồn** | 10 can → branch chỉ định | Giáp→Dần, Ất→Mão... |
| **Thiên Mã** | 12 chi → branch | Dần Ngọ Tuất→Thân, Thân Tý Thìn→Dần... |

### 2.2 Tứ Hoá Hệ Thống (`sihua.ts`)

```typescript
// Tứ hoá theo năm (bản mệnh — tĩnh, cố định suốt đời)
SI_HUA_TABLE[0] = ['Liêm Trinh','Phá Quân','Vũ Khúc','Thái Dương']   // Giáp năm
SI_HUA_TABLE[1] = ['Thiên Cơ','Thiên Lương','Tử Vi','Thái Âm']     // Ất năm
// ... 10 năm can

// Tứ hoá đại hạn: dùng CUNG CAN của đại hạn (không phải bản mệnh can)
getDaXianSiHua(chart, dxIndex) → lấy palace.stem → getSiHuaByStem

// Tứ hoá lưu niên: dùng năm hiện tại
getLiuNianSiHua(year) → getYearStemIndex(year) → getSiHuaByStem

// Tứ hoá lưu tháng: Ngũ Hổ Độn
getLiuYueStemIndex(yearStem, month)  // tháng 1-12

// Tự hóa (Cung can tự hóa): cung can → 4 hóa, có sao nằm đúng cung đó
detectSelfSihua(palace) → SelfSihua[]

// Cung Lai Duyên: tìm cung nào "bay" ra hóa sao
findIncomingPalaces(chart, starName, sihua) → Palace[]
```

### 2.3 Thuật Toán Xếp Bàn (`algorithm.ts`)

```
Đầu vào: năm/tháng/ngày sinh dương lịch, giờ, giới tính, kinh độ
   ↓
1. getLunarInfo()          → năm âm lịch, can, chi, tháng, ngày
2. iztro.bySolar()         → xếp 12 cung + 14 chính tinh + tứ hoá + đại hạn
3. mapBrightness()         → Miếu/Hưởng/Lợi/Bình/Không/Hãm → bright/normal/dim
4. mapStarType()           → major/minor/lucky/sha
5. Cấu trúc hóa Palace:  branch, stem, name, stars[], daXianAge, isMingGong, isShenGong
6. Xử lý không cung (Khung Cung): borrowedFromBranch, borrowedStars
7. Tính tuổi hiện tại + đại hạn hiện tại
   ↓
Đầu ra: ZiweiChart { birthInfo, lunarInfo, mingGongBranch, wuxingJu,
                       palaces[12], daXians[], currentAge, currentDaXianIndex }
```

**Quy Tắc Tử Thì** (Nguỵ Hải厦体系):
- 23:00–23:59 = **Vãn Tử** → tính **ngày mai**
- 00:00–00:59 = **Tảo Tử** → tính **hôm nay**
- Chính thời = TCN ± (kinh độ - 120) × 4 phút

### 2.4 Nhận Diện Cục Diện (`patterns.ts`)

**30+ cục diện**, chia 4 cấp:

#### Thượng Cấp (Excellent/Good)

| Cục diện | Nguồn | Điều kiện |
|-----------|-------|-----------|
| Quân Thần Khánh Hội | Toàn Thư | Tử Vi nhập mệnh + Tả Hữu đồng thời tam phương |
| Tử Phủ Đồng Cung | Toàn Thư | Tử Vi + Thiên Phủ cùng cung (Dần/Thân) |
| Phủ Tướng Triêu Viên | Toàn Thư | Thiên Phủ + Thiên Tướng phân thủ tam phương tứ chính |
| Dương Lương Xương Lộc | Toàn Thư | Thái Dương + Thiên Lương + Văn Xương + Lộc Tồn tam phương |
| Hỏa Tham / Linh Tham | Tủy Cốt Phú | Tham Lang + Hỏa Tinh / Linh Tinh cùng cung hoặc tam phương |
| Vũ Tham | Tủy Cốt Phú | Võ Trác + Tham Lang cùng cung (Sửu/Mùi) hoặc đối cung |
| Sát Phá Lang | Toàn Thư | Thất Sát + Phá Quân + Tham Lang tam phương tụ hội |
| Cơ Nguyệt Đồng Lương | Toàn Thư | Thiên Cơ + Thái Âm + Thiên Đồng + Thiên Lương 4★ tam phương |
| Song Lộc Triêu Viên | Toàn Thư | Hoá Lộc + Lộc Tồn tam phương đồng thời |
| Tam Kỳ Gia Hội | Toàn Thư | Hoá Lộc + Hoá Quyền + Hoá Khoa tam phương đồng thời |

#### Trung Cấp (Good/Neutral)

| Cục diện | Nguồn | Điều kiện |
|-----------|-------|-----------|
| Liêm Trinh Thiên Tướng | Toàn Thư | Cùng cung |
| Võ Trác Thất Sát | Toàn Thư | Cùng cung |
| Thiên Đồng Thiên Lương | Toàn Thư | Cùng cung |
| Nhật Nguyệt Đồng Cung | Toàn Thư | Thái Dương + Thái Âm tại Sửu/Mùi cùng cung |
| Nhật Nguyệt Giáp Mệnh | Toàn Thư | Thái Dương Thái Âm phân cư mệnh cung trước sau |
| Cự Môn Nhật Đồng Cung | Toàn Thư | Cự Môn + Thái Dương tại Dần/Thân cùng cung |
| Thạch Trung Ẩn Ngọc | Tủy Cốt Phú | Cự Môn nhập mệnh Tý/Ngọ cung |
| Minhm Châu Xuất Hải | Toàn Tập | Mệnh cung tại Mùi không cung + đối cung Sửu là Nhật Nguyệt |
| Phụ Tịch Giáp Mệnh | Toàn Thư | Tả Hữu phân cư mệnh cung trước sau |
| Xương Khúc Giáp Mệnh | Toàn Thư | Văn Xương Văn Khúc phân cư mệnh cung trước sau |
| Khôi Vũ Giáp Mệnh | Toàn Thư | Thiên Khôi Thiên Vũ phân cư mệnh cung trước sau |

#### Cơ Bản (Neutral/Good)

| Cục diện | Nguồn |
|-----------|-------|
| Lộc Tồn Thủ Mệnh/Thân | Toàn Thư |
| Thiên Mã nhập Mệnh/Diên | Toàn Thư |
| Hoá Lộc nhập Tài | Toàn Thư |
| Hoá Quyền nhập Quan | Toàn Thư |
| Hoá Khoa nhập Mệnh/Thân | Toàn Thư |
| Xương Khúc đồng thời | Toàn Thư |
| Phụ Tịch đồng thời | Toàn Thư |
| Khôi Vũ đồng thời | Toàn Thư |
| Khoa Quyền song hội | Toàn Thư |

#### Ác Cấp (Caution)

| Cục diện | Nguồn | Ghi chú |
|-----------|-------|---------|
| Hoá Kị nhập Mệnh/Diên | Toàn Thư | Cần lưu ý |
| Dương Đà Giáp Kị | Tủy Cốt Phú | Dương Đà phân cư mệnh trước sau + Hoá Kị tọa mệnh |
| Hỏa Linh Giáp Mệnh | Toàn Thư | Hỏa Tinh Linh Tinh phân cư mệnh trước sau |
| Không Kiếp Giáp Mệnh | Toàn Thư | Địa Không Địa Kiếp phân cư mệnh trước sau |
| Liêm Sát Dương | Toàn Thư | Liêm Trinh + Thất Sát + Dương Đà tam phương |
| Cự Hỏa Dương | Tủy Cốt Phú | Cự Môn + Hỏa Tinh + Dương Đà tam phương |
| Linh Xương Đà Võ | Tủy Cốt Phú | Linh Tinh + Văn Xương + Đà Lô + Võ Trác tam phương |
| Mã Đầu Đới Tiễn | Tủy Cốt Phú | Dương Đà tọa mệnh cung Ngọ |

**Cấu Trúc Pattern:**
```typescript
interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];          // cung liên quan
  conditions?: {
    required: string[];      // điều kiện bắt buộc
    bonus?: string[];        // điều kiện cộng điểm
    breaking?: string[];       // điều kiện phá cục
  };
  source?: string;            // kinh điển nguồn
}
```

---

## 3. Hệ Thống Mười Bốn Chính Tinh

### 3.1 Danh Sách Chính Tinh

| Tên | Ngũ Hành | Tính | Quẻ | Ý Nghĩa Cốt Lõi |
|------|----------|-------|------|-------------------|
| Tử Vi | Thổ | Trung tính thiên cát | Đế Tinh | Đế vương·Tôn quý·Độc lập |
| Thiên Cơ | Mộc | Cát Tinh | Thiện Tinh | Trí tuệ·Cơ biến·Mưu lược |
| Thái Dương | Hỏa | Cát Tinh | Quý Nhân Tinh | Dương cương·Quan quý·Hào phóng |
| Võ Trác | Kim | Trung tính | Tài Tinh | Tài phú·Cương nghị·Quyết đoán |
| Thiên Đồng | Thủy | Cát Tinh | Phúc Tinh | Ôn hòa·Hưởng lạc·Tùy duyên |
| Liêm Trinh | Hỏa | hung trung mang tài | Hoa Tinh | Tài nghệ·Hình khố·Hoa duyên |
| Thiên Phủ | Thổ | Cát Tinh | Tài Khố Tinh | Tài khố·Ổn định·Bảo thủ |
| Thái Âm | Thủy | Cát Tinh | Tài Phú Tinh | Nhu mỹ·Tài phú·Âm nhu |
| Tham Lang | Mộc | Trung tính | Hoa Tinh | Dục vọng·Hoa duyên·Đa tài |
| Cự Môn | Thủy | hung trung mang tài | Thị Phi Tinh | Khẩu thiệt·Thị phi·Biện tài |
| Thiên Tướng | Thủy | Cát Tinh | Ấn Tinh | Phụ tá·Hành chính·Ổn trọng |
| Thiên Lương | Thổ | Cát Tinh | Ấm Tị Tinh | Ấm hộ·Y học·Trưởng bối |
| Thất Sát | Kim | hung Tinh | Tướng Soái Tinh | Tướng soái·Quyết đoán·Cô thác |
| Phá Quân | Thủy | hung Tinh | Biến Động Tinh | Khai sáng·Biến động·Phá cựu |

### 3.2 Hệ Thống Độ Sáng (Miếu Hưởng Lợi Bình Không Hãm)

```typescript
// Ví dụ: Tử Vi độ sáng theo địa chi
STAR_BRIGHTNESS['Tử Vi'] = {
  2:'bright', 5:'bright', 8:'bright', 11:'bright',  // Dần Tỵ Thân Hợi — Miếu
  1:'normal', 4:'normal', 7:'bright', 10:'normal',  // Sửu Thìn Mùi — Hưởng/Lợi
  0:'normal', 3:'dim', 6:'dim', 9:'normal'         // Tý Mão Ngọ — Hãm
}
```

| Mức | Mã | Ý nghĩa |
|------|-----|---------|
| Miếu (Miaó) | bright | Sao phát huy tối đa |
| Hưởng (Hưởng) | bright | Sao phát huy tốt |
| Đắc (Dé) | bright | Tương đương hưởng |
| Lợi (Lì) | normal | Bình thường |
| Bình (Bình) | normal | Bình thường |
| Không (Bù) | dim | Bất lợi |
| Hãm (Hãm) | dim | Suy tổn |

### 3.3 Phân Loại Sao Phụ

```typescript
const SHA_STARS = ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh',
                   'Địa Không','Địa Kiếp','Thiên Không','Tuần Không',
                   'Kiết Lộ','Đại Hao','Thiên Sứ','Thiên Thương'];
const LUCKY_STARS = ['Văn Xương','Văn Khúc','Tả Hữu','Hữu Hữu',
                     'Thiên Khôi','Thiên Vũ','Lộc Tồn','Thiên Mã',
                     'Thiên Quan','Thiên Phúc','Thiên Tài','Thiên Thọ',
                     'Tam Đài','Bát Tòa','Ân Quang','Thiên Quý',
                     'Đài Phụ','Long Trì','Phượng Các','Hồng Loan','Thiên Hy'];
```

---

## 4. Thập Nhị Cung — Ý Nghĩa Từng Cung

```
Thứ tự thuận chiều kim đồng hồ (từ Mệnh Cung):
0: Mệnh Cung   → Nền tảng một đời, căn bản vận mệnh
1: Huynh Đệ Cung → Anh chị em, cộng sự
2: Phu Thê Cung → Phối ngẫu, hôn nhân
3: Tử Nữ Cung  → Con cái, hoa duyên
4: Tài Bạch Cung → Tài chính, cách kiếm tiền
5: Tật Khoa Cung → Sức khỏe, thể chất
6: Diên Niên Cung → Xuất ngoại, cơ hội, nhân duyên
7: Hữu Nghĩa Cung → Quan hệ xã hội, quý nhân, tiểu nhân
8: Quan Lộc Cung → Sự nghiệp, địa vị xã hội
9: Điền Trạch Cung → Bất động sản, tổ tiên, tài khố
10: Phúc Đức Cung → Tinh thần, phúc đức, hôn nhân sâu sắc
11: Phụ Mẫu Cung → Trưởng bối, văn thư, hợp đồng
```

**Tam Phương Tứ Chính:**
- Mệnh Cung + Tài Bạch (thuận 4) + Quan Lộc (thuận 8) + Diên Niên (đối cung)
- Đây là vòng phân tích cốt lõi trong tử vi

**Thân Cung:**
- Xác định ảnh hưởng mạnh nhất giai đoạn nào trong đời
- Có thể trùng với 1 trong 12 cung
- Thân Cung tại Tài Bạch → thường là phụ nữ đi làm

---

## 5. Tứ Hoá — Bản Chất

### 5.1 Tứ Hoá Bảng (10 thiên can)

| Can | Hoá Lộc | Hoá Quyền | Hoá Khoa | Hoá Kị |
|-----|---------|-----------|---------|---------|
| Giáp (0) | Liêm Trinh | Phá Quân | Vũ Khúc | Thái Dương |
| Ất (1) | Thiên Cơ | Thiên Lương | Tử Vi | Thái Âm |
| Bính (2) | Thiên Đồng | Thiên Cơ | Văn Xương | Liêm Trinh |
| Đinh (3) | Thái Âm | Thiên Đồng | Thiên Cơ | Cự Môn |
| Mậu (4) | Tham Lang | Thái Âm | Hữu Hữu | Thiên Cơ |
| Kỷ (5) | Võ Trác | Tham Lang | Thiên Lương | Văn Khúc |
| Canh (6) | Thái Dương | Võ Trác | Thái Âm | Thiên Đồng |
| Tân (7) | Cự Môn | Thái Dương | Văn Khúc | Văn Xương |
| Nhâm (8) | Thiên Lương | Tử Vi | Tả Hữu | Võ Trác |
| Quý (9) | Phá Quân | Cự Môn | Thái Âm | Tham Lang |

### 5.2 Ý Nghĩa Tứ Hoá

| Tứ Hoá | Tính | Chủ | Ứng dụng |
|---------|-------|-----|-----------|
| Hoá Lộc | Tính thủ | Tài, duyên, năng lực | Tài chính, cơ hội, quan hệ |
| Hoá Quyền | Tính cương | Quyền lực, quyết đoán, độc lập | Khả năng lãnh đạo, cạnh tranh |
| Hoá Khoa | Tính thanh | Danh tiếng, quý nhân, văn thư | Học vấn, danh vọng, hỗ trợ |
| Hoá Kị | Tính ỷ | Bệnh, sát, bài học sâu sắc | Trở ngại, thử thách, cần đối mặt |

### 5.3 Tứ Hoá Luỹ Tiến (Phân Tầng)

```typescript
// Tầng 1: Bản mệnh (Sanh Niên tứ hoá) — cố định, không đổi suốt đời
//   → Lấy từ năm sinh

// Tầng 2: Đại hạn (Đại Hạn tứ hoá) — dùng CUNG CAN chứ không phải bản mệnh can
getDaXianSiHua(chart, dxIndex)
// → Lấy palace.stem (cung can) → getSiHuaByStem

// Tầng 3: Lưu niên (Lưu Niên tứ hoá) — theo năm hiện tại
getLiuNianSiHua(year) → getYearStemIndex(year)

// Tầng 4: Lưu tháng (Lưu Nguyệt tứ hoá) — Ngũ Hổ Độn
getLiuYueStemIndex(yearStem, month)
```

> **Nguyên tắc Nguỵ Hải厦**: Tứ hoá sao luôn cố định (không dùng Phi Tinh派 cung can tự hóa) — chỉ xem đại hạn/lưu niên đi qua cung nào mà thôi.

---

## 6. Hợp Bàn Tri Thức (`heming-knowledge.ts`)

### 6.1 Nguyên Tắc Song Cung Liên Tham

> **"Xem hôn nhân, chỉ nhìn Phu Thê Cung là sai hoàn toàn, phải đồng thời nhìn Phúc Đức Cung."**

Hai cung bắt buộc phân tích đồng thời:
- **Phu Thê Cung**: Tượng phối ngẫu, tính cách, mô hình tương tác
- **Phúc Đức Cung**: Tình cảm sâu sắc, liệu hôn nhân bền lâu không

### 6.2 Tiêu Chuẩn Thiên Tác Chi Hợp (Định cỡ cao nhất)

| Điều kiện | Ý nghĩa |
|-----------|---------|
| Phương A Phu Thê Cung chính tinh = Phương B Mệnh Cung chính tinh | Có duyên từ kiếp trước |
| Phương B Phu Thê Cung chính tinh = Phương A Mệnh Cung chính tinh | Tương hỗ |
| Hai bên đối ứng lẫn nhau | Định mệnh một đôi |

### 6.3 Tính Điểm Hợp Bàn

| Điểm | Điều kiện |
|-------|-----------|
| ★★★★★ | Thiên tác + tứ hoá tương hỗ + đại hạn đồng vận |
| ★★★★ | Một bên Phu Thê = đối phương Mệnh + tứ hoá chủ là Lộc/Khoa |
| ★★★ | Mệnh cục tương hợp, cần mài dũa |
| ★★ | Mỗi bên có sát tinh, tứ hoá có khắc |
| ★ | Tam sát tụ hội, nguy cơ ly hôn |

### 6.4 Báo Hiệu Các Cặp Đôi Tương Khắc

- Phương A hoá kị bay vào Phương B Phu Thê → gây thương tổn cho hôn nhân Phương B
- Hai bên Phu Thê đều nặng sát không cát → nguy hiểm
- Cự Môn tại Hữu Nghĩa → "kết hợp với bạn bè sẽ thành kẻ thù"

### 6.5 Mười Bốn Chính Tinh Trong Phu Thê Cung (Tóm Tắt)

| Chính tinh | Đặc điểm | Lưu ý |
|------------|-----------|-------|
| Tử Vi | Cao ngạo, năng lực | Nên kết hôn muộn |
| Thiên Cơ | Hay thay đổi | Nên chênh lệch tuổi lớn |
| Thái Dương | Nam giúp vợ, nữ lấy chồng giỏi | Hãm + hoá kị → tương khắc |
| Võ Trác | Cô thác, thiên hạ | Nhất định kết hôn muộn |
| Thiên Đồng | Ôn hòa, hưởng lạc | Nên chênh lệch tuổi lớn |
| Liêm Trinh | Bất ổn nhất | Ly hôn hoặc mất mát |
| Thiên Phủ | Ổn định, bình thản | Cát tinh, hòa bình |
| Thái Âm | Thanh tú, dịu dàng | Hãm + sát → thay đổi nhiều |
| Tham Lang | Hoa duyên mạnh nhất | Nguy cơ ngoại tình cao |
| Cự Môn | Cãi nhau nhiều | Cần Thái Dương giải hòa |
| Thiên Tướng | Hợp tác, bổ trợ | Tình cảm ổn định |
| Thiên Lương | Trưởng bối, trưởng thành | Trước nhiều sóng gió, sau ổn định |
| Thất Sát | Ly biệt, ít gặp nhau | Nên kết hôn sau 30 |
| Phá Quân | Phá hoại hôn nhân mạnh nhất | Cần trải qua mài dũa |

---

## 7. Đại Hạn

```typescript
interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;   // cung đặt đại hạn
  palaceName: string;
  stemIndex?: number;     // cung can (dùng cho đại hạn tứ hoá)
  stemName?: string;
  siHua?: DaXianSiHua;
}
```

- Mỗi cung có 1 đại hạn (thường 10 năm)
- Ưu tiên nhận dạng đại hạn hiện tại: `currentAge >= startAge && currentAge <= endAge`
- **Nguỵ Hải厦 không chủ trương** dùng Phi Tinh派 cung can tự hóa để đoán đại hạn

---

## 8. Bảng Mã Nguồn và File Tương Ứng

| File | Chức năng | Dòng |
|------|-----------|------|
| `algorithm.ts` | Xếp bàn tử vi | 182 |
| `constants.ts` | Hằng số ngũ hành, tứ hoá | 145 |
| `types.ts` | Kiểu ZiweiChart, Palace, Star... | 91 |
| `patterns.ts` | 30+ cục diện nhận diện | 1119 |
| `sihua.ts` | Tứ hoá: bản mệnh/đại hạn/lưu niên | 199 |
| `heming-knowledge.ts` | Tri thức hợp bàn | 330 |
| `db-analysis.ts` | SEO knowledge page (khung rỗng) | 55 |
| `share.ts` | Công cụ chính thời + URL | 90 |
| `history.ts` | Lịch sử localStorage | 65 |
| `famous.ts` | 14 nhân vật nổi tiếng | 137 |
| `cities.ts` | 350+ thành phố + kinh độ | 512 |
| `gusuifu.ts` | Tủy Cốt Phú (9 chương) | 219 |
| `quanji.ts` | Tử Vi Đấu Số Toàn Tập (5 quyển) | 196 |
| `quanshu.ts` | Tử Vi Đấu Số Toàn Thư (7 chương) | 147 |
| `tianji.ts` | Nguỵ Hải厦 Thiên Kỷ + 64 quái + 堪舆 | 549 |
| `renji.ts` | Nguỵ Hải厦 Nhân Kỷ + 215 huyệt + 100 phương | 660 |
| `diji.ts` | Nguỵ Hải厦 Địa Kỷ | 184 |

**Tổng cộng: ~3.700+ dòng mã nguồn cốt lõi**
