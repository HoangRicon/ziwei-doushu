/**
 * Cơ sở tri thức hợp bản Tử Vi Đẩu Số
 * Dựa trên hệ thống Nhu Hải Hạ《Thiên Kỷ》 + 《Tử Vi Đẩu Số Toàn Thư》bình luận cổ điển + Tổng hợp tài liệu chuyên nghiệp toàn mạng
 * Để AI phân tích hợp bản sử dụng
 */

// ─── Thập Tứ Sao Chính trong Phu Tân Cung bình luận hoàn chỉnh ──────────────────────────

export const STAR_IN_FUQI_GU: Record<string, {
  summary: string;       // Một câu cốt lõi
  good: string;          // Điều kiện/biểu hiện Cát tượng
  bad: string;           // Hung tượng/lưu ý
  spouse_traits: string; // Ngoại hình tính cách vợ/chồng
  timing: string;        // Gợi ý thời hạn kết hôn
  ni_quote?: string;     // Lời nguyên của Nhu Hải Hạ
}> = {
  '紫微': {
    summary: 'Vợ/chồng cao ngạo năng lực, nên kết hôn muộn, tình cảm lấy tôn trọng làm cơ sở',
    good: 'Tam phương có Phụ Tịch tương giá, vợ/chồng hiền tài có tài năng, hôn nhân sau kết hôn được quý nhân giúp đỡ; Hợp thấy Lộc tồn chủ tài lộc song toàn',
    bad: 'Cô Quân vô Phụ, vợ/chồng mạnh mẽ khó giao tiếp; Thìn Tuất cung phu thê tình phần mỏng manh; Hội Phá Quân: trước hôn nhân có nhiều trở ngại',
    spouse_traits: 'Vợ/chồng khí chất cao ngạo, có chủ kiến, tự tôn mạnh, năng lực mạnh nhưng không dễ bộc lộ cảm xúc',
    timing: 'Nên kết hôn muộn (nam trên 30, nữ trên 27), sớm kết hôn nhiều trắc trở',
    ni_quote: 'Tử Vi tại Phu Tân Cung, cô khắc, nên kết hôn muộn, tình cảm tốt nhưng chi phí giao tiếp cao',
  },
  '天机': {
    summary: 'Hôn nhân nhiều biến đổi, nên chọn vợ/chồng chênh lệch tuổi lớn hơn',
    good: 'Thấy Lộc Tồn hoặc Hóa Lộc: tình cảm có thể duy trì; Hội Thái Âm: bổ sung thêm tinh tế dịu dàng',
    bad: 'Hóa Kỵ hoặc hội sát: tình cảm biến đổi lớn, dễ chia ly; Thiên Cơ thiện biến, vợ/chồng đối với tình cảm do dự',
    spouse_traits: 'Vợ/chồng thông minh hay thay đổi, tâm tư tinh tế, duyên sâu với tôn giáo triết học, hơi thần kinh',
    timing: 'Nên chênh lệch tuổi lớn (chênh trên 6 tuổi), có thể giảm xung đột thay đổi hai bên',
    ni_quote: 'Thiên Cơ thiện biến, không nên độc tọa, hôn nhân đầy biến đổi',
  },
  '太阳': {
    summary: 'Nam mệnh giúp vợ, nữ mệnh vượng phu; Rơi vào Hãm thêm Hóa Kỵ thì ngược lại chủ hình khắc',
    good: 'Tại Miếu (từ Mão đến Thân): vợ/chồng năng lực, nam mệnh có người vợ hiền tài; nữ mệnh gả người vượng phu, hôn nhân mỹ mãn',
    bad: 'Rơi vào Hãm (từ Dậu đến Dần): nam mệnh vợ/chồng bệnh yếu, nữ mệnh gả người tầm thường; Hóa Kỵ: nữ mệnh "trên không thấy cha, dưới không thấy con, giữa không thấy chồng", mười năm đó chồng có tai họa lớn',
    spouse_traits: 'Vợ/chồng cởi mở rộng rãi, có ý thức hình ảnh công chúng, hào phóng nhưng đôi khi quá mạnh mẽ',
    timing: 'Xu hướng tình cảm bắt đầu nóng nhưng cuối lạnh, nên giữ khoảng cách vừa phải để duy trì sự mới mẻ',
    ni_quote: 'Thái Dương hóa Kỵ, trên không thấy cha, dưới không thấy con, giữa không thấy chồng——Nữ mệnh mười năm đó chồng chắc chắn có tai họa lớn',
  },
  '武曲': {
    summary: 'Sao cô tộc, hôn nhân hình khắc, đều nên kết hôn muộn',
    good: 'Võ Cực hóa Lộc: vợ/chồng có tài nhưng nam mệnh ngược lại than vợ quá năng lực; Thấy Lộc Tồn Phụ Giúp: hôn nhân ổn định có tài',
    bad: 'Hóa Kỵ: cô ốm, khó kết hôn, hoặc vợ/chồng có tàn tật; Võ Cực Thất Sát (Mão Dậu cung): điềm báo hôn nhân ác liệt; Gặp Tứ Sát bất kỳ: chủ ly hôn; Võ Cực Phá Quân: gặp sát kỵ hình dao hôn nhân nhất định bất lợi',
    spouse_traits: 'Vợ/chồng cương liệt độc lập, nói chuyện trực tiếp, không giỏi bộc lộ cảm xúc, kinh tế năng lực mạnh nhưng tính cách cô khắc',
    timing: 'Võ Cực hệ đều khuyến nghị kết hôn sau 30 tuổi, sớm kết hôn sớm tan',
    ni_quote: 'Võ Cực hóa Kỵ, vi Hình Sự chi tinh, Võ Cực hệ hôn nhân nên muộn',
  },
  '天同': {
    summary: 'Vợ/chồng ôn hòa hưởng lạc, nên chênh lệch tuổi lớn, kết hôn muộn là cát',
    good: 'Thấy Lộc Tồn hoặc Hóa Lộc: vợ/chồng ôn hòa mang tài, gia đình ổn định; Cùng Thái Âm: tình cảm ngọt ngào dịu dàng',
    bad: 'Hóa Kỵ: tình cảm ban đầu còn được, dần chuyển nhạt, do điều phối không tốt gây ra oán hận; Gặp sát nhiều: lười biếng trở thành gánh nặng',
    spouse_traits: 'Vợ/chồng ôn hòa thiện lương, lạc quan thuận theo, nhưng có thể lười biếng, hưởng lạc chủ nghĩa mạnh',
    timing: 'Nam lấy vợ nhỏ hơn, nữ gả người lớn hơn, chênh lệch trên 8 tuổi là kết hôn tốt nhất',
  },
  '廉贞': {
    summary: 'Phu Tân Cung bất ổn định nhất trong các Sao Chính, rủi ro sinh ly tử biệt cao',
    good: 'Liêm Trung Thiên Phủ (Tử Ngọ): vợ/chồng ôn hòa thanh tú, tình cảm còn có thể, vợ/chồng đa số là người làm công ăn lương',
    bad: 'Liêm Trung Đam Lang: phi sinh ly tử biệt; Liêm Trung Phá Quân: làm mồ mả dưới nước; Liêm Trung Thất Sát: chôn xác nửa đường; Hóa Kỵ: tình cảm quấy rối liên tục, hòa hợp tan vỡ tuần hoàn; Cùng Hỏa Tinh đồng cung: có cát tinh cũng ly biệt',
    spouse_traits: 'Vợ/chồng ngoại hình xuất chúng, giỏi giao tiếp, giá trị cảm xúc cao, nhưng không ổn định; Có thể ly nhiều gặp ít',
    timing: 'Nam mệnh nên lấy vợ trẻ hơn (trẻ 6-12 tuổi), nữ mệnh nên gả người lớn tuổi hơn',
    ni_quote: 'Liêm Trung Đam Lang/Liêm Trung Phá Quân tại Phu Tân Cung, không phân nam mệnh nữ mệnh, phi sinh ly tử biệt; Liêm Trung Thất Sát——nửa đường chôn xác; Liêm Trung Phá Quân——làm mồ dưới nước; Liêm Trung Đam Lang——hoạnh yểu (chết trẻ)',
  },
  '天府': {
    summary: 'Sao thiện, chủ sinh ly bất tử biệt, tình cảm ổn định nhưng bình thường',
    good: 'Thấy Lộc Tồn hoặc Hóa Lộc: tài lộc song toàn, tình cảm ổn định; Tam phương vô sát: vợ chồng bình yên hài hòa',
    bad: 'Phụ Tịch đơn tinh: dễ có hôn nhân lần hai; Gặp Tứ Sát: tình cảm mơ hồ, xác suất sinh ly tăng',
    spouse_traits: 'Vợ/chồng ôn văn nhã quý, sở thích rộng, giữ tài có nguyên tắc, năng lực công việc mạnh, nhưng bảo thủ',
    timing: 'Nam mệnh vợ lớn tuổi hơn, nữ mệnh vợ nhỏ tuổi hơn; tình cảm ổn định nhưng cần chủ động vận hành',
  },
  '太阴': {
    summary: 'Thích vợ/chồng thanh tú dịu dàng; Rơi vào Hãm thêm sát thì tình cảm nhiều biến đổi',
    good: 'Tại Miếu (tử đến ngọ) thấy cát: vợ/chồng thanh tú có thành tựu, nam mệnh vợ đẹp; nữ mệnh: bản thân thanh tú có khí chất',
    bad: 'Rơi vào Hãm (未 đến Hợi): tình cảm dễ thay đổi, vợ/chồng sức khỏe không tốt; Hóa Kỵ (nam mệnh đặc biệt kiêng): mẹ chồng nàng dâu bất hòa, vợ và mẹ nhất định xung đột; Gặp Hỏa Linh: tình cảm biến đổi lớn',
    spouse_traits: 'Vợ/chồng dịu dàng thanh tú, tinh tế nhạy cảm, trọng tình cảm, nhưng đôi khi bộc phát cảm xúc',
    timing: 'Không có ràng buộc cụ thể, nhưng khi rơi vào Hãm nên kết hôn muộn',
    ni_quote: 'Đàn ông mệnh, sợ nhất Thái Âm hóa Kỵ, mẹ chồng nàng dâu bất hòa, vợ và mẹ nhất định không hòa',
  },
  '贪狼': {
    summary: 'Đào Hoa sung túc nhất, hôn nhân không ổn định, rủi ro ngoại tình cao',
    good: 'Hóa Lộc: vợ/chồng tài năng, phong tình vạn chủng, tình cảm ngọt ngào (nhưng rủi ro ngoại tình không giảm); Gặp Hóa Khoa: giảm ngoại tình',
    bad: 'Hóa Kỵ: nhiều hôn nhân lần hai; Tử Vi Đam Lang (Mão Dậu): vợ/chồng nhiều đi ra ngoài, có điềm ngoại tình; Gặp Tứ Sát: nhất định sinh ly; Ngọ cung Đam Lang (Võ quan tinh): ngược lại chủ vợ/chồng Võ chức, tương đối ổn định',
    spouse_traits: 'Vợ/chồng tài năng siêu quần, năng lực xã hội mạnh, duyên异性 tốt, nhưng dục vọng mạnh, khó kiềm chế',
    timing: 'Sớm kết hôn tình cảm nhiều biến đổi, nên kết hôn muộn; Trước hôn nhân nhất định tìm hiểu quan hệ của đối phương',
    ni_quote: 'Đam Lang ngoài chỉ đào hoa tinh, còn chỉ tửu sắc tài khí độ, đều ở trong Đam Lang; Đam Lang tại Ngọ cung là Võ quan tinh, đừng tùy tiện bình đào hoa',
  },
  '巨门': {
    summary: 'Khẩu thị thị phi nhiều, vợ chồng dễ cãi vã, cần Thái Dương hóa giải',
    good: 'Thái Dương tại Miếu tương hội: ngược lại chủ hôn nhân hòa mỹ, khẩu tài hóa thành công cụ giao tiếp; Hóa Lộc: vợ hiền tài, tài lộc vì vợ mà mở',
    bad: 'Hóa Kỵ: vợ/chồng thích nói nhiều, thị phi không ngừng; Đà La cùng độ: vợ chồng tự tìm kiếm phiền não; Độc thủ vô cát: tình cảm ức chế, mâu thuẫn sâu sắc',
    spouse_traits: 'Vợ/chồng khẩu tài giỏi, tâm tính ghen tuông mạnh, quan tâm mặt mũi, đôi khi quá khắt khe, nhưng nội tâm thắm thiết',
    timing: 'Không có ràng buộc cụ thể, nhưng cần chuẩn bị tâm lý cho việc điều chỉnh giao tiếp lâu dài',
  },
  '天相': {
    summary: '"Thân thượng gia thân" lương duyên, phu tôn phụ hát, hôn nhân hợp tác',
    good: 'Thấy Phụ Tịch song toàn: tình cảm trung thành, hôn nhân vững chắc; vợ/chồng chính trực thực tế; Thiên Tương tam hợp thấy Lộc: tài lộc có thể kỳ vọng',
    bad: 'Phụ Tịch đơn tinh: có thể dự báo hôn nhân lần hai; Gặp sát nhiều: tình cảm ức chế ủy khuất, không giỏi bộc lộ',
    spouse_traits: 'Vợ/chồng chính trực thực tế, giữ chữ tín, không thích xung đột, giỏi điều phối, là bạn đời tuyệt vời',
    timing: 'Đa số là quan hệ phát triển từ bạn học, đồng nghiệp, hàng xóm quen biết, nên vợ chồng hợp tác làm việc',
  },
  '天梁': {
    summary: 'Thích vợ/chồng trách nhiệm mạnh hoặc tuổi lớn hơn, trước hôn nhân nhiều sóng gió',
    good: 'Thấy Lộc: vợ/chồng có phước đức, tình cảm thực tế; Tam phương có cát: tình cảm vận hành ổn định lý trí',
    bad: 'Hóa Kỵ hoặc thấy sát: nói nhiều, mạnh mẽ thuyết phục, tình cảm xa cách; Thiên Lương phối Thiên Mã: vợ chồng vì hoàn cảnh phân tán; Trước hôn nhân dễ tình đầu thất bại',
    spouse_traits: 'Vợ/chồng trách nhiệm mạnh, trầm ổn thành, giỏi nói lý, nhưng đôi khi có xu hướng giảng giải',
    timing: 'Trước hôn nhân nhiều sóng gió là thường tình, một khi kết hôn ngược lại vững chắc; vô sát sau hôn nhân duyên sâu hơn',
  },
  '七杀': {
    summary: '"Loan khân bán lãnh"——Gặp ít xa nhiều, nên kết hôn muộn sau 30 tuổi',
    good: 'Tại Miếu (Dần Thân cung): vợ/chồng tuy cương mạnh nhưng trung thành, một khi đầu tư thì toàn lực phó trọn; Hóa Lộc giúp: giảm cô khắc',
    bad: 'Gặp sát: tình cảm bề ngoài hài hòa nội tâm bất mãn, nam mệnh chủ hai vợ; nữ mệnh nên làm thiếp kế thừa; Mão Dậu cung (Võ Cực Thất Sát): vận hôn nhân tệ nhất',
    spouse_traits: 'Vợ/chồng cương mạnh cô khắc,一见钟情 nhanh, rời đi cũng nhanh, yêu đương nóng lạnh đều nhanh',
    timing: 'Đều nên kết hôn muộn, sau 30 tuổi hôn nhân tương đối vững chắc; sớm kết hôn nhiều hình khắc',
    ni_quote: 'Thất Sát cư phu nhĩ loan khân bán lãnh (Cổ phú); Nếu lấy cô vợ là Thất Sát nhập mệnh, vậy ngươi liền hỏng một nửa rồi, rất mệt mỏi a, cỏ cây gió sợ hãi',
  },
  '破军': {
    summary: 'Sao phá hao hôn nhân, không ai qua được, theo đuổi tình cảm không ràng buộc',
    good: 'Hóa Lộc: phá nhi lập, tình cảm trải qua sóng gió ngược lại có thể đi đến cuối cùng; Anh tinh nhập miếu: vợ/chồng anh tuấn có cá tính',
    bad: 'Hóa Kỵ: phá hủy hết, nhiều một hôn nhân hoặc không kết hôn; Tử Vi Phá Quân (Sửu Mùi): không thêm sát cũng khắc, thêm sát nhất định ly hôn; Cùng Liêm Trung: làm mồ dưới nước; Trung niên sau có tướng phân giường phân ở',
    spouse_traits: 'Vợ/chồng theo đuổi tự do, không thích ràng buộc, dũng cảm đột phá, nhưng quan niệm hôn nhân yếu, cả đời biến đổi nhiều',
    timing: 'Trước hôn nhân dễ一见钟情 hoặc kết hôn vội vàng, nên kéo dài thời gian tìm hiểu rồi mới quyết định',
    ni_quote: 'Liêm Trung Phá Quân tại Phu Tân Cung, làm mồ dưới nước; Phá Quân là sao phá hủy hôn nhân mạnh nhất',
  },
};

