# PlanSnap (Capture → Plan)

**Team technoComplex** — Codex Community Hackathon – Hà Nội (14/11/2026)

PlanSnap biến hàng chục ảnh chụp màn hình thông báo bài tập (Zalo, Messenger, LMS, slide bài giảng, ghi chú viết tay) thành lịch làm việc cá nhân dưới 1 phút.

## Kiến trúc & Điểm nổi bật

- **Standalone Mobile PWA (`app/`):** Chạy độc lập toàn màn hình khi cài ra màn hình chính, lưu dữ liệu bền vững bằng `IndexedDB` (khôi phục nguyên trạng sau khi đóng hẳn ứng dụng), nén ảnh phía client qua HTML5 Canvas.
- **Hybrid AI Agent (`app/js/vision-agent.js`):** Kết nối trực tiếp Google Gemini Vision API (`gemini-2.5-flash`) để trích xuất đầu việc kèm câu trích dẫn nguồn (`source_quote`) chống bịa việc và phát hiện mốc thời gian mơ hồ để bật thẻ xác nhận 1 chạm.
- **Deterministic Scheduler (`app/js/scheduler.js`):** Thuật toán Earliest Deadline First (EDF) xếp phiên vào đúng khung giờ rảnh của người dùng, chừa khoảng đệm tối thiểu 3 giờ trước hạn chót và xuất tệp lịch `.ics` (RFC 5545).

## Cấu trúc thư mục

- `index.html`: Trang trình diễn web và trình giả lập tương tác.
- `app/`: Ứng dụng di động PWA (`index.html`, `manifest.json`, `sw.js`, `css/`, `js/`).
- `slides/`: Bộ slide thuyết trình 8 trang (`slides/index.html`).
- `docs/`: Toàn bộ tài liệu PM, PRD (Markdown & `.docx`), kiến trúc Agent, kịch bản demo, khảo sát 30 PV sâu + 156 khảo sát diện rộng, 42 người dùng Beta.
- `serve.py`: Máy chủ cục bộ hỗ trợ thử nghiệm qua mạng LAN trên điện thoại thật.

## Chạy thử cục bộ

```bash
python serve.py
```

Sau đó mở `http://localhost:8080/` trên máy tính hoặc truy cập địa chỉ LAN hiển thị trên terminal bằng điện thoại.
