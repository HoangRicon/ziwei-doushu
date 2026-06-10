# Cơ Sở Lý Luận — Lý Luận Căn Bản từ Mã Nguồn

> Tài liệu này trích xuất hệ thống lý luận và quy trình suy luận từ mã nguồn của dự án `ziwei-doushu`. Nó tập trung vào các nguyên tắc, thuật toán, và phương pháp luận được lập trình trực tiếp thành mã nguồn.

---

## 1. Hệ Thống Lý Luận Tử Vi

### 1.1 Nguyên Lý Cốt Lõi

```
┌──────────────────────────────────────────────────┐
│        Tử Vi Đấu Số · Hệ thống lý luận            │
├──────────────────────────────────────────────────┤
│ 1. Tính tĩnh  → Bản mệnh, cố định             │
│    (Sanh Niên tứ hoá — từ năm sinh, không đổi) │
│                                                     │
│ 2. Tính động → Đại hạn (mười năm nhất động)   │
│    (Đại Hạn tứ hoá — dùng cung can, không bản mệnh)│
│                                                     │
│ 3. Tính lưu chuyển → Lưu niên (nhất niên nhất động)│
│    (Lưu Niên tứ hoá — theo năm hiện tại)        │
│                                                     │
│ 4. Tam phương tứ chính → Mệnh+Tài+Quan+Diên   │
│    (Phân tích vòng tròn, không đơn tuyến)        │
│                                                     │
│ 5. Mệnh Cung vi bản → Mệnh định cục diện,     │
│    Tam phương định dụng                            │
│    (Tập trung vào gốc, không đảo lộn)          │
└──────────────────────────────────────────────────┘
```

### 1.2 Tam Phương Tứ Chính

**Định nghĩa toán học:**
```typescript
function getSanFangPalaces(chart: ZiweiChart): Palace[] {
  const m = chart.mingGongBranch;
  const branches = [m, (m+4)%12, (m+8)%12, (m+6)%12];
  //          Mệnh      Tài Bạch        Quan Lộc       Diên Niên(đối)
  return chart.palaces.filter(p => branches.includes(p.branch));
}

function isInSanFang(chart, branch): boolean {
  const m = chart.mingGongBranch;
  return [m, (m+4)%12, (m+8)%12, (m+6)%12].includes(branch);
}
```

**Ý nghĩa lý luận:**
- **Mệnh Cung (thuận 0)**: Nền tảng vĩnh cửu — tính cách bẩm sinh
- **Tài Bạch Cung (thuận 4)**: Cơ hội tài chính — cách kiếm tiền
- **Quan Lộc Cung (thuận 8)**: Vị thế xã hội — sự nghiệp
- **Diên Niên Cung (đối)**: Bên ngoài — người khác nhìn nhận, du lịch

### 1.3 Nguyên Tắc Song Cung Liên Tham

**Nguyên tắc kép:**

```
┌──────────────────────────────────────┐
│ Xem hôn nhân → Phu Thê + Phúc Đức    │
│ Xem tài vận → Tài Bạch + Điền Trạch  │
│ Xem sự nghiệp → Quan Lộc + Mệnh       │
│ Xem sức khỏe → Tật Khoa + Mệnh      │
│ Xem nhân mạch → Diên Niên + Hữu Nghĩa│
└──────────────────────────────────────┘
```

**Quy tắc lý luận từ mã nguồn:**
```typescript
// Trong patterns.ts — kiểm tra Giáp Cung (được/vị)
function getJiaPalaces(chart, branch): { prev?, next? } {
  return {
    prev: getPalaceByBranch((branch + 11) % 12),  // Tiền nhất cung
    next: getPalaceByBranch((branch + 1) % 12)     // Hậu nhất cung
  };
}
// Giáp = trước sau hai cung có sao cụ thể → cục diện giáp
```

---

## 2. Thuật Toán Nhận Diện Cục Diện

### 2.1 Kiến Trúc Pattern Detector

