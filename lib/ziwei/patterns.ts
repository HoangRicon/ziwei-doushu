/**
 * Nhận diện cục diện Tử Vi Đẩu Số (Phiên bản v2 chuẩn hóa)
 *
 * Nguyên tắc thiết kế:
 * 1. Ưu tiên điều kiện sách cổ: Mỗi cục diện liệt kê cấu trúc ba tầng "Phải / Cộng điểm / Phá cục", có thể kiểm chứng nguồn gốc
 * 2. Lập trường Nhu Sư: Không sử dụng công cụ tự hóa cung cung, đại hạn tứ hóa, lai nhân cung等飞星派
 * 3. Miếu Vượng Lợi Nhập: Dùng trường brightness (bright=Miếu/Vượng, normal=Bình, dim=Nhập)
 * 4. Tam phương tứ chánh hội chiếu: Mệnh Cung + Tài Bạch + Quan Lộc + Di Quan
 * 5. Giá cung: Hai cung trước sau Mệnh Cung
 *
 * Nguồn cổ điển chính:
 *  - 《Tử Vi Đẩu Số Toàn Tập》(Trần Đoàn Tổ Sư truyền, bản in Minh Đại)
 *  - 《Tử Vi Đẩu Số Toàn Thư》(La Hồng Tiên biên, bản in Minh Đại)
 *  - 《Tủy Nãot Phú》《Nữ Mệnh Tủy Nãot Phú》《Thập Nhị Cung Chư Hưng Đắc Địa Tuyệt Quyết》
 *  - Nhu Hải Hạ《Thiên Kỷ》giảng nghĩa Tử Vi Đẩu Số
 */

import type { ZiweiChart, Palace, Star } from './types';

// ────────────────── Kiểu ──────────────────
export interface PatternCondition {
  required: string[];   // Điều kiện phải thỏa mãn (đã qua)
  bonus?: string[];     // Cộng điểm (đã trigger)
  breaking?: string[];  // Phá cục cảnh báo (đã trigger)
}

export interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];                 // Cung vị liên quan
  conditions?: PatternCondition;     // Cấu trúc điều kiện thành lập (v2 mới)
  source?: string;                   // Nguồn cổ điển (v2 mới)
}

// ────────────────── Hằng số ──────────────────
const SHA_NAMES = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];
const SHA_HARD = ['擎羊', '陀罗', '火星', '铃星'];   // Tứ Sát
const SHA_KONG = ['地空', '地劫'];                  // Không Hóa
const ZUO_YOU = ['左辅', '右弼'];
const CHANG_QU = ['文昌', '文曲'];
const KUI_YUE = ['天魁', '天钺'];

// ────────────────── Hàm phụ trợ ──────────────────
function getMajorStarNames(palace: Palace): string[] {
  return palace.stars.filter(s => s.type === 'major').map(s => s.name);
}
function findStar(palace: Palace, name: string): Star | undefined {
  return palace.stars.find(s => s.name === name);
}
function hasStar(palace: Palace, name: string): boolean {
  return palace.stars.some(s => s.name === name);
}
function findStarPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.stars.some(s => s.name === name));
}
function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}
function shaCountInPalace(palace: Palace, list: string[] = SHA_HARD): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}
function hasShaInPalace(palace: Palace, list: string[] = SHA_NAMES): boolean {
  return palace.stars.some(s => list.includes(s.name));
}
function getSanFangPalaces(chart: ZiweiChart): Palace[] {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12];
  return chart.palaces.filter(p => branches.includes(p.branch));
}
function isInSanFang(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12].includes(branch);
}
function getDuiGong(chart: ZiweiChart, branch: number): Palace | undefined {
  return getPalaceByBranch(chart, (branch + 6) % 12);
}
function getJiaPalaces(chart: ZiweiChart, branch: number): { prev?: Palace; next?: Palace } {
  return {
    prev: getPalaceByBranch(chart, (branch + 11) % 12),
    next: getPalaceByBranch(chart, (branch + 1) % 12),
  };
}
function sanFangAllStars(chart: ZiweiChart): Set<string> {
  return new Set(getSanFangPalaces(chart).flatMap(p => p.stars.map(s => s.name)));
}
function sanFangShaCount(chart: ZiweiChart, list: string[] = SHA_HARD): number {
  return getSanFangPalaces(chart).reduce((sum, p) => sum + shaCountInPalace(p, list), 0);
}
function isBright(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'bright';
}
function isDim(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'dim';
}
function getStarSiHua(palace: Palace, starName: string): Star['siHua'] | undefined {
  return findStar(palace, starName)?.siHua;
}
const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ────────────────── Bộ nhận diện cục diện chính ──────────────────

