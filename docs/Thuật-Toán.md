# Thuật Toán — Hệ Thống Tính Toán Tử Vi cho AI

> Tài liệu này định nghĩa toàn bộ thuật toán cần thiết để xây dựng phần mềm luận giải Tử Vi bằng AI. Mọi công thức, quy trình, và quy tắc suy luận đều được trình bày dưới dạng có thể lập trình trực tiếp.

---

## Mục lục

1. [Kiến trúc tổng thể](#1-kiến-trúc-tổng-thể)
2. [Thuật toán xếp bàn](#2-thuật-toán-xếp-bàn)
3. [Quy tắc Tử Thì](#3-quy-tắc-tử-thì)
4. [Chính thời tính](#4-chính-thời-tính)
5. [Hệ thống độ sáng sao](#5-hệ-thống-độ-sáng-sao)
6. [Hệ thống tứ hoá](#6-hệ-thống-tứ-hoá)
7. [Thuật toán nhận diện cục diện](#7-thuật-toán-nhận-diện-cục-diện)
8. [Hệ thống đại hạn](#8-hệ-thống-đại-hạn)
9. [Hợp bàn thuật toán](#9-hợp-bàn-thuật-toán)
10. [Cấu trúc dữ liệu đầu ra](#10-cấu-trúc-dữ-liệu-đầu-ra)
11. [Quy trình luận giải AI tổng hợp](#11-quy-trình-luận-giải-ai-tổng-hợp)

---

## 1. Kiến trúc tổng thể

```
Đầu vào người dùng
  ├── Năm sinh (dương lịch, ví dụ 1990)
  ├── Tháng sinh (dương lịch, 1-12)
  ├── Ngày sinh (dương lịch, 1-31)
  ├── Giờ sinh (0-23 hoặc tên giờ Tý→Hợi)
  ├── Giới tính (nam/nữ)
 

  ↓

Bước 1: Chuẩn hóa thông tin
  ├── Chuyển giờ → chỉ số giờ Tử Vi (0-11)
  ├── Áp dụng quy tắc Tử Thì nếu giờ = 23-0
  ├── Tính chính thời nếu có kinh độ
  └── Xác định can năm (Giáp=0...Quý=9)

Bước 2: Tính âm lịch
  ├── getLunarInfo(year, month, day, hour, longitude?)
  │   → năm âm lịch, can, chi, tháng âm, ngày âm
  └── Dùng thư viện hoặc bảng tra cứu

Bước 3: Xếp bàn (sử dụng iztro hoặc thuật toán riêng)
  ├── iztro.bySolar(year, month, day, hour, gender, longitude?)
  │   → 12 cung + 14 chính tinh + tứ hoá + đại hạn
  └── mapBrightness() → gán độ sáng cho từng sao

Bước 4: Xử lý cấu trúc
  ├── Tạo đối tượng Palace cho mỗi cung
  ├── Xử lý Không Cung (cung trống)
  ├── Tính tuổi hiện tại
  └── Xác định đại hạn hiện tại

Bước 5: Phân tích (AI hoặc rule-based)
  ├── Nhận diện cục diện (30+ patterns)
  ├── Tính tứ hoá luỹ tiến (bản mệnh → đại hạn → Lưu Niên → lưu tháng)
  ├── Phân tích tam phương tứ chính
  └── Sinh luận giải

  ↓

Đầu ra: ZiweiChart (JSON) + Luận giải (văn bản)
```

---

## 2. Thuật toán xếp bàn

### 2.1 Đầu vào / Đầu ra

```typescript
interface BirthInfo {
  solarYear: number;    // 1990
  solarMonth: number;   // 1-12
  solarDay: number;     // 1-31
  hour: number;         // 0-23 hoặc 0-11 (giờ Tử Vi)
  minute: number;       // 0-59
  gender: 'male' | 'female';
  
}

interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: {
    year: number;
    month: number;
    day: number;
    yearStem: number;  // 0-9 (Giáp=0)
    yearBranch: number; // 0-11 (Tý=0)
    monthStem: number;
    monthBranch: number;
    dayStem: number;
    dayBranch: number;
    hourBranch: number; // 0-11 (Tý=0)
  };
  mingGongBranch: number;  // chỉ số Mệnh Cung (0-11)
  shenGongBranch: number;  // chỉ số Thân Cung (0-11)
  wuxingJu: number;        // 2-6 (cục số)
  palaces: Palace[12];
  daXians: DaXian[];       // 12 đại hạn
  currentAge: number;
  currentDaXianIndex: number;
}
```

### 2.2 Thuật toán chuyển giờ dương lịch → giờ Tử Vi

```typescript
// 24 giờ chia thành 12 đoạn, mỗi đoạn 2 giờ
// Quy tắc Tử Thì can thiệp TRƯỚC khi tính giờ Tử Vi

function getZiweiHour(clockHour: number, clockMinute: number, longitude: number): number {
  // Bước 1: Tính chính thời (solar time)
  const trueSolar = calcTrueSolar(clockHour, clockMinute, longitude);

  // Bước 2: Tử Thì — giờ từ 23:00-00:59
  // Vãn Tử (23:00-23:59) → tính ngày mai
  // Tảo Tử (00:00-00:59) → tính hôm nay
  // (Xử lý bước này ở cấp độ ngày âm lịch, không ảnh hưởng giờ)

  // Bước 3: Chia giờ chính thời thành 12 giờ Tử Vi
  // Giờ Tử Vi = floor((trueSolarMins - 60) / 120) + 1
  // Tý = 0, Sửu = 1, Dần = 2 ... Hợi = 11
  const solarMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4; // phút chênh
  const trueSolarMins = ((solarMins + offset) % 1440 + 1440) % 1440;

  // Tử Thì: 1380-1440 và 0-60 phút (23:00-00:59)
  if (trueSolarMins >= 1380 || trueSolarMins < 60) {
    return 0; // Tử Thì → Tý (chỉ số 0)
  }

  return Math.floor((trueSolarMins - 60) / 120) + 1; // 1-12
}

// Kết quả: 0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ,
//           6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi
```

### 2.3 Thuật toán tính can năm (thiên can)

```typescript
// Công thức: Can = (Năm Dương Lịch - 4) % 10
// 0=Giáp, 1=Ất, 2=Bính, 3=Đinh, 4=Mậu, 5=Kỷ, 6=Canh, 7=Tân, 8=Nhâm, 9=Quý

function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

// Ví dụ: 1990 → (1990-4)%10 = 1986%10 = 6 → Canh
// Ví dụ: 1991 → (1991-4)%10 = 1987%10 = 7 → Tân
```

### 2.4 Thuật toán tính can tháng (Ngũ Hổ Độn)

```typescript
// Bảng can tháng theo can năm (tháng 1 = Dần, 12 = Hợi)
const YIN_START_STEM: Record<number, number> = {
  0: 2, 5: 2,  // Giáp, Kỷ → Bính (Dần)
  1: 4, 6: 4,  // Ất, Canh → Nhâm (Dần)
  2: 6, 7: 6,  // Bính, Tân → Canh (Dần)
  3: 8, 8: 8,  // Đinh, Nhâm → Mậu (Dần)
  4: 0, 9: 0,   // Mậu, Quý → Giáp (Dần)
};

// Can tháng = (can Dần + tháng - 1) % 10
function getMonthStemIndex(yearStem: number, month: number): number {
  const yinStem = YIN_START_STEM[yearStem];
  return ((yinStem + ((month - 1) % 12)) % 10 + 10) % 10;
}
```

### 2.5 Thuật toán tính can ngày (Lục Giáp)

```typescript
// Lục Giáp: 60 ngày 1 chu kỳ, kết hợp can + chi
// Công thức dựa trên số Julian hoặc bảng tra cứu

// Cách 1: Tính từ ngày Julius
function getDayStemBranch(jd: number): { stem: number; branch: number } {
  // jd: Julian Day Number
  const stem = ((jd % 10) + 10) % 10;
  const branch = ((jd % 12) + 12) % 12;
  return { stem, branch };
}

// Cách 2: Tính trực tiếp từ ngày tháng năm
function getDayStemBranchFromDate(year: number, month: number, day: number) {
  // Công thức Zeller hoặc dùng thư viện lunar calendar
  // Trả về: stem (0-9), branch (0-11)
}
```

### 2.6 Xác định cung Mệnh và cung Thân

```typescript
// Quy tắc:
// 1. Từ năm sinh + giới tính → xác định Mệnh Cung (cung khởi điểm)
// 2. Thân Cung = Mệnh Cung + 6 (đối cung)

// Cách phổ biến: Dựa vào can năm và tháng
// Công thức tổng quát:
//   Mệnh Cung = f(can_năm, tháng_sinh) theo bảng

// Ví dụ đơn giản (dùng iztro):
// iztro.bySolar(year, month, day, hour, gender, longitude)
// → trả về đầy đủ chart với mingGongBranch và shenGongBranch

function getMingGong(chart: ZiweiChart): Palace {
  return chart.palaces.find(p => p.branch === chart.mingGongBranch)!;
}

function getShenGong(chart: ZiweiChart): Palace {
  return chart.palaces.find(p => p.branch === chart.shenGongBranch)!;
}
```

---

## 3. Quy tắc Tử Thì

```
QUY TẮC TUYỆT ĐỐI:
┌────────────────────────────────────────────────────────┐
│ 23:00 - 23:59 = Vãn Tử → tính NGÀY MAI              │
│   (Năm +1, Tháng +1/0, Ngày +1 theo âm lịch)         │
│                                                        │
│ 00:00 - 00:59 = Tảo Tử → tính HÔM NAY                │
│   (Không thay đổi năm/tháng/ngày)                    │
└────────────────────────────────────────────────────────┘

KHI NÀO ÁP DỤNG:
- Khi người dùng nhập giờ sinh trong khoảng 23:00-00:59
- Cần thay đổi ngày âm lịch TƯƠNG ỨNG trước khi xếp bàn
- Giờ vẫn là Tý (chỉ số 0) cho cả hai trường hợp

VÍ DỤ:
- Sinh 2024-01-15 23:30 → tính ngày 2024-01-16 (âm lịch)
- Sinh 2024-01-15 00:15 → tính ngày 2024-01-15 (âm lịch)
```

---

## 4. Chính thời tính

```typescript
// Chính thời = Giờ địa phương thực sự, có tính kinh độ
// Công thức: Chênh lệch = (Kinh độ - 120) × 4 phút

// offset > 0: đông hơn Bắc Kinh → trời lên trễ hơn
// offset < 0: tây hơn Bắc Kinh → trời lên sớm hơn

function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4; // phút
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;

  // Tử Thì: 1380-1440 (23:00-23:59) và 0-60 (00:00-00:59)
  if (solar >= 1380 || solar < 60) return 0; // Tý

  // Các giờ khác: chia 120 phút = 2 giờ mỗi cung
  return Math.floor((solar - 60) / 120) + 1; // Sửu=1, Dần=2... Hợi=11
}

```


---

## 5. Hệ thống độ sáng sao

### 5.1 Định nghĩa các mức độ sáng

```typescript
// 7 mức độ sáng, gom thành 3 nhóm cho lập trình:
const BRIGHTNESS_LEVEL = {
  bright:  ['Miếu', 'Hưởng', 'Đắc'],  // Sao phát huy tối đa
  normal:  ['Lợi', 'Bình'],             // Sao phát huy bình thường
  dim:     ['Không', 'Hãm'],             // Sao suy tổn / bất lợi
};

// Độ sáng theo địa chi (branch 0-11)
// Branch: 0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ,
//          6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi
```

### 5.2 Bảng độ sáng của 14 chính tinh (phần quan trọng nhất)

```typescript
// Cấu trúc: STAR_BRIGHTNESS[starName] = { [branch]: brightness }
const STAR_BRIGHTNESS: Record<string, Record<number, string>> = {

  'Tử Vi': {
    2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright', // Dần Tỵ Thân Hợi → Miếu
    1: 'normal', 4: 'normal', 7: 'normal', 10: 'normal', // Sửu Thìn Mùi Tuất → Hưởng/Lợi
    0: 'dim',    3: 'dim',    6: 'dim',    9: 'dim',     // Tý Mão Ngọ Dậu → Hãm
  },

  'Thiên Cơ': {
    0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',  // Tý Mão Ngọ Dậu → Miếu
    1: 'normal', 2: 'normal', 4: 'normal', 5: 'normal',
    7: 'normal', 8: 'normal', 10: 'normal', 11: 'normal', // Hưởng/Lợi
  },

  'Thái Dương': {
    0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',  // Tý Mão Ngọ Dậu → Miếu
    1: 'dim',    4: 'dim',    7: 'dim',    10: 'dim',     // Sửu Thìn Mùi Tuất → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',   // Dần Tỵ Thân Hợi
  },

  'Vũ Khúc': {
    1: 'bright', 4: 'bright', 7: 'bright', 10: 'bright',  // Sửu Thìn Mùi Tuất → Miếu
    0: 'dim',    3: 'dim',    6: 'dim',    9: 'dim',     // Tý Mão Ngọ Dậu → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
  },

  'Liêm Trinh': {
    0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',  // Tý Mão Ngọ Dậu → Miếu
    1: 'dim',    4: 'dim',    7: 'dim',    10: 'dim',     // Sửu Thìn Mùi Tuất → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
  },

  'Thiên Phủ': {
    1: 'bright', 4: 'bright', 7: 'bright', 10: 'bright',  // Sửu Thìn Mùi Tuất → Miếu
    0: 'dim',    3: 'dim',    6: 'dim',    9: 'dim',     // Tý Mão Ngọ Dậu → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
  },

  'Thái Âm': {
    1: 'bright', 4: 'bright', 7: 'bright', 10: 'bright',  // Sửu Thìn Mùi Tuất → Miếu
    0: 'dim',    3: 'dim',    6: 'dim',    9: 'dim',     // Tý Mão Ngọ Dậu → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
  },

  'Tham Lang': {
    0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',  // Tý Mão Ngọ Dậu → Miếu
    1: 'normal', 2: 'normal', 4: 'normal', 5: 'normal',
    7: 'normal', 8: 'normal', 10: 'normal', 11: 'normal',
  },

  'Cự Môn': {
    // Cự Môn "thất thường" — không có miếu cố định
    // Thường được đánh giá dựa trên cung chủ và các sao đồng cung
    1: 'normal', 2: 'normal', 4: 'normal', 5: 'normal',
    7: 'normal', 8: 'normal', 10: 'normal', 11: 'normal',
    0: 'dim', 3: 'dim', 6: 'dim', 9: 'dim',
  },

  'Thiên Tướng': {
    0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',  // Tý Mão Ngọ Dậu → Miếu
    1: 'dim',    4: 'dim',    7: 'dim',    10: 'dim',     // Sửu Thìn Mùi Tuất → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
  },

  'Thiên Lương': {
    1: 'bright', 4: 'bright', 7: 'bright', 10: 'bright',  // Sửu Thìn Mùi Tuất → Miếu
    0: 'dim',    3: 'dim',    6: 'dim',    9: 'dim',     // Tý Mão Ngọ Dậu → Hãm
    2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
  },

  'Thất Sát': {
    // Thất Sát "hung" — không có miếu, đắc ở một số cung đặc biệt
    // Thường bất lợi ở hầu hết cung
    0: 'dim',    1: 'dim',    3: 'dim',    4: 'dim',
    6: 'dim',    8: 'dim',    10: 'dim',   11: 'dim',
    2: 'normal', 5: 'normal', 7: 'normal', 9: 'normal',
  },

  'Phá Quân': {
    // Phá Quân "hung" — không miếu, phát huy ở một số cung
    0: 'dim',    1: 'dim',    3: 'dim',    4: 'dim',
    6: 'dim',    8: 'dim',    10: 'dim',   11: 'dim',
    2: 'normal', 5: 'normal', 7: 'normal', 9: 'normal',
  },

  'Thiên Đồng': {
    1: 'bright', 4: 'bright', 7: 'bright', 10: 'bright',  // Sửu Thìn Mùi Tuất → Miếu
    0: 'normal', 2: 'normal', 3: 'normal', 5: 'normal',
    6: 'normal', 8: 'normal', 9: 'normal', 11: 'normal',
  },
};
```

### 5.3 Thuật toán mapBrightness

```typescript
function mapBrightness(palace: Palace, starName: string): string {
  const branch = palace.branch;
  const brightnessMap = STAR_BRIGHTNESS[starName];
  if (!brightnessMap) return 'normal';
  return brightnessMap[branch] || 'normal';
}

function mapStarType(starName: string): 'major' | 'minor' | 'lucky' | 'sha' {
  if (MAJOR_STARS.includes(starName)) return 'major';
  if (SHA_STARS.includes(starName)) return 'sha';
  if (LUCKY_STARS.includes(starName)) return 'lucky';
  return 'minor';
}

// Sao: Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng,
const MAJOR_STARS = [
  'Tử Vi','Thiên Cơ','Thái Dương','Vũ Khúc','Thiên Đồng',
  'Liêm Trinh','Thiên Phủ','Thái Âm','Tham Lang','Cự Môn',
  'Thiên Tướng','Thiên Lương','Thất Sát','Phá Quân'
];
```

---

## 6. Hệ thống tứ hoá

### 6.1 Bảng tứ hoá theo thiên can (SI_HUA_TABLE)

```typescript
// 10 thiên can × 4 hóa = 40 kết hợp
// Index: 0=Giáp, 1=Ất, 2=Bính, 3=Đinh, 4=Mậu, 5=Kỷ, 6=Canh, 7=Tân, 8=Nhâm, 9=Quý

const SI_HUA_TABLE: string[][] = [
  /* 0 Giáp */ ['Liêm Trinh','Phá Quân','Vũ Khúc','Thái Dương'],
  /* 1 Ất   */ ['Thiên Cơ','Thiên Lương','Tử Vi','Thái Âm'],
  /* 2 Bính */ ['Thiên Đồng','Thiên Cơ','Văn Xương','Liêm Trinh'],
  /* 3 Đinh */ ['Thái Âm','Thiên Đồng','Thiên Cơ','Cự Môn'],
  /* 4 Mậu  */ ['Tham Lang','Thái Âm','Hữu Hữu','Thiên Cơ'],
  /* 5 Kỷ   */ ['Vũ Khúc','Tham Lang','Thiên Lương','Văn Khúc'],
  /* 6 Canh */ ['Thái Dương','Vũ Khúc','Thái Âm','Thiên Đồng'],
  /* 7 Tân  */ ['Cự Môn','Thái Dương','Văn Khúc','Văn Xương'],
  /* 8 Nhâm */ ['Thiên Lương','Tử Vi','Tả Hữu','Vũ Khúc'],
  /* 9 Quý  */ ['Phá Quân','Cự Môn','Thái Âm','Tham Lang'],
];
// Format: [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kị]
```

### 6.2 Hàm tính tứ hoá

```typescript
type SiHuaKey = 'Lộc' | 'Quyền' | 'Khoa' | 'Kị';

function getSiHuaByStem(stemIndex: number): Record<SiHuaKey, string> {
  const arr = SI_HUA_TABLE[stemIndex % 10];
  return {
    'Lộc': arr[0],
    'Quyền': arr[1],
    'Khoa': arr[2],
    'Kị': arr[3],
  };
}

// Ví dụ: Giáp năm (stemIndex=0)
// → Hóa Lộc=Liêm Trinh, Hóa Quyền=Phá Quân, Hóa Khoa=Vũ Khúc, Hóa Kị=Thái Dương
```

### 6.3 Tứ Hóa luỹ tiến (4 tầng)

```typescript
// ═══════════════════════════════════════════════════════
// TẦNG 1: BẢN MỆNH (Sanh Niên tứ hoá) — TĨNH, cố định suốt đời
// ═══════════════════════════════════════════════════════
function getBanMenhSiHua(chart: ZiweiChart): Record<SiHuaKey, string> {
  const yearStem = chart.lunarInfo.yearStem; // 0-9
  return getSiHuaByStem(yearStem);
}
// → Lấy can năm sinh → tra bảng tứ hoá → ra 4 sao hóa
// → Xác định 4 sao này nằm ở cung nào trong 12 cung

// ═══════════════════════════════════════════════════════
// TẦNG 2: ĐẠI HẠN tứ hoá — ĐỘNG, 10 năm/thay đổi
// ═══════════════════════════════════════════════════════
function getDaXianSiHua(chart: ZiweiChart, dxIndex: number): Record<SiHuaKey, string> {
  const dxPalace = chart.palaces.find(p => p.branch === chart.daXians[dxIndex].palaceBranch);
  const stemIndex = dxPalace!.stem; // Lấy CUNG CAN, KHÔNG phải bản mệnh can!
  return getSiHuaByStem(stemIndex);
}
// → Lấy cung can (stem) của cung đại hạn → tra bảng
// → KHÔNG dùng can năm sinh (sai hoàn toàn nếu làm vậy)

// ═══════════════════════════════════════════════════════
// TẦNG 3: LƯU NIÊN tứ hoá — ĐỘNG, 1 năm/thay đổi
// ═══════════════════════════════════════════════════════
function getLiuNianSiHua(year: number): Record<SiHuaKey, string> {
  const stemIndex = getYearStemIndex(year);
  return getSiHuaByStem(stemIndex);
}
// → Lấy can năm hiện tại → tra bảng

// ═══════════════════════════════════════════════════════
// TẦNG 4: LƯU THÁNG tứ hoá — ĐỘNG, 1 tháng/thay đổi
// ═══════════════════════════════════════════════════════
function getLiuYueSiHua(yearStem: number, month: number): Record<SiHuaKey, string> {
  const stemIndex = getLiuYueStemIndex(yearStem, month);
  return getSiHuaByStem(stemIndex);
}

// ═══════════════════════════════════════════════════════
// ĐỘ ƯU TIÊN (từ mạnh → yếu)
// ═══════════════════════════════════════════════════════
// Bản mệnh < Đại hạn < Lưu niên < Lưu tháng
//   (cố định)    (10 năm)    (1 năm)    (1 tháng)
// NGUYÊN TẮC: Lớp nào mạnh hơn → áp đảo lớp yếu hơn
```

### 6.4 Tự Hóa (Cung can tự hóa)

```typescript
// Khi cung can hóa ra sao VÀ sao đó nằm đúng trong cung đó
// → Gọi là "Tự Hóa"

function detectSelfSihua(palace: Palace): SelfSihua[] {
  const transforms = getSiHuaByStem(palace.stem);
  const selfSihua: SelfSihua[] = [];

  const starNames = palace.stars.map(s => s.name);

  for (const [type, starName] of Object.entries(transforms)) {
    if (starNames.includes(starName)) {
      selfSihua.push({
        type: type as SiHuaKey, // 'Lộc'|'Quyền'|'Khoa'|'Kị'
        starName,
        palace: palace.name,
      });
    }
  }

  return selfSihua;
}
// Ví dụ: Mệnh Cung có can = Giáp, đồng thời có Liêm Trinh trong Mệnh Cung
// → Mệnh Cung tự hóa Liêm Trinh (Hóa Lộc)
```

### 6.5 Cung Lai Duyên

```typescript
// Tìm cung nào "bay" ra hóa sao → cung đó có duyên với cung gốc

function findIncomingPalaces(chart: ZiweiChart, starName: string, sihua: SiHuaKey): Palace[] {
  // Bước 1: Tìm cung nào có can hóa ra starName
  // Bước 2: Tìm cung nào có starName nằm trong đó
  // Bước 3: Trả về cung có starName nhưng KHÔNG phải cung gốc
  const result: Palace[] = [];

  for (const palace of chart.palaces) {
    const transforms = getSiHuaByStem(palace.stem);
    const transformedStar = transforms[sihua];

    if (transformedStar === starName) {
      // Cung này có can hóa ra starName
      const targetPalace = chart.palaces.find(p =>
        p.stars.some(s => s.name === starName) && p.branch !== palace.branch
      );
      if (targetPalace) result.push(targetPalace);
    }
  }

  return result;
}
```

### 6.6 Thuật toán Ngũ Hổ Độn (xác định can tháng)

```typescript
// Ngũ Hổ Độn: Xác định can tháng dựa trên can năm
// Năm Giáp/Ất → tháng Giáp; Năm Bính/Đinh → tháng Bính...
// Năm Mậu/Kỷ → tháng Mậu; Năm Canh/Tân → tháng Canh; Năm Nhâm/Quý → tháng Nhâm

const WUHU_DUN: number[] = [0, 0, 2, 2, 4, 4, 6, 6, 8, 8];
// Index = can năm (0-9), giá trị = can tháng (0=Giáp, 2=Bính, 4=Mậu, 6=Canh, 8=Nhâm)

function getLiuYueStemIndex(yearStem: number, month: number): number {
  const baseStem = WUHU_DUN[yearStem % 10];
  // Tháng 1 = tháng Dần, đếm từ Dần
  // Tháng Giáp (base) = tháng Dần (month 1)
  const offset = (month - 1) % 12; // offset trong 12 tháng
  // Can tăng 2 mỗi tháng (theo ngũ hành)
  return (baseStem + offset * 2) % 10;
}

// Ví dụ: Năm Giáp (0) + Tháng 3 (month=3 → Dần+2=Thìn)
// → 5 tháng từ tháng Dần(1): Dần(1), Mão(2), Thìn(3), Tỵ(4), Ngọ(5)
// → offset = 2 (3-1)
// → baseStem = 0 (Giáp)
// → stemIndex = (0 + 2*2) % 10 = 4 (Mậu)
// → Tháng 3 âm lịch năm Giáp = tháng Mậu
```

### 6.7 Xác định can năm (Định Kỷ)

```typescript
// Can năm = f(năm dương lịch)
// Bảng tra cứu: năm % 10 → stemIndex

const YEAR_STEM_CYCLE = [
  6, 7, 8, 9, 0, 1, 2, 3, 4, 5,
  // 1984=Giáp Tý, 1985=Ất Sửu, 1986=Bính Dần, 1987=Đinh Mão, 1988=Mậu Thìn,
  // 1989=Kỷ Tỵ, 1990=Canh Ngọ, 1991=Tân Mùi, 1992=Nhâm Thân, 1993=Quý Dậu,
];
// 1994=Giáp Tuất(0), 1995=Ất Hợi(1)...

function getYearStemIndex(year: number): number {
  return year % 10; // nhưng cần offset vì 1984%10=4, 1984=Giáp Tý(0)
  // Thực ra: 1984%10=4, cycle[1984-1984]=0... vậy:
}

// Công thức chính xác:
function getYearStemIndex(year: number): number {
  return (year - 4) % 10 < 0 ? (year - 4) % 10 + 10 : (year - 4) % 10;
}
// 1984 → (1984-4)%10 = 0 → Giáp ✓
// 1990 → (1990-4)%10 = 6 → Canh ✓
// 2024 → (2024-4)%10 = 0 → Giáp ✓
```

### 6.8 Xác định chi năm (Địa Chi)

```typescript
// Chi năm = f(năm dương lịch)
// Năm 1984 = Tý, cứ thế đếm 1 năm +1

const YEAR_BRANCH_CYCLE = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  // Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi
];

function getYearBranchIndex(year: number): number {
  return (year - 4) % 12 < 0 ? (year - 4) % 12 + 12 : (year - 4) % 12;
}
// 2024 → (2024-4)%12 = 8 → Thân ✓
// 1984 → (1984-4)%12 = 0 → Tý ✓
```

---

## 7. Thuật toán nhận diện cục diện

### 7.1 Cấu trúc Pattern

```typescript
interface PatternCondition {
  required: string[];   // Điều kiện BẮT BUỘC — đã thỏa mãn
  bonus?: string[];     // Điều kiện CỘNG ĐIỂM — đã trigger
  breaking?: string[];  // Điều kiện PHÁ CỤC — đã trigger
}

interface Pattern {
  name: string;                    // Tên cục diện
  level: 'excellent' | 'good' | 'neutral' | 'caution'; // Cấp
  description: string;             // Mô tả luận giải
  palaces: string[];               // Các cung liên quan
  conditions?: PatternCondition;
  source?: string;                 // Kinh điển nguồn
}
```

### 7.2 Thuật toán tam phương tứ chính

```typescript
// Tam phương = Mệnh Cung + thuận 4 + thuận 8
// Tứ chính = thêm đối cung (thuận 6)
// Quy tắc: thuận theo chiều kim đồng hồ trong 12 cung

function getSanFangSet(chart: ZiweiChart): Set<string> {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12];
  const stars = new Set<string>();

  for (const palace of chart.palaces) {
    if (branches.includes(palace.branch)) {
      for (const star of palace.stars) {
        stars.add(star.name);
      }
    }
  }
  return stars;
}

function isInSanFang(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12].includes(branch);
}

function isInSiZheng(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12].includes(branch);
}
```

### 7.3 Quy tắc phân cấp level

```typescript
function evaluatePatternLevel(
  baseLevel: Pattern['level'],
  bonus: string[] = [],
  breaking: string[] = []
): Pattern['level'] {
  // Phá cục → giảm 1 bậc
  if (breaking.length > 0) {
    if (baseLevel === 'excellent') return 'good';
    if (baseLevel === 'good') return 'neutral';
    return 'caution';
  }

  // Có bonus → tăng 1 bậc
  if (bonus.length > 0) {
    if (baseLevel === 'good') return 'excellent';
  }

  return baseLevel;
}
```

### 7.4 Hằng số sát tinh

```typescript
const SHA_HARD = ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh']; // Tứ sát
const SHA_KONG = ['Địa Không','Địa Kiếp'];                       // Không kiếp
const SHA_ALL = ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh',
                 'Địa Không','Địa Kiếp','Thiên Không','Tuần Không',
                 'Kiết Lộ','Đại Hao','Thiên Sứ','Thiên Thương'];

function shaCountInPalace(palace: Palace, list: string[] = SHA_ALL): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}

function shaCountInSanFang(chart: ZiweiChart, list: string[] = SHA_HARD): number {
  const set = getSanFangSet(chart);
  return list.filter(name => set.has(name)).length;
}
```

### 7.5 Chi tiết 30+ cục diện

#### Thượng cấp (excellent / good)

```typescript
// ──────────────────────────────────────────────────────────────
// 1. QUÂN THẦN KHÁNH HỘI
// Điều kiện: Tử Vi nhập mệnh + Tả Hữu đồng thời tam phương
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectJunChenQingHui(chart, ming, patterns) {
  const sanFang = getSanFangSet(chart);

  const hasTuVi = ming.stars.some(s => s.name === 'Tử Vi');
  const hasTaHu = sanFang.has('Tả Hữu');

  if (!hasTuVi || !hasTaHu) return;

  const bonus = [];
  const breaking = [];

  if (sanFang.has('Xương Khúc')) bonus.push('Xương Khúc đồng thời');
  if (sanFang.has('Lộc Tồn')) bonus.push('Lộc Tồn đồng thời');
  if (sanFang.has('Hóa Lộc') || sanFang.has('Hóa Quyền'))
    bonus.push('Hóa Lộc/Quyền tam phương');

  if (shaCountInSanFang(chart, SHA_HARD) >= 3)
    breaking.push('Tam sát tụ hội tam phương');

  const level = evaluatePatternLevel('excellent', bonus, breaking);

  patterns.push({
    name: 'Quân Thần Khánh Hội',
    level,
    description: level === 'excellent'
      ? 'Tử Vi nhập mệnh, Tả Hữu đồng thời tam phương — quân thần gặp nhau, đại cát. Nếu có Xương Khúc, Lộc Tồn bổ trợ thì công danh hiển đạt, địa vị cao quý.'
      : 'Quân thần khánh hội nhưng tam sát can thiệp, cần thận trọng trong quyết định.',
    palaces: ['Mệnh', 'Tài Bạch', 'Quan Lộc'],
    conditions: {
      required: ['Tử Vi nhập Mệnh Cung', 'Tả Hữu tam phương'],
      bonus,
      breaking,
    },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 2. TỬ PHỦ ĐỒNG CUNG
// Điều kiện: Tử Vi + Thiên Phủ cùng cung (Dần hoặc Thân)
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectZiFu(chart, ming, patterns) {
  const tuViInMing = ming.stars.some(s => s.name === 'Tử Vi');
  const thiPhuInMing = ming.stars.some(s => s.name === 'Thiên Phủ');

  if (!tuViInMing || !thiPhuInMing) return;
  if (ming.branch !== 2 && ming.branch !== 8) return; // Dần hoặc Thân

  patterns.push({
    name: 'Tử Phủ Đồng Cung',
    level: ming.branch === 2 ? 'excellent' : 'good',
    description: 'Tử Vi (Đế tinh) cùng Thiên Phủ (Tài khố) đồng cung — vừa có quyền vừa có tiền. Dần: năng động, khởi nghiệp sớm. Thân: ổn định, tích lũy.',
    palaces: ['Mệnh Cung'],
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 3. PHỦ TƯỚNG TRIÊU VIÊN
// Điều kiện: Thiên Phủ + Thiên Tướng phân thủ tam phương tứ chính
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectFuXiangChaoYuan(chart, ming, patterns) {
  const phuBranch = chart.palaces.find(p => p.stars.some(s => s.name === 'Thiên Phủ'))?.branch;
  const tuongBranch = chart.palaces.find(p => p.stars.some(s => s.name === 'Thiên Tướng'))?.branch;

  if (phuBranch === undefined || tuongBranch === undefined) return;

  const m = chart.mingGongBranch;
  const sanFang = [m, (m+4)%12, (m+8)%12, (m+6)%12];

  const inSanFangPhu = sanFang.includes(phuBranch);
  const inSanFangTuong = sanFang.includes(tuongBranch);

  if (!inSanFangPhu || !inSanFangTuong) return;
  if (phuBranch === tuongBranch) return; // Không cùng cung

  patterns.push({
    name: 'Phủ Tướng Triều Viên',
    level: 'good',
    description: 'Thiên Phủ và Thiên Tướng phân thủ tam phương tứ chính — phụ tá đắc lực, hành chính ổn trọng, thích công chức, tích lũy dần dà.',
    palaces: ['Thiên Phủ cung', 'Thiên Tướng cung'],
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 4. DƯƠNG LƯƠNG XƯƠNG LỘC
// Điều kiện: Thái Dương + Thiên Lương + Văn Xương + Lộc Tồn tam phương
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectYangLiangChangLu(chart, ming, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Thái Dương','Thiên Lương','Văn Xương','Lộc Tồn'];
  const hasAll = required.every(name => sanFang.has(name));

  if (!hasAll) return;

  patterns.push({
    name: 'Dương Lương Xương Lộc',
    level: 'excellent',
    description: 'Bốn sao tinh túy đồng tam phương — khoa cừ tinh, văn chương lập quốc, học thuật kiến thiết, tiếng tăm vang dội.',
    palaces: ['Tam phương'],
    conditions: { required: ['Bốn tinh đồng tam phương'] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 5. HỎA THAM / LINH THAM
// Điều kiện: Tham Lang + Hỏa Tinh cùng cung hoặc tam phương
//             Tham Lang + Linh Tinh cùng cung hoặc tam phương
// Nguồn: Tủy Cốt Phú
// ──────────────────────────────────────────────────────────────
function detectHuoTanLingTan(chart, ming, patterns) {
  const huoThamPalace = chart.palaces.find(p =>
    p.stars.some(s => s.name === 'Tham Lang') &&
    p.stars.some(s => s.name === 'Hỏa Tinh')
  );
  const lingThamPalace = chart.palaces.find(p =>
    p.stars.some(s => s.name === 'Tham Lang') &&
    p.stars.some(s => s.name === 'Linh Tinh')
  );

  const bonus: string[] = [];
  const breaking: string[] = [];

  if (huoThamPalace) {
    patterns.push({
      name: 'Hỏa Tham Cục',
      level: 'good',
      description: 'Tham Lang ngộ Hỏa Tinh — "tất phát hoành tài", bất ngờ phát tài, nhưng duyên cơ tài bất ổn, cần cảnh giác.',
      palaces: [huoThamPalace.name],
      conditions: { required: ['Tham Lang + Hỏa Tinh cùng cung'], bonus, breaking },
      source: '《Tủy Cốt Phú》',
    });
  }

  if (lingThamPalace) {
    patterns.push({
      name: 'Linh Tham Cục',
      level: 'good',
      description: 'Tham Lang ngộ Linh Tinh — thiên ngoại hoành tài, đầu tư bất động sản hoặc khởi nghiệp, gặp quý nhân lớn.',
      palaces: [lingThamPalace.name],
      conditions: { required: ['Tham Lang + Linh Tinh cùng cung'], bonus, breaking },
      source: '《Tủy Cốt Phú》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 6. VŨ THAM
// Điều kiện: Vũ Khúc + Tham Lang cùng cung (Sửu hoặc Mùi) hoặc đối cung
// Nguồn: Tủy Cốt Phú
// ──────────────────────────────────────────────────────────────
function detectWuTan(chart, ming, patterns) {
  const pal = chart.palaces.find(p =>
    p.stars.some(s => s.name === 'Vũ Khúc') &&
    p.stars.some(s => s.name === 'Tham Lang')
  );

  if (!pal) return;
  if (pal.branch !== 1 && pal.branch !== 7) return; // Sửu hoặc Mùi

  patterns.push({
    name: 'Vũ Tham Cục',
    level: 'good',
    description: 'Vũ Khúc cùng Tham Lang tại Sửu hoặc Mùi — tham lam tài vật, quyết đoán nhưng thiếu đoàn kết, dễ cãi vã.',
    palaces: [pal.name],
    source: '《Tủy Cốt Phú》',
  });
}

// ──────────────────────────────────────────────────────────────
// 7. SÁT PHÁ LANG
// Điều kiện: Thất Sát + Phá Quân + Tham Lang tam phương tứ chính
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectShaPoLang(chart, ming, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Thất Sát','Phá Quân','Tham Lang'];
  const hasAll = required.every(name => sanFang.has(name));

  if (!hasAll) return;

  const bonus: string[] = [];
  const breaking: string[] = [];

  if (sanFang.has('Hóa Lộc') || sanFang.has('Hóa Quyền'))
    bonus.push('Tam phương hữu Hóa Lộc hoặc Hóa Quyền (động năng lực)');
  if (sanFang.has('Tả Hữu') && sanFang.has('Hữu Hữu'))
    bonus.push('Phụ Tịch đồng thời (biến động trung hữu quý nhân)');

  if (shaCountInSanFang(chart, SHA_HARD) >= 3)
    breaking.push('Sát tinh quá nhiều (động vô thành)');
  if (ming.stars.some(s => SHA_KONG.includes(s.name)))
    breaking.push('Mệnh tọa không kiếp (động khổ sở)');

  const level = evaluatePatternLevel('good', bonus, breaking);

  patterns.push({
    name: 'Sát Phá Lang',
    level,
    description: 'Tam sát đồng hội mệnh — sáng tạo khởi phá. Một đời biến động nhiều, không cam tâm phổ thông, thích khởi nghiệp, quân cảnh, kinh doanh. Trẻ dễ thất bại, trung niên mới ổn định.',
    palaces: ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Diên Niên'],
    conditions: { required: ['Thất Sát, Phá Quân, Tham Lang tam phương'], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 8. CƠ NGUYỆT ĐỒNG LƯƠNG
// Điều kiện: Thiên Cơ + Thái Âm + Thiên Đồng + Thiên Lương 4★ tam phương
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectJiYueTongLiang(chart, ming, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Thiên Cơ','Thái Âm','Thiên Đồng','Thiên Lương'];
  const hasAll = required.every(name => sanFang.has(name));

  if (!hasAll) return;

  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương',
    level: 'excellent',
    description: 'Bốn tinh đồng tam phương — tư duy linh hoạt, công việc ổn định, thích công chức, hành chính, tích lũy dần dà.',
    palaces: ['Tam phương'],
    conditions: { required: ['Bốn tinh đồng tam phương'] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 9. SONG LỘC TRIÊU VIÊN
// Điều kiện: Hóa Lộc + Lộc Tồn tam phương đồng thời
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectSongLocChaoYuan(chart, ming, patterns) {
  const sanFang = getSanFangSet(chart);
  const hasHoaLoc = sanFang.has('Hóa Lộc');
  const hasLocTon = sanFang.has('Lộc Tồn');

  if (!hasHoaLoc || !hasLocTon) return;

  patterns.push({
    name: 'Song Lộc Triều Viên',
    level: 'excellent',
    description: 'Hóa Lộc gặp Lộc Tồn tam phương — "phú bằng Đào Chu", giàu có về tài lộc, cơ hội tài chính lớn, tự thân vận dụng năng lực kiếm tiền.',
    palaces: ['Tam phương'],
    conditions: { required: ['Hóa Lộc + Lộc Tồn tam phương'] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 10. TAM KỲ GIA HỘI
// Điều kiện: Hóa Lộc + Hóa Quyền + Hóa Khoa tam phương đồng thời
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectTamKyGiaHoi(chart, ming, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Hóa Lộc','Hóa Quyền','Hóa Khoa'];
  const hasAll = required.every(name => sanFang.has(name));

  if (!hasAll) return;

  patterns.push({
    name: 'Tam Kỳ Gia Hội',
    level: 'excellent',
    description: 'Tam kỳ đồng hội tam phương — danh lợi quyền đủ, học hành đỗ đạt, làm quan lớn, tiền tài tự đến, quý nhân nhiều.',
    palaces: ['Tam phương'],
    conditions: { required: ['Hóa Lộc + Hóa Quyền + Hóa Khoa tam phương'] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}
```

#### Trung cấp (good / neutral)

```typescript
// ──────────────────────────────────────────────────────────────
// 11. LIÊM TRINH THIÊN TƯỚNG — Liêm Trinh + Thiên Tướng cùng cung
// ──────────────────────────────────────────────────────────────
function detectLianXiang(chart, patterns) {
  const lianPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Liêm Trinh'));
  const tuongPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thiên Tướng'));
  if (!lianPalace || !tuongPalace || lianPalace.branch !== tuongPalace.branch) return;
  const inMing = lianPalace.branch === chart.mingGongBranch;
  const bonus = [];
  const breaking = [];
  if (lianPalace.stars.some(s => s.name === 'Lộc Tồn') || getStarSiHua(lianPalace, 'Liêm Trinh') === 'Lộc')
    bonus.push('Có Lộc Tồn hoặc Liêm Trinh hóa Lộc');
  if (sanFangAllStars(chart).has('Tả Hữu')) bonus.push('Tả Hữu đồng thời');
  if (lianPalace.stars.some(s => s.name === 'Tịnh Dương')) breaking.push('Liêm Tướng có Tịnh Dương');
  if (getStarSiHua(lianPalace, 'Liêm Trinh') === 'Kị') breaking.push('Liêm Trinh hóa Kị');
  patterns.push({
    name: 'Liêm Trinh Thiên Tướng',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: 'Liêm Trinh cùng Thiên Tướng đồng cung — chính trực, tài giỏi. Tại Mệnh → tài năng, quyền uy.',
    palaces: [lianPalace.name],
    conditions: { required: ['Liêm Trinh + Thiên Tướng cùng cung'], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 12. VŨ QUÝ THẤT SÁT — Vũ Khúc + Thất Sát cùng cung
// ──────────────────────────────────────────────────────────────
function detectWuQiSha(chart, patterns) {
  const wuPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Vũ Khúc'));
  const qiPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thất Sát'));
  if (!wuPalace || !qiPalace || wuPalace.branch !== qiPalace.branch) return;
  const inMing = wuPalace.branch === chart.mingGongBranch;
  const bonus = [];
  const breaking = [];
  if (getStarSiHua(wuPalace, 'Vũ Khúc') === 'Quyền') bonus.push('Vũ Khúc hóa Quyền');
  if (getStarSiHua(wuPalace, 'Vũ Khúc') === 'Kị') breaking.push('Vũ Khúc hóa Kị');
  if (wuPalace.stars.some(s => ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh'].includes(s.name)))
    breaking.push('Cung có nhiều sát tinh');
  patterns.push({
    name: 'Vũ Quý Thất Sát',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: 'Vũ Khúc + Thất Sát đồng cung — quyết đoán, dũng cảm. Tại Mệnh → can trạch, quân sự, tài chính.',
    palaces: [wuPalace.name],
    conditions: { required: ['Vũ Khúc + Thất Sát cùng cung'], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 13. THIÊN ĐỒNG THIÊN LƯƠNG — Thiên Đồng + Thiên Lương cùng cung
// ──────────────────────────────────────────────────────────────
function detectTongLiang(chart, patterns) {
  const tongPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thiên Đồng'));
  const liangPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thiên Lương'));
  if (!tongPalace || !liangPalace || tongPalace.branch !== liangPalace.branch) return;
  const bonus = [];
  const breaking = [];
  if (sanFangAllStars(chart).has('Văn Xương')) bonus.push('Văn Xương đồng thời');
  if (getStarSiHua(tongPalace, 'Thiên Đồng') === 'Lộc') bonus.push('Thiên Đồng hóa Lộc');
  if (tongPalace.stars.some(s => ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh'].includes(s.name)))
    breaking.push('Cung có sát tinh');
  patterns.push({
    name: 'Thiên Đồng Thiên Lương',
    level: breaking.length ? 'neutral' : 'good',
    description: 'Thiên Đồng + Thiên Lương đồng cung — ôn hòa, hưởng lạc. Thích hợp công việc ổn định.',
    palaces: [tongPalace.name],
    conditions: { required: ['Thiên Đồng + Thiên Lương cùng cung'], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 14. NHẬT NGUYỆT ĐỒNG CUNG — Thái Dương + Thái Âm tại Sửu/Mùi
// ──────────────────────────────────────────────────────────────
function detectRiYueTongGong(chart, patterns) {
  const sunPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thái Dương'));
  const moonPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thái Âm'));
  if (!sunPalace || !moonPalace || sunPalace.branch !== moonPalace.branch) return;
  if (sunPalace.branch !== 1 && sunPalace.branch !== 7) return;
  const inMing = sunPalace.branch === chart.mingGongBranch;
  const bonus = [];
  const breaking = [];
  if (sunPalace.branch === 7) bonus.push('Mùi: nhật nguyệt đồng quang');
  if (sanFangAllStars(chart).has('Văn Xương') && sanFangAllStars(chart).has('Văn Khúc'))
    bonus.push('Văn Xương + Văn Khúc đồng thời');
  if (sunPalace.stars.some(s => ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh'].includes(s.name)))
    breaking.push('Cung có sát tinh');
  patterns.push({
    name: 'Nhật Nguyệt Đồng Cung',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: sunPalace.branch === 7
      ? 'Thái Dương + Thái Âm cùng tại Mùi — nhật nguyệt đồng quang, danh lợi song toàn.'
      : 'Thái Dương + Thái Âm cùng tại Sửu — cân bằng âm dương, nội tâm phức tạp.',
    palaces: [sunPalace.name],
    conditions: { required: [`Thái Dương + Thái Âm tại ${sunPalace.branch === 7 ? 'Mùi' : 'Sửu'}`], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 15. NHẬT NGUYỆT GIÁP MỆNH — Thái Dương + Thái Âm giáp mệnh
// ──────────────────────────────────────────────────────────────
function detectRiYueJiaMing(chart, patterns) {
  const mingBranch = chart.mingGongBranch;
  const prevPalace = chart.palaces.find(p => p.branch === (mingBranch + 11) % 12);
  const nextPalace = chart.palaces.find(p => p.branch === (mingBranch + 1) % 12);
  if (!prevPalace || !nextPalace) return;
  const prevHasSun = prevPalace.stars.some(s => s.name === 'Thái Dương');
  const prevHasMoon = prevPalace.stars.some(s => s.name === 'Thái Âm');
  const nextHasSun = nextPalace.stars.some(s => s.name === 'Thái Dương');
  const nextHasMoon = nextPalace.stars.some(s => s.name === 'Thái Âm');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;
  const sunPalace = prevHasSun ? prevPalace : nextPalace;
  const moonPalace = prevHasMoon ? prevPalace : nextPalace;
  const bonus = [];
  const breaking = [];
  if (sunPalace.stars.find(s => s.name === 'Thái Dương')?.brightness === 'bright') bonus.push('Thái Dương miếu');
  if (moonPalace.stars.find(s => s.name === 'Thái Âm')?.brightness === 'bright') bonus.push('Thái Âm miếu');
  if (sunPalace.stars.find(s => s.name === 'Thái Dương')?.brightness === 'dim') breaking.push('Thái Dương hãm');
  patterns.push({
    name: 'Nhật Nguyệt Giáp Mệnh',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương + Thái Âm giáp Mệnh — quang minh lạc trí, quý nhân không đoạn.',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required: ['Thái Dương + Thái Âm giáp Mệnh'], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 16. CỰ MÔN NHẬT ĐỒNG CUNG — Cự Môn + Thái Dương tại Dần/Thân
// ──────────────────────────────────────────────────────────────
function detectJuRiTongGong(chart, patterns) {
  const juPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Cự Môn'));
  const sunPalace = chart.palaces.find(p => p.stars.some(s => s.name === 'Thái Dương'));
  if (!juPalace || !sunPalace || juPalace.branch !== sunPalace.branch) return;
  if (juPalace.branch !== 2 && juPalace.branch !== 8) return;
  const inMing = juPalace.branch === chart.mingGongBranch;
  const bonus = [];
  const breaking = [];
  if (juPalace.branch === 2) bonus.push('Dần: Thái Dương miếu, Cự Môn được giải');
  if (getStarSiHua(juPalace, 'Cự Môn') === 'Lộc' || getStarSiHua(juPalace, 'Cự Môn') === 'Quyền')
    bonus.push('Cự Môn hóa Lộc/Quyền (khẩu tài sinh tài)');
  if (getStarSiHua(juPalace, 'Cự Môn') === 'Kị') breaking.push('Cự Môn hóa Kị');
  if (juPalace.branch === 8) breaking.push('Thân: Thái Dương tà, Cự Môn ám');
  patterns.push({
    name: 'Cự Môn Nhật Đồng Cung',
    level: breaking.length ? 'caution' : (inMing && juPalace.branch === 2 ? 'excellent' : 'good'),
    description: `Cự Môn + Thái Dương cùng tại ${juPalace.branch === 2 ? 'Dần' : 'Thân'} — ${juPalace.branch === 2 ? 'Dần: khẩu tài lợi thế, truyền thông, luật sư.' : 'Thân: dễ tranh cãi, hiểu lầm.'}`,
    palaces: [juPalace.name],
    conditions: { required: [`Cự Môn + Thái Dương tại ${juPalace.branch === 2 ? 'Dần' : 'Thân'}`], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 17. THẠCH TRUNG ẨN NGỌC — Cự Môn nhập mệnh tại Tý/Ngọ
// ──────────────────────────────────────────────────────────────
function detectShiZhongYinYu(chart, ming, patterns) {
  if (!ming.stars.some(s => s.name === 'Cự Môn')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;
  const bonus = [];
  const breaking = [];
  if (getStarSiHua(ming, 'Cự Môn') === 'Lộc' || getStarSiHua(ming, 'Cự Môn') === 'Quyền')
    bonus.push('Cự Môn hóa Lộc/Quyền');
  if (sanFangAllStars(chart).has('Văn Xương')) bonus.push('Văn Xương đồng thời (ngọc được mở)');
  if (getStarSiHua(ming, 'Cự Môn') === 'Kị') breaking.push('Cự Môn hóa Kị (ngọc chìm bùn)');
  if (ming.stars.some(s => ['Tịnh Dương','Đà Lô','Hỏa Tinh','Linh Tinh'].includes(s.name)))
    breaking.push('Mệnh Cung có sát tinh');
  patterns.push({
    name: 'Thạch Trung Ẩn Ngọc',
    level: breaking.length ? 'caution' : 'excellent',
    description: 'Cự Môn tại Tý/Ngọ — bề ngoài bình thường nhưng nội chất tài hoa. Sớm âm thầm, trung niên mới tỏa sáng.',
    palaces: ['Mệnh Cung'],
    conditions: { required: [`Cự Môn tại ${ming.branch === 0 ? 'Tý' : 'Ngọ'}`], bonus, breaking },
    source: '《Tủy Cốt Phú·Thạch Trung Ẩn Ngọc》',
  });
}

// ──────────────────────────────────────────────────────────────
// 18. MINH CHÂU XUẤT HẢI — Mệnh tại Mùi là không cung, đối cung Sửu có Nhật Nguyệt
// ──────────────────────────────────────────────────────────────
function detectMingZhuChuHai(chart, ming, patterns) {
  if (ming.branch !== 7) return;
  const mainStars = ming.stars.filter(s => s.type === 'major');
  if (mainStars.length > 0) return;
  const duiPalace = chart.palaces.find(p => p.branch === 1);
  if (!duiPalace) return;
  const hasSun = duiPalace.stars.some(s => s.name === 'Thái Dương');
  const hasMoon = duiPalace.stars.some(s => s.name === 'Thái Âm');
  if (!hasSun || !hasMoon) return;
  const bonus = [];
  const breaking = [];
  if (sanFangAllStars(chart).has('Văn Xương') || sanFangAllStars(chart).has('Văn Khúc'))
    bonus.push('Văn Xương/Khúc đồng thời');
  if (sanFangShaCount(chart) >= 2) breaking.push('Sát tinh tam phương (ngọc tối)');
  patterns.push({
    name: 'Minh Châu Xuất Hải',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Mệnh tại Mùi là Không Cung, đối cung Sửu là Nhật Nguyệt — minh châu xuất hải. Từ bình thường vươn lên tầng lớp cao hơn.',
    palaces: ['Mệnh Cung (Mùi)', 'Sửu (đối cung)'],
    conditions: { required: ['Mệnh tại Mùi là Không Cung', 'Đối cung Sửu có Nhật Nguyệt'], bonus, breaking },
    source: '《Tử Vi Đấu Số Toàn Tập·Minh Châu Xuất Hải》',
  });
}

// ──────────────────────────────────────────────────────────────
// 19. PHỤ TỊCH GIÁP MỆNH — Tả Hữu giáp mệnh trước sau
// ──────────────────────────────────────────────────────────────
function detectFuBiJiaMing(chart, patterns) {
  const mingBranch = chart.mingGongBranch;
  const prevPalace = chart.palaces.find(p => p.branch === (mingBranch + 11) % 12);
  const nextPalace = chart.palaces.find(p => p.branch === (mingBranch + 1) % 12);
  if (!prevPalace || !nextPalace) return;
  const prevHasZuo = prevPalace.stars.some(s => s.name === 'Tả Hữu');
  const prevHasYou = prevPalace.stars.some(s => s.name === 'Hữu Hữu');
  const nextHasZuo = nextPalace.stars.some(s => s.name === 'Tả Hữu');
  const nextHasYou = nextPalace.stars.some(s => s.name === 'Hữu Hữu');
  const ok = (prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo);
  if (!ok) return;
  patterns.push({
    name: 'Phụ Tịch Giáp Mệnh',
    level: 'excellent',
    description: 'Tả Hữu giáp Mệnh — quý nhân suốt đời, gặp hung hóa kiết. Cổ thư vân: "Tả Hữu Hữu Hữu, trung thân phúc hậu".',
    palaces: ['Mệnh Cung', prevPalace.name, nextPalace.name],
    conditions: { required: ['Tả Hữu giáp Mệnh'] },
    source: '《Tử Vi Đấu Số Toàn Thư·Phụ Tịch Giáp Mệnh》',
  });
}

// ──────────────────────────────────────────────────────────────
// 20. XƯƠNG KHÚC GIÁP MỆNH — Văn Xương + Văn Khúc giáp mệnh
// ──────────────────────────────────────────────────────────────
function detectChangQuJiaMing(chart, patterns) {
  const mingBranch = chart.mingGongBranch;
  const prevPalace = chart.palaces.find(p => p.branch === (mingBranch + 11) % 12);
  const nextPalace = chart.palaces.find(p => p.branch === (mingBranch + 1) % 12);
  if (!prevPalace || !nextPalace) return;
  const prevHasChang = prevPalace.stars.some(s => s.name === 'Văn Xương');
  const prevHasQu = prevPalace.stars.some(s => s.name === 'Văn Khúc');
  const nextHasChang = nextPalace.stars.some(s => s.name === 'Văn Xương');
  const nextHasQu = nextPalace.stars.some(s => s.name === 'Văn Khúc');
  const ok = (prevHasChang && nextHasQu) || (prevHasQu && nextHasChang);
  if (!ok) return;
  patterns.push({
    name: 'Xương Khúc Giáp Mệnh',
    level: 'excellent',
    description: 'Văn Xương + Văn Khúc giáp Mệnh — thông minh tuấn tú, văn chương kiệt xuất. Cổ thư vân: "Văn Xương giáp mệnh chủ khoa giáp".',
    palaces: ['Mệnh Cung', prevPalace.name, nextPalace.name],
    conditions: { required: ['Văn Xương + Văn Khúc giáp Mệnh'] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 21. KHÔI VŨ GIÁP MỆNH — Thiên Khoái + Thiên Vũ giáp mệnh
// ──────────────────────────────────────────────────────────────
function detectKuiYueJiaMing(chart, patterns) {
  const mingBranch = chart.mingGongBranch;
  const prevPalace = chart.palaces.find(p => p.branch === (mingBranch + 11) % 12);
  const nextPalace = chart.palaces.find(p => p.branch === (mingBranch + 1) % 12);
  if (!prevPalace || !nextPalace) return;
  const okA = prevPalace.stars.some(s => s.name === 'Thiên Khoái') && nextPalace.stars.some(s => s.name === 'Thiên Vũ');
  const okB = prevPalace.stars.some(s => s.name === 'Thiên Vũ') && nextPalace.stars.some(s => s.name === 'Thiên Khoái');
  if (!okA && !okB) return;
  patterns.push({
    name: 'Khôi Vũ Giáp Mệnh',
    level: 'good',
    description: 'Thiên Khoái + Thiên Vũ giáp Mệnh — quý nhân thi cử, gặp may trong thăng tiến.',
    palaces: ['Mệnh Cung', prevPalace.name, nextPalace.name],
    conditions: { required: ['Thiên Khoái + Thiên Vũ giáp Mệnh'] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}

// ──────────────────────────────────────────────────────────────
// 22. SONG LỘC TRIỀU VIÊN — Hóa Lộc + Lộc Tồn tam phương
// ──────────────────────────────────────────────────────────────
function detectShuangLuChaoYuan(chart, ming, patterns) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false, luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === 'Lộc')) huaLuFound = true;
    if (p.stars.some(s => s.name === 'Lộc Tồn')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;
  const breaking = ming.stars.some(s => s.name === 'Địa Không' || s.name === 'Địa Kiếp')
    ? ['Mệnh có Địa Không/Địa Kiếp (lộc hao tán)'] : [];
  patterns.push({
    name: 'Song Lộc Triều Viên',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Hóa Lộc + Lộc Tồn đồng thời tam phương — Cổ thư vân: "Song Lộc triều Viên, phú bằng Đào Chu". Tài vận dồi dào.',
    palaces: sanFang.map(p => p.name),
    conditions: { required: ['Hóa Lộc + Lộc Tồn tam phương'], breaking },
    source: '《Tử Vi Đấu Số Toàn Thư·Song Lộc Triều Viên》',
  });
}

// ──────────────────────────────────────────────────────────────
// 23. TAM KỲ GIA HỘI — Hóa Lộc + Hóa Quyền + Hóa Khoa tam phương
// ──────────────────────────────────────────────────────────────
function detectSanQiJiaHui(chart, patterns) {
  const sanFang = getSanFangPalaces(chart);
  let lu = false, quan = false, ke = false;
  for (const p of sanFang) {
    for (const s of p.stars) {
      if (s.siHua === 'Lộc') lu = true;
      if (s.siHua === 'Quyền') quan = true;
      if (s.siHua === 'Khoa') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;
  patterns.push({
    name: 'Tam Kỳ Gia Hội',
    level: 'excellent',
    description: 'Hóa Lộc + Hóa Quyền + Hóa Khoa đồng thời tam phương — cực phú quý, danh lợi quyền đủ. Top cục diện trong Tử Vi.',
    palaces: sanFang.map(p => p.name),
    conditions: { required: ['Hóa Lộc + Hóa Quyền + Hóa Khoa tam phương'] },
    source: '《Tử Vi Đấu Số Toàn Thư·Tam Kỳ Gia Hội》',
  });
}

// ──────────────────────────────────────────────────────────────
// 24. HÓA LỘC NHẬP MỆNH — Sao có Hóa Lộc nhập Mệnh Cung
// ──────────────────────────────────────────────────────────────
function detectHuaLuRuMing(chart, ming, patterns) {
  const huaLuStar = ming.stars.find(s => s.siHua === 'Lộc' && s.type === 'major');
  if (!huaLuStar) return;
  patterns.push({
    name: `${huaLuStar.name} Hóa Lộc Nhập Mệnh`,
    level: 'good',
    description: `${huaLuStar.name} hóa Lộc tại Mệnh — tài vận tốt, cơ hội đến nhiều.`,
    palaces: ['Mệnh Cung'],
    conditions: { required: [`${huaLuStar.name} hóa Lộc tại Mệnh`] },
    source: '《Tử Vi Đấu Số Toàn Thư》',
  });
}
```

#### Ác cấp (caution)

```typescript
// ──────────────────────────────────────────────────────────────
// 22. HOÁ KỊ NHẬP MỆNH/DIÊN
// Điều kiện: Hóa Kị tọa mệnh hoặc nhập Diên Niên
// ──────────────────────────────────────────────────────────────
function detectHuaJiRuMingDien(chart, patterns) {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const dienPalace = chart.palaces.find(p => p.branch === (chart.mingGongBranch + 6) % 12);

  const banMenh = getBanMenhSiHua(chart);
  const hokiInMing = mingPalace!.stars.some(s => s.name === banMenh['Kị']);
  const hokiInDien = dienPalace!.stars.some(s => s.name === banMenh['Kị']);

  if (hokiInMing || hokiInDien) {
    patterns.push({
      name: 'Hóa Kị Nhập Mệnh/Diên',
      level: 'caution',
      description: 'Hóa Kị tọa mệnh hoặc nhập Diên Niên — cần lưu ý trở ngại, thử thách bất ngờ, bài học sâu sắc. Nhưng "kị" cũng là động lực thay đổi.',
      palaces: hokiInMing ? ['Mệnh Cung'] : ['Diên Niên Cung'],
      source: '《Tử Vi Đấu Số Toàn Thư》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 23. DƯƠNG ĐÀ GIÁP KỊ
// Điều kiện: Dương Đà phân cư mệnh trước sau + Hóa Kị tọa mệnh
// Nguồn: Tủy Cốt Phú
// ──────────────────────────────────────────────────────────────
function detectYangTuoJiaJi(chart, patterns) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch)!;
  const prev = chart.palaces.find(p => p.branch === (chart.mingGongBranch + 11) % 12);
  const next = chart.palaces.find(p => p.branch === (chart.mingGongBranch + 1) % 12);

  const hasYangTuo = (s: any) => s && s.stars.some((st: any) => st.name === 'Dương Đà');

  if ((hasYangTuo(prev) || hasYangTuo(next)) &&
      ming.stars.some(s => s.name === 'Hóa Kị')) {
    patterns.push({
      name: 'Dương Đà Giáp Kị',
      level: 'caution',
      description: 'Dương Đà giáp Mệnh + Hóa Kị tọa — theo Tủy Cốt Phú: "hung đại", tai ương bất ngờ, cần đề phòng.',
      palaces: ['Mệnh Cung', 'Tiền/Hậu cung'],
      source: '《Tủy Cốt Phú》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 24. HỎA LINH GIÁP MỆNH
// Điều kiện: Hỏa Tinh Linh Tinh phân cư mệnh trước sau
// ──────────────────────────────────────────────────────────────
function detectHuoLingJiaMing(chart, patterns) {
  const mingBranch = chart.mingGongBranch;
  const prev = chart.palaces.find(p => p.branch === (mingBranch + 11) % 12);
  const next = chart.palaces.find(p => p.branch === (mingBranch + 1) % 12);

  const hasHuo = (pal: any) => pal && pal.stars.some((s: any) => s.name === 'Hỏa Tinh');
  const hasLing = (pal: any) => pal && pal.stars.some((s: any) => s.name === 'Linh Tinh');

  if ((hasHuo(prev) && hasLing(next)) || (hasLing(prev) && hasHuo(next))) {
    patterns.push({
      name: 'Hỏa Linh Giáp Mệnh',
      level: 'caution',
      description: 'Hỏa Tinh và Linh Tinh giáp Mệnh — nóng nảy, xung đột, dễ gặp tai nạn bất ngờ.',
      palaces: ['Tiền/Hậu cung'],
      source: '《Tử Vi Đấu Số Toàn Thư》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 25. KHÔNG KIẾP GIÁP MỆNH
// Điều kiện: Địa Không Địa Kiếp phân cư mệnh trước sau
// ──────────────────────────────────────────────────────────────
function detectKongJieJiaMing(chart, patterns) {
  const mingBranch = chart.mingGongBranch;
  const prev = chart.palaces.find(p => p.branch === (mingBranch + 11) % 12);
  const next = chart.palaces.find(p => p.branch === (mingBranch + 1) % 12);

  const hasKong = (pal: any) => pal && pal.stars.some((s: any) => s.name === 'Địa Không' || s.name === 'Địa Kiếp');

  if (hasKong(prev) && hasKong(next)) {
    patterns.push({
      name: 'Không Kiếp Giáp Mệnh',
      level: 'caution',
      description: 'Địa Không và Địa Kiếp giáp Mệnh — vô thường, nhiều biến động, tài vận hao tán, khó tích lũy.',
      palaces: ['Tiền/Hậu cung'],
      source: '《Tử Vi Đấu Số Toàn Thư》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 26. LIÊM SÁT DƯƠNG
// Điều kiện: Liêm Trinh + Thất Sát + Dương Đà tam phương
// Nguồn: Toàn Thư
// ──────────────────────────────────────────────────────────────
function detectLianShaYang(chart, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Liêm Trinh','Thất Sát','Dương Đà'];
  const hasAll = required.every(name => sanFang.has(name));

  if (hasAll) {
    patterns.push({
      name: 'Liêm Sát Dương',
      level: 'caution',
      description: 'Ba hung tinh tam phương — nguy cơ đổ máu, thương tích, tai nạn. Cần cẩn trọng trong giao thông, xung đột.',
      palaces: ['Tam phương'],
      source: '《Tử Vi Đấu Số Toàn Thư》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 27. CỰ HỎA DƯƠNG
// Điều kiện: Cự Môn + Hỏa Tinh + Dương Đà tam phương
// Nguồn: Tủy Cốt Phú
// ──────────────────────────────────────────────────────────────
function detectCuHuoYang(chart, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Cự Môn','Hỏa Tinh','Dương Đà'];
  const hasAll = required.every(name => sanFang.has(name));

  if (hasAll) {
    patterns.push({
      name: 'Cự Hỏa Dương',
      level: 'caution',
      description: 'Cự Môn Hỏa Tinh Dương Đà tam phương — Tủy Cốt Phú: "thường dục tử", nguy hiểm, cần tránh xung đột.',
      palaces: ['Tam phương'],
      source: '《Tủy Cốt Phú》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 28. LINH XƯƠNG ĐÀ VÕ
// Điều kiện: Linh Tinh + Văn Xương + Đà Lô + Vũ Khúc tam phương
// Nguồn: Tủy Cốt Phú
// ──────────────────────────────────────────────────────────────
function detectLingXuongDaVo(chart, patterns) {
  const sanFang = getSanFangSet(chart);
  const required = ['Linh Tinh','Văn Xương','Đà Lô','Vũ Khúc'];
  const hasAll = required.every(name => sanFang.has(name));

  if (hasAll) {
    patterns.push({
      name: 'Linh Xương Đà Võ',
      level: 'caution',
      description: 'Bốn sao hỗn tạp tam phương — Tủy Cốt Phú: "hạn chí đầu hà", khởi đầu khó khăn, cần kiên trì.',
      palaces: ['Tam phương'],
      source: '《Tủy Cốt Phú》',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 29. MÃ ĐẦU ĐỚI TIỄN
// Điều kiện: Dương Đà tọa mệnh cung Ngọ
// Nguồn: Tủy Cốt Phú
// ──────────────────────────────────────────────────────────────
function detectMaDauDoiTien(chart, patterns) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch)!;

  if (ming.branch === 6 && ming.stars.some(s => s.name === 'Dương Đà')) { // Ngọ
    patterns.push({
      name: 'Mã Đầu Đới Tiễn',
      level: 'caution',
      description: 'Dương Đà tọa Mệnh tại Ngọ — chạy ngang không ngừng, khó ổn định, xa cách gia đình.',
      palaces: ['Mệnh Cung (Ngọ)'],
      source: '《Tủy Cốt Phú》',
    });
  }
}
```

### 7.6 Hàm tổng hợp nhận diện cục diện

```typescript
function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch)!;

  // Thượng cấp
  detectJunChenQingHui(chart, ming, patterns);
  detectZiFu(chart, ming, patterns);
  detectFuXiangChaoYuan(chart, ming, patterns);
  detectYangLiangChangLu(chart, ming, patterns);
  detectHuoTanLingTan(chart, ming, patterns);
  detectWuTan(chart, ming, patterns);
  detectShaPoLang(chart, ming, patterns);
  detectJiYueTongLiang(chart, ming, patterns);
  detectSongLocChaoYuan(chart, ming, patterns);
  detectTamKyGiaHoi(chart, ming, patterns);

  // Trung cấp
  detectRiYueTongCung(chart, ming, patterns);
  detectMinhChauXuatHai(chart, ming, patterns);
  // ... thêm các detector trung cấp khác

  // Ác cấp
  detectHuaJiRuMingDien(chart, patterns);
  detectYangTuoJiaJi(chart, patterns);
  detectHuoLingJiaMing(chart, patterns);
  detectKongJieJiaMing(chart, patterns);
  detectLianShaYang(chart, patterns);
  detectCuHuoYang(chart, patterns);
  detectLingXuongDaVo(chart, patterns);
  detectMaDauDoiTien(chart, patterns);

  return patterns;
}
```

---

## 8. Hệ thống đại hạn

### 8.1 Cấu trúc đại hạn

```typescript
interface DaXian {
  index: number;          // 0-11
  startAge: number;       // Tuổi bắt đầu
  endAge: number;         // Tuổi kết thúc
  palaceBranch: number;   // Cung đặt đại hạn (0-11)
  palaceName: string;      // Tên cung
  stemIndex?: number;     // Cung can (dùng cho đại hạn tứ hoá)
  stemName?: string;
  siHua?: Record<SiHuaKey, string>; // Tứ Hóa đại hạn
}
```

### 8.2 Thuật toán xác định đại hạn

```typescript
// Đại hạn bắt đầu từ cung Thân (đối cung Mệnh)
// Đếm thuận chiều kim đồng hồ từ Thân → mỗi cung 10 năm

function getDaXians(chart: ZiweiChart): DaXian[] {
  const shenBranch = chart.shenGongBranch; // Thân Cung = điểm bắt đầu
  const daXians: DaXian[] = [];
  const mingStem = chart.lunarInfo.yearStem; // Can năm (ảnh hưởng tốc độ)

  for (let i = 0; i < 12; i++) {
    const palaceBranch = (shenBranch + i) % 12;
    const palace = chart.palaces[palaceBranch];
    const startAge = i * 10;
    const endAge = startAge + 9;

    daXians.push({
      index: i,
      startAge,
      endAge,
      palaceBranch,
      palaceName: palace.name,
      stemIndex: palace.stem,
      stemName: STEM_NAMES[palace.stem],
    });
  }

  return daXians;
}

function getCurrentDaXian(chart: ZiweiChart): DaXian | null {
  const age = chart.currentAge;
  return chart.daXians.find(dx => age >= dx.startAge && age <= dx.endAge) || null;
}

function getCurrentDaXianIndex(chart: ZiweiChart): number {
  const dx = getCurrentDaXian(chart);
  return dx ? dx.index : -1;
}
```

### 8.3 Thuật toán xác định tuổi hiện tại

```typescript
// Tuổi âm lịch = Năm hiện tại - Năm sinh + 1 (nếu chưa qua Tết)
// Tuổi âm lịch = Năm hiện tại - Năm sinh (nếu đã qua Tết)

function getCurrentAge(birthYear: number, birthMonth: number, birthDay: number): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  let age = currentYear - birthYear;

  // Nếu chưa qua sinh nhật trong năm → trừ 1
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }

  return age;
}

// ═══════════════════════════════════════════════════════════════════
// THUẬT TOÁN XÁC ĐỊNH Ngũ Hành Cục (phụ thuộc vào chart từ iztro)
// ═══════════════════════════════════════════════════════════════════
// Ngũ Hành Cục: Mộc Tam Cục(3), Hỏa Lục Cục(6), Thổ Ngũ Cục(5), Kim Tứ Cục(4), Thủy Nhị Cục(2)
// Xác định từ Ngũ Hành Cục của chart (do iztro tính)
// Cách tính thủ công: lấy Tử Vi nhập cung nào → đếm số cung đến ngũ hành thuộc tính

// ═══════════════════════════════════════════════════════════════════
// THUẬT TOÁN Không Cung (Mượn đối cung)
// ═══════════════════════════════════════════════════════════════════
// Nguyên tắc: Khi cung không có chính tinh → isEmpty = true
// → Lấy thông tin từ đối cung (branch + 6) % 12

function processEmptyPalaces(chart: ZiweiChart): void {
  chart.palaces.forEach((p, idx) => {
    const mainStars = p.stars.filter(s => s.type === 'major');
    p.isEmpty = mainStars.length === 0;
    p.oppositeBranch = (p.branch + 6) % 12;

    if (p.isEmpty) {
      const oppPalace = chart.palaces.find(q => q.branch === p.oppositeBranch);
      if (oppPalace) {
        // Chỉ borrow chính tinh (không borrow tinh hoa)
        p.borrowedFromBranch = oppPalace.branch;
        p.borrowedFromName = oppPalace.name;
        p.borrowedStars = oppPalace.stars
          .filter(s => s.type === 'major')
          .map(s => s.name);
        // Đánh dấu sao borrowed
        oppPalace.stars
          .filter(s => s.type === 'major')
          .forEach(s => {
            s.borrowedToBranch = p.branch;
          });
      }
    }
  });
}

// Ví dụ: Mệnh Cung (Mão) không có chính tinh
// → isEmpty = true, oppositeBranch = (3+6)%12 = 9 (Dậu)
// → borrowedFrom = Dậu cung
// → borrowedStars = ['Thất Sát', 'Phá Quân', ...] (từ Dậu cung)
// → LUẬN: Lấy tính cách từ đối cung thay vì Mệnh Cung bản thân
// → Người này có đối cung mạnh → nội tâm phức tạp, thiên hướng ngoại

// ═══════════════════════════════════════════════════════════════════
// THUẬT TOÁN LƯU NIÊN CHI TIẾT
// ═══════════════════════════════════════════════════════════════════
function getLiuNianPalace(year: number, chart: ZiweiChart): { branch: number; name: string } {
  // Năm nhập cung = (năm % 12) — nhưng cần offset từ Mệnh Cung
  // Cách khác: Mệnh Cung (Thân Cung) là điểm khởi + (năm-1) % 12
  const mingBranch = chart.mingGongBranch;
  const yearOffset = (year - chart.lunarInfo.year) % 12;
  const liuNianBranch = (mingBranch + yearOffset) % 12;
  const palace = chart.palaces.find(p => p.branch === liuNianBranch);
  return { branch: liuNianBranch, name: palace?.name ?? 'Không xác định' };
}

function getLiuYuePalace(year: number, month: number, chart: ZiweiChart): { branch: number; name: string } {
  // Lưu tháng = Lưu niên cung + tháng
  const liuNian = getLiuNianPalace(year, chart);
  const liuYueBranch = (liuNian.branch + month - 1) % 12;
  const palace = chart.palaces.find(p => p.branch === liuYueBranch);
  return { branch: liuYueBranch, name: palace?.name ?? 'Không xác định' };
}

// ═══════════════════════════════════════════════════════════════════
// THUẬT TOÁN XÁC ĐỊNH Thân Cung (Shen Gong)
// ═══════════════════════════════════════════════════════════════════
// Thân Cung = cung kết hợp giữa giờ sinh và tháng sinh
// Công thức: (giờ Tử Vi index * 2 + tháng âm) % 12
// Hoặc: iztro cung cấp sẵn trong chart.shenGongBranch

function getShenGongBranch(hourIndex: number, lunarMonth: number): number {
  return (hourIndex * 2 + lunarMonth - 2) % 12;
}
// hourIndex: Tý=0, Sửu=1, Dần=2... Hợi=11
// Ví dụ: Tý giờ (0) + tháng 3 → (0*2 + 3) % 12 = 3 → Mão
```

---

## 9. Hợp bàn thuật toán

### 9.1 Nguyên tắc song cung liên tham

```typescript
// NGUYÊN TẮC TUYỆT ĐỐI:
// Xem hôn nhân → Phu Thê Cung + Phúc Đức Cung (bắt buộc cả hai)
// KHÔNG BAO GIỜ chỉ nhìn Phu Thê Cung

function getMarriageAnalysis(chart: ZiweiChart): {
  phuThe: PalaceAnalysis;
  phucDuc: PalaceAnalysis;
  overall: string;
} {
  const phuTheBranch = (chart.mingGongBranch + 2) % 12;
  const phucDucBranch = (chart.mingGongBranch + 10) % 12;

  const phuThe = analyzePalace(chart.palaces[phuTheBranch]);
  const phucDuc = analyzePalace(chart.palaces[phucDucBranch]);

  return {
    phuThe: analyzePalace(chart.palaces[phuTheBranch]),
    phucDuc: analyzePalace(chart.palaces[phucDucBranch]),
    overall: assessMarriageQuality(phuThe, phucDuc),
  };
}
```

### 9.2 Thiên tác chi hợp (cao nhất)

```typescript
// TIÊU CHUẨN ĐỊNH CỠ:
★★★★★ = Thiên tác hoàn hảo:
  A.PhuThê chính tinh = B.Mệnh chính tinh (A có duyên từ kiếp trước)
  B.PhuThê chính tinh = A.Mệnh chính tinh (B có duyên từ kiếp trước)
  Hai bên đối ứng lẫn nhau (định mệnh một đôi)

★★★★  = Một bên đối ứng:
  A.PhuThê chính tinh = B.Mệnh chính tinh

★★★   = Mệnh cục tương hợp, cần mài dũa tình cảm

★★    = Mỗi bên có sát tinh, tình cảm nhiều sóng gió

★     = Tam sát tụ hội, nguy cơ ly hôn cao
```

### 9.3 Thuật toán nhận diện Thiên tác (đối ứng Mệnh-Phu Thê)

```typescript
interface HeMingResult {
  score: 1 | 2 | 3 | 4 | 5;
  criteria: string;
  description: string;
  risks: string[];
}

function analyzeHeMing(chartA: ZiweiChart, chartB: ZiweiChart): HeMingResult {
  const ptA = getPhuThe(chartA);
  const ptB = getPhuThe(chartB);
  const mgA = getMenh(chartA);
  const mgB = getMenh(chartB);

  const ptAStars = ptA.stars.filter(s => s.type === 'major').map(s => s.name);
  const ptBStars = ptB.stars.filter(s => s.type === 'major').map(s => s.name);
  const mgAStars = mgA.stars.filter(s => s.type === 'major').map(s => s.name);
  const mgBStars = mgB.stars.filter(s => s.type === 'major').map(s => s.name);

  // Kiểm tra thiên tác
  const ptA_eq_mgB = ptAStars.some(star => mgBStars.includes(star));
  const ptB_eq_mgA = ptBStars.some(star => mgAStars.includes(star));
  const mutual = ptA_eq_mgB && ptB_eq_mgA;

  if (mutual) {
    return {
      score: 5,
      criteria: 'Thiên tác đối ứng — định mệnh một đôi',
      description: 'Hai bên Phu Thê đối ứng Mệnh của nhau — duyên từ nhiều kiếp, hợp nhau trên mọi phương diện.',
      risks: [],
    };
  }

  // Bước 3: Tứ Hóa đối chiếu
  const siahuaA = getBanMenhSiHua(chartA);
  const siahuaB = getBanMenhSiHua(chartB);

  // Bước 4: Đại hạn đồng bộ
  const dxA = getCurrentDaXian(chartA);
  const dxB = getCurrentDaXian(chartB);

  let score = 3;
  const risks: string[] = [];
  const criteria: string[] = [];

  if (ptA_eq_mgB || ptB_eq_mgA) {
    score = 4;
    criteria.push('Một bên Phu Thê đối ứng đối phương Mệnh');
  }

  if (dxA && dxB && dxA.palaceBranch === dxB.palaceBranch) {
    criteria.push('Đại hạn đồng vận');
    score = Math.min(5, score + 1);
  }

  if (chartA.palaces.find(p => p.branch === ptB.branch)?.stars.some(s => s.name === 'Hóa Kị')) {
    risks.push('A.năm hoá kị bay vào B.Phu Thê');
  }
  if (ptAStars.includes('Liêm Trinh') && ptBStars.includes('Liêm Trinh')) {
    risks.push('Hai bên đều Liêm Trinh — bất ổn cao');
  }

  if (risks.length > 1) score = Math.max(1, score - 2);

  return {
    score: score as 1 | 2 | 3 | 4 | 5,
    criteria: criteria.length ? criteria.join(', ') : 'Mệnh cục tương hợp',
    description: HEMING_SCORE_DESC[score],
    risks,
  };
}

const HEMING_SCORE_DESC = {
  5: 'Duyên định mệnh, hợp nhau trên mọi phương diện.',
  4: 'Một bên Phu Thê đối ứng đối phương Mệnh, có duyên.',
  3: 'Mệnh cục tương hợp, cần mài dũa tình cảm.',
  2: 'Mỗi bên có sát tinh, tình cảm nhiều sóng gió.',
  1: 'Tam sát tụ hội, nguy cơ ly hôn cao.',
};
```

### 9.4 Thuật toán đánh giá chất lượng cung

```typescript
function analyzePalace(palace: Palace): {
  majorStars: Star[];
  luckyStars: Star[];
  shaStars: Star[];
  brightness: Record<string, string>;
  summary: string;
  score: number; // 1-10
} {
  const major = palace.stars.filter(s => s.type === 'major');
  const lucky = palace.stars.filter(s => s.type === 'lucky');
  const sha = palace.stars.filter(s => s.type === 'sha');

  let score = 5; // Cơ sở

  // Cộng cho mỗi chính tinh miếu
  for (const star of major) {
    if (star.brightness === 'bright') score += 2;
    if (star.brightness === 'dim') score -= 2;
  }

  // Trừ cho mỗi sát tinh
  score -= sha.length * 1.5;

  // Cộng cho sao may mắn
  score += Math.min(3, lucky.length * 0.5);

  score = Math.max(1, Math.min(10, Math.round(score)));

  return {
    majorStars: major,
    luckyStars: lucky,
    shaStars: sha,
    brightness: Object.fromEntries(major.map(s => [s.name, s.brightness])),
    summary: generatePalaceSummary(palace, score),
    score,
  };
}
```

### 9.5 Thuật toán hợp bàn Ngũ Bước Pháp (hệ thống Ni Hải)

```typescript
// ════════════════════════════════════════════════════════════════════
// BƯỚC 1: Đánh giá nền tảng mệnh 2 bên
// ════════════════════════════════════════════════════════════════════
function evaluateMingGeBasis(chartA: ZiweiChart, chartB: ZiweiChart): string[] {
  const issues: string[] = [];
  const mgA = getMenh(chartA);
  const mgB = getMenh(chartB);

  // Cả hai đều Sát Phá Lang → đố
  const hasShaPoLangA = hasMajorStars(mgA, ['Thất Sát', 'Phá Quân', 'Tham Lang']);
  const hasShaPoLangB = hasMajorStars(mgB, ['Thất Sát', 'Phá Quân', 'Tham Lang']);
  if (hasShaPoLangA && hasShaPoLangB) {
    issues.push('Cả hai đều Sát Phá Lang — hai hổ tương tranh');
  }

  // Một bên quá yếu
  if (analyzePalace(mgA).score < 3) issues.push('Bên A mệnh cung yếu');
  if (analyzePalace(mgB).score < 3) issues.push('Bên B mệnh cung yếu');

  return issues;
}

// ════════════════════════════════════════════════════════════════════
// BƯỚC 2: Đối chiếu Phu Thê + Mệnh
// ════════════════════════════════════════════════════════════════════
function evaluateFuqiDuiying(chartA: ZiweiChart, chartB: ZiweiChart) {
  const ptA = getPhuThe(chartA);
  const ptB = getPhuThe(chartB);
  const mgA = getMenh(chartA);
  const mgB = getMenh(chartB);

  // A.PhuThê chính tinh đối ứng B.Mệnh chính tinh?
  const ptAMatchesMgB = ptA.stars.filter(s => s.type === 'major')
    .some(s => mgB.stars.some(m => m.name === s.name));

  // B.PhuThê chính tinh đối ứng A.Mệnh chính tinh?
  const ptBMatchesMgA = ptB.stars.filter(s => s.type === 'major')
    .some(s => mgA.stars.some(m => m.name === s.name));

  return { ptAMatchesMgB, ptBMatchesMgA };
}

// ════════════════════════════════════════════════════════════════════
// BƯỚC 3: Phân tích Thái Dương + Thái Âm (quan trọng)
// ════════════════════════════════════════════════════════════════════
// Nữ: Thái Dương đại diện chồng. Thái Dương đắc địa→Vượng phu. Thái Dương hãm hóa Kị→Khắc phu
// Nam: Thái Âm đại diện vợ. Thái Âm đắc địa→vợ đẹp. Thái Âm hóa Kị→bất hoà

function analyzeSunMoonForMarriage(chartA: ZiweiChart, chartB: ZiweiChart) {
  // Tìm Thái Dương và Thái Âm trong mỗi chart
  const sunA = findStar(chartA, 'Thái Dương');
  const moonA = findStar(chartA, 'Thái Âm');
  const sunB = findStar(chartB, 'Thái Dương');
  const moonB = findStar(chartB, 'Thái Âm');

  const warnings: string[] = [];

  // Nữ mệnh A: Thái Dương hãm + Hóa Kị → nguy hiểm
  if (chartA.gender === 'female' && sunA?.brightness === 'dim') {
    const sunHoaKi = getStarSiHua(sunA, 'Thái Dương');
    if (sunHoaKi === 'Kị') {
      warnings.push('A(nữ): Thái Dương hóa Kị — cực kỳ bất lợi cho hôn nhân');
    }
  }

  // Nam mệnh A: Thái Âm hãm + Hóa Kị → bất hoà
  if (chartA.gender === 'male' && moonA?.brightness === 'dim') {
    const moonHoaKi = getStarSiHua(moonA, 'Thái Âm');
    if (moonHoaKi === 'Kị') {
      warnings.push('A(nam): Thái Âm hóa Kị — bất hoà với mẹ/vợ');
    }
  }

  return warnings;
}

// ════════════════════════════════════════════════════════════════════
// BƯỚC 4: Bay hóa đối chiếu (kỹ thuật nâng cao)
// ════════════════════════════════════════════════════════════════════
// Can năm sinh → tìm 4 sao hóa → xem những sao này rơi vào đâu trong bảng của đối phương

function analyzeFlyingSiHua(chartA: ZiweiChart, chartB: ZiweiChart) {
  const stemA = chartA.lunarInfo.yearStem;
  const stemB = chartB.lunarInfo.yearStem;
  const huaA = getSiHuaByStem(stemA); // { Lộc: sao, Quyền: sao, ... }
  const huaB = getSiHuaByStem(stemB);

  const issues: string[] = [];

  // A.hóa Kị bay vào B.PhuThê → mang đến tổn thương cho B
  for (const starName of Object.values(huaA)) {
    const targetPalace = chartB.palaces.find(p => p.stars.some(s => s.name === starName));
    if (targetPalace && targetPalace.name.includes('Phu Thê')) {
      issues.push(`A.hóa Kị sao「${starName}」bay vào B.PhuThê Cung`);
    }
  }

  return issues;
}

// ════════════════════════════════════════════════════════════════════
// BƯỚC 5: Đại hạn đồng bộ
// ════════════════════════════════════════════════════════════════════
function analyzeDaXianSync(chartA: ZiweiChart, chartB: ZiweiChart) {
  const dxA = getCurrentDaXian(chartA);
  const dxB = getCurrentDaXian(chartB);

  if (!dxA || !dxB) return null;

  if (dxA.palaceBranch === dxB.palaceBranch) {
    return { sync: true, note: 'Đại hạn đồng vận — cùng lên hoặc cùng xuống' };
  }

  const favorableA = isGoodDaXian(dxA, chartA);
  const favorableB = isGoodDaXian(dxB, chartB);

  if (favorableA && favorableB) {
    return { sync: true, note: 'Cả hai đều đang ở giai đoạn thuận lợi' };
  }
  if (!favorableA && !favorableB) {
    return { sync: true, note: 'Cả hai cùng khó khăn — cần nỗ lực từ hai phía' };
  }

  return { sync: false, note: 'Một bên thuận lợi, một bên khó khăn — cần cân bằng' };
}
```

### 9.6 Thuật toán xác định loại duyên (Loại duyên)

```typescript
// ════════════════════════════════════════════════════════════════════
// Xác định loại duyên dựa trên hóa sao bay vào Phu Thê / Mệnh
// ════════════════════════════════════════════════════════════════════
type YuanFenType = 'chinh-duyen' | 'chu-dong' | 'bai-yang' | 'oan-gia';

function detectYuanFenType(
  myChart: ZiweiChart,
  otherChart: ZiweiChart
): Record<YuanFenType, boolean> {
  const stemMy = myChart.lunarInfo.yearStem;
  const huaMy = getSiHuaByStem(stemMy);

  let hasLuInPT = false, hasQuanInPT = false;
  let hasKeInPT = false, hasJiInPT = false;

  for (const palace of otherChart.palaces) {
    for (const star of palace.stars) {
      if (star.name === huaMy['Lộc']) hasLuInPT = true;
      if (star.name === huaMy['Quyền']) hasQuanInPT = true;
      if (star.name === huaMy['Khoa']) hasKeInPT = true;
      if (star.name === huaMy['Kị']) hasJiInPT = true;
    }
  }

  return {
    'chinh-duyen': hasLuInPT,      // Hóa Lộc dẫn động → chính duyên
    'chu-dong': hasQuanInPT,       // Hóa Quyền dẫn động → chủ động tranh
    'bai-yang': hasKeInPT,         // Hóa Khoa dẫn động → bạch đầu lâu
    'oan-gia': hasJiInPT,          // Hóa Kị dẫn động → oan gia
  };
}

// ════════════════════════════════════════════════════════════════════
// Điểm hợp bàn theo chuẩn Ni Hải
// ════════════════════════════════════════════════════════════════════
const HEMING_SCORE_CRITERIA = {
  'Năm Sao': 'Song phương Phu Thê Cung đối ứng, tứ hoá tương bổ, đại hạn cùng đi vận thịnh, Phúc Đức Cung song cát',
  'Tứ Sao': 'Một phương Phu Thê Cung đối ứng đối phương Mệnh, tứ hoá chủ Lộc Khoa, tình cảm nền tảng chắc',
  'Tam Sao': 'Mệnh cục tương phối nhưng mỗi bên có góc, cần mài dũa, dài hạn ổn định',
  'Nhị Sao': 'Phu Thê Cung mỗi bên có sát tinh, hóa Kị có xung, tình cảm trồi sụt lớn, cần hai bên chủ động vận hành',
  'Nhất Sao': 'Hung tinh tụ hội Phu Thê Cung, hoặc Liêm Trinh tam hung tổ hợp, sinh ly tử biệt rủi ro cao',
};
```

### 9.7 Thuật toán xác định thời điểm kết hôn (Tam tầng phán đoán)

```typescript
// ════════════════════════════════════════════════════════════════════
// TẦNG 1: Dựa vào bản mệnh (cơ sở)
// ════════════════════════════════════════════════════════════════════
function getMarriageTimingFromNatal(chart: ZiweiChart): {
  recommend: 'sớm' | 'muộn' | 'bình thường';
  reason: string;
} {
  const pt = getPhuThe(chart);
  const majorNames = pt.stars.filter(s => s.type === 'major').map(s => s.name);

  // Những sao KHÔNG nên kết hôn sớm
  const badEarly = ['Vũ Khúc', 'Liêm Trinh', 'Thất Sát', 'Phá Quân'];
  const hasBad = majorNames.some(n => badEarly.includes(n));

  if (hasBad) {
    return { recommend: 'muộn', reason: 'Phu Thê Cung có sát tinh, nên kết hôn sau 30 tuổi' };
  }

  // Những sao NÊN kết hôn sớm
  const goodEarly = ['Thiên Phủ', 'Thiên Tướng', 'Thiên Đồng'];
  const hasGood = majorNames.some(n => goodEarly.includes(n));
  if (hasGood) {
    return { recommend: 'sớm', reason: 'Phu Thê Cung cát tinh, thuận lợi kết hôn' };
  }

  return { recommend: 'bình thường', reason: 'Phu Thê Cung bình thường, không có chỉ định đặc biệt' };
}

// ════════════════════════════════════════════════════════════════════
// TẦNG 2: Dựa vào Đại hạn
// ════════════════════════════════════════════════════════════════════
function getMarriageTimingFromDaXian(chart: ZiweiChart, targetAge: number): {
  possible: boolean;
  note: string;
} {
  const dx = chart.daXians.find(d => targetAge >= d.startAge && targetAge <= d.endAge);
  if (!dx) return { possible: false, note: 'Không xác định được đại hạn' };

  const palace = chart.palaces.find(p => p.branch === dx.palaceBranch);
  if (!palace) return { possible: false, note: '' };

  // Đại hạn đi qua Phu Thê cung
  const ptBranch = (chart.mingGongBranch + 2) % 12;
  if (dx.palaceBranch === ptBranch) {
    const hasGood = palace.stars.some(s => s.type === 'lucky' || s.type === 'major');
    return {
      possible: true,
      note: hasGood ? 'Đại hạn tại Phu Thê, cát tinh — cơ hội kết hôn tốt' : 'Đại hạn tại Phu Thê nhưng không có cát tinh'
    };
  }

  return { possible: false, note: 'Đại hạn không đi qua Phu Thê' };
}

// ════════════════════════════════════════════════════════════════════
// TẦNG 3: Dựa vào Lưu Niên (Hồng Loan, Thiên Hỷ)
// ════════════════════════════════════════════════════════════════════
const HONGMARRIAGE_STARS = ['Hồng Loan', 'Thiên Hỷ'];

function getMarriageTimingFromLiuNian(year: number, chart: ZiweiChart): {
  possible: boolean;
  palaces: string[];
} {
  const liuNian = getLiuNianSiHua(year);
  const ptBranch = (chart.mingGongBranch + 2) % 12;
  const mgBranch = chart.mingGongBranch;
  const found: string[] = [];

  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      if (HONGMARRIAGE_STARS.includes(star.name)) {
        if (palace.branch === ptBranch) found.push('Phu Thê Cung có Hồng Loan hoặc Thiên Hỷ');
        if (palace.branch === mgBranch) found.push('Mệnh Cung có Hồng Loan hoặc Thiên Hỷ');
      }
    }
  }

  return { possible: found.length > 0, palaces: found };
}
```

### 9.8 Thuật toán hợp tác sự nghiệp (Hợp bàn kinh doanh)

```typescript
// ════════════════════════════════════════════════════════════════════
// Đánh giá hợp tác sự nghiệp / kinh doanh
// ════════════════════════════════════════════════════════════════════
interface BusinessHeMing {
  score: 1 | 2 | 3 | 4 | 5;
  advantages: string[];
  risks: string[];
}

function analyzeBusinessHeMing(chartA: ZiweiChart, chartB: ZiweiChart): BusinessHeMing {
  const guanA = getGuanLu(chartA);
  const guanB = getGuanLu(chartB);
  const shuYiA = getShuYi(chartA); // Huynh Đệ Cung (cung hợp tác)
  const shuYiB = getShuYi(chartB);

  const advantages: string[] = [];
  const risks: string[] = [];
  let score = 3;

  // A.Quan Lộc Cung Hóa Lộc bay vào B.Quan Lộc Cung
  // A.Quan Lộc Cung có cùng cát tinh với B.Quan Lộc Cung → thuận lợi

  // Huynh Đệ Cung (cung hợp tác) có Lộc Tồn, không hóa Kị
  if (!hasShaInPalace(shuYiA, SHA_ALL) && hasStar(shuYiA, 'Lộc Tồn')) {
    advantages.push('A: Huynh Đệ Cung có Lộc Tồn');
    score++;
  }

  // Huynh Đệ Cung có Cự Môn → cảnh báo
  if (hasStar(shuYiA, 'Cự Môn')) {
    risks.push('A: Huynh Đệ Cung có Cự Môn — Ni Hải: "Cự Môn tại Hữu Nghĩa, hợp tác bạn thành thù"');
    score = Math.max(1, score - 1);
  }

  // A.hóa Kị bay vào B.Tài Bạch Cung
  const jiA = getSiHuaByStem(chartA.lunarInfo.yearStem)['Kị'];
  const caiB = chartB.palaces.find(p => p.name === 'Tài Bạch');
  if (caiB && caiB.stars.some(s => s.name === jiA)) {
    risks.push(`A: Hóa Kị「${jiA}」bay vào B: Tài Bạch Cung — A tiêu hao của B`);
    score = Math.max(1, score - 2);
  }

  return {
    score: score as 1 | 2 | 3 | 4 | 5,
    advantages,
    risks,
  };
}
```

### 9.9 Bảng tương thích Tinh Diệu (11 loại)

```
╔══════════════════════════════════════════════════════════════════╗
║ 2 bên Mệnh chính tinh          │ Điểm │ Nhận xét                          ║
╠══════════════════════════════════════════════════════════════════╣
║ Tử Vi + Thiên Phủ                 │ ★★★★★ │ Đế tinh gặp Tài khố, tương hỗ, ổn định ║
║ Thiên Tướng + bất kỳ sao         │ ★★★★  │ Ấn tinh thích nghi mọi cục diện    ║
║ Thiên Lương + Thiên Đồng         │ ★★★★  │ Lão thành + ôn hòa, bạch đầu       ║
║ Thái Dương + Thái Âm             │ ★★★★  │ Nhật nguyệt điều hoà, bổ túc       ║
║ Thất Sát + Thất Sát             │ ★★    │ Hai hổ tương tranh, nhiều ma sát  ║
║ Phá Quân + Phá Quân             │ ★★    │ Song phá, bất ổn                  ║
║ Liêm Trinh + Thất Sát/Phá Quân   │ ★     │ Tam hung tam phương, nguy cơ cao   ║
║ Sát Phá Lang + Cơ Nguyệt Đồng Lương │ ★★★   │ Động bổ túc tĩnh, cần mài dũa   ║
║ Tử Vi + Phá Quân                 │ ★★★★  │ Cục diện tương đương, hấp dẫn     ║
║ Vũ Khúc + Thiên Đồng             │ ★★★   │ Cương nhu bổ túc                  ║
║ Tham Lang + Tham Lang            │ ★★    │ Hai Tham Lang, tham vọng cao       ║
╚══════════════════════════════════════════════════════════════════╝
```

### 9.10 Thuật toán phân tích Nhật Nguyệt Tinh Tượng (quan trọng cho hôn nhân)

```typescript
// ════════════════════════════════════════════════════════════════════
// Nữ mệnh: Thái Dương đại diện chồng
// Nam mệnh: Thái Âm đại diện vợ
// ════════════════════════════════════════════════════════════════════
function analyzeSunMoonForSpouse(chart: ZiweiChart): {
  sun?: { brightness: string; siHua?: string; spouseNote: string };
  moon?: { brightness: string; siHua?: string; spouseNote: string };
} {
  const sunPalace = findStarPalace(chart, 'Thái Dương');
  const moonPalace = findStarPalace(chart, 'Thái Âm');

  const result: ReturnType<typeof analyzeSunMoonForSpouse> = {};

  if (sunPalace) {
    const sunStar = findStar(sunPalace, 'Thái Dương');
    result.sun = {
      brightness: sunStar?.brightness ?? 'normal',
      siHua: sunStar?.siHua,
      spouseNote: sunStar?.brightness === 'bright'
        ? 'Nữ: Thái Dương miếu — chồng có khả năng, được hưởng lợi từ chồng'
        : sunStar?.brightness === 'dim'
          ? 'Nữ: Thái Dương hãm — chồng khó khăn, cần chọn chồng cẩn thận'
          : 'Nữ: Thái Dương bình — chồng bình thường',
    };
  }

  if (moonPalace) {
    const moonStar = findStar(moonPalace, 'Thái Âm');
    result.moon = {
      brightness: moonStar?.brightness ?? 'normal',
      siHua: moonStar?.siHua,
      spouseNote: chart.gender === 'male'
        ? moonStar?.brightness === 'bright'
          ? 'Nam: Thái Âm miếu — vợ đẹp, hiền, có tài'
          : 'Nam: Thái Âm hãm — cẩn thận bất hoà mẹ vợ'
        : 'Nữ: Thái Âm miếu — tự thân đẹp, nhiều cảm xúc',
    };
  }

  return result;
}
```

### 9.11 Thuật toán Không Cung (Mượn Đối Cung)

```typescript
// ════════════════════════════════════════════════════════════════════
// Khi cung không có chính tinh → gọi là Không Cung (isEmpty = true)
// → Lấy thông tin từ đối cung (đối cung, luôn = branch + 6)
// ════════════════════════════════════════════════════════════════════
function handleEmptyPalace(chart: ZiweiChart): void {
  chart.palaces.forEach(p => {
    const mainStars = p.stars.filter(s => s.type === 'major');
    p.isEmpty = mainStars.length === 0;
    p.oppositeBranch = (p.branch + 6) % 12;

    if (p.isEmpty) {
      const oppPalace = chart.palaces.find(q => q.branch === p.oppositeBranch);
      if (oppPalace) {
        p.borrowedFromBranch = oppPalace.branch;
        p.borrowedFromName = oppPalace.name;
        // Chỉ borrow chính tinh (không borrow tinh hoa)
        p.borrowedStars = oppPalace.stars.filter(s => s.type === 'major').map(s => s.name);
      }
    }
  });
}

// Ví dụ: Mệnh Cung không có chính tinh (Không Cung)
// → isEmpty = true
// → borrowedFromBranch = đối cung (Diên Niên Cung)
// → borrowedStars = ['Tử Vi', 'Thiên Cơ', ...] (các chính tinh từ đối cung)
// → LUẬN: Lấy tính cách từ đối cung (Diên Niên Cung) thay vì Mệnh Cung
```

---

## 10. Cấu trúc dữ liệu đầu ra

```typescript
interface Palace {
  branch: number;           // 0-11 (Tý=0...Hợi=11)
  stem: number;             // 0-9 (Giáp=0...Quý=9)
  name: string;             // 'Mệnh Cung', 'Huynh Đệ', 'Phu Thê', v.v.
  stars: Star[];
  isEmpty: boolean;         // Không cung
  borrowedFrom?: number;    // Branch đối cung nếu là không cung
  daXianAge?: [number, number]; // Tuổi đại hạn
}

interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  brightness: 'bright' | 'normal' | 'dim';
  siHua?: SiHuaKey;         // Nếu sao này là tứ hoá
}

// ─── Tổng hợp cho AI ───
interface ZiweiChartFull {
  chart: ZiweiChart;
  patterns: Pattern[];
  analysis: {
    ming: {
      stars: string[];
      keywords: string[];
      nature: string;
      score: number;
    };
    tamFang: {
      meng: PalaceAnalysis;
      tai: PalaceAnalysis;
      quan: PalaceAnalysis;
      dien: PalaceAnalysis;
    };
    heMing?: HeMingResult; // Nếu là hợp bàn
  };
}
```

### Xuất tóm tắt cho AI

```typescript
function getMingGongSummary(chart: ZiweiChart): {
  stars: string[];
  keywords: string[];
  nature: string;
  score: number;
} {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch)!;
  const majorStars = mingPalace.stars.filter(s => s.type === 'major');
  const starNames = majorStars.map(s => s.name);

  const keywordMap: Record<string, string[]> = {
    'Tử Vi':    ['Tôn quý','Độc lập','Lãnh đạo'],
    'Thiên Cơ': ['Trí tuệ','Cơ biến','Mưu lược'],
    'Thái Dương': ['Dương cương','Quan quý','Hào phóng'],
    'Vũ Khúc':  ['Cương nghị','Quyết đoán','Tài phú'],
    'Thiên Đồng': ['Ôn hòa','Hưởng lạc','Tùy duyên'],
    'Liêm Trinh': ['Tài nghệ','Hình khố','Hoa duyên'],
    'Thiên Phủ': ['Tài khố','Ổn định','Bảo thủ'],
    'Thái Âm':  ['Nhu mỹ','Tài phú','Âm nhu'],
    'Tham Lang': ['Dục vọng','Hoa duyên','Đa tài'],
    'Cự Môn':   ['Khẩu thiệt','Biện tài','Thị phi'],
    'Thiên Tướng': ['Phụ tá','Hành chính','Ổn trọng'],
    'Thiên Lương': ['Ấm hộ','Y học','Trưởng bối'],
    'Thất Sát': ['Tướng soái','Quyết đoán','Cô thác'],
    'Phá Quân': ['Khai sáng','Biến động','Phá cựu'],
  };

  const natureMap: Record<string, string> = {
    'Tử Vi':    'Đế Tinh',
    'Thiên Cơ': 'Trí Tuệ Tinh',
    'Thái Dương': 'Quý Nhân Tinh',
    'Vũ Khúc':  'Tài Tinh',
    'Thiên Đồng': 'Phúc Tinh',
    'Liêm Trinh': 'Hoa Tinh',
    'Thiên Phủ': 'Tài Khố Tinh',
    'Thái Âm':  'Tài Phú Tinh',
    'Tham Lang': 'Hoa Tinh',
    'Cự Môn':   'Thị Phi Tinh',
    'Thiên Tướng': 'Ấn Tinh',
    'Thiên Lương': 'Ấm Tị Tinh',
    'Thất Sát': 'Tướng Soái Tinh',
    'Phá Quân': 'Biến Động Tinh',
  };

  return {
    stars: starNames,
    keywords: starNames.flatMap(n => keywordMap[n] || []).slice(0, 5),
    nature: starNames[0] ? natureMap[starNames[0]] : 'Khung Cung',
    score: analyzePalace(mingPalace).score,
  };
}
```

---

## 11. Quy trình luận giải AI tổng hợp

### 11.1 Pipeline luận giải

```
BƯỚC 1: TIẾP NHẬN & CHUẨN HÓA
  ↓ Nhận BirthInfo → Tính chart
BƯỚC 2: XẾP BÀN
  ↓ iztro.bySolar() → ZiweiChart
BƯỚC 3: PHÂN TÍCH TĨNH
  ↓ Nhận diện cục diện + phân tích tam phương + tứ hoá bản mệnh
BƯỚC 4: PHÂN TÍCH ĐỘNG
  ↓ Tính đại hạn hiện tại + tứ hoá đại hạn + Lưu Niên
BƯỚC 5: GỌI AI
  ↓ Đóng gói context → prompt cho LLM
BƯỚC 6: SINH LUẬN GIẢI
  ↓ LLM tạo văn bản dựa trên knowledge base
```

### 11.2 Prompt template cho AI

```typescript
const INTERPRETATION_PROMPT = `
Bạn là một chuyên gia Tử Vi theo hệ thống Nguỵ Hải.

NGỮ CẢNH BÀN TỬ VI:
{JSON_CHART}

CÁC CỤC DIỆN ĐÃ NHẬN DIỆN:
{PATTERNS_LIST}

TỨ HOÁ BẢN MỆNH:
- Hóa Lộc: {hoaLoc} → cung {hoaLocBranch}
- Hóa Quyền: {hoaQuyen} → cung {hoaQuyenBranch}
- Hóa Khoa: {hoaKhoa} → cung {hoaKhoaBranch}
- Hóa Kị: {hoaKi} → cung {hoaKiBranch}

ĐẠI HẠN HIỆN TẠI ({tuoiHienTai} tuổi):
- Cung: {daXianPalace}
- Tứ Hóa: {daXianSihua}

YÊU CẦU:
1. Phân tích tính cách từ Mệnh Cung + chính tinh + độ sáng
2. Giải thích cục diện (nếu có)
3. Luận đoán đại hạn hiện tại
4. Đưa ra lời khuyên cụ thể
5. Viết bằng tiếng Việt, chính xác, có chiều sâu

NGUYÊN TẮC:
- "Mệnh Cung vi bản, Tam Phương vi dụng"
- "Nhân sự nỗ lực + Địa lý = 2/3 > Thiên mệnh = 1/3"
- Chỉ dùng Tam Hợp phái (không Phi Tinh)
- Tứ Hóa sao cố định, không tự di chuyển
`;
```

### 11.3 Bảng quyết định luận giải

```typescript
const INTERPRETATION_DECISION_TABLE = [
  // [Điều kiện] → [Ưu tiên phân tích]
  ['Mệnh có Tử Vi + Tả Hữu', 'Quân Thần Khánh Hội → công danh'],
  ['Mệnh có Tử Vi + Thiên Phủ', 'Tử Phủ Đồng Cung → quyền + tiền'],
  ['Tam Kỳ Gia Hội', 'Tam Kỳ → học hành, thi cử'],
  ['Hỏa Tham / Linh Tham', 'Cơ hội tài chính bất ngờ'],
  ['Cơ Nguyệt Đồng Lương', 'Ổn định, công chức'],
  ['Sát Phá Lang', 'Khởi nghiệp, biến động'],
  ['Hóa Kị nhập Mệnh', 'Thử thách, bài học sâu'],
  ['Liêm Trinh tại Phu Thê', 'Hôn nhân bất ổn, cần thận trọng'],
  ['Vũ Khúc tại Phu Thê', 'Kết hôn muộn, cô thác'],
  ['Phá Quân tại Phu Thê', 'Nguy cơ tan vỡ hôn nhân'],
  ['Đại hạn Mệnh có sát', 'Thận trọng trong quyết định lớn'],
  ['Đại hạn Tài có Lộc Tồn', 'Cơ hội tài chính trong giai đoạn này'],
];
```

### 11.4 Thuật toán xác định chủ đề luận giải

```typescript
function determineInterpretationFocus(chart: ZiweiChart): string[] {
  const ming = getMenh(chart);
  const priority: string[] = [];

  // Ưu tiên theo cường độ sao
  const majorInMing = ming.stars.filter(s => s.type === 'major').map(s => s.name);

  if (majorInMing.includes('Tử Vi')) priority.push('lãnh đạo', 'quyền lực');
  if (majorInMing.includes('Thiên Cơ')) priority.push('trí tuệ', 'cơ biến');
  if (majorInMing.includes('Vũ Khúc')) priority.push('tài chính', 'quyết đoán');
  if (majorInMing.includes('Liêm Trinh')) priority.push('tài nghệ', 'hình khố');
  if (majorInMing.includes('Tham Lang')) priority.push('hoa duyên', 'dục vọng');
  if (majorInMing.includes('Thất Sát')) priority.push('tướng soái', 'cạnh tranh');
  if (majorInMing.includes('Phá Quân')) priority.push('khởi phá', 'thay đổi');

  // Ưu tiên theo đại hạn
  const dx = getCurrentDaXian(chart);
  if (dx) {
    const dxPalace = chart.palaces[dx.palaceBranch];
    if (dxPalace.branch === chart.mingGongBranch) priority.push('đại hạn mệnh — quyết định quan trọng');
    if (dxPalace.branch === (chart.mingGongBranch + 4) % 12) priority.push('đại hạn tài — cơ hội tài chính');
    if (dxPalace.branch === (chart.mingGongBranch + 8) % 12) priority.push('đại hạn quan — sự nghiệp thay đổi');
    if (dxPalace.branch === (chart.mingGongBranch + 2) % 12) priority.push('đại hạn phu thê — tình cảm');
  }

  return priority;
}
```

---

## Phụ lục: Thứ tự 12 cung

```
Index  Tên cung          Thuận từ Mệnh    Chiều kim đồng hồ
──────────────────────────────────────────────────────────────
  0    Mệnh Cung         —                Tý
  1    Huynh Đệ          +1               Sửu
  2    Phu Thê           +2               Dần
  3    Tử Nữ             +3               Mão
  4    Tài Bạch          +4               Thìn
  5    Tật Khoa          +5               Tỵ
  6    Diên Niên         +6               Ngọ
  7    Hữu Nghĩa         +7               Mùi
  8    Quan Lộc           +8               Thân
  9    Điền Trạch         +9               Dậu
 10    Phúc Đức           +10              Tuất
 11    Phụ Mẫu            +11              Hợi
──────────────────────────────────────────────────────────────
Thân Cung = Mệnh Cung + 6 (đối cung)
```
