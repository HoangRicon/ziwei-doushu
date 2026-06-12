/**
 * Nhận diện cục diện Tử Vi Đẩu Số (Phiên bản v2 chuẩn hóa)
 *
 * Nguyên tắc thiết kế:
 * 1. Ưu tiên điều kiện sách cổ: Mỗi cục diện liệt kê cấu trúc ba tầng "Phải / Cộng điểm / Phá cục", có thể kiểm chứng nguồn gốc
 * 2. Lập trường Nhu Sư: Không sử dụng công cụ tự hóa công, đại hạn tự hóa, lai nhân công (phải sinh của công)
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
// Dùng tên tiếng Việt đã chuẩn hóa
const SHA_NAMES = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];
const SHA_HARD = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];   // Tứ Sát
const SHA_KONG = ['Địa Không', 'Địa Kiếp'];                          // Không Hóa
const ZUO_YOU = ['Tả Phụ', 'Hữu Bật'];
const CHANG_QU = ['Văn Xương', 'Văn Khúc'];
const KUI_YUE = ['Thiên Khôi', 'Thiên Việt'];

const BRANCH_NAMES_VN = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

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
function branchName(b: number): string {
  return BRANCH_NAMES_VN[b] ?? '';
}

// ────────────────── Bộ nhận diện cục diện chính ──────────────────

/** Quân thần khánh hội: Tử Vi nhập mệnh, Tả Phụ Hữu Tị đồng hội (đồng cung hoặc tam phương) */
function detectJunChenQingHui(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, 'Tử Vi')) return;
  const sanFangSet = sanFangAllStars(chart);
  const hasZuo = sanFangSet.has('Tả Phụ');
  const hasYou = sanFangSet.has('Hữu Bật');
  if (!hasZuo || !hasYou) return;

  const required = ['Tử Vi nhập Mệnh', 'Tả Phụ Hữu Tị đồng hội tam phương tứ chánh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('Văn Xương') || sanFangSet.has('Văn Khúc')) bonus.push('Tái hội Văn Xương hoặc Văn Khúc');
  if (sanFangSet.has('Thiên Khôi') || sanFangSet.has('Thiên Việt')) bonus.push('Khôi Võ quý nhân gia chiếu');
  if (getStarSiHua(ming, 'Tử Vi') === 'Quyền') bonus.push('Tử Vi hóa Quyền');
  if (sanFangShaCount(chart, SHA_KONG) >= 2) breaking.push('Địa Không Địa Kiếp song夹 hội chiếu (Tử Vi kị Không Kiếp)');

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
  const ziwei = findStarPalace(chart, 'Tử Vi');
  const tianfu = findStarPalace(chart, 'Thiên Phủ');
  if (!ziwei || !tianfu || ziwei.branch !== tianfu.branch) return;

  const inMing = ziwei.branch === chart.mingGongBranch;
  const required = inMing
    ? ['Tử Vi Thiên Phủ đồng nhập Mệnh Cung']
    : ['Tử Vi Thiên Phủ đồng cung (không tại Mệnh Cung, hội chiếu giảm lực)'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('Tả Phụ') && sanFangSet.has('Hữu Bật')) bonus.push('Tả Phụ Hữu Tị đồng hội');
  if (sanFangSet.has('Văn Xương') || sanFangSet.has('Văn Khúc')) bonus.push('Tái hội Văn Xương Văn Khúc');
  if (hasShaInPalace(ziwei, SHA_KONG)) breaking.push('Tử Phủ cung tọa Không Kiếp (phá tử phủ chi quý khí)');
  if (shaCountInPalace(ziwei, SHA_HARD) >= 2) breaking.push('Tử Phủ cung thấy song sát đồng tọa');

  patterns.push({
    name: 'Tử Phủ Đồng Cung',
    level: inMing && !breaking.length ? 'excellent' : 'good',
    description: inMing
      ? 'Tử Vi Thiên Phủ đồng nhập Mệnh Cung, Đế tướng tợn lâm, quý tôn chi mệnh. Chủ tính đức ngay thẳng, no ấm vô lo, có lãnh đạo tài năng, thích hợp đảm nhận chức vụ quan trọng. Cần Tả Hữu Bật Tịch đến phối hợp phương viên đại cục hoàn chỉnh.'
      : 'Tử Vi Thiên Phủ đồng cung nhưng vị tại Mệnh, chủ cả đời có quý nhân quý khí yểm trợ, nhưng bản thân không nhất định đại phú quý, cần xem hội chiếu cát sát mà định.',
    palaces: [ziwei.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tử Phủ Đồng Cung Cục》',
  });
}

/** Phủ Tướng Triều Viên: Thiên Phủ, Thiên Tướng lần lượt thủ Mệnh Cung tam phương tứ chánh */
function detectFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tianfu = findStarPalace(chart, 'Thiên Phủ');
  const tianxiang = findStarPalace(chart, 'Thiên Tướng');
  if (!tianfu || !tianxiang) return;
  if (!isInSanFang(chart, tianfu.branch) || !isInSanFang(chart, tianxiang.branch)) return;
  if (tianfu.branch === chart.mingGongBranch && tianxiang.branch === chart.mingGongBranch) return;
  if (tianfu.branch === tianxiang.branch) return;

  const required = ['Thiên Phủ tọa tam phương', 'Thiên Tướng tọa tam phương', 'Hai sao không cùng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(ming, 'Lộc Tồn') || hasStar(ming, 'Lộc')) bonus.push('Mệnh Cung thấy Lộc');
  if (sanFangAllStars(chart).has('Tả Phụ')) bonus.push('Tái hội Tả Phụ');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh Cung tọa sát tinh');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Tam phương tứ chánh sát tinh quá nhiều');

  patterns.push({
    name: 'Phủ Tương Triều Viên',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Phủ Thiên Tướng phân thủ Mệnh Cung tam phương tứ chánh, văn võ tợn chế, quyền ấn song huy, chủ cả đời ăn mặc sung túc, địa vị cao tôn. Cổ thư vân "Phủ Tướng triều viên thiên chung thực lộc", thường gặp trong chính giới, nhà quản lý doanh nghiệp.',
    palaces: [tianfu.name, tianxiang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Phủ Tướng Triều Viên Cục》',
  });
}

/** Dương Lương Xương Lộc: Thái Dương + Thiên Lương + Văn Xương + Lộc Tồn tứ sao hội Mệnh Cung, đại quý cục */
function detectYangLiangChangLu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Thái Dương') || !sanFangSet.has('Thiên Lương') ||
      !sanFangSet.has('Văn Xương') || !sanFangSet.has('Lộc Tồn')) return;

  const sun = findStarPalace(chart, 'Thái Dương')!;
  const liang = findStarPalace(chart, 'Thiên Lương')!;
  const required = [
    'Thái Dương hội mệnh tam phương',
    'Thiên Lương hội mệnh tam phương',
    'Văn Xương hội mệnh tam phương',
    'Lộc Tồn hội mệnh tam phương',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sun, 'Thái Dương')) bonus.push('Thái Dương Miếu Vượng');
  if (isBright(liang, 'Thiên Lương')) bonus.push('Thiên Lương Miếu Vượng');
  if (sanFangSet.has('Khoa')) bonus.push('Tái hội hóa Khoa');
  if (isDim(sun, 'Thái Dương')) breaking.push('Thái Dương Nhập Hãm (Dương Lương thất huy)');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Tam phương sát nặng');

  patterns.push({
    name: 'Dương Lương Xương Lộc',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn tứ sao hội Mệnh Cung tam phương, xưng hào "Khoa Cử chi tinh", chủ thanh quý hiển đạt, khảo vận cực kỳ tốt, thích hợp đi con đường học thuật, văn giáo, nghiên cứu, chứng nhận chuyên môn, cả đời công danh dễ thành tựu.',
    palaces: [sun.name, liang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Dương Lương Xương Lộc Cục》',
  });
}