// ─── Tứ Hóa tại Phu Tân Cung bình luận hoàn chỉnh ──────────────────────────

export const SIHUA_IN_FUQI_GU = {
  '化禄': 'Với vợ/chồng có duyên thiên bẩm, vợ/chồng tính cách lạc quan, sau hôn nhân tình cảm tốt hơn, vợ/chồng càng ngày càng biết kiếm tiền, duyên phận sâu sắc; Tự hóa Lộc thì tài đến tài đi, tình cảm có nhưng khó giữ',
  '化权': 'Hôn nhân đa số chủ động tranh giành mà đến, vợ/chồng nắm quyền quyết định, phần lớn sự việc vợ/chồng tự quyết, cần học cách buông tay; Hôn nhân kiểu tranh đoạt, càng cưỡng cầu càng khó được',
  '化科': 'Xem như tiểu Lộc, có thể cùng vợ/chồng hòa hợp, có quý nhân duyên, có lợi cho yêu đương kết hôn; Khoa tại Phu Tân chủ vợ/chồng có danh tiếng hoặc kỹ năng chuyên môn',
  '化忌': 'Nợ hôn nhân, sớm kết hôn sớm ly, khuyến nghị kết hôn muộn hoặc không kết hôn; Vợ/chồng đối với bản thân có oán than; Hóa Kỵ xung Phu Tân Cung đặc biệt hung——điềm sinh ly tử biệt',
};

