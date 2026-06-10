'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';

import { vnStar, vnPalace } from '@/lib/ziwei/starNames';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// Vietnamese translation of Ni Haixia system star interpretations
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  '紫微': {
    niHaixia: 'Thầy Ni cho rằng Tử Vi là sao hoàng đế, ngồi mệnh cung thì có khí cô độc ngạo, thích ở một mình, không thích bị người khác quản lý. Tử Vi cần Tả Phụ Hữu Phụ hỗ trợ hai bên mới phát huy được khí chất đế vương, nếu không chỉ là quân cô độc, giàu mà không quý. Tử Vi ở Thìn Tuất là tốt nhất, cùng Thiên Phủ tạo thành cục diện song tinh, tài quan song mỹ, có thể xuất tướng nhập tướng. Tử Vi sợ nhất là Hỏa Tinh, Linh Tinh, Kình Dương, Đà La đồng cung, gặp sát thì cô độc quý, có quyền mà không có tài.',
    classical: 'Cổ quyết: "Tử Vi đế tọa lâm mệnh chủ tôn quý, thống lĩnh chúng tinh, tọa mệnh giả chủ quyền uy hiển đạt." Nam Bắc Sơn Nhân chú: "Tử Vi thủ mệnh ở Thìn vị, tài quan song mỹ, xuất tướng nhập tướng, vị chí tam công; Tý cung an mệnh giả, phú quý bất trì, nhật hậu bất mỹ."',
    bestPalace: 'Mệnh Cung (Dần Thân), Quan Lộc Cung',
    worstPalace: 'Tật Ách Cung, Phu Tân Cung',
    career: 'Chính trị, quản lý, khởi nghiệp độc lập, khí chất hoàng đế bẩm sinh, phù hợp vị trí lãnh đạo độc lập',
    relationship: 'Tình cảm bị động, tự trọng cao, cần đối phương chủ động, có xu hướng cô đơn, kết hôn muộn thì tốt',
    wealth: 'Tài vận ổn định, giữ gìn hơn tiến thủ, Thìn Tuất vị trí tài quan song mỹ, thích hợp đầu tư tích lũy',
    health: 'Thuộc Thổ, chú ý lách, hệ tiêu hóa. Tránh lao lực quá sức, nên giữ lịch sinh hoạt đều đặn',
  },
  '天机': {
    niHaixia: 'Thầy Ni nói Thiên Cơ là sao tham mưu, sao thông minh nhất, nhưng thông minh lộ liễu thì tổn thương thân. Thiên Cơ hóa Kỵ phiền phức nhất, đại diện thông minh phản bị thông minh hại. Thiên Cơ thuộc Mộc, hay thay đổi linh hoạt, ở mệnh cung thì tư duy nhanh nhạy, nhưng thường nhiều mưu ít quyết, cần rời quê hương đi xa mới phát triển được, ứng sự cơ biến, tùy cơ ứng biến là đặc tính lớn nhất của nó.',
    classical: 'Cổ quyết: "Vi nhân sinh tinh hoạt, tự hảo tác kinh doanh, Thiên Cơ tinh thuộc Mộc, thương mại đều đa cơ kiến, ly tông tất viễn thân, cơ mưu tất viễn ly thân." Nam Bắc Sơn Nhân chú: "Thiên Cơ ư miếu vượng địa, chủ nhân sinh tinh minh, thiện hoạch hóa; ư hãm địa tắc hôn ám, nhân nhân giai tòng thương vi nghiệp."',
    bestPalace: 'Mệnh Cung (Dần), Quan Lộc Cung',
    worstPalace: 'Phu Tân Cung',
    career: 'Chuyên gia kỹ thuật, mưu sĩ, nghiên cứu viên, IT, quy hoạch, dùng trí nhiều hơn sức, thích hợp phát triển xa quê hương',
    relationship: 'Tình cảm hay thay đổi, suy nghĩ nhiều, khó tập trung, nên kết hôn muộn, sau hôn nhân cần buông bỏ lo âu',
    wealth: 'Kiếm tiền bằng trí tuệ và kỹ năng, không giỏi giữ tiền, theo nghiệp chuyên môn thì tài vận ổn định',
    health: 'Thuộc Mộc, chú ý gan, túi mật, hệ thần kinh. Suy nghĩ nhiều dễ mất ngủ, nên tập thiền định',
  },
  '太阳': {
    niHaixia: 'Thầy Ni cho rằng Thái Dương là sao đại nam trung chủ nghĩa, ở Mão đến Ngọ vị nhập miếu, quang minh chính đại; sau Ngọ dần lạc hãm. Người Thái Dương tọa mệnh rộng lượng tốt mặt mũi, nam mệnh tốt, nữ mệnh quá mạnh mẽ. Thái Dương đại diện cho cha và bề trên, ở mệnh cung chủ nhân tính cách hướng ngoại, thích được mọi người nhìn thấy, thích hợp nhất công vụ hoặc nghiệp vụ công cộng. Lạc hãm thì trước chăm sau lười, cô độc vất vả.',
    classical: 'Cổ quyết: "Thái Dương cư Ngọ vi nhập miếu, quang huy đại phóng, chủ quý hiển, nam mệnh tốt nhất; lạc hãm tắc cô độc vất vả, tiên cần hậu lười." Nam Bắc Sơn Nhân chú: "Thái Dương ư Ngọ cung thủ mệnh, tài quan song mỹ, xuất tướng nhập tướng; Thìn vị an mệnh, trung niên tài quan biến mỹ, ất niên sinh nhân ngộ hung diệc đại lợi."',
    bestPalace: 'Mệnh Cung (Mão đến Ngọ), Quan Lộc Cung',
    worstPalace: 'Phu Tân Cung (nữ mệnh), Tật Ách Cung',
    career: 'Công vụ, chính trị, quản lý, quan hệ công chúng, giáo dục, truyền thông, thích đứng trước đám đông, thích hợp nghiệp vụ công cộng',
    relationship: 'Nam mệnh duyên tốt nhưng đào hoa, nữ mệnh độc lập mạnh mẽ, hôn nhân cần mài giũa, nên tìm bạn đời dịu dàng chu đáo',
    wealth: 'Tài vận dựa vào nỗ lực, rộng lượng hay cho, không giỏi tích lũy; nhập miếu tài vận vượng, lạc hãm tài vận thăng trầm',
    health: 'Thuộc Hỏa, chú ý tim, mắt. Vị trí lạc hãm dễ lao lực quá sức, cần nghỉ ngơi đầy đủ',
  },
  '武曲': {
    niHaixia: 'Thầy Ni xem Võ Khúc là tài bạch chủ tinh, cương ngạnh bất khuất, sợ nhất cô độc khắc. Người Võ Khúc tọa mệnh ý chí kiên định, thích hợp tài chính, quản lý tài sản, nhưng tình cảm quá thẳng, dễ làm tổn thương người khác. Võ Khúc hóa Kỵ phải cẩn thận tai nạn đổ máu. Võ Khúc ở Thìn Tuất Sửu Mùi được vượng địa, cùng Thất Sát đồng cung có thể thành tướng tài cục, là cục diện tài vận cực kỳ tốt.',
    classical: 'Cổ quyết: "Võ Khúc thuộc Kim, cương cường chi tính, nhất sinh đa hình khắc; thủ mệnh ư vượng địa, xuất tướng nhập tướng." Nam Bắc Sơn Nhân chú: "Võ Khúc thủ mệnh, tam phương tứ chính câu cát, tài quan song mỹ, võ chức gia phụ ủy xương khúc, diệc chủ đại quý; dữ Thất Sát đồng cung, vi tướng tài cục, chủ đại phú."',
    bestPalace: 'Mệnh Cung (Thìn Tuất Sửu Mùi), Tài Bạch Cung, Quan Lộc Cung',
    worstPalace: 'Phu Tân Cung',
    career: 'Tài chính, quân cảnh, kế toán, công trình, sức mạnh thực thi cực kỳ mạnh, thích hợp lĩnh vực cần quyết đoán',
    relationship: 'Tình cảm thẳng thắn, thiếu khí chất, cần bạn đời dịu dàng bổ khuyết, kiêng tình cảm cô độc',
    wealth: 'Sao tài bạch bản mệnh, tài vận cực mạnh, năng lực tài chính xuất sắc, Thìn Tuất vị tài quan song mỹ',
    health: 'Thuộc Kim, chú ý phổi, hệ hô hấp, răng. Hóa Kỵ cần phòng tai nạn đổ máu',
  },
  '天同': {
    niHaixia: 'Thầy Ni nói Thiên Đồng là phước tinh, sao lười nhất. Thiên Đồng tọa mệnh thích hưởng phúc, không thích cạnh tranh, thích hợp công việc ổn định. Thiên Đồng cùng Thiên Lương đồng cung là tốt nhất, có thể hưởng phúc lại có bảo đảm. Thiên Đồng hóa Lộc là hóa Lộc đẹp nhất, chủ một đời ăn mặc vô lo, vui vẻ tự tại. Thiên Đồng kiêng lạc hãm, lạc hãm thì phúc giảm, cần cùng sao hung hóa giải.',
    classical: 'Cổ quyết: "Thiên Đồng vi phước đức chi tinh, tọa mệnh giả hưởng phúc hữu dư, chủ nhất sinh tiêu dao tự tại, bất tiến lao khổ." Nam Bắc Sơn Nhân chú: "Thiên Đồng thủ mệnh, tam phương vô sát, nhất sinh khoái lạc, ăn mặc phong túc; gia cát tinh tắc phú quý song toàn, vi nhân ôn hòa, đa nhân duyên."',
    bestPalace: 'Mệnh Cung, Phước Đức Cung',
    worstPalace: 'Quan Lộc Cung',
    career: 'Dịch vụ, giải trí, ẩm thực, văn nghệ, môi trường nhẹ nhàng vui vẻ nhất, kiêng cạnh tranh áp lực cao',
    relationship: 'Tình cảm ôn hòa, không chủ động, dễ tiếp nhận thụ động, hôn nhân khá ổn định, tính cách hòa thuận đáng yêu',
    wealth: 'Tài vận không nổi bật, dựa vào lương ổn định, không giỏi đầu cơ, no ấm nhưng khó giàu lớn',
    health: 'Thuộc Thủy, chú ý thận, bàng quang. Thể trạng yếu, nên tập thể dục vừa phải, giữ tâm trạng nhẹ nhàng',
  },
  '廉贞': {
    niHaixia: 'Thầy Ni cho rằng Liêm Truyền là thứ tình hoa, tài năng xuất chúng nhưng tình cảm phức tạp. Liêm Truyền hóa Kỵ phiền phức cực kỳ, đại diện kiện tụng, lao tù, bất ngờ. Liêm Truyền cùng Thiên Tương đồng cung thì hóa hung thành cát, trở thành cục hành chính ấn thụ chi cục. Liêm Truyền ngũ hành thuộc Hỏa, tính cách cương liệt, một đời nhiều thăng trầm, tài năng xuất chúng, nếu có thể giữ chính bất tà, có thể thành đại khí.',
    classical: 'Cổ quyết: "Liêm Truyền vi thứ tình hoa, tài năng hoành túc, tình cảm đa ba thuyết; Liêm tương đồng cung, hóa hung vi kỳ, thành hành chính ấn thụ cục, khả chưởng quyền bính." Nam Bắc Sơn Nhân chú: "Liêm Truyền thủ mệnh, kiến cát tinh tắc tài năng xuất chúng, hóa Kỵ tắc quan tụng, chủ huyết quang chi tai, tu phòng."',
    bestPalace: 'Quan Lộc Cung (phối Thiên Tương), Mệnh Cung (hóa Lộc)',
    worstPalace: 'Mệnh Cung (hóa Kỵ), Phu Tân Cung',
    career: 'Nghệ thuật, giải trí, pháp luật, công vụ (phối Thiên Tương), tài năng xuất chúng, nên giữ chính nghiệp mới bền lâu',
    relationship: 'Đào hoa nhiều, tình cảm phức tạp, dễ gặp tranh chấp tình cảm, nên kết hôn muộn, chọn bạn đời ổn trọng',
    wealth: 'Tài vận thăng trầm, kiếm tiền bằng tài năng, hóa Kỵ phòng tranh chấp tài chính và rủi ro pháp lý',
    health: 'Thuộc Hỏa, chú ý tim, máu, gan. Hóa Kỵ phòng tai nạn và phẫu thuật, chú ý đổ máu',
  },
  '天府': {
    niHaixia: 'Thầy Ni nói Thiên Phủ là tài khố tinh, thủ thành chi tinh, không chủ động phát tài nhưng có thể giữ được tài sản. Người Thiên Phủ tọa mệnh trầm ổn bảo thủ, nữ mệnh là tốt nhất, có thể vượng phu hưng gia. Thiên Phủ thích nhất Tử Vi đồng cung hoặc đối chiếu, tạo thành cục diện song tinh, tài quan song mỹ. Thiên Phủ sợ Không Kiếp giáp, gặp Không Kiếp thì tài khố cạn kiệt, giữ không được tài.',
    classical: 'Cổ quyết: "Thiên Phủ vi tài khố chi tinh, thủ mệnh giả trầm ổn bảo thủ, chủ tích tài vượng gia; nữ mệnh phùng chi, năng vượng phu ích tử, gia đạo hưng long." Nam Bắc Sơn Nhân chú: "Thiên Phủ thủ mệnh, tam phương cát tụ, tài quan song mỹ, phú quý an khang; ngộ Không Kiếp, tắc tài khố phá lậu, nan dĩ tích tài."',
    bestPalace: 'Mệnh Cung, Tài Bạch Cung, Điền Trạch Cung',
    worstPalace: 'Thiên Di Cung',
    career: 'Hành chính, quản lý, bảo hiểm, bất động sản, cầu ổn không mạo hiểm, thích hợp nghề giữ gìn',
    relationship: 'Tình cảm ổn định, lo toan gia đình, là bạn đời tốt, coi trọng an toàn gia đình và bảo đảm kinh tế',
    wealth: 'Tài vận cực tốt, khả năng giữ tiền mạnh, thích hợp đầu tư tích lũy và bất động sản nhất',
    health: 'Thuộc Thổ, chú ý lách, tiêu hóa. Thể trạng vững, nên giữ ăn uống và sinh hoạt đều đặn',
  },
  '太阴': {
    niHaixia: 'Thầy Ni cho rằng Thái Âm là tài tinh, lợi nữ mệnh, cũng là sao đại diện cho mẹ và vợ của nam mệnh. Thái Âm nhập miếu thì tài vận cực kỳ tốt, hãm địa thì tài vận bị cản trở. Thái Âm hóa Kỵ phải chú ý vấn đề của người thân nữ. Thái Âm ở Hợi Tý vị nhập miếu, quang huy toàn chiếu, đại diện ưu nhã tinh tế, tình cảm phong phú, coi trọng thế giới nội tâm và đời sống tinh thần.',
    classical: 'Cổ quyết: "Thái Âm vi tài tinh, lợi nữ mệnh; Hợi Tý nhập miếu, quang huy toàn chiếu, tài vận cực vượng; Ngọ vị lạc hãm, u uất đa tình, tài vận bình đạm." Nam Bắc Sơn Nhân chú: "Thái Âm thủ mệnh, nhập miếu giả phú tài ưu hậu, nữ mệnh diệc gia; lạc hãm giả tu nỗ lực phương năng trí phú, tình cảm tế nhị."',
    bestPalace: 'Mệnh Cung (Hợi Tý), Tài Bạch Cung',
    worstPalace: 'Mệnh Cung (Ngọ vị lạc hãm)',
    career: 'Tài chính, ngân hàng, bất động sản, nghệ thuật, giáo dục, tỉ mỉ kiên nhẫn, thích hợp nghề cần thẩm mỹ và dịu dàng',
    relationship: 'Tình cảm dịu dàng tinh tế, coi trọng cảm xúc nội tâm, cần quan hệ ổn định có cảm giác an toàn',
    wealth: 'Nhập miếu tài vận cực vượng, lạc hãm phải nỗ lực; tài chính tỉ mỉ, giỏi tích lũy, không giỏi mạo hiểm',
    health: 'Thuộc Thủy, chú ý thận, tử cung (nữ mệnh). Cảm xúc dao động ảnh hưởng sức khỏe, nên giữ tinh thần thoải mái',
  },
  '贪狼': {
    niHaixia: 'Thầy Ni nói Đam Lang là sao đa tài đa nghệ nhất, đào hoa nặng nhất. Đam Lang hóa Lộc nhập mệnh thì mị lực bốn phía, người gặp người yêu. Đam Lang thuộc vãn phát chi tinh, trung niên sau mới thực sự phát đạt. Đam Lang ở Dần Thân vị nhập miếu tốt nhất, đào hoa vượng, tài nghệ siêu quần; hóa Lộc sau tài vận đại phát, nhưng nếu gặp Không Kiếp thì một đời nhiều sóng gió, khó tụ tài.',
    classical: 'Cổ quyết: "Đam Lang phát phúc hanh thông, đa tài đa nghệ, tình hoa tối trọng; nhiên nan quá tam thập tuế, vãn phát giả chúng." Nam Bắc Sơn Nhân chú: "Đam Lang thủ mệnh, phùng cát tắc phúc lộc đa thọ, phát phúc hanh thông; nhưng cửu hậu bất đắc thiện chung, cố nghi tu thân dưỡng đức, phương khả thiện chung."',
    bestPalace: 'Mệnh Cung (hóa Lộc), Phước Đức Cung, Thiên Di Cung',
    worstPalace: 'Tật Ách Cung',
    career: 'Nghệ thuật, giải trí, quan hệ công chúng, bán hàng, phong thủy ngũ thuật, dựa vào quan hệ và tài năng, đa tài đa năng',
    relationship: 'Đào hoa cực vượng, tình cảm đa dạng, nên kết hôn muộn, sau hôn nhân cần kiềm chế đào hoa mới có thể đến bạc đầu',
    wealth: 'Kiếm tiền bằng quan hệ và tài năng, tài vận trung cao niên mới ổn định, hóa Lộc tài nguyên rộng mở, sớm nên ổn',
    health: 'Thuộc Mộc (chứa Thủy), chú ý gan, thận. Đào hoa quá dễ tổn hao tinh lực, nên tiết chế điều dưỡng',
  },
  '巨门': {
    niHaixia: 'Thầy Ni cho rằng Cử Môn là sao khẩu chi thị phi, nhưng hóa Lộc hóa Quyền chuyển thành cát, trở thành cục diện kiếm tiền bằng khẩu tài. Cử Môn tọa mệnh đa nghi, thiện biện, thích hợp luật sư, giáo viên, bán hàng. Cử Môn sợ nhất hóa Kỵ, chủ khẩu chi thị phi không ngừng, thậm chí dẫn đến kiện tụng. Cử Môn ở Tý Ngọ vị tương đối tốt, khẩu tài tốt, chủ lấy ngôn ngữ lập thân.',
    classical: 'Cổ quyết: "Cử Môn vi ám diệu chi tinh, chủ khẩu chi thị phi; hóa Lộc Quyền tắc chuyển vi dĩ khẩu tài mưu sinh, chủ phú quý." Nam Bắc Sơn Nhân chú: "Cử Môn thủ mệnh, phùng hóa Lộc Quyền, dĩ khẩu chi vi nghiệp giả đại cát; hóa Kỵ tắc khẩu chi liên lụy, quan tụng, tu cẩn ngữ ngôn."',
    bestPalace: 'Quan Lộc Cung (hóa Lộc Quyền), Mệnh Cung (Tý Ngọ)',
    worstPalace: 'Phu Tân Cung, Tật Ách Cung (hóa Kỵ)',
    career: 'Luật sư, giáo viên, bán hàng, dẫn chương trình, chuyên gia đàm phán, năng lực cốt lõi là khẩu tài',
    relationship: 'Đa nghi đa lo, dễ suy nghĩ quá nhiều, giao tiếp là then chốt hôn nhân, cần chọn bạn đời có kiên nhẫn',
    wealth: 'Kiếm tiền bằng khẩu tài và kỹ năng chuyên môn, hóa Lộc tài vận khá, hóa Kỵ phòng tranh chấp tài chính',
    health: 'Thuộc Thủy, chú ý thận, tai, khoang miệng. Suy nghĩ nhiều dễ tổn thương, nên học thư giãn giảm áp',
  },
  '天相': {
    niHaixia: 'Thầy Ni nói Thiên Tương là ấn thụ tinh, phụ trách hành chính sự vụ. Người Thiên Tương tọa mệnh trung quy tắc, thích hợp công vụ hành chính. Thiên Tương cần nhất có sao mạnh tương phối mới phát huy được, đơn độc tọa mệnh khá bình thường. Thiên Tương thích nhất Liêm Truyền tương tùy, tạo thành Liêm Tương cục, có thể chủ đại quyền hành chính; sợ nhất Phá Quân đồng cung, tạo thành hình kỵ giáp ấn cục, chủ hung hiểm.',
    classical: 'Cổ quyết: "Thiên Tương vi ấn thụ chi tinh, chủ hành chính sự vụ; Liêm Tương đồng cung, hóa hung vi cát, chưởng hành chính đại quyền." Nam Bắc Sơn Nhân chú: "Thiên Tương thủ mệnh, trung quy tắc, thích hợp công vụ; đắc Liêm Truyền tương phối, khả thành quốc gia tòng lãnh; Phá Quân đồng thủ, tắc hình khắc nan tránh."',
    bestPalace: 'Quan Lộc Cung, Mệnh Cung (phối Liêm Truyền)',
    worstPalace: 'Tài Bạch Cung, Mệnh Cung (phối Phá Quân thì hình kỵ giáp ấn)',
    career: 'Công vụ, quản lý hành chính, thư ký, trợ lý, giỏi vai trò hỗ trợ phụ trợ, cần sao mạnh dẫn đường',
    relationship: 'Tình cảm ổn định, trung hậu chân thành, là bạn đời tốt, nhưng cần đối phương chủ đạo phương hướng',
    wealth: 'Tài vận bình ổn, dựa vào lương tích lũy, không thích hợp đầu tư mạo hiểm, tài chính giữ gìn là tốt nhất',
    health: 'Thuộc Thủy, chú ý thận, hệ bạch huyết. Thể trạng trung bình, nên giữ thói quen sinh hoạt đều đặn',
  },
  '天梁': {
    niHaixia: 'Thầy Ni cho rằng Thiên Lương là ấm tinh, có thể bảo vệ người khác, cũng đại diện cho y học tôn giáo. Người Thiên Lương tọa mệnh có duyên với bề trên, sớm nhiều mài trán, về già hưởng phúc. Thiên Lương sợ nhất hóa Kỵ, đại diện bề trên hoặc sức khỏe có vấn đề. Thiên Lương cùng Thái Dương đồng cung là tốt nhất, nhật nguyệt tương minh, quý nhân che chở, một đời có quý nhân giúp đỡ, cuối cùng được bình an.',
    classical: 'Cổ quyết: "Thiên Lương vi ấm tinh, chủ tế ân bảo hộ; tọa mệnh giả hữu trường duyên, sớm thụ ma luyện, vãn hưởng thanh phúc." Nam Bắc Sơn Nhân chú: "Thiên Lương thủ mệnh, tu phùng cát tinh phương năng phát đạt; ngộ Thái Dương đồng cung, nhật nguyệt tương minh, chủ quý hiển, nhất sinh đa quý nhân tương trợ."',
    bestPalace: 'Mệnh Cung, Phụ Mẫu Cung, Phước Đức Cung',
    worstPalace: 'Mệnh Cung (hóa Kỵ), Tài Bạch Cung',
    career: 'Y tế, tôn giáo, pháp luật, công tác xã hội, từ thiện, thích giúp đỡ người khác, có tâm giúp đỡ mọi người',
    relationship: 'Tình cảm thường gắn với người chênh lệch tuổi lớn, hoặc duyên đến muộn, cần chờ đợi kiên nhẫn mới được duyên lành',
    wealth: 'Tài vận dựa vào quý nhân giúp đỡ, sớm tài vận không tốt, về già tài vận mới vững, nên giữ không nên xung',
    health: 'Thuộc Thổ, chú ý lách, xương. Cần coi trọng sức khỏe lúc về già, nên phòng bệnh sớm',
  },
  '七杀': {
    niHaixia: 'Thầy Ni nói Thất Sát là tướng quân tinh, quyết đoán xung phong mạnh, nhưng có tính cô độc khắc. Thất Sát tọa mệnh phải có phụ tinh hóa giải cô độc, nếu không lục thân duyên mỏng. Thất Sát cùng Võ Khúc đồng cung là tướng tài cục, cực kỳ tốt. Thất Sát sợ nhất trúc la tam hạn (Dương Đà Hỏa Linh chiếu), chủ đại hung, phải phòng bất ngờ. Thất Sát hóa Lộc sau ngược lại thành cát, có thể thành đại tướng chi tài.',
    classical: 'Cổ quyết: "Thất Sát vi tướng quân chi tinh, quyết đoán xung phong cường; thủ mệnh giả cô độc tính trọng, lục thân duyên mỏng." Nam Bắc Sơn Nhân chú: "Thất Sát thủ mệnh, tam hợp cát tụ tắc đại quý; ngộ trúc la tam hạn (Dương đà hỏa linh), chủ đại hung, phòng ỷ ngoại chi tai, phòng hình khắc."',
    bestPalace: 'Mệnh Cung (có phụ tinh), Quan Lộc Cung',
    worstPalace: 'Phu Tân Cung, Phụ Mẫu Cung',
    career: 'Quân cảnh, khởi nghiệp, giao dịch tài chính, lĩnh vực độc lập, cần quyết đoán nhanh và dũng cảm',
    relationship: 'Tình cảm cô độc, khó tìm bạn đời phù hợp, cần người có thể bao dung tính cách mạnh mẽ, nên kết hôn muộn',
    wealth: 'Tài vận dao động lớn, có cơ hội giàu có, cũng có thăng trầm lớn; Võ Khúc đồng cung có thể thành tướng tài cục đại quý',
    health: 'Thuộc Kim, chú ý phổi, đại tràng. Tính tình nóng nảy dễ tổn thương, nên học kiểm soát cảm xúc và tu thân',
  },
  '破军': {
    niHaixia: 'Thầy Ni nói Phá Quân là sao có thể phá cựu lập tân nhất, cũng là một trong những sao cô độc khắc nhất. Phá Quân hóa Lộc sau mới chuyển thành tốt, đại diện có thể phá rồi lập. Phá Quân tọa mệnh lục thân duyên mỏng, nhưng năng lực khai tạo cực kỳ mạnh. Phá Quân thích hợp nhất cải cách, sáng tạo; hóa Lộc thì tài vận chuyển vượng, một phá một lập, cuối cùng có thể thành công sự nghiệp.',
    classical: 'Cổ quyết: "Phá Quân vi năng tối phá cựu lập tân chi tinh, tọa mệnh giả cô độc, lục thân duyên mỏng, nhiên khai tạo năng lực siêu cường; hóa Lộc hậu phá nhi hậu lập, khả thành đại nghiệp." Nam Bắc Sơn Nhân chú: "Phá Quân thủ mệnh, nhất sinh đa ba thuyết; hóa Lộc giả, phá tài chi hậu phương năng trùng kiến, tài vận chung quy hảo chuyển, chủ vãn niên thành tựu."',
    bestPalace: 'Quan Lộc Cung (hóa Lộc), Thiên Di Cung',
    worstPalace: 'Phu Tân Cung, Phụ Mẫu Cung',
    career: 'Nghiệp khởi kiểu sáng tạo, quân cảnh, cải cách, quản lý thay đổi, thích hợp tiên phong không ngừng khai phá lĩnh vực mới',
    relationship: 'Tình cảm nhiều sóng gió, ly hợp bất định, lục thân duyên mỏng, cần chọn bạn đời độc lập có sức bao dung lớn',
    wealth: 'Tài vận thăng trầm lớn, hóa Lộc tài vận chuyển tốt; giữ gìn thì tài suy thoái, cần không ngừng khai phá mới tích lũy được',
    health: 'Thuộc Thủy, chú ý thận, bàng quang, hệ sinh sản. Thể trạng thăng trầm, nên giữ thói quen tập thể dục đều đặn',
  },
};

