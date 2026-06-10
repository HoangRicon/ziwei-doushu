/**
 * Kho tàng cổ thư — Định nghĩa kiểu dữ liệu
 *
 * Thiết kế: Toàn bộ cổ thư được đóng gói dưới dạng dữ liệu JSON tĩnh (không có rủi ro bản quyền vì là công trình công)
 * Tải một lần vào bộ nhớ khi Next.js khởi động, không phụ thuộc CSDL
 */

export interface Paragraph {
  /** ID duy nhất của đoạn văn (dùng cho điều hướng anchor) */
  id: string;
  /** Số thứ tự đoạn văn (trong chương) */
  idx: number;
  /** Nội dung gốc đoạn văn (văn cổ) */
  text: string;
  /** Bản dịch hiện đại (tùy chọn, điền sau) */
  translation?: string;
  /** Chú thích của thầy Nhi (tùy chọn, ghi nguồn) */
  niNote?: string;
}

export interface Chapter {
  /** Tiêu đề chương (ví dụ: "Quyển 1", "Tổng luận") */
  title: string;
  /** Phụ đề/tóm tắt chương (tùy chọn) */
  subtitle?: string;
  paragraphs: Paragraph[];
}

export interface Book {
  /** Tên sách */
  title: string;
  /** Slug sách (dùng cho URL, ví dụ 'guisuifu') */
  slug: string;
  /** Triều đại */
  dynasty: string;
  /** Tác giả (nhiều người hoặc không rõ thì ghi "không rõ" hoặc tên nhiều người) */
  author: string;
  /** Giới thiệu */
  intro: string;
  /** Tổng số từ (xấp xỉ) */
  wordCount: number;
  chapters: Chapter[];
}

export interface SearchHit {
  bookSlug: string;
  bookTitle: string;
  chapterTitle: string;
  paragraphId: string;
  /** Đoạn trích nổi bật (chứa thẻ <mark>) */
  snippet: string;
  /** Văn bản gốc */
  text: string;
}