// ─── Phương pháp luận cốt lõi hợp bản ─────────────────────────────────────────

export const HEMING_METHODOLOGY = `
## Khung phân tích cốt lõi hợp bản (Hệ thống Nhu Hải Hạ + 《Tử Vi Đẩu Số Toàn Thư》tổng hợp)

### I. Nguyên tắc Liên Tham song cung (Phương pháp bình hôn nhân quan trọng nhất của Nhu Hải Hạ)

**Khẩu quyết cốt lõi: «Xem hôn nhân, chỉ nhìn Phu Tân Cung, sai hoàn toàn, nhất định phải đồng thời xem Phước Đức Cung.»**

- **Phu Tân Cung**: Xem Sao chủ, ngoại hình, tính cách, chế độ tương tác của vợ/chồng
- **Phước Đức Cung**: Đại diện tình cảm sâu sắc vợ chồng, hôn nhân có thể lâu dài không
- **案例 của Nhu Sư**: "Có người Phu Tân Cung rất tốt, Phước Đức Cung rất kém, tan! Vợ chồng sẽ tan."

**Do đó khi hợp bản phải đồng thời phân tích của hai bên: Mệnh Cung + Phu Tân Cung + Phước Đức Cung**

---

### II. Tiêu chuẩn đánh giá Thiên Tác chi Hợp (Đại hợp từ trời)

**Tương hợp cao cấp nhất (Thiên Tác chi Hợp)**:
- Phu Tân Cung chủ tinh bên A = Mệnh Cung chủ tinh bên B
- Phu Tân Cung chủ tinh bên B = Mệnh Cung chủ tinh bên A
- Hai bên tương ứng lẫn nhau, là đôi bạn định mệnh

**Tương hợp cấp thứ hai**:
- Một bên Phu Tân Cung chủ tinh = Mệnh Cung chủ tinh đối phương (tương ứng đơn hướng)
- Ngũ hành Mệnh Cung hai bên tương sinh (vd: Mộc mệnh phối Thổ mệnh, Thổ mệnh phối Thủy mệnh)
- Đại hạn hai bên cùng đi vận Vượng

**Tổ hợp điềm hung**:
- Hai bên tương hóa Kỵ xung Mệnh Cung đối phương (oan gia)
- Một bên hóa Kỵ bay vào Phu Tân Cung đối phương (mang đến tổn thương hôn nhân cho đối phương)
- Phu Tân Cung hai bên đều có trọng sát vô cát tinh

---

### III. Pháp ngũ bước hợp bản hoàn chỉnh

**Bước một: Đánh giá cơ sở mệnh cách hai bên**
- Cục diện Mệnh Cung hai bên có tương xứng không (cùng loại or bổ trợ)
- Trọng điểm xem: Mệnh Cung + Thân Cung + Phước Đức Cung kết hợp sao
- Cảnh báo: Hai bên đều là Sát Phá Lang (hai hổ tương tranh); hoặc một mạnh một yếu quá chênh lệch

**Bước hai: Liên Tham Phu Tân Cung**
- Phu Tân Cung chủ tinh bên A → Có tương ứng Mệnh Cung/Tam hợp phương sao bên B không?
- Phu Tân Cung chủ tinh bên B → Có tương ứng Mệnh Cung/Tam hợp phương sao bên A không?
- Tứ hóa trạng thái Phu Tân Cung hai bên (Hóa Lộc/Hóa Kỵ ảnh hưởng lớn nhất)

**Bước ba: Phân tích tướng sao Thái Dương Thái Âm**
- Nữ mệnh: Thái Dương đại diện chồng; Thái Dương tại Miếu=Vượng phu, rơi vào Hãm hóa Kỵ=Khắc phu
- Nam mệnh: Thái Âm đại diện vợ; Thái Âm tại Miếu=Vợ đẹp hiền, hóa Kỵ=Mẹ chồng nàng dâu bất hòa
- Trạng thái hai sao này trong bản đồ hai bên, trực tiếp ảnh hưởng chất lượng hôn nhân

**Bước bốn: Liên Tham phi hóa Tứ Hóa (Kỹ thuật cao cấp)**
- Năm sinh bên A → Tìm Sao Tứ Hóa → Những sao này rơi vào Cung nào trong bản đồ bên B
  - Hóa Lộc bay vào Mệnh Cung/Tài Bạch Cung bên B: Có hỗ trợ tích cực cho bên B
  - Hóa Kỵ bay vào Phu Tân Cung bên B: Mang đến tổn thương hôn nhân cho bên B
  - Hóa Kỵ bay vào Mệnh Cung bên B: Bản thân tạo áp lực cho đối phương
- Năm sinh bên B → Phân tích ngược lại bên A
- Hình thành "Phi hóa liên tham", đánh giá "Loại duyên" hai chiều

**Bước năm: Phân tích đồng bộ Đại hạn**
- Đại hạn hiện tại hai bên có cùng đi Vận Vượng không: Cùng Vượng=Thời cơ tốt nhất, Cùng Suy=Thách thức chung
- Một bên Vượng một bên Suy: Cần chủ động cân bằng trạng thái hai bên
- Tam hợp phương đào hoa tinh hội tụ trong Lưu Niên: Năm đó thời cơ kết hôn tốt

---

### IV. Đánh giá loại duyên

| Loại duyên hóa | Đặc điểm |
|-----------------|----------|
| Duyên Lộc dẫn động | Chính duyên, tình yêu chân thật, tình cảm ngọt ngào thuận lợi |
| Duyên Quyền dẫn động | Tình cảm chủ động tranh đoạt, có lực căng, có bên chủ đạo |
| Duyên Khoa dẫn động | Duyên số hòa hợp, tôn trọng lẫn nhau, loại sống đến già |
| Duyên Kỵ dẫn động | Nghịch duyên/oan gia, giày vò lẫn nhau nhưng khó chia ly, cần tu tâm dưỡng tính mới có thể hóa giải |
| Hai bên tương Hóa Kỵ | Loại "Đường cùng gặp nhau", tình cảm mãnh liệt nhưng đau khổ đồng thời, kiểu nợ tiền kiếp |

---

### V. Pháp ba tầng đoán ngày cưới

**Tầng một: Cục diện bản mệnh**
- Phu Tân Cung vô sát: Nên sớm kết hôn
- Phu Tân Cung có sát vô cát: Nên kết hôn muộn (nam trên 30, nữ trên 27)
- Võ Cực, Liêm Trung, Thất Sát, Phá Quân tại Phu Tân Cung: Đều khuyến nghị kết hôn muộn

**Tầng hai: Đại hạn**
- Đại hạn Phu Tân Cung nhiều cát tinh: Mười năm đó có cơ hội kết hôn
- Đại hạn Phu Tân Cung hóa Kỵ: Mười năm đó tình cảm bị cản trở

**Tầng ba: Lưu niên**
- Hồng Loan, Thiên Hỷ nhập Mệnh Cung hoặc Phu Tân Cung: Năm đó tình duyên có động
- Lưu niên cung vị rơi vào Phu Tân Cung: Năm đó hôn nhân là trọng điểm
- Lưu niên tam hợp phương đào hoa tinh hội tụ: Năm đó nhiều cơ hội tình cảm

---

### VI. Tình huống kết hôn theo các cung

| Lưu niên cung vị | Tình huống kết hôn |
|-------------------|-------------------|
| Phu Tân Cung | Phát triển tình cảm bình thường kết hôn |
| Mệnh Cung | Bản thân chủ động xuất kích kết hôn |
| Tử Nữ Cung | Kết hôn vì có con (lên xe trước mua vé sau) |
| Điền Trạch Cung | Vì gia đình, bất động sản mà kết hôn |
| Phụ Mẫu Cung | Theo lệnh cha mẹ, qua giới thiệu trưởng bối |

---

### VII. Dấu hiệu cụ thể Khắc phu/Khắc tài

**Mệnh Khắc phu (ý nghĩa không truyền thống) định nghĩa của Nhu Sư**:
> "Con gái khắc phu, chính là cô vợ đi phía trước, anh chồng đằng sau mồ hôi nhễ nhại xách túi lớn túi nhỏ trả tiền,好不容易等到 xe, anh chồng còn phải giúp cô vợ mở cửa. Đây gọi là khắc phu."
> "Vượng phu, một người vợ hoàn toàn khiến anh chồng không có lo âu hậu phương."

**Dấu hiệu cụ thể**:
- Phu Tân Cung Liêm Trung+Đam Lang/Phá Quân/Thất Sát (tổ hợp ba hung)
- Thái Dương rơi vào Hãm hóa Kỵ (nữ mệnh)
- Thái Âm hóa Kỵ (nam mệnh)
- Phu Tân Cung Tứ Sát tụ hội vô cát tinh
- Cô Tần Cô Túc nhập Mệnh Cung hoặc Phu Tân Cung
- Phước Đức Cung Phá Quân rơi vào Hãm + Liêm Trung bình (Trung mồ nước cục)

---

### VIII. Đánh giá hợp tác sự nghiệp

**Cung tham khảo chính**:
- Quan Lộc Cung: Sao tính sự nghiệp hai bên có tương thích không
- Huynh Đệ Cung (Túc Y Cung): Đại diện quan hệ hợp tác
- Phước Đức Cung: Có thể cùng chịu ngọt dùng đắng không

**Điềm cát hợp tác sự nghiệp**:
- Mệnh Cung hai bên bổ trợ (một mưu một hành)
- Một bên Quan Lộc Cung hóa Lộc bay vào Quan Lộc Cung đối phương
- Huynh Đệ Cung có Lộc Tồn vô hóa Kỵ xung

**Điềm hung hợp tác sự nghiệp**:
- Hai bên hóa Kỵ tương xung Quan Lộc Cung
- Mệnh Cung đối phương hóa Kỵ bay vào Tài Bạch Cung bản thân (đối phương tiêu hao tiền bạc mình)
- Cử Môn tại Huynh Đệ/Túc Y Cung: Nhu Sư nói: "Cử Môn tại bằng hữu cung, đại diện cùng bằng hữu hợp tác sẽ bằng hữu thành cừu nhân"

---

### IX. Loại pha tình cảm (Đánh giá nhanh tương thích mệnh cách)

| Tổ hợp hai bên | Tương thích | Giải thích |
|-----------------|-------------|------------|
| Tử Vi + Thiên Phủ | ★★★★★ | Đế tinh gặp tài khố, tương hỗ thành tựu, ổn định nhất |
| Thiên Tương + Bất kỳ sao | ★★★★ | Ấn tinh tác tài, Thiên Tương khả năng thích nghi mạnh |
| Thiên Lương + Thiên Đồng | ★★★★ | Trưởng thành và ôn hòa bổ trợ, loại sống đến già |
| Thái Dương + Thái Âm | ★★★★ | Nhật nguyệt tương minh, bổ trợ kinh điển, âm dương điều hòa |
| Thất Sát + Thất Sát | ★★ | Hai hổ tương tranh, tia lửa lớn, nhiều mâu thuẫn |
| Phá Quân + Phá Quân | ★★ | Song phá, tương phá hủy, hôn nhân không ổn |
| Liêm Trung + Thất Sát/Phá Quân | ★ | Tổ hợp ba hung trong hai, rủi ro sinh ly tử biệt cao nhất |
| Sát Phá Lang + Cơ Nguyệt Đồng Lương | ★★★ | Động tĩnh bổ trợ, nhưng cần mài giũa, một bên khai thác một bên thủ',
| Tử Phá + Liêm Phủ | ★★★★ | Cục diện tương đương, tương hấp dẫn |
| Võ Cực + Thiên Đồng | ★★★ | Cương nhu tương chế, Võ Cực thu liễm gặp Thiên Đồng ôn hòa, có thể bổ trợ |

---

### X. Tổng hợp danh ngôn cốt lõi hợp bản của Nhu Hải Hạ

1. **"Xem hôn nhân, chỉ nhìn Phu Tân Cung, sai hoàn toàn, nhất định phải đồng thời xem Phước Đức Cung."**
2. **"Liêm Trung Đam Lang/Liêm Trung Phá Quân tại Phu Tân Cung, không phân nam mệnh nữ mệnh, phi sinh ly tử biệt."**
3. **"Liêm Trung Thất Sát——nửa đường chôn xác; Liêm Trung Phá Quân——làm mồ dưới nước; Liêm Trung Đam Lang——hoạnh yểu chết trẻ."**
4. **"Thái Dương hóa Kỵ, trên không thấy cha, dưới không thấy con, giữa không thấy chồng." (Nữ mệnh mười năm đó phu quân có tai họa lớn)**
5. **"Đàn ông mệnh, sợ nhất Thái Âm hóa Kỵ, mẹ chồng nàng dâu bất hòa, vợ và mẹ nhất định không hòa."**
6. **"Vượng phu, một người vợ hoàn toàn khiến anh chồng không có lo âu hậu phương; Khắc phu là tình cảm quá tốt, hoàn toàn lấy đối phương làm chủ."**
7. **"Cử Môn tại bằng hữu cung, cùng bằng hữu hợp tác sẽ bằng hữu thành cừu nhân."**
8. **"Nếu lấy cô vợ là Thất Sát nhập mệnh, vậy ngươi差不多毁了一半了, rất mệt mỏi a, cỏ cây gió sợ hãi."**
`;