/** Hỏa Đam cục / Linh Đam cục: Tham Lang + Hỏa Tinh hoặc Tham Lang + Linh Tinh đồng cung hoặc hội chiếu */
function detectHuoTanLingTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tan = findStarPalace(chart, 'Tham Lang');
  if (!tan) return;
  const huo = findStarPalace(chart, 'Hỏa Tinh');
  const ling = findStarPalace(chart, 'Linh Tinh');

  for (const [shaName, shaPalace] of [['Hỏa Tinh', huo], ['Linh Tinh', ling]] as const) {
    if (!shaPalace) continue;
    const sameOrTrine =
      tan.branch === shaPalace.branch ||
      (tan.branch + 4) % 12 === shaPalace.branch ||
      (tan.branch + 8) % 12 === shaPalace.branch ||
      (tan.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;
    if (!isInSanFang(chart, tan.branch)) continue;

    const sameCung = tan.branch === shaPalace.branch;
    const required = [
      `Tham Lang${sameCung ? 'đồng cung' : 'hội chiếu'}${shaName}`,
      'Tham Lang hội chiếu mệnh tam phương',
    ];
    const bonus: string[] = [];
    const breaking: string[] = [];
    if (isBright(tan, 'Tham Lang')) bonus.push('Tham Lang Miếu Vượng');
    if (getStarSiHua(tan, 'Tham Lang') === 'Lộc' || getStarSiHua(tan, 'Tham Lang') === 'Quyền') bonus.push('Tham Lang hóa Lộc/hóa Quyền');
    if (hasShaInPalace(tan, ['Kình Dương', 'Đà La'])) breaking.push('Tham Lang cung lại thấy Dương Đà (phá hoành phát chi lực)');
    if (hasShaInPalace(tan, SHA_KONG)) breaking.push('Tham Lang ngộ Không Kiếp (tài lai tài khứ)');

    patterns.push({
      name: shaName === 'Hỏa Tinh' ? 'Hỏa Đam Cục' : 'Linh Đam Cục',
      level: breaking.length ? 'good' : 'excellent',
      description: `Tham Lang gặp ${shaName}${sameCung ? 'đồng cung' : 'tam phương hội chiếu'}, chủ đột phát hoành tài, cơ hội đột ngột. Cổ thư vân "Tham Lang ngộ hỏa linh, tất phát hoành tài", nhưng đến nhanh đi cũng nhanh, nên thấy tốt liền thu.${breaking.length ? 'Cục diện này điều kiện phá đã trigger, lực phát giảm.' : ''}`,
      palaces: [tan.name, shaPalace.name],
      conditions: { required, bonus, breaking },
      source: '《Tử Vi Đẩu Số Tủy Nãot Phú》',
    });
  }
}

/** Võ Đam cục: Vũ Khúc + Tham Lang đồng cung (Sửu/Mùi) hoặc đối chiếu */
function detectWuTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const wu = findStarPalace(chart, 'Vũ Khúc');
  const tan = findStarPalace(chart, 'Tham Lang');
  if (!wu || !tan) return;
  const sameOrOppose = wu.branch === tan.branch || (wu.branch + 6) % 12 === tan.branch;
  if (!sameOrOppose) return;
  if (!isInSanFang(chart, wu.branch) && !isInSanFang(chart, tan.branch)) return;

  const sameCung = wu.branch === tan.branch;
  const required = [
    sameCung ? 'Vũ Khúc Tham Lang đồng cung (Sửu/Mùi)' : 'Vũ Khúc Tham Lang đối cung hội chiếu',
    'Hội chiếu mệnh tam phương',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Hỏa Tinh') || sanFangAllStars(chart).has('Linh Tinh'))
    bonus.push('Tái ngộ Hỏa Tinh/Linh Tinh (Hỏa Đam/Linh Đam叠加)');
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Lộc') bonus.push('Vũ Khúc hóa Lộc');
  if (hasShaInPalace(wu, ['Kình Dương', 'Đà La'])) breaking.push('Võ Đam cung thấy Dương Đà');
  if (hasShaInPalace(wu, SHA_KONG)) breaking.push('Võ Đam cung ngộ Không Kiếp');

  patterns.push({
    name: 'Võ Đam Cục',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Vũ Khúc Tham Lang hội mệnh, tài tinh dữ đào hoa dục vọng tinh giao huy, cổ thư vân "Võ Đam bất phát thiếu niên nhân"——ba mươi tuổi phương năng tích lũy phát huy. Chủ trung niên dĩ hậu đại phú quý, tài nguyên do nhân mạch, ứng tiêu, quản lý dục vọng mà đến, thích hợp tài chính, đầu cơ, bán hàng, giải trí.',
    palaces: [wu.name, tan.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú》',
  });
}

/** Sát Phá Lang: Thất Sát, Phá Quân, Tham Lang tam phương tề tụ */
function detectShaPoLang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['Thất Sát', 'Phá Quân', 'Tham Lang'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;

  const required = ['Thất Sát, Phá Quân, Tham Lang tam sao tề nhập mệnh tam phương tứ chánh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('Lộc') || sanFangSet.has('Quyền')) bonus.push('Tam phương có hóa Lộc hoặc hóa Quyền (động đắc hữu lực)');
  if (sanFangSet.has('Tả Phụ') && sanFangSet.has('Hữu Bật')) bonus.push('Tả Hữu Bật Tịch đồng hội (biến đổi trung được quý nhân)');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Sát tinh quá nặng (động vô thành)');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Mệnh tọa Không Kiếp (động khổ tâm)');

  patterns.push({
    name: 'Sát Phá Lang',
    level: breaking.length ? 'caution' : 'good',
    description: 'Thất Sát, Phá Quân, Tham Lang tam sao hội mệnh, khai sáng xuyên lãng chi mệnh cách. Cả đời biến đổi nhiều, không phục trần phàm, thích hợp sáng lập doanh nghiệp, quân cảnh, kinh doanh, bán hàng. Trung niên dĩ hậu mới ổn định thủ thành, trẻ tuổi dễ bởi xung động thất bại.',
    palaces: getSanFangPalaces(chart).filter(p => has.includes(getMajorStarNames(p)[0])).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Sát Phá Lang》',
  });
}

/** Cơ Nguyệt Đồng Lương: Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương tứ sao đồng nhập Mệnh Di Quan Tài Quan */
function detectJiYueTongLiang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => sanFangSet.has(s));
  if (has.length < 4) return;

  const required = ['Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương tứ sao tề nhập mệnh tam phương tứ chánh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('Văn Xương') || sanFangSet.has('Văn Khúc')) bonus.push('Tái hội Văn Xương Văn Khúc');
  if (sanFangSet.has('Khoa')) bonus.push('Tái hội hóa Khoa');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Sát tinh quá nhiều (Cơ Nguyệt Đồng Lương kị sát)');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh Cung tọa sát');

  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Cơ Thái Âm Thiên Đồng Thiên Lương tứ sao đồng nhập Mệnh Di Quan Tài Quan, văn chất vân vân, thông tuệ thiện mưu. Thích hợp nhất công chức, học thuật, văn nghệ, y học, dịch vụ v.v cần tích lũy ổn định, không thích đại mạo hiểm đại đầu cơ.',
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Cơ Nguyệt Đồng Lương Cục》',
  });
}

