'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollIntroProps {
  onComplete: () => void;
  /** Van ban nut bo qua */
  skipLabel?: string;
}

const BEIDOU = ['Bắc Đẩu', 'Thiên Tuyền', 'Thiên Cơ', 'Thiên Quyền', 'Ngọc Hành', 'Khai Dương', 'Dao Quang'];

export default function ScrollIntro({ onComplete, skipLabel = 'Bỏ Qua' }: ScrollIntroProps) {
  // visible: toan bo intro co hien thi khong
  // unrolled: cuon co da duoc trien khai (dieu khien noi dung hien ra)
  const [visible, setVisible] = useState(true);
  const [unrolled, setUnrolled] = useState(false);

  useEffect(() => {
    // Chuoi thoi gian:
    // 0.0s        : Cot cuon o giua, giay cuon lai (width: 0)
    // 0.3-2.0s   : Cuon bung ra hai ben (1.7s)
    // 2.0s        : unrolled = true, noi dung hien ra
    // 2.0-3.5s   : Noi dung dung 1.5s cho nguoi xem
    // 3.5s        : Bat dau mo dan
    // 4.2s        : visible = false, kich hoat onComplete
    const t1 = setTimeout(() => setUnrolled(true), 1900);
    const t2 = setTimeout(() => setVisible(false), 3500);
    const t3 = setTimeout(onComplete, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const handleSkip = () => {
    setVisible(false);
    setTimeout(onComplete, 700);
  };

  // Cuon trien khai di uong: dau nhanh roi cham (cam giac vat ly cua cuon duoc mo ra)
  const easeUnroll = [0.32, 0.72, 0.36, 1.0] as const;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'radial-gradient(ellipse at center, #1a120a 0%, #0a0604 70%, #000000 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Trang tri sao xa */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, rgba(255,220,150,0.6), transparent),
              radial-gradient(1px 1px at 70% 20%, rgba(255,220,150,0.4), transparent),
              radial-gradient(1px 1px at 35% 75%, rgba(255,220,150,0.5), transparent),
              radial-gradient(1.5px 1.5px at 85% 65%, rgba(255,220,150,0.4), transparent),
              radial-gradient(1px 1px at 60% 88%, rgba(255,220,150,0.3), transparent),
              radial-gradient(2px 2px at 92% 40%, rgba(255,220,150,0.5), transparent)
            `,
          }} />

          {/* Than chinh cuon (tung phai sang trai — truc phai co dinh, giay trai sang, truc trai sang trai) */}
          <div style={{
            position: 'relative',
            width: 'min(90vw, 1080px)',
            height: 'min(60vh, 480px)',
          }}>
            {/* Giay truyen (right neo tai truc phai, width tu 0 → 100% - chieu rong hai truc) */}
            <motion.div
              initial={{ width: 0, opacity: 0.92 }}
              animate={{ width: 'calc(100% - 32px)', opacity: 1 }}
              transition={{ duration: 1.9, ease: easeUnroll }}
              style={{
                position: 'absolute',
                top: '8%', bottom: '8%',
                right: '16px',
                background: `
                  linear-gradient(180deg, rgba(120,80,30,0.08) 0%, transparent 12%, transparent 88%, rgba(120,80,30,0.08) 100%),
                  linear-gradient(135deg, #efe1bf 0%, #e8d6ad 50%, #d6c08a 100%)
                `,
                boxShadow: `
                  inset 0 0 80px rgba(140,90,30,0.18),
                  inset 0 -2px 0 rgba(120,80,30,0.15),
                  0 8px 40px rgba(0,0,0,0.7),
                  0 16px 60px rgba(80,40,10,0.4)
                `,
                overflow: 'hidden',
              }}
            >
              {/* Bong cuon tu vi (mo phong net gap cua cuon cu) */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '8px',
                background: 'linear-gradient(180deg, rgba(80,50,20,0.35), transparent)',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px',
                background: 'linear-gradient(0deg, rgba(80,50,20,0.35), transparent)',
              }} />

              {/* Hoa cu thu co */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `
                  radial-gradient(at 20% 30%, rgba(120,80,30,0.06), transparent 50%),
                  radial-gradient(at 80% 70%, rgba(120,80,30,0.05), transparent 50%),
                  radial-gradient(at 50% 50%, rgba(120,80,30,0.04), transparent 60%)
                `,
                opacity: 0.7,
              }} />

              {/* Noi dung cuon (hien ra sau khi trien khai) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={unrolled ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 clamp(40px, 8vw, 120px)',
                  fontFamily: '"STSong", "Songti SC", "SimSun", serif',
                }}
              >
                {/* Trang tri: Ten北斗七心 */}
                <div style={{
                  fontSize: 'clamp(10px, 1.1vw, 12px)',
                  color: '#8b5d18',
                  letterSpacing: '0.45em',
                  marginBottom: 'clamp(20px, 3vh, 36px)',
                  fontFamily: '"STKaiti", "Kaiti SC", serif',
                  whiteSpace: 'nowrap',
                  opacity: 0.85,
                }}>
                  {BEIDOU.join(' · ')}
                </div>

                {/* Duong kim tia */}
                <div style={{
                  width: '60px', height: '1px',
                  background: 'linear-gradient(90deg, transparent, #a87a30, transparent)',
                  marginBottom: 'clamp(16px, 2.5vh, 28px)',
                }} />

                {/* Big title */}
                <h1 style={{
                  fontSize: 'clamp(48px, 8vw, 110px)',
                  fontWeight: 700,
                  color: '#1a1208',
                  letterSpacing: 'clamp(0.18em, 0.25vw, 0.3em)',
                  lineHeight: 1.05,
                  margin: 0,
                  textShadow: '0 1px 0 rgba(255,250,235,0.3)',
                  whiteSpace: 'nowrap',
                }}>
                  Tử Vi Mệnh Bản
                </h1>

                {/* Subtitle */}
                <div style={{
                  fontSize: 'clamp(13px, 1.5vw, 18px)',
                  color: '#6b4818',
                  letterSpacing: '0.4em',
                  fontFamily: '"STKaiti", "Kaiti SC", serif',
                  marginTop: 'clamp(16px, 2.5vh, 24px)',
                  marginBottom: '6px',
                  whiteSpace: 'nowrap',
                }}>
                  Quan Thien Chi Tượng · Sát Nhân Chi Mệnh
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 1.2vw, 14px)',
                  color: '#8b6410',
                  letterSpacing: '0.3em',
                  fontFamily: '"STSong", serif',
                  whiteSpace: 'nowrap',
                  opacity: 0.85,
                }}>
                  Thầy Nhu Hải Hạ《Thiên Kỷ》hệ thống chính thống
                </div>

                {/* Dau that */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                  animate={unrolled ? { opacity: 1, scale: 1, rotate: -4 } : {}}
                  transition={{ delay: 0.4, duration: 0.5, ease: 'backOut' }}
                  style={{
                    marginTop: 'clamp(20px, 3vh, 32px)',
                    width: 'clamp(50px, 6vw, 64px)',
                    height: 'clamp(50px, 6vw, 64px)',
                    background: '#a8302a',
                    color: '#f5ecd7',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"STSong", serif',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(245,236,215,0.15)',
                    fontSize: 'clamp(11px, 1.2vw, 13px)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0' }}><span>Vương</span><span>Ngọc</span></div>
                  <div style={{ display: 'flex', gap: '0' }}><span>Ngư</span><span>Ấn</span></div>
                </motion.div>

                {/* Trang tri: Quai bagua */}
                <div style={{
                  marginTop: 'clamp(20px, 3vh, 32px)',
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  color: '#a87a30',
                  letterSpacing: '0.6em',
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                }}>
                  ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷
                </div>
              </motion.div>
            </motion.div>

            {/* Cot cuon ben phai (co dinh, la truc chua cuon) */}
            <div
              style={{
                position: 'absolute', top: 0, bottom: 0, right: 0,
                width: '32px',
                background: 'linear-gradient(90deg, #4a2f0e 0%, #8b5d18 25%, #c89647 50%, #8b5d18 75%, #4a2f0e 100%)',
                borderRadius: '4px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.7), inset 0 0 12px rgba(0,0,0,0.4)',
                zIndex: 2,
              }}
            >
              {/* Non dong ngoc tren */}
              <div style={{
                position: 'absolute', top: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'radial-gradient(ellipse at 30% 30%, #f0d090 0%, #c89647 35%, #6a4218 90%)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'radial-gradient(ellipse at 30% 30%, #f0d090 0%, #c89647 35%, #6a4218 90%)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }} />
            </div>

            {/* Cot cuon ben trai (tu vi tri truc phai, mo sang trai — day la truc bi "keo") */}
            <motion.div
              initial={{ right: '0px' }}
              animate={{ right: 'calc(100% - 32px)' }}
              transition={{ duration: 1.9, ease: easeUnroll }}
              style={{
                position: 'absolute', top: 0, bottom: 0,
                width: '32px',
                background: 'linear-gradient(90deg, #4a2f0e 0%, #8b5d18 25%, #c89647 50%, #8b5d18 75%, #4a2f0e 100%)',
                borderRadius: '4px',
                boxShadow: '-2px 6px 24px rgba(0,0,0,0.7), inset 0 0 12px rgba(0,0,0,0.4)',
                zIndex: 3,
              }}
            >
              <div style={{
                position: 'absolute', top: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'radial-gradient(ellipse at 30% 30%, #f0d090 0%, #c89647 35%, #6a4218 90%)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'radial-gradient(ellipse at 30% 30%, #f0d090 0%, #c89647 35%, #6a4218 90%)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }} />
            </motion.div>
          </div>

          {/* Nut bo qua */}
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute', bottom: '32px', right: '32px',
              padding: '8px 18px',
              background: 'transparent',
              color: 'rgba(232,220,196,0.55)',
              border: '1px solid rgba(232,220,196,0.18)',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: '"STSong", serif',
              letterSpacing: '0.25em',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(232,220,196,0.4)';
              e.currentTarget.style.color = 'rgba(232,220,196,0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(232,220,196,0.18)';
              e.currentTarget.style.color = 'rgba(232,220,196,0.55)';
            }}
          >
            {skipLabel} →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
