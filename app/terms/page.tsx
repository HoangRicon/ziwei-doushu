export const metadata = { title: 'Điều khoản dịch vụ · Bản đồ Tử Vi', description: 'Điều khoản dịch vụ và thỏa thuận người dùng Bản đồ Tử Vi' };

export default function TermsPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--color-bg-page)', borderBottom: '1px solid var(--color-border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Quay lại trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--color-border-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--color-accent)', letterSpacing: '0.2em' }}>Bản đồ Tử Vi</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều khoản dịch vụ</h1>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Tổng quan dịch vụ</h2>
      <p>Bản đồ Tử Vi (sau đây gọi là "Nền tảng") cung cấp dịch vụ sắp bản đồ và giải đoán Tử Vi Đẩu Số dựa trên hệ thống "Thiên Kỷ" của Nị Hải Hạ. Toàn bộ nội dung bản đồ trên nền tảng chỉ mang tính chất tham khảo, <strong>không đưa ra bất kỳ lời khuyên y tế, đầu tư, pháp lý, tâm lý hoặc quyết định quan trọng nào trong cuộc đời</strong>.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy tắc ứng xử người dùng</h2>
      <p>Khi sử dụng nền tảng, bạn đồng ý rằng:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Chỉ sử dụng nền tảng cho mục đích hợp pháp và tham khảo cá nhân</li>
        <li>Không phát tán nội dung nền tảng cho mục đích thương mại, sao chép hoặc công bố công khai</li>
        <li>Không thực hiện hành vi làm rối loạn hoạt động bình thường của nền tảng</li>
        <li>Thông tin sinh nhật được cung cấp phải chính xác; nền tảng không chịu trách nhiệm cho sai lệch giải đoán do thông tin không chính xác</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sở hữu trí tuệ và điều khoản cấm · Chống sao chép và huấn luyện AI</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>Tất cả nội dung bản đồ, cơ sở tri thức (bao gồm toàn bộ văn bản giải đoán cho 14 Chính tinh × 12 Cung × Nam nữ × Tứ hóa × Đại hạn Lưu niên), thiết kế UI, phương án tích hợp thuật toán, kho ví dụ đều là sáng tạo gốc của nền tảng hoặc được biên soạn hợp pháp.</strong><br/><br/>
        Nghiêm cấm các hành vi sau, người vi phạm sẽ chịu trách nhiệm bồi thường dân sự và trách nhiệm hình sự:<br/>
        ① Sử dụng bot, script tự động, gọi API hàng loạt hoặc bất kỳ phương tiện kỹ thuật nào khác để thu thập nội dung nền tảng;<br/>
        ② Sử dụng văn bản giải đoán bản đồ, dữ liệu phản hồi API do nền tảng tạo ra <strong>để huấn luyện bất kỳ mô hình học máy nào</strong> (bao gồm nhưng không giới hạn ở mô hình ngôn ngữ lớn, mô hình tạo bản đồ, mô hình tạo văn bản, v.v.);<br/>
        ③ Bán lại, đăng tải nội dung do nền tảng tạo ra lên các website, ứng dụng, tài khoản mạng xã hội khác;<br/>
        ④ Dịch ngược, sao chép, sửa đổi mã nguồn frontend hoặc backend của nền tảng để cung cấp dịch vụ cùng loại với danh nghĩa "tự vận hành".<br/><br/>
        Văn bản đầu ra của nền tảng có nhúng hình mờ theo dõi, các bản sao/vết huấn luyện vi phạm có thể bị phát hiện và truy xuất. Khi phát hiện vi phạm, nền tảng có quyền yêu cầu <strong>bồi thường 1 triệu Nhân dân tệ cho mỗi trường hợp vi phạm</strong>, đồng thời giữ quyền khởi kiện tại tòa án và phối hợp với cơ quan công an điều tra.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Tuyên bố miễn trách</h2>
      <p>Nội dung bản đồ trên nền tảng dựa trên kiến thức Tử Vi Đẩu Số truyền thống và hệ thống Nị Hải Hạ, <strong>không đảm bảo chính xác 100%</strong>. Vận mệnh chịu ảnh hưởng chung của Thiên, Địa, Nhân tam tài, đầu ra của nền tảng chỉ là tài liệu tham khảo để tự nhận thức bản thân. Người dùng nên tiếp cận lý trí, không nên quá phụ thuộc vào bất kỳ phán đoán bản đồ đơn lẻ nào.</p>
      <p>Nền tảng không chịu trách nhiệm pháp lý đối với bất kỳ hậu quả nào phát sinh từ việc sử dụng nội dung nền tảng (bao gồm nhưng không giới hạn ở sai lầm quyết định, ảnh hưởng tâm lý, thay đổi quan hệ, v.v.).</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Thay đổi và chấm dứt dịch vụ</h2>
      <p>Nền tảng giữ quyền điều chỉnh, tạm ngưng hoặc chấm dứt toàn bộ hoặc một phần dịch vụ vào bất kỳ lúc nào. Thay đổi quan trọng sẽ được thông báo cho người dùng qua thông báo trên trang hoặc email.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Luật áp dụng và giải quyết tranh chấp</h2>
      <p>Các điều khoản này áp dụng luật Trung Quốc. Nếu có tranh chấp, hai bên nên thương lượng hữu nghị; nếu thương lượng thất bại, sẽ được giải quyết bằng kiện tụng tại tòa án nhân dân có thẩm quyền nơi cư trú của chủ thể vận hành nền tảng.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Thông tin liên hệ</h2>
      <p>Nếu có thắc mắc, vui lòng liên hệ qua WeChat chăm sóc khách hàng / hòm thư công cộng được công bố trên nền tảng.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--color-text-muted)' }}>
          <a href="/privacy" style={{ color: 'var(--color-accent)' }}>Chính sách bảo mật</a> · <a href="/" style={{ color: 'var(--color-accent)' }}>Quay lại trang chủ</a>
        </p>
      </main>
    </>
  );
}
