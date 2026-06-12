// app/api/charts/[id]/chat/route.ts
// POST: append a user message and stream assistant response, save to chatHistory
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const BRANCH_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const STEM_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const WUXING_NAMES = ['', 'Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

function buildChartSummary(chart: any): string {
  const { birthInfo, lunarInfo, mingGongBranch, shenGongBranch, wuxingJu, wuxingJuName, palaces, daXians, currentAge, currentDaXianIndex } = chart;

  let summary = `【Thông tin sinh】\n`;
  summary += `- Năm dương lịch: ${birthInfo.year}\n`;
  summary += `- Giờ sinh: ${BRANCH_NAMES[birthInfo.hour]}\n`;
  summary += `- Giới tính: ${birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}\n`;
  summary += `- Năm âm lịch: ${lunarInfo.lunarYear} (${STEM_NAMES[lunarInfo.yearStem]}${BRANCH_NAMES[lunarInfo.yearBranch]})\n`;
  summary += `- Tháng âm: ${lunarInfo.lunarMonth} (${lunarInfo.isLeapMonth ? 'nhuận' : 'thường'})\n`;
  summary += `- Ngày âm: ${lunarInfo.lunarDay}\n`;

  summary += `\n【Cục diện】\n`;
  summary += `- Mệnh Cung: ${BRANCH_NAMES[mingGongBranch]} ${STEM_NAMES[palaces[mingGongBranch]?.stem ?? 0]}\n`;
  summary += `- Thân Cung: ${BRANCH_NAMES[shenGongBranch]} ${STEM_NAMES[palaces[shenGongBranch]?.stem ?? 0]}\n`;
  summary += `- Ngũ Hành Cục: ${wuxingJuName} (${WUXING_NAMES[wuxingJu]})\n`;
  summary += `- Tuổi hiện tại: ${currentAge}\n`;

  const currentDaXian = daXians[currentDaXianIndex];
  if (currentDaXian) {
    summary += `- Đại Hạn hiện tại: ${currentDaXian.startAge}-${currentDaXian.endAge} tuổi, tại ${currentDaXian.palaceName}\n`;
    if (currentDaXian.siHua) {
      summary += `  Tứ Hóa Đại Hạn: ${currentDaXian.siHua.lu} Lộc, ${currentDaXian.siHua.quan} Quyền, ${currentDaXian.siHua.ke} Khoa, ${currentDaXian.siHua.ji} Kỵ\n`;
    }
  }

  summary += `\n【12 Cung Tử Vi】\n`;
  for (let i = 0; i < 12; i++) {
    const palace = palaces[i];
    if (!palace) continue;
    const majorStars = palace.stars.filter((s: any) => s.type === 'major').map((s: any) => s.name).join(', ');
    const otherStars = palace.stars.filter((s: any) => s.type !== 'major').map((s: any) => s.name).join(', ');
    const isDaXian = palace.isCurrentDaXian ? ' ◀ Đại Hạn' : '';
    const isMingGong = palace.isMingGong ? ' ◀ Mệnh Cung' : '';
    summary += `- ${palace.name} (${BRANCH_NAMES[i]}): ${majorStars || '(không chủ tinh)'}${otherStars ? ' | ' + otherStars : ''}${isDaXian}${isMingGong}\n`;
  }

  return summary;
}

const SYSTEM_PROMPT = `Bạn là Nhà Mệnh Lý — chuyên gia Tử Vi Đẩu Số theo hệ thống Thầy Ni Hải Hạ.

Khi phân tích, bạn TUYỆT ĐỐI tuân theo cấu trúc phản hồi bằng tiếng Việt với các tiêu đề **【】**. KHÔNG viết thêm bất kỳ lời mở đầu hay kết luận nào khác ngoài nội dung cấu trúc.

Nguyên tắc giải đoán:
|- Dựa trên bản đồ Tử Vi được cung cấp trong context
|- Tham chiếu quan điểm, thuật ngữ và cách giải đoán của Thầy Ni Hải Hạ trong "Tử Ngọc Lưu Chú" và "Mệnh Cách Toàn Thư"
|- Phân tích liên động tam phương tứ chính (Tài, Quan, Thiên Di, Mệnh)
|- Đề cập đến đại hạn hiện tại và ảnh hưởng của nó
|- Lời khuyên thực tế, có thể áp dụng

**Quy tắc quan trọng về TỨ HÓA trên sao Tử Vi:**
|- **Sao hóa Lộc (Lực/Khối/Phú)**: Khi sao chủ tinh hóa Lộc, mang ý nghĩa về tài lộc, tiền bạc, nguồn thu nhập. Tốt nhất khi sao tốt hóa Lộc.
|- **Sao hóa Quyền (Lượng/Chuyên/Trì)**: Khi sao chủ tinh hóa Quyền, mang ý nghĩa về quyền lực, tham vọng, kiểm soát, cạnh tranh. Tốt khi cung vị hành chính hoặc quân sự.
|- **Sao hóa Khoa (Văn/Khôi/Đồ)**: Khi sao chủ tinh hóa Khoa, mang ý nghĩa về học vấn, danh tiếng, sự nổi bật. Tốt cho học tập, thi cử, nghiên cứu.
|- **Sao hóa Kỵ (Y/Nguy/Hi)**: Khi sao chủ tinh hóa Kỵ, mang ý nghĩa về tổn thương, rủi ro, mất mát. Cần chú ý đến bản chất của sao chủ tinh — sao tốt hóa Kỵ vẫn có thể phản ảnh hưởng, sao xấu hóa Kỵ thì càng hung hiểm.
|- **Cung mượn đối cung (không cung)**: Khi một cung không có chủ tinh, nó mượn chủ tinh từ đối cung. Giải đoán phải dựa trên chủ tinh mượn.
|- **Tự hóa**: Mỗi cung có thể có tự hóa (Lộc, Quyền, Khoa, Kỵ). Tự hóa mang ý nghĩa nội tại của cung đó.

Trả lời ngắn gọn, đi thẳng vào trọng điểm. Dùng tiếng Việt.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type Params = { params: Promise<{ id: string }> };

// POST /api/charts/[id]/chat
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const chart = await db.ziweiChart.findUnique({ where: { id } });

  if (!chart || chart.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { message } = await req.json();
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Thiếu nội dung tin nhắn' }, { status: 400 });
  }

  const baseUrl = process.env.MIMO_BASE_URL || 'http://localhost:20128/v1';
  const apiKey = process.env.MIMO_API_KEY || '';
  const model = process.env.MIMO_MODEL || 'cx/gpt-5.4-mini';

  const chartSummary = buildChartSummary(chart.chartData as any);
  const chatHistory: ChatMessage[] = Array.isArray(chart.chatHistory)
    ? (chart.chatHistory as ChatMessage[])
    : [];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\n【BẢN ĐỒ TỬ VI CẦN GIẢI ĐOÁN】\n${chartSummary}`,
        },
        ...chatHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
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
  let assistantText = '';

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
              // Save chat history: user message + assistant response
              const newHistory: ChatMessage[] = [
                ...chatHistory,
                { role: 'user', content: message },
                { role: 'assistant', content: assistantText },
              ];
              await db.ziweiChart.update({
                where: { id },
                data: { chatHistory: newHistory },
              }).catch(err => console.error('Failed to save chat history:', err));
              controller.enqueue(encoder.encode('data: [DONE]\n'));
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content ?? '';
              if (delta) {
                assistantText += delta;
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
}
