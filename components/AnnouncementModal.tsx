'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 公告版本号——以后想再弹新公告，改这里就行（旧版 key 失效，新版重新弹一次）
const ANNOUNCEMENT_VERSION = '2026-05-01';
const STORAGE_KEY = `announcement_seen_${ANNOUNCEMENT_VERSION}`;

export default function AnnouncementModal() {
  // 默认不开，client 端 useEffect 检查 localStorage 后立即决定是否弹出。
  // 没看过 → 立即覆盖首页；看过 → 不再弹。
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false); // hydration 完成标志

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch { /* localStorage 可能被禁，忽略 */ }
    setDecided(true);
  }, []);

  // 公告打开时锁住 body 滚动，防止背后首页可滚（仪式感更强）
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* skip */ }
  };

  if (!decided) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // 不点击外部关闭——强制用户按"我知道了"按钮才能进入首页
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(20,12,2,0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #fefcf6 0%, #faf3e3 100%)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: 'min(85vh, 760px)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(60,30,10,0.4), 0 4px 16px rgba(60,30,10,0.2)',
              border: '1px solid rgba(184,146,42,0.25)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            }}
          >
            {/* 顶部装饰 + 关闭按钮 */}
            <div style={{
              padding: '22px 28px 14px',
              borderBottom: '1px solid rgba(184,146,42,0.15)',
              background: 'linear-gradient(180deg, rgba(184,146,42,0.08) 0%, transparent 100%)',
              flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: '#b8922a', opacity: 0.7, marginBottom: '6px' }}>
                THƯ GỬI NGƯỜI DÙNG
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#3d2f10', letterSpacing: '0.08em', margin: 0 }}>
                Gửi những ai đang sử dụng nền tảng này
              </h2>
              <button
                onClick={close}
                aria-label="Đóng"
                style={{
                  position: 'absolute', top: '14px', right: '16px',
                  width: '28px', height: '28px',
                  background: 'rgba(184,146,42,0.08)',
                  border: '1px solid rgba(184,146,42,0.2)',
                  borderRadius: '50%',
                  color: '#7a5e2a', fontSize: '14px',
                  cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* 限时免费 banner（最关键信息，置顶强调）*/}
            <div style={{
              margin: '14px 22px 0',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
              border: '1.5px dashed rgba(232,132,62,0.5)',
              borderRadius: '12px',
              flexShrink: 0,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#c45a2d', marginBottom: '4px', fontWeight: 600 }}>
                ƯU ĐÃI ĐẶC BIỆT · Phản hồi đặc biệt
              </div>
              <div style={{ fontSize: '14px', color: '#8b3a1a', fontWeight: 600, lineHeight: 1.6 }}>
                <span style={{ fontSize: '16px', color: '#c45a2d', fontWeight: 700 }}>1 tháng 5 — 8 tháng 5</span>
                <br />
                Tất cả tính năng + Hỏi đáp AI hoàn toàn miễn phí
              </div>
            </div>

            {/* 正文（可滚动）*/}
            <div style={{
              padding: '18px 28px 24px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: 1.85,
              color: '#5a4a30',
              flex: 1,
            }}>
              <p style={{ margin: '0 0 12px' }}>
                Thật lòng mà nói, tôi không ngờ lại nhận được sự quan tâm lớn đến như vậy.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Lúc đầu khi xây dựng nền tảng này, mục đích của tôi rất đơn giản: trong thời đại AI, làm cho hệ thống phức tạp của thầy Ni trở nên đơn giản, hiệu quả và dễ hiểu hơn.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Không nhất thiết ai cũng phải học lâu, đọc nhiều sách mới có thể tiếp cận những nội dung này. Chúng tôi hy vọng thông qua nền tảng này, mọi người có thể bằng cách thư giãn hơn, nhận được một số tham khảo và cảm hứng về bản thân, giai đoạn cuộc sống, hướng đi lựa chọn.
              </p>
              <p style={{
                margin: '0 0 12px',
                padding: '10px 14px',
                background: 'rgba(184,146,42,0.07)',
                borderLeft: '3px solid rgba(184,146,42,0.45)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: '#7a5e2a',
              }}>
                Thầy Ni từng nói một câu: Làm sao con người có thể phát minh ra một thứ hoàn toàn vô dụng được?
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Tôi luôn cảm thấy, Kinh Dịch cũng vậy, Tử Vi Đấu Số cũng vậy. Điều có giá trị thực sự của chúng không phải là khiến người ta bị mắc kẹt bởi một kết quả nào đó, mà là giúp chúng ta sớm nhìn thấy thói quen tính cách, chủ đề cuộc đời và hướng đi lựa chọn của bản thân. Nhìn thấy rồi, mới có cơ hội điều chỉnh; Hiểu rồi, mới có cơ hội trở nên tốt hơn.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Còn những lời như "Việc bạn đang xem những thứ này vào lúc này cũng là một phần của vận mệnh", tôi không bình luận thêm.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Những ngày qua tài khoản bị ảnh hưởng, <strong style={{ color: '#c45a2d' }}>Ngày 3 tháng 5 sẽ khôi phục cập nhật bình thường.</strong>
              </p>
              <p style={{ margin: '0 0 16px', color: '#3d2f10', fontWeight: 500 }}>
                Cuối cùng, chân thành chúc mọi người ngày càng hiểu rõ bản thân hơn, ngày càng yêu thương bản thân hơn, và ngày càng có khả năng yêu thương những người xung quanh.
              </p>
              <p style={{ margin: 0, textAlign: 'right', fontSize: '13px', color: '#7a5e2a' }}>
                —— Cảm ơn mọi người 🙏
              </p>
            </div>

            {/* 底部按钮 */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid rgba(184,146,42,0.15)',
              background: 'rgba(184,146,42,0.04)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              flexShrink: 0,
            }}>
              <button
                onClick={close}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #b8922a 0%, #9a7a20 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
                }}
              >
                Đã hiểu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