```typescript
// patterns.ts — 30+ bộ nhận diện cục diện
// Mỗi hàm detectXxx nhận (chart, mingPalace, patterns[]) → push Pattern

function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);

  // Thượng cấp
  detectJunChenQingHui(chart, ming, patterns);    // Quân Thần Khánh Hội
  detectZiFu(chart, ming, patterns);             // Tử Phủ Đồng Cung
  detectFuXiangChaoYuan(chart, ming, patterns); // Phủ Tướng Triêu Viên
  detectYangLiangChangLu(chart, ming, patterns);  // Dương Lương Xương Lộc
  detectHuoTanLingTan(chart, ming, patterns);     // Hỏa Tham/Linh Tham
  detectWuTan(chart, ming, patterns);             // Vũ Tham
  detectShaPoLang(chart, ming, patterns);          // Sát Phá Lang
  detectJiYueTongLiang(chart, ming, patterns); // Cơ Nguyệt Đồng Lương

  // Ác cấp
  detectHuaJiRuMingQian(chart, patterns);       // Hóa Kị nhập Mệnh/Diên
  detectYangTuoJiaJi(chart, patterns);         // Dương Đà Giáp Kị
  detectHuoLingJiaMing(chart, patterns);      // Hỏa Linh Giáp Mệnh
  detectLianShaYang(chart, patterns);           // Liêm Sát Dương

  return patterns;
}
```

### 2.2 Lớp Cấu Trúc Pattern

```typescript
interface PatternCondition {
  required: string[];   // Điều kiện bắt buộc — đã thỏa mãn
  bonus?: string[];      // Điều kiện cộng điểm — đã trigger
  breaking?: string[];    // Điều kiện phá cục — đã trigger
}

interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];        // Cung liên quan
  conditions?: PatternCondition;
  source?: string;        // Kinh điển nguồn
}
```

### 2.3 Quy Trình Lý Luận (Từ mã nguồn)

**Bước 1: Xác định Mệnh Cung**
```typescript
const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);

function getMajorStarNames(palace: Palace): string[] {
  return palace.stars
    .filter(s => s.type === 'major')
    .map(s => s.name);
}
```

**Bước 2: Đánh giá độ sáng**
```typescript
function isBright(palace, starName): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'bright';  // Miếu/Hưởng/Đắc → bright
}

function isDim(palace, starName): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'dim';     // Hãm/Không → dim
}
```

**Bước 3: Tính sát tinh**
```typescript
const SHA_HARD = ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh'];  // Tứ sát
const SHA_KONG = ['Địa Không','Địa Kiếp'];                          // Không kiếp

function shaCountInPalace(palace, list = SHA_HARD): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}

function hasShaInPalace(palace, list = SHA_NAMES): boolean {
  return palace.stars.some(s => list.includes(s.name));
}
```

**Bước 4: Đánh giá cấp cục diện**
```
Level đánh giá:
  excellent  = Thỏa điều kiện bắt buộc + không phá cục + có bonus
  good      = Thỏa điều kiện + không/không nhiều phá cục
  neutral   = Thỏa điều kiện cơ bản
  caution   = Có phá cục trigger HOẶC cục diện hung chồm
```

### 2.4 Ví dụ: Quy Trình Nhận Diện Sát Phá Lang

```typescript
function detectShaPoLang(chart, ming, patterns) {
  const sanFangSet = sanFangAllStars(chart);
  // Kiểm tra tam phương tứ chính có Thất Sát, Phá Quân, Tham Lang
  const has = ['Thất Sát','Phá Quân','Tham Lang'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;  // Không đủ 3 → bỏ qua

  // Đánh giá điều kiện
  const required = ['Thất Sát, Phá Quân, Tham Lang tam tinh đồng hội tam phương'];
  const bonus = [];
  const breaking = [];

  if (sanFangSet.has('Hóa Lộc') || sanFangSet.has('Hóa Quyền'))
    bonus.push('Tam phương hữu Hóa Lộc hoặc Hóa Quyền (động năng lực)');
  if (sanFangSet.has('Tả Hữu') && sanFangSet.has('Hữu Hữu'))
    bonus.push('Phụ Tịch đồng thời (biến động trung hữu quý nhân)');
  if (sanFangShaCount(chart, SHA_HARD) >= 3)
    breaking.push('Sát tinh quá nhiều (động vô thành)');
  if (hasShaInPalace(ming, SHA_KONG))
    breaking.push('Mệnh tọa không kiếp (động khổ sở)');

  // Xác định cấp
  const level = breaking.length ? 'caution' : 'good';

  patterns.push({
    name: 'Sát Phá Lang',
    level,
    description: breaking.length
      ? 'Tam sát đồng hội mệnh, sáng tạo khởi phá. Một đời biến động nhiều, không cam tâm phổ thông, thích khởi nghiệp, quân cảnh, kinh doanh. Trẻ dễ thất bại, trung niên mới ổn định.'
      : 'Tam sát đồng hội mệnh, sáng tạo khởi phá. Một đời biến động nhiều, không cam tâm phổ thông, thích khởi nghiệp, quân cảnh, kinh doanh. Trẻ dễ thất bại, trung niên mới ổn định.',
  });
}
```