// ─── Bảng phụ trợ phán đoán hôn nhân ──────────────────────────────

export const MARRIAGE_STARS_BRIEF: Record<string, string> = {
  '红鸾': 'Chính duyên hôn恋, nhập mệnh thân chủ động thành hôn; Lưu niên gặp Hồng Loan năm đó tình恋 có động',
  '天喜': 'Hôn hi, cùng Hồng Loan tương hỗ dẫn động, chủ tường hỷ sự đến',
  '天姚': 'Đào hoa tài nghệ, cơ hội tình cảm; Gặp Thiên Dao trong hôn恋 dễ có gặp gỡ lãng mạn',
  '咸池': 'Đào hoa cường lực, chú ý tranh chấp tình cảm; Gặp Đam Lang thì đào hoa sung túc nhất',
  '孤辰': 'Sao cô khắc, nam mệnh nhập mệnh cung chủ độc lập tốt, nhưng nhập Phu Tân Cung chủ duyên cạn',
  '寡宿': 'Sao cô khắc, nữ mệnh nhập mệnh hoặc Phu Tân Cung, chủ hôn nhân bất thuận gặp ít xa nhiều',
  '天哭': 'Sao cô khắc hình thương, nhập Phu Tân Cung chủ vợ/chồng có tai họa lớn',
  '天虚': 'Sao hư hao, nhập Phu Tân Cung chủ tình cảm hư hao',
  '天巫': 'Muộn kết hôn di sản tôn giáo; Nhập Phu Tân Cung chủ muộn kết hôn là cát, sớm kết hôn nhiều sóng gió',
};

export const HEMING_SCORE_CRITERIA = {
  'Ngũ Tinh': 'Phu Tân Cung hai bên tương ảnh Thiên Tác chi Hợp, Tứ Hóa tương bổ sung, Đại hạn cùng đi Vận Vượng, Phước Đức Cung song cát',
  'Tứ Tinh': 'Phu Tân Cung một bên tương ứng Mệnh Cung đối phương, Tứ Hóa lấy Lộc Khoa làm chủ, cơ sở tình cảm vững chắc',
  'Tam Tinh': 'Mệnh cách tương phối nhưng mỗi bên có góc cạnh, cần mài giũa, xem lâu dài ổn định',
  'Nhị Tinh': 'Phu Tân Cung mỗi bên có sát tinh, hóa Kỵ có xung, tình cảm trồi sụm lớn, cần hai bên chủ động vận hành',
  'Nhất Tinh': 'Sao hung hội tụ Phu Tân Cung, hoặc tổ hợp ba hung Liêm Trung, rủi ro sinh ly tử biệt cao',
};
