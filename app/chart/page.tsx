'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * Trang bản đồ - Demo công cụ sắp xếp bản đồ nguồn mở
 *
 * Đây là ví dụ chạy tối thiểu: sử dụng công cụ sắp xếp bản đồ generateChart() của kho lưu trữ
 * kết hợp với các thành phần UI cơ bản để hiển thị một bản đồ Tử Vi hoàn chỉnh + giải đoán cơ bản,
 * đồng thời hỗ trợ chuyển đổi giữa bản đồ gốc / Đại hạn / Lưu niên.
 *
 * Lưu ý: Giao diện tương tác hoàn chỉnh của phiên bản thương mại trực tuyến (UI mới được thiết kế lại,
 * giải đoán AI streaming, ghép bản đồ, thẻ chia sẻ, v.v.) không thuộc phạm vi nguồn mở;
 * tuy nhiên nhân công sắp xếp bản đồ - thuật toán an sao, tứ hóa, nhận diện cục diện, kho tàng cổ thư -
 * hoàn toàn mở (xem lib/ziwei/*), có thể phát triển lại giao diện của riêng bạn một cách tự do.
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());

  // ── Chưa sắp xếp bản đồ: Hiển thị biểu mẫu thông tin sinh─────────
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Sắp xếp Tử Vi Đẩu Số</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          Nhập ngày tháng năm sinh, công cụ sắp xếp nguồn mở sẽ tạo bản đồ ngay lập tức.
          <br />
          (Trang này là Demo công cụ, giao diện phiên bản thương mại hoàn chỉnh không thuộc phạm vi nguồn mở; nhân công sắp xếp bản đồ hoàn toàn mở.)
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── Đã sắp xếp bản đồ: Bản đồ + Giải đoán ──
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); }}
        style={{
          marginBottom: 16, padding: '6px 14px', cursor: 'pointer',
          border: '1px solid #ccc', borderRadius: 8, background: 'transparent',
        }}
      >
        Sắp xếp lại bản đồ
      </button>

      <TimeNav
        chart={chart}
        view={view}
        liunianYear={liunianYear}
        onViewChange={setView}
        onYearChange={setLiunianYear}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)',
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}