/** Quân thần khánh hội: Tử Vi nhập mệnh, Tả Phụ Hữu Tị đồng hội (đồng cung hoặc tam phương) */
function detectJunChenQingHui(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微')) return;
  const sanFangSet = sanFangAllStars(chart);
  const hasZuo = sanFangSet.has('左辅');
  const hasYou = sanFangSet.has('右弼');
  if (!hasZuo || !hasYou) return;

  const required = ['紫微入命', '左辅右弼同会三方四正'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('再会文昌或文曲');
  if (sanFangSet.has('天魁') || sanFangSet.has('天钺')) bonus.push('魁钺贵人加照');
  if (getStarSiHua(ming, '紫微') === '权') bonus.push('紫微化权');
  if (sanFangShaCount(chart, SHA_KONG) >= 2) breaking.push('地空地劫双夹会照（紫微忌空劫）');

  patterns.push({
    name: 'Quân Thần Khánh Hội',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Tử Vi nhập mệnh, Tả Phụ Hữu Tị đồng hội, Đế vương được hiền thần phụ tá, chủ đại phú quý, đại nghiệp chi mệnh. Cả đời quý nhân không ngừng, thích hợp đi con đường thương trường chính sự cao cấp, lãnh đạo xuyên ngành.',
    palaces: ['Mệnh Cung'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Quân Thần Khánh Hội Cục》',
  });
}

/** Tử Phủ đồng cung: Tử Vi + Thiên Phủ tại Mệnh Cung (chỉ cung Dần, Thân) */
function detectZiFu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const ziwei = findStarPalace(chart, '紫微');
  const tianfu = findStarPalace(chart, '天府');
  if (!ziwei || !tianfu || ziwei.branch !== tianfu.branch) return;

  const inMing = ziwei.branch === chart.mingGongBranch;
  const required = inMing
    ? ['紫微天府同入命宫']
    : ['紫微天府同宫（不在命宫，会照减力）'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('左辅右弼同会');
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('再会昌曲');
  if (hasShaInPalace(ziwei, SHA_KONG)) breaking.push('紫府宫坐空劫（破紫府之贵气）');
  if (shaCountInPalace(ziwei, SHA_HARD) >= 2) breaking.push('紫府宫见双煞同坐');

  patterns.push({
    name: 'Tử Phủ Đồng Cung',
    level: inMing && !breaking.length ? 'excellent' : 'good',
    description: inMing
      ? 'Tử Vi Thiên Phủ đồng nhập Mệnh Cung, Đế tướng tợn lâm, quý tôn chi mệnh. Chủ tính đức ngay thẳng, no ấm vô lo, có lãnh đạo tài năng, thích hợp đảm nhận chức vụ quan trọng. Cần Tả Hữu Phụ Tịch đến phối hợp phương viên đại cục hoàn chỉnh.'
      : 'Tử Vi Thiên Phủ đồng cung nhưng vị tại Mệnh, chủ cả đời có quý nhân quý khí yểm trợ, nhưng bản thân không nhất định đại phú quý, cần xem hội chiếu cát sát mà định.',
    palaces: [ziwei.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tử Phủ Đồng Cung Cục》',
  });
}

/** Phủ Tương triều Viên: Thiên Phủ, Thiên Tương lần lượt thủ守 Mệnh Cung tam phương tứ chánh */
function detectFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tianfu = findStarPalace(chart, '天府');
  const tianxiang = findStarPalace(chart, '天相');
  if (!tianfu || !tianxiang) return;
  if (!isInSanFang(chart, tianfu.branch) || !isInSanFang(chart, tianxiang.branch)) return;
  if (tianfu.branch === chart.mingGongBranch && tianxiang.branch === chart.mingGongBranch) return;
  if (tianfu.branch === tianxiang.branch) return;

  const required = ['天府坐命三方', '天相坐命三方', '两星不同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(ming, '禄存') || hasStar(ming, '化禄')) bonus.push('命宫见禄');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('再会左辅');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('命宫坐煞星');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('三方四正煞星过多');

  patterns.push({
    name: 'Phủ Tương Triều Viên',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Phủ Thiên Tương phân thủ Mệnh Cung tam phương tứ chánh, văn võ tợn chế, quyền ấn song huy, chủ cả đời ăn mặc sung túc, địa vị cao tôn. Cổ thư vân "Phủ Tương triều viên thiên chung thực lộc", thường gặp trong chính giới, nhà quản lý doanh nghiệp.',
    palaces: [tianfu.name, tianxiang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Phủ Tương Triều Viên Cục》',
  });
}

/** Dương Lương Xương Lộc: Thái Dương + Thiên Lương + Văn Xương + Lộc Tồn tứ sao hội Mệnh Cung, đại quý cục */
function detectYangLiangChangLu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('太阳') || !sanFangSet.has('天梁') ||
      !sanFangSet.has('文昌') || !sanFangSet.has('禄存')) return;

  const sun = findStarPalace(chart, '太阳')!;
  const liang = findStarPalace(chart, '天梁')!;
  const required = [
    '太阳会命宫三方',
    '天梁会命宫三方',
    '文昌会命宫三方',
    '禄存会命宫三方',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sun, '太阳')) bonus.push('太阳庙旺');
  if (isBright(liang, '天梁')) bonus.push('天梁庙旺');
  if (sanFangSet.has('化科')) bonus.push('再会化科');
  if (isDim(sun, '太阳')) breaking.push('太阳落陷（阳梁失辉）');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('三方煞重');

  patterns.push({
    name: 'Dương Lương Xương Lộc',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn tứ sao hội Mệnh Cung tam phương, xưng hào "Khoa Cử chi tinh", chủ thanh quý hiển đạt, khảo vận cực kỳ tốt, thích hợp đi con đường học thuật, văn giáo, nghiên cứu, chứng nhận chuyên môn, cả đời công danh dễ thành tựu.',
    palaces: [sun.name, liang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Dương Lương Xương Lộc Cục》',
  });
}

/** Hỏa Đam cục / Linh Đam cục: Đam Lang + Hỏa Tinh hoặc Đam Lang + Linh Tinh đồng cung hoặc hội chiếu */
function detectHuoTanLingTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tan = findStarPalace(chart, '贪狼');
  if (!tan) return;
  const huo = findStarPalace(chart, '火星');
  const ling = findStarPalace(chart, '铃星');

  for (const [shaName, shaPalace] of [['火星', huo], ['铃星', ling]] as const) {
    if (!shaPalace) continue;
    const sameOrTrine =
      tan.branch === shaPalace.branch ||
      (tan.branch + 4) % 12 === shaPalace.branch ||
      (tan.branch + 8) % 12 === shaPalace.branch ||
      (tan.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;
    if (!isInSanFang(chart, tan.branch)) continue;

    const required = [`贪狼${tan.branch === shaPalace.branch ? '同宫' : '会照'}${shaName}`, '贪狼会照命宫三方'];
    const bonus: string[] = [];
    const breaking: string[] = [];
    if (isBright(tan, '贪狼')) bonus.push('贪狼庙旺');
    if (getStarSiHua(tan, '贪狼') === '禄' || getStarSiHua(tan, '贪狼') === '权') bonus.push('贪狼化禄/化权');
    if (hasShaInPalace(tan, ['擎羊', '陀罗'])) breaking.push('贪狼宫又见羊陀（破横发之力）');
    if (hasShaInPalace(tan, SHA_KONG)) breaking.push('贪狼遇空劫（财来财去）');

    patterns.push({
      name: shaName === '火星' ? 'Hỏa Đam Cục' : 'Linh Đam Cục',
      level: breaking.length ? 'good' : 'excellent',
      description: `Đam Lang gặp ${shaName}${tan.branch === shaPalace.branch ? 'đồng cung' : 'tam phương hội chiếu'}, chủ đột phát hoành tài, cơ hội đột ngột. Cổ thư vân "Đam Lang ngộ hỏa linh, tất phát hoành tài", nhưng đến nhanh đi cũng nhanh, nên thấy tốt liền thu.${breaking.length ? 'Cục diện này điều kiện phá đã trigger, lực phát giảm.' : ''}`,
      palaces: [tan.name, shaPalace.name],
      conditions: { required, bonus, breaking },
      source: '《Tử Vi Đẩu Số Tủy Nãot Phú》',
    });
  }
}

/** Võ Đam cục: Võ Cực + Đam Lang đồng cung (Sửu/Mùi) hoặc đối chiếu */
function detectWuTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const tan = findStarPalace(chart, '贪狼');
  if (!wu || !tan) return;
  const sameOrOppose = wu.branch === tan.branch || (wu.branch + 6) % 12 === tan.branch;
  if (!sameOrOppose) return;
  if (!isInSanFang(chart, wu.branch) && !isInSanFang(chart, tan.branch)) return;

  const required = [
    wu.branch === tan.branch ? '武曲贪狼同宫（丑/未）' : '武曲贪狼对宫拱照',
    '会照命宫三方',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('火星') || sanFangAllStars(chart).has('铃星'))
    bonus.push('再遇火星/铃星（火贪/铃贪叠加）');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('武曲化禄');
  if (hasShaInPalace(wu, ['擎羊', '陀罗'])) breaking.push('武贪宫见羊陀');
  if (hasShaInPalace(wu, SHA_KONG)) breaking.push('武贪宫遇空劫');

  patterns.push({
    name: 'Võ Đam Cục',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Võ Cực Đam Lang hội mệnh, tài tinh dữ đào hoa dục vọng tinh giao huy, cổ thư vân "Võ Đam bất phát thiếu niên nhân"——ba mươi tuổi phương năng tích lũy phát huy. Chủ trung niên dĩ hậu đại phú quý, tài nguyên do nhân mạch, ứng tiêu, quản lý dục vọng mà đến, thích hợp tài chính, đầu cơ, bán hàng, giải trí.',
    palaces: [wu.name, tan.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú》',
  });
}

/** Sát Phá Lang: Thất Sát, Phá Quân, Đam Lang tam phương tề tụ */
function detectShaPoLang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['七杀', '破军', '贪狼'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;

  const required = ['七杀、破军、贪狼三星齐入命宫三方四正'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('化禄') || sanFangSet.has('化权')) bonus.push('三方有化禄或化权（动得有力）');
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('辅弼同会（变动中得贵人）');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('煞星过重（动而无成）');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('命坐空劫（动得辛苦）');

  patterns.push({
    name: 'Sát Phá Lang',
    level: breaking.length ? 'caution' : 'good',
    description: 'Thất Sát, Phá Quân, Đam Lang tam sao hội mệnh, khai sáng xuyên lãng chi mệnh cách. Cả đời biến đổi nhiều, không phục trần phàm, thích hợp sáng lập doanh nghiệp, quân cảnh, kinh doanh, bán hàng. Trung niên dĩ hậu mới ổn định thủ thành, trẻ tuổi dễ bởi xung động thất bại.',
    palaces: getSanFangPalaces(chart).filter(p => has.includes(getMajorStarNames(p)[0])).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Sát Phá Lang》',
  });
}

/** Cơ Nguyệt Đồng Lương: Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương tứ sao đồng nhập Mệnh Di Quan Tài Quan */
function detectJiYueTongLiang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length < 4) return;

  const required = ['天机、太阴、天同、天梁四星齐入命宫三方四正'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('再会昌曲');
  if (sanFangSet.has('化科')) bonus.push('再会化科');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('煞星过多（机月同梁忌煞）');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('命宫坐煞');

  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Cơ Thái Âm Thiên Đồng Thiên Lương tứ sao đồng nhập Mệnh Di Quan Tài Quan, văn chất vân vân, thông tuệ thiện mưu. Thích hợp nhất công chức, học thuật, văn nghệ, y học, dịch vụ v.v cần tích lũy ổn định, không thích đại mạo hiểm đại đầu cơ.',
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Cơ Nguyệt Đồng Lương Cục》',
  });
}

