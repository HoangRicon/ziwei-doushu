'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

export default function PreviewPage() {
  const router = useRouter();
  // replayKey dùng để ép buộc đặt lại ScrollIntro (khi người dùng bấm "phát lại một lần nữa")
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      {/* Hoạt ảnh cuộn trục mở đầu */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {/* Bảng thông tin + nút điều khiển "mẫu + hoạt ảnh kết thúc" */}
      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: '"STSong", "Songti SC", serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#c89647', marginBottom: '16px' }}>
            SCROLL · INTRO · PREVIEW
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.18em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            Cuộn Tử Vi · Xem trước mở đầu
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '500px', lineHeight: 1.9,
            letterSpacing: '0.1em',
            marginBottom: '40px',
            fontFamily: '"STKaiti", "Kaiti SC", serif',
          }}>
            Hiệu ứng cuộn bạn vừa thấy sẽ mở ra từ từ mỗi khi vào trang chủ.<br />
            Nếu hài lòng, hãy cho tôi biết, tôi sẽ kết nối vào trang chủ / triển khai.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.3em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              PHÁT LẠI MỘT LẦN NỮA
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.3em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
              }}
            >
              VÀO PHIÊN BẢN GỐC TRANG CHỦ
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.15em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Phiên bản gốc ↗</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>Bản đồ</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>Hợp bản đồ</Link>
          </div>

          {/* Giải thích timeline */}
          <div style={{
            marginTop: '64px',
            padding: '24px 32px',
            border: '1px solid rgba(232,220,196,0.12)',
            maxWidth: '500px',
            fontSize: '12px',
            color: '#a89878',
            lineHeight: 1.9,
            letterSpacing: '0.1em',
            fontFamily: '"STKaiti", serif',
            textAlign: 'left',
          }}>
            <div style={{ color: '#c89647', marginBottom: '12px', letterSpacing: '0.2em', fontSize: '11px' }}>Timeline hoạt ảnh</div>
            <div>· 0.0 ~ 1.7 s &nbsp;&nbsp;Cuộn từ trung tâm mở ra hai bên</div>
            <div>· 1.9 ~ 2.7 s &nbsp;&nbsp;Nội dung giấy tuyền hiện ra (tiêu đề + phụ đề + ấn son)</div>
            <div>· 2.7 ~ 3.5 s &nbsp;&nbsp;Dừng lại để ngắm nhìn</div>
            <div>· 3.5 ~ 4.2 s &nbsp;&nbsp;Mờ dần toàn bộ, vào trang chủ</div>
            <div style={{ marginTop: '12px', color: '#6e6048', fontSize: '11px' }}>
              Người dùng có thể bấm "Bỏ qua" ở góc dưới bên phải bất kỳ lúc nào để vào thẳng trang chủ.
            </div>
          </div>
        </main>
      )}
    </>
  );
}
