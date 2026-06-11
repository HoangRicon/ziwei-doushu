import { NextRequest, NextResponse } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';

const BRANCH_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const STEM_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const WUXING_NAMES = ['', 'Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

function buildChartSummary(chart: ZiweiChart, label: string): string {
  const { birthInfo, lunarInfo, mingGongBranch, shenGongBranch, wuxingJuName, palaces, daXians, currentDaXianIndex } = chart;

  const currentDx = daXians[currentDaXianIndex];

  let s = `【${label}】\n`;
  s += `Năm sinh: ${birthInfo.year} | Giới tính: ${birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}\n`;
  s += `Giờ sinh: ${BRANCH_NAMES[birthInfo.hour]} | Năm âm: ${lunarInfo.lunarYear} (${STEM_NAMES[lunarInfo.yearStem]}${BRANCH_NAMES[lunarInfo.yearBranch]})\n`;
  s += `Mệnh Cung: ${BRANCH_NAMES[mingGongBranch]} | Thân Cung: ${BRANCH_NAMES[shenGongBranch]}\n`;
  s += `Ngũ Hành Cục: ${wuxingJuName}\n`;
  s += `Tuổi hiện tại: ${birthInfo.year > 0 ? new Date().getFullYear() - birthInfo.year : '?'}\n`;

  if (currentDx) {
    s += `Đại Hạn hiện tại: ${currentDx.startAge}-${currentDx.endAge} tuổi, tại ${currentDx.palaceName}\n`;
  }

  s += `12 Cung:\n`;
  for (const palace of palaces) {
    const b = palace.branch;
    const majorStars = palace.stars.filter(s => s.type === 'major').map(s => s.name).join(', ');
    const siHua = palace.stars.find(s => s.siHua);
    s += `- ${palace.name} (${BRANCH_NAMES[b]}): ${majorStars || '(không chủ tinh)'}${siHua ? ` [${siHua.name} hóa ${siHua.siHua}]` : ''}\n`;
  }

  return s;
}

const SYSTEM_PROMPT = `Bạn là Nhà Mệnh Lý — chuyên gia Tử Vi Đẩu Số theo hệ thống Thầy Ni Hải Hạ.

Nhiệm vụ: So sánh và phân tích sự TƯƠNG HỢP giữa hai bản đồ Tử Vi dựa trên hệ thống Thầy Ni Hải Hạ.

Khi phân tích, bạn TUYỆT ĐỐI tuân theo cấu trúc phản hồi bằng tiếng Việt với các tiêu đề **【】**. KHÔNG viết thêm bất kỳ lời mở đầu hay kết luận nào khác ngoài nội dung cấu trúc.

**Quy tắc phân tích ghép bản (Hợp Bản):**

1. **Phân tích từng người**: Xác định đặc tính cốt lõi của mỗi người (chủ tinh Mệnh Cung, ngũ hành cục, tam phương tứ chính).

2. **Ghép Tử Vi (Ghép cung)**: Đối chiếu các cung tương ứng giữa hai người:
   - Mệnh Cung ↔ Mệnh Cung: tương hợp tính cách
   - Phu Tân Cung ↔ Phu Tân Cung: tương hợp tình cảm
   - Quan Lộc Cung ↔ Quan Lộc Cung: tương hợp sự nghiệp
   - Tài Bạch Cung ↔ Tài Bạch Cung: tương hợp tài vận

3. **Ghép tam phương tứ chính**: Phân tích tam hợp giữa hai người — các cung cùng tam hợp tạo duyên.

4. **Ghép đại hạn**: So sánh vận đại hạn — hai người cùng thời kỳ vận tốt thì hợp tác thuận lợi.

5. **Ghép tứ hóa**: So sánh bản mệnh tứ hóa — Lộc-Khoa hóa gặp nhau tạo duyên tốt; Kỵ gặp nhau cần lưu ý.

6. **Kết luận**: Đánh giá tổng thể mức độ tương hợp (rất hợp / khá hợp / trung bình / khó hợp) với lý do cụ thể.

Nếu có câu hỏi cụ thể, trả lời trực tiếp dựa trên hai bản đồ. Nếu không, cung cấp phân tích tổng quát.

Trả lời ngắn gọn, đi thẳng vào trọng điểm. Dùng tiếng Việt.`;

export async function POST(req: NextRequest) {
  try {
    const { chartA, chartB, question } = await req.json() as {
      chartA: ZiweiChart;
      chartB: ZiweiChart;
      question?: string;
    };

    if (!chartA || !chartB) {
      return NextResponse.json({ error: 'Thiếu dữ liệu bản đồ' }, { status: 400 });
    }

    const baseUrl = process.env.MIMO_BASE_URL || 'http://localhost:20128/v1';
    const apiKey = process.env.MIMO_API_KEY || '';
    const model = process.env.MIMO_MODEL || 'cx/gpt-5.4-mini';

    const summaryA = buildChartSummary(chartA, 'Bên A');
    const summaryB = buildChartSummary(chartB, 'Bên B');

    const userMessage = question
      ? `Hãy phân tích và trả lời: ${question}`
      : 'Hãy phân tích tổng quan sự tương hợp giữa hai người này theo hệ thống Thầy Ni Hải Hạ.';

    const apiMessages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${summaryA}\n\n${summaryB}` },
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return NextResponse.json({ error: `AI API lỗi: ${response.status}` }, { status: 502 });
    }

    if (!response.body) {
      return NextResponse.json({ error: 'Không có luồng phản hồi' }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n'));
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content ?? '';
                if (delta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: delta } })}\n`));
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Heming API error:', err);
    return NextResponse.json({ error: 'Lỗi server khi phân tích hợp bản' }, { status: 500 });
  }
}