---

## 3. Quy Trình Hợp Bàn

### 3.1 Nguyên Tắc Suy Luận

```
┌──────────────────────────────────────────────────┐
│       Hợp bàn ngũ bước (Từ heming-knowledge.ts)      │
├──────────────────────────────────────────────────┤
│ Bước 1: Đánh giá nền tảng mệnh của 2 bên        │
│         → Mệnh Cung + Thân Cung + Phúc Đức          │
│                                                    │
│ Bước 2: Phu Thê cung đối chiếu                  │
│         → Phương A Phu Thê = Phương B Mệnh?      │
│         → Phương B Phu Thê = Phương A Mệnh?      │
│                                                    │
│ Bước 3: Thái Dương Thái Âm tinh tượng phân tích  │
│         → Nữ mệnh: Thái Dương = chồng              │
│         → Nam mệnh: Thái Âm = vợ                   │
│                                                    │
│ Bước 4: Tứ hoá phi hóa đối chiếu                │
│         → Phương A năm sinh → tìm tứ hoá → rơi vào │
│           cung nào trong bàn Phương B              │
│                                                    │
│ Bước 5: Đại hạn đồng bộ                          │
│         → 2 bên hiện tại Đại hạn có cùng vận?    │
└──────────────────────────────────────────────────┘
```

### 3.2 Tính Điểm Hợp Bàn

```typescript
const HEMING_SCORE_CRITERIA = {
  'Năm sao': 'Hai bên Phu Thê đối ứng thiên tác, tứ hoá tương bổ, Đại hạn đồng vận',
  'Bốn sao': 'Một bên Phu Thê đối ứng đối phương Mệnh, tứ hoá chủ là Lộc/Khoa',
  'Ba sao': 'Mệnh cục tương hợp nhưng đều có góc, cần mài dũa',
  'Hai sao': 'Mỗi bên có sát tinh, tứ hoá có khắc, tình cảm nhiều sóng gió',
  'Một sao': 'Hung tinh tụ hội, nguy cơ ly hôn cao'
};
```

### 3.3 Duyên Phân Loại

| Duyên loại | Đặc điểm | Biểu hiện |
|------------|----------|-----------|
| Hóa Lộc dẫn động | Chính duyên | Tình cảm ngọt ngào thuận lợi |
| Hóa Quyền dẫn động | Chủ động tranh đấu | Có sức ép, có bên chủ đạo |
| Hóa Khoa dẫn động | Hài hòa | Tôn trọng lẫn nhau, kiểu bạc đầu |
| Hóa Kị dẫn động | Nghịch duyên/oan gia | Tra tấn nhưng khó rời |
| Hai bên đối hóa kị | "Đường cùng gặp nhau" | Mạnh mẽ nhưng đau đớn, nợ từ kiếp trước |

---

## 4. Hệ Thống Tứ Hoá — Lớp Lý Luận

### 4.1 Tính Toán Tứ Hoá Từ Mã Nguồn