const levelConfig = {
  major: { label: 'Chủ Tinh', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát Tinh', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát Tinh', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Tạp Tinh', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

// ── SiHua color map ──────────────────────────────────────────
const SI_HUA_VN: Record<string, string> = { '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ' };
function vnSiHua(s: string) { return SI_HUA_VN[s] ?? s; }

const siHuaColors: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>{vnStar(star.name)}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  Hóa{vnSiHua(star.siHua)}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--color-text-muted)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* Basic info */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ Hành · ${desc.element}`,
                  `Tính chất · ${desc.nature}`,
                  ...(palaceName ? [`Vị trí · ${vnPalace(palaceName)}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? 'Nhập miếu' : star.brightness === 'dim' ? 'Lạc hãm' : 'Bình hòa'] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--color-border)',
                      color: tag === 'Nhập miếu' ? '#eab308' : tag === 'Lạc hãm' ? '#ef4444' : 'var(--color-text-body)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

              {/* Từ khóa */}
              {desc && (
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Đặc Trưng Tinh Y</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--color-accent)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nguyên văn cổ thư */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>
                  Nguyên văn cổ thư
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--color-accent)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}

            {/* Giải đoán Thầy Ni Hải Hạ */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--color-border)' }} />
                    Thầy Ni Hải Hạ giải đoán
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--color-border)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-body)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Hướng Sự Nghiệp', value: detail.career, icon: '◈' },
                    { label: 'Đặc Trưng Tình Cảm', value: detail.relationship, icon: '♡' },
                    { label: 'Phân Tích Tài Vận', value: detail.wealth, icon: '◆' },
                    { label: 'Lưu Ý Sức Khỏe', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Cung Tốt Nhất</div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Cung Cần Lưu Ý</div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* Phụ tinh/Sát tinh */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                {star.type === 'lucky' && (
                  <>
                    {star.name === '文昌' && 'Văn Xương nhập cung, chủ học tập thi cử thuận lợi, văn thư ấn chương có lợi, thích hợp công việc liên quan đến văn tự. Cổ quyết: "Văn Xương khoa giáp, chủ văn chương hiển đạt, phùng khảo tất đệ."'}
                    {star.name === '文曲' && 'Văn Khúc nhập cung, chủ tài năng xuất chúng, khẩu tài tốt, giỏi biểu đạt, năng khiếu nghệ thuật mạnh. Cổ quyết: "Văn Khúc vi tài nghệ chi tinh, năng văn năng võ, khẩu tài thắng nhân."'}
                    {star.name === '左辅' && 'Tả Phụ nhập cung, chủ quý nhân giúp đỡ, có người nâng đỡ, việc trong cung được hỗ trợ thiện ý. Cổ quyết: "Tả Phụ vi trợ lực chi tinh, tọa mệnh tắc quý nhân đa, phùng hung hóa cát."'}
                    {star.name === '右弼' && 'Hữu Phụ nhập cung, chủ quý nhân giúp đỡ, nhiều quý nhân nữ giới, việc trong cung có người hỗ trợ. Cổ quyết: "Hữu Phụ vi âm trợ chi tinh, đa nữ quý nhân, hóa hiểm vi nha."'}
                    {star.name === '天魁' && 'Thiên Khôi nhập cung, chủ quý nhân sinh ban ngày, quý nhân nam giới nhiều, lực hóa hung thành cát. Cổ quyết: "Thiên Khôi vi thiên ất quý nhân, phùng chi tất hữu quý nhân phù trì."'}
                    {star.name === '天钺' && 'Thiên Võ nhập cung, chủ quý nhân sinh ban đêm, quý nhân nữ giới nhiều, tăng thêm khí lành cát giới. Cổ quyết: "Thiên Võ vi ngọc đường quý nhân, chủ âm trợ, nữ quý nhân đa."'}
                    {star.name === '禄存' && 'Lộc Tồn nhập cung, chủ tài lộc thủ thành, cung vị có tài khí, nhưng thuộc loại tài vận bảo thủ. Cổ quyết: "Lộc Tồn vi tài lộc chi tinh, chủ thủ tài dư thừa, tiến tài kiên toàn."'}
                    {star.name === '天马' && 'Thiên Mã nhập cung, chủ bôn động dâng trào, động trung cầu tài, nên chủ động xuất kích, không nên ngồi đợi. Cổ quyết: "Thiên Mã chủ động, phùng lộc tắc tài lộc song toàn, động trung sinh tài."'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {star.name === '地空' && 'Địa Không nhập cung, chủ việc trong cung có cảm giác hư không, tinh thần tiêu tán, nên chú ý sức khỏe tâm thần. Cổ quyết: "Địa Không chủ hư hao, nhập mệnh cung giả đa tinh thần mê mang, tu phòng không tưởng."'}
                    {star.name === '地劫' && 'Địa Kiếp nhập cung, chủ việc trong cung có tổn thất bất ngờ, tài vật cần thận trọng, phòng tiểu nhân. Cổ quyết: "Địa Kiếp chủ kiếp tài, nhập mệnh cung giả tài vận thụ tổn, phòng ỷ ngoại chi thất."'}
                    {star.name === '火星' && 'Hỏa Tinh nhập cung, chủ việc trong cung nóng nảy xung động, cảm xúc dao động, nhưng nếu gặp Đam Lang thì ngược lại thành cát. Cổ quyết: "Hỏa Tinh chủ cấp rộ, nhiên ngộ Đam Lang đồng cung, phản vi hỏa đam cục, chủ bạo phát."'}
                    {star.name === '铃星' && 'Linh Tinh nhập cung, chủ việc trong cung có trở ngại ngầm, phòng tiểu nhân phía sau, việc gì cũng nên khiêm nhường. Cổ quyết: "Linh Tinh chủ ám sát, nhập mệnh giả đa ngầm thụ địch, tu phòng sau lưng thị phi."'}
                    {star.name === '擎羊' && 'Kình Dương nhập cung, chủ hình khắc, việc trong cung nhiều sóng gió, có tai nạn đổ máu hoặc bất ngờ. Cổ quyết: "Kình Dương vi hình khắc chi tinh, nhập mệnh cung giả đa hình khắc, tu phòng ỷ ngoại huyết quang."'}
                    {star.name === '陀罗' && 'Đà La nhập cung, chủ thị phi quanh quẩn, việc trong cung trì hoãn không quyết, việc gì cũng nên chuẩn bị sớm. Cổ quyết: "Đà La chủ thị phi trì hoãn, nhập mệnh cung giả tác sự trì hoãn, tu phòng cuốn chuốc không rõ."'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