/** Liêm Trung Thiên Tương: đồng cung */
function detectLianXiang(chart: ZiweiChart, patterns: Pattern[]) {
  const lian = findStarPalace(chart, '廉贞');
  const xiang = findStarPalace(chart, '天相');
  if (!lian || !xiang || lian.branch !== xiang.branch) return;

  const inMing = lian.branch === chart.mingGongBranch;
  const required = ['廉贞天相同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(lian, '禄存') || getStarSiHua(lian, '廉贞') === '禄') bonus.push('见禄存或廉贞化禄');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('左辅会照');
  if (hasShaInPalace(lian, ['擎羊'])) breaking.push('廉相宫坐擎羊（廉杀羊倾向）');
  if (getStarSiHua(lian, '廉贞') === '忌') breaking.push('廉贞化忌');

  patterns.push({
    name: 'Liêm Trung Thiên Tương Cục',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: 'Liêm Trung Thiên Tương đồng cung, ấn thụ cục diện, chủ bảnh đảm xử sự, thanh liêm chi danh, thích hợp nhận công chức, hành chính, pháp vụ, kỹ hoạch. Sợ gặp Kình Dương hóa Kỵ, tắc phản chủ quan phi.',
    palaces: [lian.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Võ Cực Thất Sát: đồng cung, tướng tinh phối tài tinh */
function detectWuQiSha(chart: ZiweiChart, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const qi = findStarPalace(chart, '七杀');
  if (!wu || !qi || wu.branch !== qi.branch) return;

  const inMing = wu.branch === chart.mingGongBranch;
  const required = ['武曲七杀同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(wu, '武曲') === '权') bonus.push('武曲化权');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('武曲化禄');
  if (getStarSiHua(wu, '武曲') === '忌') breaking.push('武曲化忌（武曲化忌为财劫之兆）');
  if (hasShaInPalace(wu, ['擎羊', '陀罗', '火星', '铃星'])) breaking.push('武杀宫煞星过多');

  patterns.push({
    name: 'Võ Cực Thất Sát',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: 'Võ Cực Thất Sát đồng cung, tướng tinh phối tài tinh, chủ quả quyết cương nghị, tài lý năng lực mạnh, thích hợp tài chính, quân cảnh, sáng lập doanh nghiệp. Nhưng kiêng gặp hóa Kỵ sát tinh, tắc hung hiểm. Cả đời phấn đấu, tích tài nhưng trông nom.',
    palaces: [wu.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Thiên Đồng Thiên Lương: đồng cung */
function detectTongLiang(chart: ZiweiChart, patterns: Pattern[]) {
  const tong = findStarPalace(chart, '天同');
  const liang = findStarPalace(chart, '天梁');
  if (!tong || !liang || tong.branch !== liang.branch) return;

  const required = ['天同天梁同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌')) bonus.push('文昌会照');
  if (getStarSiHua(tong, '天同') === '禄') bonus.push('天同化禄');
  if (hasShaInPalace(tong, SHA_HARD)) breaking.push('煞星同坐');

  patterns.push({
    name: 'Thiên Đồng Thiên Lương Cục',
    level: breaking.length ? 'neutral' : 'good',
    description: 'Thiên Đồng Thiên Lương đồng cung, phước tinh dữ ấm tinh cộng hội, chủ khoan hậu hòa thiện, lạc thiện giúp nhân, thích hợp y học, giáo dục, tôn giáo, công ích xã hội. Nhưng thiên ôn hòa bảo thủ, khó thành đại phú quý.',
    palaces: [tong.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Nhật Nguyệt đồng cung: Thái Dương Thái Âm Sửu hoặc Mùi cung đồng cung */
function detectRiYueTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const sun = findStarPalace(chart, '太阳');
  const moon = findStarPalace(chart, '太阴');
  if (!sun || !moon || sun.branch !== moon.branch) return;
  if (sun.branch !== 1 && sun.branch !== 7) return;  // Phải Sửu(1) hoặc Mùi(7)

  const inMing = sun.branch === chart.mingGongBranch;
  const required = [`太阳太阴同入${BRANCH_NAMES[sun.branch]}宫`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sun.branch === 7) bonus.push('未宫日月同辉（古书云未宫日月双美）');
  if (sanFangAllStars(chart).has('文昌') && sanFangAllStars(chart).has('文曲')) bonus.push('昌曲会照');
  if (hasShaInPalace(sun, SHA_HARD)) breaking.push('日月宫煞星同坐');

  patterns.push({
    name: 'Nhật Nguyệt Đồng Cung',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: `Thái Dương Thái Âm tại ${BRANCH_NAMES[sun.branch]} cung đồng cung, âm dương bình hành, văn võ gồm đủ. Chủ duyên异性缘佳, sự nghiệp thuận thuận, danh vọng truyền xa.${sun.branch === 7 ? 'Mùi cung nhật nguyệt song mỹ đặc biệt tốt.' : 'Sửu cung nhật nguyệt đồng cung lực tương đối bình.'}`,
    palaces: [sun.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Nhật Nguyệt giá mệnh: Thái Dương Thái Âm tại hai cung trước sau Mệnh Cung */
function detectRiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasSun = hasStar(prev, '太阳');
  const prevHasMoon = hasStar(prev, '太阴');
  const nextHasSun = hasStar(next, '太阳');
  const nextHasMoon = hasStar(next, '太阴');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;

  const sunPalace = prevHasSun ? prev : next;
  const moonPalace = prevHasMoon ? prev : next;
  const required = ['太阳太阴分居命宫前后两宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sunPalace, '太阳')) bonus.push('太阳庙旺');
  if (isBright(moonPalace, '太阴')) bonus.push('太阴庙旺');
  if (isDim(sunPalace, '太阳') || isDim(moonPalace, '太阴')) breaking.push('日月落陷（夹命无光）');

  patterns.push({
    name: 'Nhật Nguyệt Giá Mệnh',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương Thái Âm phân cư Mệnh Cung lưỡng chưỡng giá chiếu, quang minh lỗi lạc, cả đời quý nhân tương trợ, sự nghiệp bừng bừng. Nam chủ quan quý, nữ chủ vượng phu hưng gia. Nhật nguyệt tắc bất lưỡng hãm phương viên chân giá.',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Nhật Nguyệt Giá Mệnh》',
  });
}

/** Cự Nhật đồng cung: Cử Môn Thái Dương đồng nhập Dần hoặc Thân */
function detectJuRiTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const ju = findStarPalace(chart, '巨门');
  const sun = findStarPalace(chart, '太阳');
  if (!ju || !sun || ju.branch !== sun.branch) return;
  if (ju.branch !== 2 && ju.branch !== 8) return;  // Phải Dần(2) hoặc Thân(8)

  const inMing = ju.branch === chart.mingGongBranch;
  const required = [`巨门太阳同入${BRANCH_NAMES[ju.branch]}宫`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (ju.branch === 2) bonus.push('寅宫太阳庙旺，巨门得日光化解是非');
  if (getStarSiHua(ju, '巨门') === '禄' || getStarSiHua(ju, '巨门') === '权') bonus.push('巨门化禄/化权（口才生财）');
  if (getStarSiHua(ju, '巨门') === '忌') breaking.push('巨门化忌（口舌官非）');
  if (ju.branch === 8) breaking.push('申宫太阳偏西，巨门暗曜更显');

  patterns.push({
    name: 'Cự Nhật Đồng Cung',
    level: breaking.length ? 'caution' : (inMing && ju.branch === 2 ? 'excellent' : 'good'),
    description: `Cử Môn Thái Dương đồng ${BRANCH_NAMES[ju.branch]} cung, Thái Dương hóa giải Cử Môn ám diệu chiếu, chủ dĩ khẩu tài, truyền thông, ngoại ngữ, chuyên môn lập nghiệp. Dần cung vi gả, Thân cung lực giảm. Sợ Cử Môn hóa Kỵ tắc quan phi.`,
    palaces: [ju.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Cự Nhật Đồng Cung》',
  });
}

/** Thạch Trung Ẩn Ngọc: Cử Môn nhập mệnh tại Tử hoặc Ngọ cung */
function detectShiZhongYinYu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '巨门')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;  // Tử(0) hoặc Ngọ(6)

  const required = [`巨门入命于${BRANCH_NAMES[ming.branch]}宫`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(ming, '巨门') === '禄' || getStarSiHua(ming, '巨门') === '权') bonus.push('巨门化禄/化权');
  if (sanFangAllStars(chart).has('文昌')) bonus.push('文昌会照（石中隐玉得明）');
  if (getStarSiHua(ming, '巨门') === '忌') breaking.push('巨门化忌（玉藏深泥）');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('命坐煞星');

  patterns.push({
    name: 'Thạch Trung Ẩn Ngọc',
    level: breaking.length ? 'caution' : 'excellent',
    description: 'Cử Môn tọa mệnh Tử Ngọ, ngoại biểu bình thường nội tàng tài học. Sớm niên im lặng vô văn, trung niên phương hiển quý khí, thích hợp đi chuyên môn, nghiên cứu, khẩu tài, truyền thông. Cần có Lộc Quyền hoặc Văn Xương tương trợ phương năng "tác thạch kiến ngọc".',
    palaces: ['Mệnh Cung'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Thạch Trung Ẩn Ngọc》',
  });
}

/** Minh Châu Xuất Hải: Mệnh Cung tại Mùi không cung, đối cung Sửu là Thái Dương Thái Âm */
function detectMingZhuChuHai(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 7) return;   // Mệnh tại Mùi
  if (getMajorStarNames(ming).length > 0) return;   // Mệnh Cung là không cung
  const dui = getDuiGong(chart, ming.branch);
  if (!dui) return;
  if (!hasStar(dui, '太阳') || !hasStar(dui, '太阴')) return;

  const required = ['命宫在未为空宫', '对宫丑宫为太阳太阴同度'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌') || sanFangAllStars(chart).has('文曲')) bonus.push('再会昌曲');
  if (sanFangAllStars(chart).has('左辅') || sanFangAllStars(chart).has('右弼')) bonus.push('辅弼相助');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('煞星会照（珠光黯淡）');

  patterns.push({
    name: 'Minh Châu Xuất Hải',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Mệnh Mùi không cung, đối cung Sửu cung nhật nguyệt đồng huy chiếu, hiệu "Minh Châu Xuất Hải". Chủ xuất thân bình thường, hậu thiên nỗ lực vượt lên, thích hợp viễn phụ tha hương, học thuật nghiên cứu hoặc chức vụ cao trong đại công ty, chủ đại phú quý.',
    palaces: ['Mệnh Cung', dui.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Tập · Minh Châu Xuất Hải》',
  });
}

/** Tử Vi độc tọa nhập mệnh */
function detectZiWeiInMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微') || hasStar(ming, '天府')) return;

  const required = ['紫微独坐命宫（无天府同坐）'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('左辅右弼同会');
  if (sanFangSet.has('文昌') && sanFangSet.has('文曲')) bonus.push('文昌文曲同会');
  if (!sanFangSet.has('左辅') && !sanFangSet.has('右弼')) breaking.push('无辅弼（孤君无臣）');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('紫微遇空劫（古书最忌）');

  patterns.push({
    name: 'Tử Vi Nhập Mệnh',
    level: breaking.length ? 'caution' : (bonus.length ? 'excellent' : 'good'),
    description: 'Tử Vi độc tọa Mệnh Cung, Đế vương chi tinh, tự tôn tâm cường, có lãnh đạo mị lực. Nhưng Tử Vi tối ky "tại dã cô quân"——nếu vô Tả Hữu Phụ Tịch tương hội, phản thành cô cao tự ngạo, dễ chiêu hủy bang.',
    palaces: ['Mệnh Cung'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Phụ Tịch giá mệnh */
function detectFuBiJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasZuo = hasStar(prev, '左辅');
  const prevHasYou = hasStar(prev, '右弼');
  const nextHasZuo = hasStar(next, '左辅');
  const nextHasYou = hasStar(next, '右弼');
  if (!((prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo))) return;

  const required = ['左辅右弼分居命宫前后两宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('再会魁钺');

  patterns.push({
    name: 'Phụ Tịch Giá Mệnh',
    level: 'excellent',
    description: 'Tả Phụ Hữu Tịch giá mệnh, cả đời quý nhân không ngừng, phùng hung hóa kỳ. Thích hợp đi sự nghiệp, quản lý đại doanh nghiệp, có quý nhân đề bạt chi mệnh. Cổ thư vân "Tả Phụ Hữu Tịch, chung thân phước hậu".',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Phụ Tịch Giá Mệnh》',
  });
}

/** Xương Khúc giá mệnh */
function detectChangQuJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasChang = hasStar(prev, '文昌');
  const prevHasQu = hasStar(prev, '文曲');
  const nextHasChang = hasStar(next, '文昌');
  const nextHasQu = hasStar(next, '文曲');
  if (!((prevHasChang && nextHasQu) || (prevHasQu && nextHasChang))) return;

  patterns.push({
    name: 'Xương Khúc Giá Mệnh',
    level: 'excellent',
    description: 'Văn Xương Văn Khúc giá Mệnh Cung, chủ thông minh tuấn tú, văn thái phi nhiên, thích hợp đi văn giáo, học thuật, nghệ thuật, viết lách. Cổ thư vân "Xương Khúc giá mệnh chủ khoa giáp", tối lợi khảo vận.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['文昌文曲分居命宫前后两宫'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Khôi Vượng giá mệnh */
function detectKuiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '天魁') && hasStar(next, '天钺');
  const okB = hasStar(prev, '天钺') && hasStar(next, '天魁');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Khôi Vượng Giá Mệnh',
    level: 'good',
    description: 'Thiên Khôi Thiên Vượng giá mệnh, nam xưng Thiên Ết, nữ xưng Ngọc Đường, cả đời quý nhân đề bạt. Khảo thí, tìm việc, thời khắc then chốt thường có quý nhân bất ngờ tương trợ.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['天魁天钺分居命宫前后两宫'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Song Lộc triều Viên: Hóa Lộc + Lộc Tồn đồng hội tam phương */
function detectShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false;
  let luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === '禄')) huaLuFound = true;
    if (hasStar(p, '禄存')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;

  patterns.push({
    name: 'Song Lộc Triều Viên',
    level: 'excellent',
    description: 'Hóa Lộc, Lộc Tồn đồng hội Mệnh Cung tam phương tứ chánh, tài nguyên dũng động, ăn mặc sung túc. Cổ thư vân "Song Lộc triều viên, phú tỷ Đào Chu", chủ cả đời không lo tiền bạc, nhiều chính tài hoành tài kiêm đắc.',
    palaces: sanFang.map(p => p.name),
    conditions: {
      required: ['化禄会照三方四正', '禄存会照三方四正'],
      breaking: hasShaInPalace(ming, SHA_KONG) ? ['命坐空劫（双禄遇空，财来财去）'] : undefined,
    },
    source: '《Tử Vi Đẩu Số Toàn Thư · Song Lộc Triều Viên》',
  });
}

/** Tam Kỳ gia hội: Hóa Lộc Hóa Quyền Hóa Khoa đồng hội tam phương */
function detectSanQiJiaHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangPalaces = getSanFangPalaces(chart);
  let lu = false, quan = false, ke = false;
  for (const p of sanFangPalaces) {
    for (const s of p.stars) {
      if (s.siHua === '禄') lu = true;
      if (s.siHua === '权') quan = true;
      if (s.siHua === '科') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;

  patterns.push({
    name: 'Tam Kỳ Gia Hội',
    level: 'excellent',
    description: 'Hóa Lộc, Hóa Quyền, Hóa Khoa tam cát hóa tề hội Mệnh Cung tam phương tứ chánh, xưng hào "Tam Kỳ gia hội". Chủ cả đời công danh, tài phú, quý nhân tam toàn, là một trong các cục diện cao nhất của Tử Vi Đẩu Số.',
    palaces: sanFangPalaces.map(p => p.name),
    conditions: { required: ['化禄、化权、化科三吉化齐会命宫三方四正'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tam Kỳ Gia Hội》',
  });
}

/** Hóa Lộc nhập mệnh/quan/tài */
function detectHuaLuRuMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === '禄' && s.type === 'major');
  if (!huaLuStar) return;

  patterns.push({
    name: `${huaLuStar.name}化禄入命`,
    level: 'good',
    description: `${huaLuStar.name} hóa Lộc tọa Mệnh Cung, chủ sinh tài thuận lợi, nhân duyên gia, cơ hội nhiều. ${huaLuStar.name === '武曲' ? 'Võ Cực hóa Lộc thuộc chính tài, thích công nghiệp, tài chính.' : huaLuStar.name === '太阴' ? 'Thái Âm hóa Lộc thuộc âm tài, bất động sản.' : huaLuStar.name === '贪狼' ? 'Đam Lang hóa Lộc thuộc nhân mạch tài, đào hoa tài.' : ''}`,
    palaces: ['Mệnh Cung'],
    conditions: { required: [`${huaLuStar.name}化禄坐命宫`] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

// ────────────────── Bộ nhận diện cục diện ác ──────────────────

/** Hóa Kỵ nhập mệnh/Di */
function detectHuaJiRuMingQian(chart: ZiweiChart, patterns: Pattern[]) {
  const qianBranch = (chart.mingGongBranch + 6) % 12;
  for (const palace of chart.palaces) {
    if (palace.branch !== chart.mingGongBranch && palace.branch !== qianBranch) continue;
    const jiStar = palace.stars.find(s => s.siHua === '忌' && s.type === 'major');
    if (!jiStar) continue;

    const inMing = palace.branch === chart.mingGongBranch;
    patterns.push({
      name: `${jiStar.name}化忌入${inMing ? '命' : '迁'}`,
      level: 'caution',
      description: inMing
        ? `${jiStar.name} hóa Kỵ tọa Mệnh Cung, cần lưu ý bản thân cố chấp, trở ngại tâm lý hoặc tiềm ẩn sức khỏe, mọi việc lui một bước suy nghĩ. Hóa Kỵ không nhất định xấu, đại diện sao này năng lượng cần chú ý đặc biệt.`
        : `${jiStar.name} hóa Kỵ tọa Di Quan Cung, ngoại出去, xa du, quan hệ nhân sự dễ có trồi sụm, nên thủ bất nên động.`,
      palaces: [palace.name],
      conditions: { required: [`${jiStar.name}化忌坐${inMing ? '命' : '迁'}宫`] },
      source: '《Tử Vi Đẩu Số Toàn Thư》',
    });
  }
}

/** Dương Đà giá Kỵ: Hóa Kỵ tọa cung, Tả Hữu bị Kình Dương Đà La giá */
function detectYangTuoJiaJi(chart: ZiweiChart, patterns: Pattern[]) {
  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === '忌');
    if (!jiStar) continue;
    if (palace.branch !== chart.mingGongBranch) continue;   // Chỉ xem Mệnh Cung bị giá

    const { prev, next } = getJiaPalaces(chart, palace.branch);
    if (!prev || !next) continue;
    const aPrev = hasStar(prev, '擎羊') && hasStar(next, '陀罗');
    const aNext = hasStar(prev, '陀罗') && hasStar(next, '擎羊');
    if (!aPrev && !aNext) continue;

    patterns.push({
      name: 'Dương Đà Giá Kỵ',
      level: 'caution',
      description: 'Hóa Kỵ tọa mệnh, Tả Hữu Kình Dương Đà La phân cư Mệnh Cung trước sau giá, cổ thư vân "Dương Đà giá Kỵ vi bại cục", chủ cả đời lao lực bôn tẩu, khốn khổ bất thuận, thân tâm câu bất. Cần dĩ đức hạnh tu dưỡng dữ cải tác tích cực hóa giải, mọi việc cẩn thận vi thượng.',
      palaces: ['Mệnh Cung', prev.name, next.name],
      conditions: { required: ['化忌坐命', '擎羊陀罗分居命宫前后两宫'] },
      source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Dương Đà Giá Kỵ》',
    });
    return;
  }
}

/** Hỏa Linh giá mệnh: Hỏa Tinh Linh Tinh phân cư Mệnh Cung trước sau */
function detectHuoLingJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '火星') && hasStar(next, '铃星');
  const okB = hasStar(prev, '铃星') && hasStar(next, '火星');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Hỏa Linh Giá Mệnh',
    level: 'caution',
    description: 'Hỏa Tinh Linh Tinh phân cư Mệnh Cung trước sau lưỡng cung giá mệnh, chủ tính c急, dễ xung động, đột ngột ngoài ý hoặc tranh chấp. Cần bồi dưỡng nhẫn nại, tránh quyết định xung động.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['火星铃星分居命宫前后两宫'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Không Hóa giá mệnh: Địa Không Địa Hóa phân cư Mệnh Cung trước sau */
function detectKongJieJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '地空') && hasStar(next, '地劫');
  const okB = hasStar(prev, '地劫') && hasStar(next, '地空');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Không Hóa Giá Mệnh',
    level: 'caution',
    description: 'Địa Không Địa Hóa giá mệnh, chủ tài lai tài khứ, tư tưởng tháo tuột, dễ遁入 tôn giáo triết học. Cổ thư vân "Không Hóa giá mệnh, tài bất tụ". Thích kỹ nghệ, tôn giáo, nghiên cứu v.v không trọng vật chất chi nghiệp.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['地空地劫分居命宫前后两宫'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Liêm Sát Dương: Liêm Trung, Thất Sát, Kình Dương tam sao hội chiếu (Lưu niên đại hạn tối hung) */
function detectLianShaYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('廉贞') && sanFangSet.has('七杀') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: 'Liêm Sát Dương',
    level: 'caution',
    description: 'Liêm Trung, Thất Sát, Kình Dương tam sao hội chiếu Mệnh Cung tam phương, cổ thư cảnh tỉnh chi hung cục. Chủ huyết quang, quan phi, ngoài ý. Bản mệnh có cục diện này không cần kinh hoảng, nhưng lưu niên đại hạn tái trigger thời cần đặc biệt cẩn thận lái xe, tránh xung đột, chú ý rủi ro phẫu thuật.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['廉贞、七杀、擎羊三星会照三方四正'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Liêm Sát Dương》',
  });
}

/** Cự Hỏa Dương: Cử Môn, Hỏa Tinh, Kình Dương hội chiếu */
function detectJuHuoYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('巨门') && sanFangSet.has('火星') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: 'Cự Hỏa Dương',
    level: 'caution',
    description: 'Cử Môn, Hỏa Tinh, Kình Dương tam sao hội chiếu, cổ thư vân "Cự Hỏa Dương, chung thân dĩ tử"——Cổ thời hung cục. Hiểu biết đương đại: Dễ vì khẩu thị, kịch liệt xung đột mà chiêu đại họa. Cần tu thân dưỡng tính, thận ngôn thận hành, tránh cực đoan cảm xúc.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['巨门、火星、擎羊三星会照三方四正'] },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Cự Hỏa Dương》',
  });
}

/** Linh Xương Đà Võ: Linh Tinh, Văn Xương, Đà La, Võ Cực hội chiếu (Hạn chí đầu hà) */
function detectLingChangTuoWu(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('铃星') && sanFangSet.has('文昌') && sanFangSet.has('陀罗') && sanFangSet.has('武曲'))) return;

  patterns.push({
    name: 'Linh Xương Đà Võ',
    level: 'caution',
    description: 'Linh Tinh, Văn Xương, Đà La, Võ Cực tứ sao tề hội, cổ thư vân "Linh Xương Đà Võ, hạn chí đầu hà"——Cổ thời đại hung cục. Bản mệnh có tổ hợp này bản thân không cần kinh hoảng, nhưng lưu niên đại hạn trigger thời cần cao độ cảnh giác đại quyết định, cảm xúc trồi sụm, hoạt động bờ nước.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['铃星、文昌、陀罗、武曲四星会照三方四正'] },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Linh Xương Đà Võ》',
  });
}

/** Mã Đầu dài tiễn: Kình Dương tại Ngọ cung tọa mệnh */
function detectMaTouDaiJian(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 6) return;   // Phải Ngọ
  if (!hasStar(ming, '擎羊')) return;

  const required = ['擎羊于午宫坐命'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('七杀') || sanFangAllStars(chart).has('破军')) bonus.push('再会七杀或破军（武职大贵）');
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('魁钺加照');

  patterns.push({
    name: 'Mã Đầu Dài Tiễn',
    level: bonus.length ? 'good' : 'caution',
    description: 'Kình Dương tại Ngọ cung tọa mệnh, hiệu "Uy trấn biên cương". Cổ thư vân "Uy trấn biên cương"——chủ cương nghị quả quyết, có xung sát chi lực, thích quân cảnh võ chức, vận động viên, ngoại khoa y sĩ. Nhưng đồng thời chủ nguy hiểm dữ ngoài ý, cần phối hợp Sát Phá Lang hoặc quý nhân phương viên đại cục, tắc phản chủ huyết quang.',
    palaces: ['Mệnh Cung'],
    conditions: { required, bonus },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Mã Đầu Dài Tiễn》',
  });
}

// ────────────────── Cục diện cơ bản (Nâng cao tỷ lệ nhận diện)──────────────────
// Thiết kế: Để bản đồ bình thường cũng có thể nhận diện ra 1-3 cục diện phổ biến, mà không phải 30+ cục cổ thư nghiêm khắc đều không tương xứng.
// Đây đều là nhận diện nhẹ lượng trigger bằng điều kiện đơn, level đa số là neutral / good.

/** Lộc Tồn thủ thân: Lộc Tồn nhập thân cung (hoặc Mệnh Cung dữ Thân Cung đồng cung) */
function detectLuCunShouShen(chart: ZiweiChart, patterns: Pattern[]) {
  const luCunPalace = findStarPalace(chart, '禄存');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;
  patterns.push({
    name: inMing ? 'Lộc Tồn Thủ Mệnh' : 'Lộc Tồn Thủ Thân',
    level: 'good',
    description: inMing
      ? 'Lộc Tồn tọa mệnh, chủ cả đời ăn mặc vô phiền, tài lộc ổn định. Tính cách bảo thủ, thiện tích lũy, nhưng Dương Đà giá Lộc tắc phòng tiểu nhân. Tối thích phối hóa Lộc, Tả Hữu Phụ Tịch phương viên đại cục.'
      : 'Lộc Tồn nhập thân cung, chủ trung niên dĩ hậu tài nguyên ổn định, đắc Lộc tự hưởng. Nhu Sư nói 「Lộc Tồn nhập thân, tài khí cận thân」——phu thê hoặc phương hướng sự nghiệp năng mang đến tài lộc ổn định.',
    palaces: [inMing ? 'Mệnh Cung' : 'Thân Cung'],
    conditions: { required: [inMing ? '禄存入命宫' : '禄存入身宫'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Lộc Tồn Tinh》',
  });
}

/** Thiên Mã nhập mệnh/Di: Ất Mã tinh động */
function detectTianMaRuMing(chart: ZiweiChart, patterns: Pattern[]) {
  const tianMaPalace = findStarPalace(chart, '天马');
  if (!tianMaPalace) return;
  const inMing = tianMaPalace.branch === chart.mingGongBranch;
  const inQian = tianMaPalace.branch === ((chart.mingGongBranch + 6) % 12);
  if (!inMing && !inQian) return;
  patterns.push({
    name: inMing ? 'Thiên Mã Nhập Mệnh' : 'Thiên Mã Tại Di',
    level: 'neutral',
    description: inMing
      ? 'Thiên Mã tọa mệnh, chủ cả đời bôn tẩu, động trung đắc tài, thích đi thương lữ, ngoại cần, xuyên biên phát triển. Nhu Sư nói 「Thiên Mã nhập mệnh, vô Lộc bất phát」——nếu tái hội Lộc Tồn hoặc hóa Lộc tắc 「Lộc Mã giao trì」chi phú cục.'
      : 'Thiên Mã tại Di Quan Cung, chủ ngoại出去 có lợi, viễn hành đắc tài, thích dị hương phát triển. Phối hóa Lộc chủ dị đới sinh tài, phối sát tinh tắc du lữ đa ba.',
    palaces: [tianMaPalace.name],
    conditions: { required: [inMing ? '天马入命宫' : '天马入迁移宫'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Thiên Mã Tinh》',
  });
}

/** Hóa Lộc nhập tài: Tài Bạch Cung chủ tinh hóa Lộc */
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === '财帛');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && s.siHua === '禄');
  if (!luStar) return;
  patterns.push({
    name: 'Hóa Lộc Nhập Tài',
    level: 'good',
    description: `${luStar.name} hóa Lộc nhập Tài Bạch Cung, chủ tài nguyên sung thông, thu nhập ổn định. Nhu Sư giảng hóa Lộc là 「chính tài」tượng trưng——sao hóa Lộc này đại biểu năng lực (đặc tính cốt lõi của ${luStar.name}) là trục chính kiếm tiền của ngươi. Phối Lộc Tồn hoặc Thiên Mã tắc tài nguyên càng rộng.`,
    palaces: ['Tài Bạch'],
    conditions: { required: [`${luStar.name}化禄入财帛宫`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
  });
}

/** Hóa Quyền nhập quan: Quan Lộc Cung chủ tinh hóa Quyền */
function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === '官禄');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && s.siHua === '权');
  if (!quanStar) return;
  patterns.push({
    name: 'Hóa Quyền Nhập Quan',
    level: 'good',
    description: `${quanStar.name} hóa Quyền nhập Quan Lộc Cung, chủ sự nghiệp có khống chế lực, năng đảm đương chức vụ độc đương nhất diện. Hóa Quyền đại biểu quyền lực dữ chấp hành lực——${quanStar.name} hóa Quyền giải thích ngươi tại sự nghiệp thượng năng thành quyết định giả hoặc trọng tâm chấp hành giả, thích đi quản lý hoặc kỹ thuật权威路线.`,
    palaces: ['Quan Lộc'],
    conditions: { required: [`${quanStar.name}化权入官禄宫`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
  });
}

/** Hóa Khoa nhập mệnh/thân: Khoa danh gia thân */
function detectHuaKeRuMingShen(chart: ZiweiChart, patterns: Pattern[]) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const target = [ming, shen].filter((p): p is Palace => Boolean(p));
  for (const p of target) {
    const keStar = p.stars.find(s => s.type === 'major' && s.siHua === '科');
    if (!keStar) continue;
    const isMing = p.branch === chart.mingGongBranch;
    patterns.push({
      name: isMing ? 'Hóa Khoa Nhập Mệnh' : 'Hóa Khoa Nhập Thân',
      level: 'good',
      description: `${keStar.name} hóa Khoa nhập ${isMing ? 'mệnh' : 'thân'} cung, chủ danh vọng, văn thư, học thuật vận. Nhu Sư giảng hóa Khoa là 「quý nhân tinh」——${keStar.name} hóa Khoa mang đến là đặc tính được người khác coi trọng, thích từ sự văn thư, giáo dục, nghiên cứu, tư vấn, văn sáng tạo v.v「dĩ danh thủ lợi」phương hướng.`,
      palaces: [isMing ? 'Mệnh Cung' : 'Thân Cung'],
      conditions: { required: [`${keStar.name}化科入${isMing ? '命' : '身'}宫`] },
      source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
    });
    return; // Mệnh và Thân trùng lặp thời chỉ nhận diện một lần
  }
}

/** Cơ Nguyệt Đồng Lương tam sao hội (Phiên bản giảm cấp): Thiên Cơ/Thái Âm/Thiên Đồng/Thiên Lương Bất kỳ 3 sao tề nhập tam phương tứ chánh */
function detectJiYueTongLiangPartial(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length !== 3) return; // 4 sao tề do detectJiYueTongLiang xử lý
  // Tránh trùng lặp với detectJiYueTongLiang (4 sao tề không vào đây)
  const missing = ['天机', '太阴', '天同', '天梁'].filter(s => !sanFangSet.has(s));
  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương Tam Sao Hội',
    level: 'neutral',
    description: `Tam phương tứ chánh hội tề ${has.join('、')}, thiếu ${missing.join('、')} vị hội. Cơ Nguyệt Đồng Lương bất toàn cục, văn chất đới mưu, nhưng ổn định độ bất như tứ sao tề. Vẫn thích công chức, giảng nghiên, y học, dịch vụ v.v cần tích lũy dữ ổn định, then chốt xem vị sao khuyết dữ tứ hóa phối hợp.`,
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required: [`三方四正会${has.join('、')}（Cơ Nguyệt Đồng Lương thiếu ${missing.join('、')}）`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Cơ Nguyệt Đồng Lương Cục》(Phiên bản giảm cấp)',
  });
  void ming;
}

/** Xương Khúc đồng hội: Văn Xương+Văn Khúc đều tại Mệnh tam phương tứ chánh */
function detectChangQuTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('文昌') || !sanFangSet.has('文曲')) return;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return;
  const inMing = hasStar(ming, '文昌') && hasStar(ming, '文曲');
  patterns.push({
    name: inMing ? 'Xương Khúc Tọa Mệnh' : 'Xương Khúc Đồng Hội',
    level: 'good',
    description: inMing
      ? 'Văn Xương Văn Khúc đồng nhập Mệnh Cung, chủ thông minh tuấn tú, văn thái phi nhiên, thích văn học, giáo dục, viết lách, tư vấn. Tối ky hóa Kỵ——Xương Khúc hóa Kỵ chủ văn thư khế ước ám khoản.'
      : 'Văn Xương Văn Khúc đồng hội tam phương tứ chánh, chủ tài hoa tung tú, khẩu tài văn bút câu giỏi. Thích đi cần biểu đạt dữ văn thái ngành nghề, hóa Khoa gia thị tắc danh vọng đại hiển.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['文昌、文曲同会命宫三方四正'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Văn Tinh Luận》',
  });
}

/** Phụ Tịch đồng hội: Tả Phụ+Hữu Tịch đều tại Mệnh tam phương tứ chánh */
function detectFuBiTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('左辅') || !sanFangSet.has('右弼')) return;
  patterns.push({
    name: 'Phụ Tịch Đồng Hội',
    level: 'good',
    description: 'Tả Phụ Hữu Tịch đồng hội Mệnh Cung tam phương tứ chánh, chủ cả đời quý nhân bất tuyệt, nhân duyên cực kỳ tốt. Tối thích vị trí lãnh đạo dữ công tác nhóm hợp tác. Nhu Sư nói 「Phụ Tịch giá mệnh, bình sinh quý nhân đa」——ngươi không phải đơn đả đấu cuộc mệnh, phải thiện dụng nhân mạch mạng lưới.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['左辅、右弼同会命宫三方四正'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Phụ Tịch Luận》',
  });
}

/** Khôi Vượng đồng hội: Thiên Khôi+Thiên Vượng đều tại Mệnh tam phương tứ chánh */
function detectKuiYueTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('天魁') || !sanFangSet.has('天钺')) return;
  patterns.push({
    name: 'Khôi Vượng Đồng Hội',
    level: 'good',
    description: 'Thiên Khôi Thiên Vượng đồng hội Mệnh Cung tam phương tứ chánh, chủ "Thiên Ết quý nhân" gia thị, thời khắc then chốt tổng có quý nhân đề bạt bất ngờ. Nhu Sư nói 「Khôi Vượng giá mệnh, tất vi quý nhân」——gặp khó khăn thời bên cạnh sẽ xuất hiện người tương trợ đắc lực, nên chủ động bảo trì nhân mạch.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['天魁、天钺同会命宫三方四正'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Khôi Vượng Luận》',
  });
}

/** Khoa Quyền song hội: Hóa Khoa + Hóa Quyền đồng hội tam phương tứ chánh */
function detectKeQuanShuangHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sfPalaces = getSanFangPalaces(chart);
  let hasKe = false, hasQuan = false;
  for (const p of sfPalaces) {
    for (const s of p.stars) {
      if (s.type === 'major' && s.siHua === '科') hasKe = true;
      if (s.type === 'major' && s.siHua === '权') hasQuan = true;
    }
  }
  if (!hasKe || !hasQuan) return;
  patterns.push({
    name: 'Khoa Quyền Song Hội',
    level: 'good',
    description: 'Hóa Khoa + Hóa Quyền đồng hội tam phương tứ chánh, chủ danh quyền song mỹ——vừa có học thức/danh vọng (Khoa), lại có khống chế lực (Quyền), thích đi "chuyên môn权威" tuyến (như y sĩ, luật sư, giáo sư, kỹ thuật cốt lõi), danh lợi song thu dữ căn cơ kiên chắc.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['化科、化权同会命宫三方四正'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Hội Chiếu》',
  });
}

// ────────────────── Điểm vào chính ──────────────────
export function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return patterns;

  // Cục diện thượng
  detectJunChenQingHui(chart, ming, patterns);
  detectZiFu(chart, ming, patterns);
  detectFuXiangChaoYuan(chart, ming, patterns);
  detectYangLiangChangLu(chart, ming, patterns);
  detectHuoTanLingTan(chart, ming, patterns);
  detectWuTan(chart, ming, patterns);
  detectShaPoLang(chart, ming, patterns);
  detectJiYueTongLiang(chart, ming, patterns);

  // Cục diện trung
  detectLianXiang(chart, patterns);
  detectWuQiSha(chart, patterns);
  detectTongLiang(chart, patterns);
  detectRiYueTongGong(chart, patterns);
  detectRiYueJiaMing(chart, patterns);
  detectJuRiTongGong(chart, patterns);
  detectShiZhongYinYu(chart, ming, patterns);
  detectMingZhuChuHai(chart, ming, patterns);
  detectZiWeiInMing(chart, ming, patterns);

  // Cục diện trợ lực
  detectFuBiJiaMing(chart, patterns);
  detectChangQuJiaMing(chart, patterns);
  detectKuiYueJiaMing(chart, patterns);
  detectShuangLuChaoYuan(chart, ming, patterns);
  detectSanQiJiaHui(chart, patterns);
  detectHuaLuRuMing(chart, ming, patterns);

  // Cục diện ác
  detectHuaJiRuMingQian(chart, patterns);
  detectYangTuoJiaJi(chart, patterns);
  detectHuoLingJiaMing(chart, patterns);
  detectKongJieJiaMing(chart, patterns);
  detectLianShaYang(chart, patterns);
  detectJuHuoYang(chart, patterns);
  detectLingChangTuoWu(chart, patterns);
  detectMaTouDaiJian(chart, ming, patterns);

  // Cục diện cơ bản (Nâng cao tỷ lệ nhận diện, để bản đồ bình thường cũng có thể nhận diện 1-3 cục)
  detectLuCunShouShen(chart, patterns);
  detectTianMaRuMing(chart, patterns);
  detectHuaLuRuCai(chart, patterns);
  detectHuaQuanRuGuan(chart, patterns);
  detectHuaKeRuMingShen(chart, patterns);
  detectJiYueTongLiangPartial(chart, ming, patterns);
  detectChangQuTongHui(chart, patterns);
  detectFuBiTongHui(chart, patterns);
  detectKuiYueTongHui(chart, patterns);
  detectKeQuanShuangHui(chart, patterns);

  return patterns;
}

// ────────────────── Tóm tắt Mệnh Cung (Bảo tồn tương thích ngược)──────────────────
export function getMingGongSummary(chart: ZiweiChart): {
  stars: string[];
  keywords: string[];
  nature: string;
} {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!mingPalace) return { stars: [], keywords: [], nature: '' };

  const majorStars = mingPalace.stars.filter(s => s.type === 'major');
  const starNames = majorStars.map(s => s.name);

  const keywordMap: Record<string, string[]> = {
    '紫微': ['Tôn Quý', 'Độc Lập', 'Lãnh Đạo'],
    '天机': ['Trí Huệ', 'Cơ Biến', 'Thiện Mưu'],
    '太阳': ['Dương Cương', 'Quan Quý', 'Khảng Đại'],
    '武曲': ['Tài Phú', 'Cương Nghị', 'Quyết Đoán'],
    '天同': ['Ôn Hòa', 'Hưởng Phước', 'Tùy Duyên'],
    '廉贞': ['Tài Nghệ', 'Đào Hoa', 'Nhiều Biến'],
    '天府': ['Tài Khố', 'Ổn Định', 'Bảo Thủ'],
    '太阴': ['Nhu Mỹ', 'Tài Phú', 'Tinh Tế'],
    '贪狼': ['Dục Vọng', 'Đào Hoa', 'Đa Tài'],
    '巨门': ['Thiện Biện', 'Đa Tư', 'Khẩu Tài'],
    '天相': ['Phụ Tác', 'Hành Chính', 'Ổn Kiện'],
    '天梁': ['Ầm Hộ', 'Y Học', 'Trưởng Bối'],
    '七杀': ['Tướng Tinh', 'Quyết Quyết', 'Cô Khắc'],
    '破军': ['Khai Sáng', 'Biến Động', 'Phá Cựu'],
  };

  const natureMap: Record<string, string> = {
    '紫微': 'Đế Quân Tinh', '天机': 'Trí Huệ Tinh', '太阳': 'Quý Nhân Tinh',
    '武曲': 'Tài Phú Tinh', '天同': 'Phước Đức Tinh', '廉贞': 'Đào Hoa Tinh',
    '天府': 'Tài Khố Tinh', '太阴': 'Tài Phú Tinh', '贪狼': 'Đào Hoa Tinh',
    '巨门': 'Thị Phi Tinh', '天相': 'Ấn Thụ Tinh', '天梁': 'Ầm Tị Tinh',
    '七杀': 'Tướng Suất Tinh', '破军': 'Biến Động Tinh',
  };

  const keywords = starNames.flatMap(n => keywordMap[n] ?? []).slice(0, 5);
  const nature = starNames.length > 0 ? (natureMap[starNames[0]] ?? '') : 'Không Cung';

  return { stars: starNames, keywords, nature };
}