```typescript
// 1) Bản mệnh (tĩnh)
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;  // Giáp=0, Ất=1...
}

// 2) Tứ hoá theo can
export function getSiHuaByStem(stemIndex: number): Record<SiHua, string> {
  const arr = SI_HUA_TABLE[stemIndex];
  return { Lộc: arr[0], Quyền: arr[1], Khoa: arr[2], Kị: arr[3] };
}

// 3) Đại hạn tứ hoá (động cấp 1)
export function getDaXianSiHua(chart, dxIndex) {
  const dxPalace = chart.palaces.find(p => p.branch === dx.palaceBranch);
  const stemIndex = dxPalace.stem;  // Dùng CUNG CAN, không phải bản mệnh can!
  return getSiHuaByStem(stemIndex);
}

// 4) Lưu niên tứ hoá (động cấp 2)
export function getLiuNianSiHua(year: number) {
  const stemIndex = getYearStemIndex(year);
  return getSiHuaByStem(stemIndex);
}

// 5) Lưu tháng tứ hoá (động cấp 3)
export function getLiuYueStemIndex(yearStem: number, month: number): number {
  // Ngũ Hổ Độn: Tháng giêng (Dần) can theo năm can
  const startStemOfYin = {
    0:2, 5:2,  // Giáp Kỷ → Bính
    1:4, 6:4,  // Ất Canh → Nhâm
    2:6, 7:6,  // Bính Tân → Canh
    3:8, 8:8,  // Đinh Nhâm → Mậu
    4:0, 9:0,  // Mậu Quý → Giáp
  };
  const yinStem = startStemOfYin[yearStem];
  return (yinStem + ((month - 1) % 12) + 10) % 10;
}

// 6) Tự hóa (Cung can tự hóa)
export function detectSelfSihua(palace: Palace): SelfSihua[] {
  const transforms = getSiHuaByStem(palace.stem);
  // Nếu cung can hóa ra sao, và sao đó nằm đúng cung → tự hóa
}

// 7) Cung Lai Duyên
export function findIncomingPalaces(chart, starName, sihua): Palace[] {
  // Tìm cung nào có cung can hóa ra starName với sihua đó
}
```

### 4.2 Độ Ưu Tiên Tứ Hoá

```
Bản mệnh (Sanh Niên tứ hoá) < Đại hạn < Lưu niên < Lưu tháng
   (cố định)    (mười năm)  (một năm)  (một tháng)
```

### 4.3 Lý Do Lý Luận Đằng Sau

```typescript
// Đại hạn dùng CUNG CAN không phải BẢN MỆNH CAN
// Giải thích:
// - Bản mệnh tứ hoá cố định → đại diện TÍNH CỐT LÕI
// - Đại hạn tứ hoá biến động → đại diện CHO 10 NĂM ĐẦU TIÊN của giai đoạn đó
// - Nếu dùng bản mệnh can → tất cả đại hạn đều giống nhau → vô nghĩa

// Lý do KHÔNG dùng Phi Tinh phái cung can tự hóa:
// - Nguỵ Hải厦: "Tứ hoá sao luôn cố định" — tứ hoá sao không di chuyển
// - Cung can tự hóa của Phi Tinh phái → làm tứ hoá sao di chuyển → trái với lý luận
```

---

## 5. Lý Luận Đằng Sau Các Hằng Số

### 5.1 Tính Cục Số (Ngũ Hành Cục)

```typescript
// Công thức tính cục
const ELEMENT_TO_JU = {
  'Thủy': 2,  // Thủy nhị cục
  'Mộc': 3,  // Mộc tam cục
  'Kim': 4,   // Kim tứ cục
  'Thổ': 5,   // Thổ ngũ cục
  'Hỏa': 6    // Hỏa lục cục
};

// Căn cứ: dựa vào Na Ấm ngũ hành của năm can + ngày sinh
// Mỗi cục có chu kỳ số khác nhau:
// - Thủy nhị cục: mỗi 2 năm đổi đại hạn
// - Hỏa lục cục: mỗi 6 năm đổi đại hạn
```

### 5.2 Thiên Mã — Công Thức

```typescript
// Tam hợp cục → Thiên Mã branch
// Dần Ngọ Tuất(tam hợp hỏa) → Thân(8)
// Thân Tý Thìn(tam hợp thủy) → Dần(2)
// Tỵ Dậu Sửu(tam hợp kim) → Hợi(11)
// Hợi Mão Mùi(tam hợp mộc) → Tỵ(5)

const TIANMA_TABLE = {
  2:8, 6:8, 10:8,  // Dần Ngọ Tuất → Thân
  8:2, 0:2, 4:2,    // Thân Tý Thìn → Dần
  5:11, 9:11, 1:11, // Tỵ Dậu Sửu → Hợi
  11:5, 3:5, 7:5    // Hợi Mão Mùi → Tỵ
};
// Dùng trong: đánh giá động (Dị Mã tinh động)
```

