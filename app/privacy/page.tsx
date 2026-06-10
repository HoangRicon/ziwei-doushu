export const metadata = { title: 'Chính sách bảo mật · Bản đồ Tử Vi', description: 'Chính sách bảo mật Bản đồ Tử Vi' };

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính sách bảo mật</h1>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thông tin chúng tôi thu thập</h2>
      <p>Để cung cấp dịch vụ sắp bản đồ và giải đoán Tử Vi, chúng tôi có thể thu thập các thông tin sau:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Thông tin cần thiết cho bản đồ</strong>：Họ tên (tùy chọn), ngày tháng năm sinh dương lịch, giờ sinh, giới tính, kinh độ nơi sinh</li>
        <li><strong>Thông tin tài khoản (sau khi đăng ký)</strong>：Số điện thoại (dùng để xác minh SMS và dịch vụ thành viên)</li>
        <li><strong>Thông tin tương tác</strong>：Nhật ký click, duyệt web, lịch sử bản đồ trên trang</li>
        <li><strong>Thông tin phản hồi</strong>：Đánh giá "đúng / không đúng" và phản hồi văn bản của bạn đối với nội dung giải đoán</li>
        <li><strong>Thông tin thanh toán</strong>：Khi mua thành viên hoặc dịch vụ đơn lẻ, được xử lý qua bên thanh toán thứ ba (Alipay / WeChat Pay), nền tảng không lưu trữ số thẻ hoặc mật khẩu đầy đủ</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Cách chúng tôi sử dụng thông tin</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Thông tin bản đồ chỉ được dùng để giải đoán lần này và lưu trong lịch sử bản đồ dưới tài khoản của bạn</li>
        <li>Số điện thoại dùng để đăng ký, đăng nhập, thông báo đơn hàng</li>
        <li>Thông tin phản hồi dùng để liên tục cải thiện chất lượng nội dung bản đồ (phân tích tổng hợp sau khi ẩn danh)</li>
        <li>Dữ liệu tổng hợp có thể được dùng cho nghiên cứu ngành và tối ưu nền tảng</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Chia sẻ thông tin và bên thứ ba</h2>
      <p>Ngoài các trường hợp sau, chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Nhà cung cấp dịch vụ thanh toán (Alipay / WeChat Pay)：Xử lý thanh toán đơn hàng</li>
        <li>Nhà cung cấp dịch vụ SMS (ví dụ: Alibaba Cloud SMS)：Gửi mã xác minh</li>
        <li>Nhà cung cấp dịch vụ đám mây (ví dụ: Vercel / Cloudflare / Alibaba Cloud)：Hạ tầng kỹ thuật</li>
        <li>Dịch vụ giải đoán AI (ví dụ: Anthropic Claude)：Xử lý cuộc trò chuyện "tự do đặt câu hỏi" của bạn (đã được ẩn danh hóa)</li>
        <li>Cơ quan tư pháp hoặc cơ quan nhà nước theo yêu cầu hợp pháp dựa trên quy định pháp luật</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Bảo mật thông tin</h2>
      <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phổ biến trong ngành để bảo vệ thông tin của bạn (mã hóa truyền tải HTTPS, mã hóa lưu trữ cơ sở dữ liệu, kiểm soát quyền truy cập, v.v.). Tuy nhiên, xin lưu ý rằng truyền tải qua Internet không thể đảm bảo an toàn 100%.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Quyền của bạn</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Truy vấn</strong>：Có thể xem toàn bộ lịch sử bản đồ và đơn hàng của bạn qua trung tâm tài khoản</li>
        <li><strong>Xóa</strong>：Liên hệ bộ phận chăm sóc khách hàng để xóa bản đồ được chỉ định / hủy tài khoản</li>
        <li><strong>Xuất</strong>：Có thể yêu cầu xuất toàn bộ dữ liệu cá nhân của bạn</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Cookie và lưu trữ cục bộ</h2>
      <p>Trang này sử dụng cookie / localStorage để: Lưu tùy chọn chủ đề tối/sáng của bạn, lịch sử bản đồ gần đây, trạng thái đăng nhập thành viên. Bạn có thể tắt trong cài đặt trình duyệt, nhưng một số chức năng có thể bị ảnh hưởng.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Người chưa thành niên</h2>
      <p>Nội dung bản đồ trên nền tảng dành cho người dùng từ 18 tuổi trở lên. Người chưa thành niên vui lòng sử dụng khi có sự đồng ý của người giám hộ, và không được sử dụng giải đoán cho các quyết định quan trọng trong cuộc đời.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. Thay đổi chính sách</h2>
      <p>Chính sách này có thể được cập nhật định kỳ. Thay đổi quan trọng sẽ được thông báo bằng cách nổi bật. Tiếp tục sử dụng có nghĩa là bạn đồng ý với phiên bản đã cập nhật.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--color-text-muted)' }}>
          <a href="/terms" style={{ color: 'var(--color-accent)' }}>Điều khoản dịch vụ</a> · <a href="/" style={{ color: 'var(--color-accent)' }}>Quay lại trang chủ</a>
        </p>
      </main>
    </>
  );
}
