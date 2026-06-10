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
      <main className="max-w-2xl mx-auto px-5 pt-12">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Sắp xếp Tử Vi Đẩu Số
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Nhập ngày tháng năm sinh, công cụ sắp xếp nguồn mở sẽ tạo bản đồ ngay lập tức.
          <br />
          <span className="text-xs opacity-70">(Trang này là Demo công cụ, giao diện phiên bản thương mại hoàn chỉnh không thuộc phạm vi nguồn mở; nhân công sắp xếp bản đồ hoàn toàn mở.)</span>
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── Đã sắp xếp bản đồ: Bản đồ + Giải đoán ──
  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Bản đồ Tử Vi
        </h1>
      </div>

      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); }}
        className="mb-4 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        style={{ borderColor: 'var(--color-border)' }}
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
        className="grid gap-5 mt-4 lg:grid-cols-[1fr_380px] grid-cols-1"
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}