### 5.3 Lộc Tồn — Công Thức

```typescript
// Theo năm can → xác định Lộc Tồn ở branch nào
const LUCUN_TABLE = {
  0:2,  // Giáp → Dần(2)
  1:3,  // Ất → Mão(3)
  2:5,  // Bính → Tỵ(5)
  3:6,  // Đinh → Ngọ(6)
  4:5,  // Mậu → Tỵ(5)
  5:6,  // Kỷ → Ngọ(6)
  6:8,  // Canh → Thân(8)
  7:9,  // Tân → Dậu(9)
  8:11, // Nhâm → Hợi(11)
  9:0   // Quý → Tý(0)
};
// Quy tắc: Lộc Tồn luôn có MỘT trong mỗi cung
// → Xác định tài vận cơ bản
```

### 5.4 Thiên Khôi Thiên Vũ — Công Thức

```typescript
// Theo năm can → xác định Khôi Vũ ở branch nào
// Quy tắc:
// Giáp năm: Khôi Sửu(1), Vũ Mùi(7)
// Ất năm: Khôi Tý(0), Vũ Thân(8)
const TIANKUI_TABLE = {
  0: [1, 7],   // Giáp: Khôi Sửu  Vũ Mùi
  1: [0, 8],   // Ất: Khôi Tý  Vũ Thân
  2: [11, 9],  // Bính: Khôi Hợi  Vũ Dậu
  // ...
};
// Khôi = nam khôi, Vũ = nữ vũ
// → Chủ yếu dùng trong: học vấn, thi cử, quý nhân
```

---

## 6. Thuật Toán Chính Thời

```typescript
// Giải thích lý luận:
// Việt Nam dùng giờ Hà Nội (105°Đ) hoặc北京时间 (120°Đ) làm chuẩn
// Nhưng mỗi địa điểm có kinh độ khác → giờ thực khác
// Chênh lệch: (kinh độ - 105 hoặc 120) × 4 phút

export function calcTrueSolarBranch(clockHour, clockMinute, longitude): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  // Tử thì: 23:00-00:59 (1380-1440 và 0-60)
  if (solar >= 1380 || solar < 60) return 0;
  // Khác: chia 120 phút = 1 giờ
  return Math.floor((solar - 60) / 120) + 1;
}
```

---

## 7. Lý Luận Đằng Sau Mỗi Cục Diện

### 7.1 Hệ Thống Phân Tầng Cục Diện

```
Thượng cấp (Excellent/Good)
  ├── Quân Thần Khánh Hội  → Tử Vi có Phụ Tịch → như lãnh đạo có thuộc hạ
  ├── Tử Phủ Đồng Cung    → Đế tinh + Tài khố → vừa có quyền vừa có tiền
  ├── Dương Lương Xương Lộc → 4 tinh hội → Khoa cừ tinh
  └── Tam Kỳ Gia Hội    → Lộc+Quyền+Khoa → Danh lợi quyền đủ

Trung cấp (Good/Neutral)
  ├── Sát Phá Lang      → 3 tinh động → Biến động, khởi nghiệp
  ├── Cơ Nguyệt Đồng Lương → 4 tinh ổn → Ổn định, công chức
  └── Hỏa Tham/Linh Tham  → Tham Lang+sát → Đột phát ngoại tài

Ác cấp (Caution)
  ├── Dương Đà Giáp Kị    → Hóa Kị bị 2 sát giáp → sách cổ: hung đại
  ├── Liêm Sát Dương      → 3 hung tinh → Đổ máu
  ├── Cự Hỏa Dương      → sách cổ: "thường dục tử"
  └── Linh Xương Đà Võ    → sách cổ: "hạn chí đầu hà"
```

### 7.2 Quy Tắc Đánh Giá Level