/** Liêm Trinh Thiên Tướng: đồng cung */
function detectLianXiang(chart: ZiweiChart, patterns: Pattern[]) {
  const lian = findStarPalace(chart, 'Liêm Trinh');
  const xiang = findStarPalace(chart, 'Thiên Tướng');
  if (!lian || !xiang || lian.branch !== xiang.branch) return;

  const inMing = lian.branch === chart.mingGongBranch;
  const required = ['Liêm Trinh Thiên Tướng đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(lian, 'Lộc Tồn') || getStarSiHua(lian, 'Liêm Trinh') === 'Lộc') bonus.push('Thấy Lộc Tồn hoặc Liêm Trinh hóa Lộc');
  if (sanFangAllStars(chart).has('Tả Phụ')) bonus.push('Tả Phụ hội chiếu');
  if (hasShaInPalace(lian, ['Kình Dương'])) breaking.push('Liêm Tướng cung tọa Kình Dương (Liêm Sát Dương xu hướng)');
  if (getStarSiHua(lian, 'Liêm Trinh') === 'Kỵ') breaking.push('Liêm Trinh hóa Kỵ');

  patterns.push({
    name: 'Liêm Trinh Thiên Tướng Cục',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: 'Liêm Trinh Thiên Tướng đồng cung, ấn thụ cục diện, chủ bảnh đảm xử sự, thanh liêm chi danh, thích hợp nhận công chức, hành chính, pháp vụ, kỹ hoạch. Sợ gặp Kình Dương hóa Kỵ, tắc phản chủ quan phi.',
    palaces: [lian.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Vũ Khúc Thất Sát: đồng cung, tướng tinh phối tài tinh */
function detectWuQiSha(chart: ZiweiChart, patterns: Pattern[]) {
  const wu = findStarPalace(chart, 'Vũ Khúc');
  const qi = findStarPalace(chart, 'Thất Sát');
  if (!wu || !qi || wu.branch !== qi.branch) return;

  const inMing = wu.branch === chart.mingGongBranch;
  const required = ['Vũ Khúc Thất Sát đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Quyền') bonus.push('Vũ Khúc hóa Quyền');
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Lộc') bonus.push('Vũ Khúc hóa Lộc');
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Kỵ') breaking.push('Vũ Khúc hóa Kỵ (Vũ Khúc hóa Kỵ vi tài kiếp chi triệu)');
  if (hasShaInPalace(wu, ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'])) breaking.push('Võ Sát cung sát tinh quá nhiều');

  patterns.push({
    name: 'Vũ Khúc Thất Sát',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: 'Vũ Khúc Thất Sát đồng cung, tướng tinh phối tài tinh, chủ quả quyết cương nghị, tài lý năng lực mạnh, thích hợp tài chính, quân cảnh, sáng lập doanh nghiệp. Nhưng kiêng gặp hóa Kỵ sát tinh, tắc hung hiểm. Cả đời phấn đấu, tích tài nhưng trông nom.',
    palaces: [wu.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Thiên Đồng Thiên Lương: đồng cung */
function detectTongLiang(chart: ZiweiChart, patterns: Pattern[]) {
  const tong = findStarPalace(chart, 'Thiên Đồng');
  const liang = findStarPalace(chart, 'Thiên Lương');
  if (!tong || !liang || tong.branch !== liang.branch) return;

  const required = ['Thiên Đồng Thiên Lương đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Văn Xương')) bonus.push('Văn Xương hội chiếu');
  if (getStarSiHua(tong, 'Thiên Đồng') === 'Lộc') bonus.push('Thiên Đồng hóa Lộc');
  if (hasShaInPalace(tong, SHA_HARD)) breaking.push('Sát tinh đồng tọa');

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
  const sun = findStarPalace(chart, 'Thái Dương');
  const moon = findStarPalace(chart, 'Thái Âm');
  if (!sun || !moon || sun.branch !== moon.branch) return;
  if (sun.branch !== 1 && sun.branch !== 7) return;  // Phải Sửu(1) hoặc Mùi(7)

  const inMing = sun.branch === chart.mingGongBranch;
  const required = [`Thái Dương Thái Âm đồng nhập ${branchName(sun.branch)} cung`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sun.branch === 7) bonus.push('Mùi cung nhật nguyệt đồng huy (cổ thư vân Mùi cung nhật nguyệt song mỹ)');
  if (sanFangAllStars(chart).has('Văn Xương') && sanFangAllStars(chart).has('Văn Khúc')) bonus.push('Văn Xương Văn Khúc hội chiếu');
  if (hasShaInPalace(sun, SHA_HARD)) breaking.push('Nhật Nguyệt cung sát tinh đồng tọa');

  patterns.push({
    name: 'Nhật Nguyệt Đồng Cung',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: `Thái Dương Thái Âm tại ${branchName(sun.branch)} cung đồng cung, âm dương bình hành, văn võ gồm đủ. Chủ duyên tình duc tot, su nghiep thuan thuan, danh vong truyen xa.${sun.branch === 7 ? 'Mùi cung nhật nguyệt song mỹ đặc biệt tốt.' : 'Sửu cung nhật nguyệt đồng cung lực tương đối bình.'}`,
    palaces: [sun.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Nhật Nguyệt giá mệnh: Thái Dương Thái Âm tại hai cung trước sau Mệnh Cung */
function detectRiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasSun = hasStar(prev, 'Thái Dương');
  const prevHasMoon = hasStar(prev, 'Thái Âm');
  const nextHasSun = hasStar(next, 'Thái Dương');
  const nextHasMoon = hasStar(next, 'Thái Âm');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;

  const sunPalace = prevHasSun ? prev : next;
  const moonPalace = prevHasMoon ? prev : next;
  const required = ['Thái Dương Thái Âm phân cư mệnh cung trước sau hai cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sunPalace, 'Thái Dương')) bonus.push('Thái Dương Miếu Vượng');
  if (isBright(moonPalace, 'Thái Âm')) bonus.push('Thái Âm Miếu Vượng');
  if (isDim(sunPalace, 'Thái Dương') || isDim(moonPalace, 'Thái Âm')) breaking.push('Nhật Nguyệt Nhập Hãm (夹命 vô quang)');

  patterns.push({
    name: 'Nhật Nguyệt Giá Mệnh',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương Thái Âm phân cư Mệnh Cung lưỡng chưỡng giá chiếu, quang minh lỗi lạc, cả đời quý nhân tương trợ, sự nghiệp bừng bừng. Nam chủ quan quý, nữ chủ vượng phu hưng gia. Nhật nguyệt tắc bất lưỡng hãm phương viên chân giá.',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Nhật Nguyệt Giá Mệnh》',
  });
}

/** Cự Nhật đồng cung: Cự Môn Thái Dương đồng nhập Dần hoặc Thân */
function detectJuRiTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const ju = findStarPalace(chart, 'Cự Môn');
  const sun = findStarPalace(chart, 'Thái Dương');
  if (!ju || !sun || ju.branch !== sun.branch) return;
  if (ju.branch !== 2 && ju.branch !== 8) return;  // Phải Dần(2) hoặc Thân(8)

  const inMing = ju.branch === chart.mingGongBranch;
  const required = [`Cự Môn Thái Dương đồng nhập ${branchName(ju.branch)} cung`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (ju.branch === 2) bonus.push('Dần cung Thái Dương Miếu Vượng, Cự Môn được nhật quang hóa giải thị phi');
  if (getStarSiHua(ju, 'Cự Môn') === 'Lộc' || getStarSiHua(ju, 'Cự Môn') === 'Quyền') bonus.push('Cự Môn hóa Lộc/hóa Quyền (khẩu tài sinh tài)');
  if (getStarSiHua(ju, 'Cự Môn') === 'Kỵ') breaking.push('Cự Môn hóa Kỵ (khẩu thị quan phi)');
  if (ju.branch === 8) breaking.push('Thân cung Thái Dương thiên hạ, Cự Môn ám diệu chiếu càng hiển');

  patterns.push({
    name: 'Cự Nhật Đồng Cung',
    level: breaking.length ? 'caution' : (inMing && ju.branch === 2 ? 'excellent' : 'good'),
    description: `Cự Môn Thái Dương đồng ${branchName(ju.branch)} cung, Thái Dương hóa giải Cự Môn ám diệu chiếu, chủ dĩ khẩu tài, truyền thông, ngoại ngữ, chuyên môn lập nghiệp. Dần cung vi gả, Thân cung lực giảm. Sợ Cự Môn hóa Kỵ tắc quan phi.`,
    palaces: [ju.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư · Cự Nhật Đồng Cung》',
  });
}

/** Thạch Trung Ẩn Ngọc: Cự Môn nhập mệnh tại Tử hoặc Ngọ cung */
function detectShiZhongYinYu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, 'Cự Môn')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;  // Tử(0) hoặc Ngọ(6)

  const required = [`Cự Môn nhập mệnh tại ${branchName(ming.branch)} cung`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(ming, 'Cự Môn') === 'Lộc' || getStarSiHua(ming, 'Cự Môn') === 'Quyền') bonus.push('Cự Môn hóa Lộc/hóa Quyền');
  if (sanFangAllStars(chart).has('Văn Xương')) bonus.push('Văn Xương hội chiếu (Thạch Trung Ẩn Ngọc đắc minh)');
  if (getStarSiHua(ming, 'Cự Môn') === 'Kỵ') breaking.push('Cự Môn hóa Kỵ (ngọc tàng thâm nê)');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh tọa sát tinh');

  patterns.push({
    name: 'Thạch Trung Ẩn Ngọc',
    level: breaking.length ? 'caution' : 'excellent',
    description: 'Cự Môn tọa mệnh Tý Ngọ, ngoại biểu bình thường nội tàng tài học. Sớm niên im lặng vô văn, trung niên phương hiển quý khí, thích hợp đi chuyên môn, nghiên cứu, khẩu tài, truyền thông. Cần có Lộc Quyền hoặc Văn Xương tương trợ phương năng "tác thạch kiến ngọc".',
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
  if (!hasStar(dui, 'Thái Dương') || !hasStar(dui, 'Thái Âm')) return;

  const required = ['Mệnh Cung tại Mùi là không cung', 'Đối cung Sửu cung vi Thái Dương Thái Âm đồng độ'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Văn Xương') || sanFangAllStars(chart).has('Văn Khúc')) bonus.push('Tái hội Văn Xương Văn Khúc');
  if (sanFangAllStars(chart).has('Tả Phụ') || sanFangAllStars(chart).has('Hữu Bật')) bonus.push('Tả Hữu Bật Tịch tương trợ');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Sát tinh hội chiếu (trân quang ám đạm)');

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
  if (!hasStar(ming, 'Tử Vi') || hasStar(ming, 'Thiên Phủ')) return;

  const required = ['Tử Vi độc tọa mệnh cung (vô Thiên Phủ đồng tọa)'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('Tả Phụ') && sanFangSet.has('Hữu Bật')) bonus.push('Tả Phụ Hữu Tịch đồng hội');
  if (sanFangSet.has('Văn Xương') && sanFangSet.has('Văn Khúc')) bonus.push('Văn Xương Văn Khúc đồng hội');
  if (!sanFangSet.has('Tả Phụ') && !sanFangSet.has('Hữu Bật')) breaking.push('Vô Phụ Tịch (cô quân vô thần)');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Tử Vi ngộ Không Kiếp (cổ thư tối kỵ)');

  patterns.push({
    name: 'Tử Vi Nhập Mệnh',
    level: breaking.length ? 'caution' : (bonus.length ? 'excellent' : 'good'),
    description: 'Tử Vi độc tọa Mệnh Cung, Đế vương chi tinh, tự tôn tâm cường, có lãnh đạo mị lực. Nhưng Tử Vi tối ky "tại dã cô quân"——nếu vô Tả Hữu Bật Tịch tương hội, phản thành cô cao tự ngạo, dễ chiêu hủy bang.',
    palaces: ['Mệnh Cung'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Phụ Tịch giá mệnh */
function detectFuBiJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasZuo = hasStar(prev, 'Tả Phụ');
  const prevHasYou = hasStar(prev, 'Hữu Bật');
  const nextHasZuo = hasStar(next, 'Tả Phụ');
  const nextHasYou = hasStar(next, 'Hữu Bật');
  if (!((prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo))) return;

  const required = ['Tả Phụ Hữu Tịch phân cư mệnh cung trước sau hai cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Thiên Khôi') || sanFangAllStars(chart).has('Thiên Việt')) bonus.push('Tái hội Khôi Võ');

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
  const prevHasChang = hasStar(prev, 'Văn Xương');
  const prevHasQu = hasStar(prev, 'Văn Khúc');
  const nextHasChang = hasStar(next, 'Văn Xương');
  const nextHasQu = hasStar(next, 'Văn Khúc');
  if (!((prevHasChang && nextHasQu) || (prevHasQu && nextHasChang))) return;

  patterns.push({
    name: 'Xương Khúc Giá Mệnh',
    level: 'excellent',
    description: 'Văn Xương Văn Khúc giá Mệnh Cung, chủ thông minh tuấn tú, văn thái phi nhiên, thích hợp đi văn giáo, học thuật, nghệ thuật, viết lách. Cổ thư vân "Xương Khúc giá mệnh chủ khoa giáp", tối lợi khảo vận.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['Văn Xương Văn Khúc phân cư mệnh cung trước sau hai cung'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Khôi Vượng giá mệnh */
function detectKuiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, 'Thiên Khôi') && hasStar(next, 'Thiên Việt');
  const okB = hasStar(prev, 'Thiên Việt') && hasStar(next, 'Thiên Khôi');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Khôi Vượng Giá Mệnh',
    level: 'good',
    description: 'Thiên Khôi Thiên Việt giá mệnh, nam xưng Thiên Ết, nữ xưng Ngọc Đường, cả đời quý nhân đề bạt. Khảo thí, tìm việc, thời khắc then chốt thường có quý nhân bất ngờ tương trợ.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['Thiên Khôi Thiên Việt phân cư mệnh cung trước sau hai cung'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Song Lộc triều Viên: Hóa Lộc + Lộc Tồn đồng hội tam phương */
function detectShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false;
  let luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === 'Lộc')) huaLuFound = true;
    if (hasStar(p, 'Lộc Tồn')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;

  patterns.push({
    name: 'Song Lộc Triều Viên',
    level: 'excellent',
    description: 'Hóa Lộc, Lộc Tồn đồng hội Mệnh Cung tam phương tứ chánh, tài nguyên dũng động, ăn mặc sung túc. Cổ thư vân "Song Lộc triều viên, phú tỷ Đào Chu", chủ cả đời không lo tiền bạc, nhiều chính tài hoành tài kiêm đắc.',
    palaces: sanFang.map(p => p.name),
    conditions: {
      required: ['Hóa Lộc hội chiếu tam phương tứ chánh', 'Lộc Tồn hội chiếu tam phương tứ chánh'],
      breaking: hasShaInPalace(ming, SHA_KONG) ? ['Mệnh tọa Không Kiếp (Song Lộc ngộ không, tài lai tài khứ)'] : undefined,
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
      if (s.siHua === 'Lộc') lu = true;
      if (s.siHua === 'Quyền') quan = true;
      if (s.siHua === 'Khoa') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;

  patterns.push({
    name: 'Tam Kỳ Gia Hội',
    level: 'excellent',
    description: 'Hóa Lộc, Hóa Quyền, Hóa Khoa tam cát hóa tề hội Mệnh Cung tam phương tứ chánh, xưng hào "Tam Kỳ gia hội". Chủ cả đời công danh, tài phú, quý nhân tam toàn, là một trong các cục diện cao nhất của Tử Vi Đẩu Số.',
    palaces: sanFangPalaces.map(p => p.name),
    conditions: { required: ['Hóa Lộc, Hóa Quyền, Hóa Khoa tam cát hóa tề hội mệnh tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tam Kỳ Gia Hội》',
  });
}

/** Hóa Lộc nhập mệnh/quan/tài */
function detectHuaLuRuMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === 'Lộc' && s.type === 'major');
  if (!huaLuStar) return;

  patterns.push({
    name: `${huaLuStar.name}hóa Lộc nhập Mệnh`,
    level: 'good',
    description: `${huaLuStar.name} hóa Lộc tọa Mệnh Cung, chủ sinh tài thuận lợi, nhân duyên gia, cơ hội nhiều. ${huaLuStar.name === 'Vũ Khúc' ? 'Vũ Khúc hóa Lộc thuộc chính tài, thích công nghiệp, tài chính.' : huaLuStar.name === 'Thái Âm' ? 'Thái Âm hóa Lộc thuộc âm tài, bất động sản.' : huaLuStar.name === 'Tham Lang' ? 'Tham Lang hóa Lộc thuộc nhân mạch tài, đào hoa tài.' : ''}`,
    palaces: ['Mệnh Cung'],
    conditions: { required: [`${huaLuStar.name}hóa Lộc tọa mệnh cung`] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

// ────────────────── Bộ nhận diện cục diện ác ──────────────────

/** Hóa Kỵ nhập mệnh/Di */
function detectHuaJiRuMingQian(chart: ZiweiChart, patterns: Pattern[]) {
  const qianBranch = (chart.mingGongBranch + 6) % 12;
  for (const palace of chart.palaces) {
    if (palace.branch !== chart.mingGongBranch && palace.branch !== qianBranch) continue;
    const jiStar = palace.stars.find(s => s.siHua === 'Kỵ' && s.type === 'major');
    if (!jiStar) continue;

    const inMing = palace.branch === chart.mingGongBranch;
    patterns.push({
      name: `${jiStar.name}hóa Kỵ nhập${inMing ? ' Mệnh' : ' Di'}`,
      level: 'caution',
      description: inMing
        ? `${jiStar.name} hóa Kỵ tọa Mệnh Cung, cần lưu ý bản thân cố chấp, trở ngại tâm lý hoặc tiềm ẩn sức khỏe, mọi việc lui một bước suy nghĩ. Hóa Kỵ không nhất định xấu, đại diện sao này năng lượng cần chú ý đặc biệt.`
        : `${jiStar.name} hóa Kỵ tọa Di Quan Cung, di ra ngoài, du lich, quan hệ nhân sự dễ có trồi sụm, nên thủ bất nên động.`,
      palaces: [palace.name],
      conditions: { required: [`${jiStar.name}hóa Kỵ tọa${inMing ? ' mệnh' : ' di'} cung`] },
      source: '《Tử Vi Đẩu Số Toàn Thư》',
    });
  }
}

/** Dương Đà giá Kỵ: Hóa Kỵ tọa cung, Tả Hữu bị Kình Dương Đà La giá */
function detectYangTuoJiaJi(chart: ZiweiChart, patterns: Pattern[]) {
  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === 'Kỵ');
    if (!jiStar) continue;
    if (palace.branch !== chart.mingGongBranch) continue;

    const { prev, next } = getJiaPalaces(chart, palace.branch);
    if (!prev || !next) continue;
    const aPrev = hasStar(prev, 'Kình Dương') && hasStar(next, 'Đà La');
    const aNext = hasStar(prev, 'Đà La') && hasStar(next, 'Kình Dương');
    if (!aPrev && !aNext) continue;

    patterns.push({
      name: 'Dương Đà Giá Kỵ',
      level: 'caution',
      description: 'Hóa Kỵ tọa mệnh, Tả Hữu Kình Dương Đà La phân cư Mệnh Cung trước sau giá, cổ thư vân "Dương Đà giá Kỵ vi bại cục", chủ cả đời lao lực bôn tẩu, khốn khổ bất thuận, thân tâm câu bất. Cần dĩ đức hạnh tu dưỡng dữ cải tác tích cực hóa giải, mọi việc cẩn thận vi thượng.',
      palaces: ['Mệnh Cung', prev.name, next.name],
      conditions: { required: ['Hóa Kỵ tọa mệnh', 'Kình Dương Đà La phân cư mệnh cung trước sau hai cung'] },
      source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Dương Đà Giá Kỵ》',
    });
    return;
  }
}

/** Hỏa Linh giá mệnh: Hỏa Tinh Linh Tinh phân cư Mệnh Cung trước sau */
function detectHuoLingJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, 'Hỏa Tinh') && hasStar(next, 'Linh Tinh');
  const okB = hasStar(prev, 'Linh Tinh') && hasStar(next, 'Hỏa Tinh');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Hỏa Linh Giá Mệnh',
    level: 'caution',
    description: 'Hỏa Tinh Linh Tinh phân cư Mệnh Cung trước sau lưỡng cung giá mệnh, chủ tính nóng vội, dễ xung động, đột ngột ngoài ý hoặc tranh chấp. Cần bồi dưỡng nhẫn nại, tránh quyết định xung động.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['Hỏa Tinh Linh Tinh phân cư mệnh cung trước sau hai cung'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Không Hóa giá mệnh: Địa Không Địa Kiếp phân cư Mệnh Cung trước sau */
function detectKongJieJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, 'Địa Không') && hasStar(next, 'Địa Kiếp');
  const okB = hasStar(prev, 'Địa Kiếp') && hasStar(next, 'Địa Không');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Không Hóa Giá Mệnh',
    level: 'caution',
    description: 'Địa Không Địa Kiếp giá mệnh, chủ tài lai tài khứ, tư tưởng tháo tuột, dễ lún vào tôn giáo triết học. Cổ thư vân "Không Hóa giá mệnh, tài bất tụ". Thích kỹ nghệ, tôn giáo, nghiên cứu v.v không trọng vật chất chi nghiệp.',
    palaces: ['Mệnh Cung', prev.name, next.name],
    conditions: { required: ['Địa Không Địa Kiếp phân cư mệnh cung trước sau hai cung'] },
    source: '《Tử Vi Đẩu Số Toàn Thư》',
  });
}

/** Liêm Sát Dương: Liêm Trinh, Thất Sát, Kình Dương tam sao hội chiếu (Lưu niên đại hạn tối hung) */
function detectLianShaYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('Liêm Trinh') && sanFangSet.has('Thất Sát') && sanFangSet.has('Kình Dương'))) return;

  patterns.push({
    name: 'Liêm Sát Dương',
    level: 'caution',
    description: 'Liêm Trinh, Thất Sát, Kình Dương tam sao hội chiếu Mệnh Cung tam phương, cổ thư cảnh tỉnh chi hung cục. Chủ huyết quang, quan phi, ngoài ý. Bản mệnh có cục diện này không cần kinh hoảng, nhưng lưu niên đại hạn tái trigger thời cần đặc biệt cẩn thận lái xe, tránh xung đột, chú ý rủi ro phẫu thuật.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Liêm Trinh, Thất Sát, Kình Dương tam sao hội chiếu tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Liêm Sát Dương》',
  });
}

/** Cự Hỏa Dương: Cự Môn, Hỏa Tinh, Kình Dương hội chiếu */
function detectJuHuoYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('Cự Môn') && sanFangSet.has('Hỏa Tinh') && sanFangSet.has('Kình Dương'))) return;

  patterns.push({
    name: 'Cự Hỏa Dương',
    level: 'caution',
    description: 'Cự Môn, Hỏa Tinh, Kình Dương tam sao hội chiếu, cổ thư vân "Cự Hỏa Dương, chung thân dĩ tử"——Cổ thời hung cục. Hiểu biết đương đại: Dễ vì khẩu thị, kịch liệt xung động mà chiêu đại họa. Cần tu thân dưỡng tính, thận ngôn thận hành, tránh cực đoan cảm xúc.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Cự Môn, Hỏa Tinh, Kình Dương tam sao hội chiếu tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Cự Hỏa Dương》',
  });
}

/** Linh Xương Đà Võ: Linh Tinh, Văn Xương, Đà La, Vũ Khúc hội chiếu (Hạn chí đầu hà) */
function detectLingChangTuoWu(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('Linh Tinh') && sanFangSet.has('Văn Xương') && sanFangSet.has('Đà La') && sanFangSet.has('Vũ Khúc'))) return;

  patterns.push({
    name: 'Linh Xương Đà Võ',
    level: 'caution',
    description: 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc tứ sao tề hội, cổ thư vân "Linh Xương Đà Võ, hạn chí đầu hà"——Cổ thời đại hung cục. Bản mệnh có tổ hợp này bản thân không cần kinh hoảng, nhưng lưu niên đại hạn trigger thời cần cao độ cảnh giác đại quyết định, cảm xúc trồi sụm, hoạt động bờ nước.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Linh Tinh, Văn Xương, Đà La, Vũ Khúc tứ sao hội chiếu tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Tủy Nãot Phú · Linh Xương Đà Võ》',
  });
}

/** Mã Đầu dài tiễn: Kình Dương tại Ngọ cung tọa mệnh */
function detectMaTouDaiJian(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 6) return;   // Phải Ngọ
  if (!hasStar(ming, 'Kình Dương')) return;

  const required = ['Kình Dương tại Ngọ cung tọa mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Thất Sát') || sanFangAllStars(chart).has('Phá Quân')) bonus.push('Tái hội Thất Sát hoặc Phá Quân (Võ chức đại quý)');
  if (sanFangAllStars(chart).has('Thiên Khôi') || sanFangAllStars(chart).has('Thiên Việt')) bonus.push('Khôi Võ gia chiếu');

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
  const luCunPalace = findStarPalace(chart, 'Lộc Tồn');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;
  patterns.push({
    name: inMing ? 'Lộc Tồn Thủ Mệnh' : 'Lộc Tồn Thủ Thân',
    level: 'good',
    description: inMing
      ? 'Lộc Tồn tọa mệnh, chủ cả đời ăn mặc vô phiền, tài lộc ổn định. Tính cách bảo thủ, thiện tích lũy, nhưng Dương Đà giá Lộc tắc phòng tiểu nhân. Tối thích phối hóa Lộc, Tả Hữu Bật Tịch phương viên đại cục.'
      : 'Lộc Tồn nhập thân cung, chủ trung niên dĩ hậu tài nguyên ổn định, đắc Lộc tự hưởng. Nhu Sư nói 「Lộc Tồn nhập thân, tài khí cận thân」——phu thê hoặc phương hướng sự nghiệp năng mang đến tài lộc ổn định.',
    palaces: [inMing ? 'Mệnh Cung' : 'Thân Cung'],
    conditions: { required: [inMing ? 'Lộc Tồn nhập mệnh cung' : 'Lộc Tồn nhập thân cung'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Lộc Tồn Tinh》',
  });
}

/** Thiên Mã nhập mệnh/Di: Ất Mã tinh động */
function detectTianMaRuMing(chart: ZiweiChart, patterns: Pattern[]) {
  const tianMaPalace = findStarPalace(chart, 'Thiên Mã');
  if (!tianMaPalace) return;
  const inMing = tianMaPalace.branch === chart.mingGongBranch;
  const inQian = tianMaPalace.branch === ((chart.mingGongBranch + 6) % 12);
  if (!inMing && !inQian) return;
  patterns.push({
    name: inMing ? 'Thiên Mã Nhập Mệnh' : 'Thiên Mã Tại Di',
    level: 'neutral',
    description: inMing
      ? 'Thiên Mã tọa mệnh, chủ cả đời bôn tẩu, động trung đắc tài, thích đi thương lữ, ngoại cần, xuyên biên phát triển. Nhu Sư nói 「Thiên Mã nhập mệnh, vô Lộc bất phát」——nếu tái hội Lộc Tồn hoặc hóa Lộc tắc 「Lộc Mã giao trì」chi phú cục.'
      : 'Thiên Mã tại Di Quan Cung, chủ di ra ngoài có lợi, viễn hành đắc tài, thích dị hương phát triển. Phối hóa Lộc chủ dị đới sinh tài, phối sát tinh tắc du lữ đa ba.',
    palaces: [tianMaPalace.name],
    conditions: { required: [inMing ? 'Thiên Mã nhập mệnh cung' : 'Thiên Mã nhập thiên di cung'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Thiên Mã Tinh》',
  });
}

/** Hóa Lộc nhập tài: Tài Bạch Cung chủ tinh hóa Lộc */
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === 'Tài Bạch Cung');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && s.siHua === 'Lộc');
  if (!luStar) return;
  patterns.push({
    name: 'Hóa Lộc Nhập Tài',
    level: 'good',
    description: `${luStar.name} hóa Lộc nhập Tài Bạch Cung, chủ tài nguyên sung thông, thu nhập ổn định. Nhu Sư giảng hóa Lộc là 「chính tài」tượng trưng——sao hóa Lộc này đại biểu năng lực (đặc tính cốt lõi của ${luStar.name}) là trục chính kiếm tiền của ngươi. Phối Lộc Tồn hoặc Thiên Mã tắc tài nguyên càng rộng.`,
    palaces: ['Tài Bạch Cung'],
    conditions: { required: [`${luStar.name}hóa Lộc nhập tài bạch cung`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
  });
}

/** Hóa Quyền nhập quan: Quan Lộc Cung chủ tinh hóa Quyền */
function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === 'Quan Lộc Cung');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && s.siHua === 'Quyền');
  if (!quanStar) return;
  patterns.push({
    name: 'Hóa Quyền Nhập Quan',
    level: 'good',
    description: `${quanStar.name} hóa Quyền nhập Quan Lộc Cung, chủ sự nghiệp có khống chế lực, năng đảm đương chức vụ độc đương nhất diện. Hóa Quyền đại biểu quyền lực dữ chấp hành lực——${quanStar.name} hóa Quyền giải thích ngươi tại sự nghiệp thượng năng thành quyết định giả hoặc trọng tâm chấp hành giả, thích đi quản lý hoặc kỹ thuật uy quyền.`,
    palaces: ['Quan Lộc Cung'],
    conditions: { required: [`${quanStar.name}hóa Quyền nhập quan lộc cung`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
  });
}

/** Hóa Khoa nhập mệnh/thân: Khoa danh gia thân */
function detectHuaKeRuMingShen(chart: ZiweiChart, patterns: Pattern[]) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const target = [ming, shen].filter((p): p is Palace => Boolean(p));
  for (const p of target) {
    const keStar = p.stars.find(s => s.type === 'major' && s.siHua === 'Khoa');
    if (!keStar) continue;
    const isMing = p.branch === chart.mingGongBranch;
    patterns.push({
      name: isMing ? 'Hóa Khoa Nhập Mệnh' : 'Hóa Khoa Nhập Thân',
      level: 'good',
      description: `${keStar.name} hóa Khoa nhập ${isMing ? 'mệnh' : 'thân'} cung, chủ danh vọng, văn thư, học thuật vận. Nhu Sư giảng hóa Khoa là 「quý nhân tinh」——${keStar.name} hóa Khoa mang đến là đặc tính được người khác coi trọng, thích từ sự văn thư, giáo dục, nghiên cứu, tư vấn, văn sáng tạo v.v「dĩ danh thủ lợi」phương hướng.`,
      palaces: [isMing ? 'Mệnh Cung' : 'Thân Cung'],
      conditions: { required: [`${keStar.name}hóa Khoa nhập${isMing ? ' mệnh' : ' thân'} cung`] },
      source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
    });
    return;
  }
}

/** Cơ Nguyệt Đồng Lương tam sao hội (Phiên bản giảm cấp): Thiên Cơ/Thái Âm/Thiên Đồng/Thiên Lương Bất kỳ 3 sao tề nhập tam phương tứ chánh */
function detectJiYueTongLiangPartial(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => sanFangSet.has(s));
  if (has.length !== 3) return;
  const missing = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => !sanFangSet.has(s));
  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương Tam Sao Hội',
    level: 'neutral',
    description: `Tam phương tứ chánh hội tề ${has.join(', ')}, thiếu ${missing.join(', ')} vị hội. Cơ Nguyệt Đồng Lương bất toàn cục, văn chất đới mưu, nhưng ổn định độ bất như tứ sao tề. Vẫn thích công chức, giảng nghiên, y học, dịch vụ v.v cần tích lũy dữ ổn định, then chốt xem vị sao khuyết dữ tứ hóa phối hợp.`,
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required: [`Tam phương tứ chánh hội ${has.join(', ')} (Cơ Nguyệt Đồng Lương thiếu ${missing.join(', ')})`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Cơ Nguyệt Đồng Lương Cục》(Phiên bản giảm cấp)',
  });
}

/** Xương Khúc đồng hội: Văn Xương+Văn Khúc đều tại Mệnh tam phương tứ chánh */
function detectChangQuTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Văn Xương') || !sanFangSet.has('Văn Khúc')) return;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return;
  const inMing = hasStar(ming, 'Văn Xương') && hasStar(ming, 'Văn Khúc');
  patterns.push({
    name: inMing ? 'Xương Khúc Tọa Mệnh' : 'Xương Khúc Đồng Hội',
    level: 'good',
    description: inMing
      ? 'Văn Xương Văn Khúc đồng nhập Mệnh Cung, chủ thông minh tuấn tú, văn thái phi nhiên, thích văn học, giáo dục, viết lách, tư vấn. Tối ky hóa Kỵ——Xương Khúc hóa Kỵ chủ văn thư khế ước ám khoản.'
      : 'Văn Xương Văn Khúc đồng hội tam phương tứ chánh, chủ tài hoa tung tú, khẩu tài văn bút câu giỏi. Thích đi cần biểu đạt dữ văn thái ngành nghề, hóa Khoa gia thị tắc danh vọng đại hiển.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Văn Xương, Văn Khúc đồng hội mệnh tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Văn Tinh Luận》',
  });
}

/** Phụ Tịch đồng hội: Tả Phụ+Hữu Tịch đều tại Mệnh tam phương tứ chánh */
function detectFuBiTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Tả Phụ') || !sanFangSet.has('Hữu Bật')) return;
  patterns.push({
    name: 'Phụ Tịch Đồng Hội',
    level: 'good',
    description: 'Tả Phụ Hữu Tịch đồng hội Mệnh Cung tam phương tứ chánh, chủ cả đời quý nhân bất tuyệt, nhân duyên cực kỳ tốt. Tối thích vị trí lãnh đạo dữ công tác nhóm hợp tác. Nhu Sư nói 「Phụ Tịch giá mệnh, bình sinh quý nhân đa」——ngươi không phải đơn đả đấu cuộc mệnh, phải thiện dụng nhân mạch mạng lưới.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Tả Phụ, Hữu Tịch đồng hội mệnh tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Phụ Tịch Luận》',
  });
}

/** Khôi Vượng đồng hội: Thiên Khôi+Thiên Việt đều tại Mệnh tam phương tứ chánh */
function detectKuiYueTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Thiên Khôi') || !sanFangSet.has('Thiên Việt')) return;
  patterns.push({
    name: 'Khôi Vượng Đồng Hội',
    level: 'good',
    description: 'Thiên Khôi Thiên Việt đồng hội Mệnh Cung tam phương tứ chánh, chủ "Thiên Ết quý nhân" gia thị, thời khắc then chốt tổng có quý nhân đề bạt bất ngờ. Nhu Sư nói 「Khôi Vượng giá mệnh, tất vi quý nhân」——gặp khó khăn thời bên cạnh sẽ xuất hiện người tương trợ đắc lực, nên chủ động bảo trì nhân mạch.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Thiên Khôi, Thiên Việt đồng hội mệnh tam phương tứ chánh'] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Khôi Vượng Luận》',
  });
}

/** Khoa Quyền song hội: Hóa Khoa + Hóa Quyền đồng hội tam phương tứ chánh */
function detectKeQuanShuangHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sfPalaces = getSanFangPalaces(chart);
  let hasKe = false, hasQuan = false;
  for (const p of sfPalaces) {
    for (const s of p.stars) {
      if (s.type === 'major' && s.siHua === 'Khoa') hasKe = true;
      if (s.type === 'major' && s.siHua === 'Quyền') hasQuan = true;
    }
  }
  if (!hasKe || !hasQuan) return;
  patterns.push({
    name: 'Khoa Quyền Song Hội',
    level: 'good',
    description: 'Hóa Khoa + Hóa Quyền đồng hội tam phương tứ chánh, chủ danh quyền song mỹ——vừa có học thức/danh vọng (Khoa), lại có khống chế lực (Quyền), thích đi "chuyên môn权威" tuyến (như y sĩ, luật sư, giáo sư, kỹ thuật cốt lõi), danh lợi song thu dữ căn cơ kiên chắc.',
    palaces: ['Mệnh Cung'],
    conditions: { required: ['Hóa Khoa, Hóa Quyền đồng hội mệnh tam phương tứ chánh'] },
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
    'Tử Vi': ['Tôn Quý', 'Độc Lập', 'Lãnh Đạo'],
    'Thiên Cơ': ['Trí Huệ', 'Cơ Biến', 'Thiện Mưu'],
    'Thái Dương': ['Dương Cương', 'Quan Quý', 'Khảng Đại'],
    'Vũ Khúc': ['Tài Phú', 'Cương Nghị', 'Quyết Đoán'],
    'Thiên Đồng': ['Ôn Hòa', 'Hưởng Phước', 'Tùy Duyên'],
    'Liêm Trinh': ['Tài Nghệ', 'Đào Hoa', 'Nhiều Biến'],
    'Thiên Phủ': ['Tài Khố', 'Ổn Định', 'Bảo Thủ'],
    'Thái Âm': ['Nhu Mỹ', 'Tài Phú', 'Tinh Tế'],
    'Tham Lang': ['Dục Vọng', 'Đào Hoa', 'Đa Tài'],
    'Cự Môn': ['Thiện Biện', 'Đa Tư', 'Khẩu Tài'],
    'Thiên Tướng': ['Phụ Tác', 'Hành Chính', 'Ổn Kiện'],
    'Thiên Lương': ['Ầm Hộ', 'Y Học', 'Trưởng Bối'],
    'Thất Sát': ['Tướng Tinh', 'Quyết Quyết', 'Cô Khắc'],
    'Phá Quân': ['Khai Sáng', 'Biến Động', 'Phá Cựu'],
  };

  const natureMap: Record<string, string> = {
    'Tử Vi': 'Đế Quân Tinh', 'Thiên Cơ': 'Trí Huệ Tinh', 'Thái Dương': 'Quý Nhân Tinh',
    'Vũ Khúc': 'Tài Phú Tinh', 'Thiên Đồng': 'Phúc Đức Tinh', 'Liêm Trinh': 'Đào Hoa Tinh',
    'Thiên Phủ': 'Tài Khố Tinh', 'Thái Âm': 'Tài Phú Tinh', 'Tham Lang': 'Đào Hoa Tinh',
    'Cự Môn': 'Thị Phi Tinh', 'Thiên Tướng': 'Ấn Thụ Tinh', 'Thiên Lương': 'Ầm Tị Tinh',
    'Thất Sát': 'Tướng Suất Tinh', 'Phá Quân': 'Biến Động Tinh',
  };

  const keywords = starNames.flatMap(n => keywordMap[n] ?? []).slice(0, 5);
  const nature = starNames.length > 0 ? (natureMap[starNames[0]] ?? '') : 'Không Cung';

  return { stars: starNames, keywords, nature };
}