```typescript
// Nguyên tắc: Một phiếu phủ quyết cho breaking
// Nếu có breaking → giảm level xuống 1 bậc

function evaluateLevel(required, bonus, breaking, baseLevel): Pattern['level'] {
  if (breaking && breaking.length > 0) {
    return baseLevel === 'excellent' ? 'good' :
           baseLevel === 'good' ? 'neutral' :
           'caution';
  }
  if (bonus && bonus.length > 0) {
    return baseLevel === 'good' ? 'excellent' : baseLevel;
  }
  return baseLevel;
}
```

---

## 8. Bảng Quyết Định

### 8.1 Khi Nào Nên Dùng Cục Diện Nào

| Tình huống | Cục diện ưu tiên |
|-----------|------------------|
| Phân tích lãnh đạo | Quân Thần Khánh Hội, Tử Phủ Đồng Cung |
| Phân tích tài chính | Song Lộc Triêu Viên, Hỏa Tham/Linh Tham |
| Phân tích học vấn | Dương Lương Xương Lộc, Tam Kỳ Gia Hội, Xương Khúc Giáp |
| Phân tích hôn nhân | (Song cung liên tham: Phu Thê + Phúc Đức) |
| Phân tích sự nghiệp | Cơ Nguyệt Đồng Lương (ổn định) / Sát Phá Lang (khởi phá) |
| Cảnh báo nguy hiểm | Ác cấp (Dương Đà Giáp Kị, Liêm Sát Dương...) |

### 8.2 Bảng Quyết Định Hôn Nhân

| Tình trạng | Khuyến nghị |
|-----------|------------|
| Phu Thê không sát | Nên kết hôn sớm |
| Phu Thê có sát không cát | Nên kết hôn muộn (nam 30+, nữ 27+) |
| Võ Trác/Liêm Trinh/Thất Sát/Phá Quân tại Phu Thê | Nhất định khuyến kết hôn muộn |
| Đại hạn Phu Thê cát tinh nhiều | Thập niên đó có cơ hội kết hôn |
| Đại hạn Phu Thê Hóa Kị | Thập niên đó tình cảm trở ngại |
| Lưu niên Hồng Loan Thiên Hy nhập Mệnh/Phu Thê | Năm đó tình duyên có động |
| Lưu niên Phu Thê cung tứ ngũ hành tinh tụ | Năm đó tình cảm cơ hội nhiều |

### 8.3 Bảng Xác Định Động Tĩnh

| Yếu tố | Loại | Ý nghĩa |
|---------|------|---------|
| Sanh Niên tứ hoá | Tĩnh (cố định) | Tính cách bẩm sinh, thiên hướng |
| Chính tinh độ sáng | Tĩnh (cố định) | Khả năng phát triển cốt lõi |
| Cục diện | Tĩnh (cố định) | Tiềm năng tổng thể |
| Đại hạn | Động (10 năm) | Giai đoạn mười năm |
| Lưu niên | Động (1 năm) | Năm hiện tại |
| Lưu tháng | Động (1 tháng) | Tháng hiện tại |
| Địa lý | Động (có thể đổi) | Có thể điều chỉnh |
| Nhân sự nỗ lực | Động (có thể đổi) | 2/3 của tổng |

---

## 9. Thuật Toán Phân Tích Tổng Hợp

```typescript
// Hàm xuất: getMingGongSummary — tóm tắt cho giao diện
export function getMingGongSummary(chart): {
  stars: string[];
  keywords: string[];
  nature: string;
} {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const majorStars = mingPalace.stars.filter(s => s.type === 'major');
  const starNames = majorStars.map(s => s.name);

  // keyword map: mỗi sao → 3 từ khóa
  const keywordMap = {
    'Tử Vi': ['Tôn quý','Độc lập','Lãnh đạo'],
    'Thiên Cơ': ['Trí tuệ','Cơ biến','Mưu lược'],
    'Thái Dương': ['Dương cương','Quan quý','Hào phóng'],
    // ...
  };

  // nature map: mỗi sao → tên gọi
  const natureMap = {
    'Tử Vi': 'Đế Tinh',
    'Thiên Cơ': 'Trí Tuệ Tinh',
    'Võ Trác': 'Tài Phú Tinh',
    // ...
  };

  return {
    stars: starNames,
    keywords: starNames.flatMap(n => keywordMap[n]).slice(0, 5),
    nature: starNames[0] ? natureMap[starNames[0]] : 'Khung Cung'
  };
}
```
