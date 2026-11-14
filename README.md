# PlanSnap (Capture → Plan)

**Team technoComplex** — Codex Community Hackathon – Hà Nội (14/11/2026)

PlanSnap biến hàng chục ảnh chụp màn hình thông báo bài tập (Zalo, Messenger, LMS, slide bài giảng, ghi chú viết tay) thành lịch làm việc cá nhân dưới 1 phút.

## Kiến trúc & Điểm nổi bật

- **App Native React Native + Expo (`mobile/`):** Nền tảng chính từ 14/11 (xem `docs/07_Decision_Log.md`, DEC-08). Cài bằng APK, lưu dữ liệu cục bộ (khôi phục nguyên trạng sau khi đóng hẳn ứng dụng), API key trong Keychain/Keystore, nén ảnh trên máy. Bản web app PWA cũ (`app/`) dùng cho beta trước 14/11, đã ngừng phát triển.
- **Hybrid AI Agent (`app/js/vision-agent.js`):** Kết nối trực tiếp Google Gemini Vision API (`gemini-2.5-flash`) để trích xuất đầu việc kèm câu trích dẫn nguồn (`source_quote`) chống bịa việc và phát hiện mốc thời gian mơ hồ để bật thẻ xác nhận 1 chạm.
- **Deterministic Scheduler (`app/js/scheduler.js`):** Thuật toán Earliest Deadline First (EDF) xếp phiên vào đúng khung giờ rảnh của người dùng, chừa khoảng đệm tối thiểu 3 giờ trước hạn chót và xuất tệp lịch `.ics` (RFC 5545).

## Cấu trúc thư mục

- `index.html`: Trang trình diễn web và trình giả lập tương tác.
- `app/`: Bản web app PWA cũ (ngừng phát triển từ 14/11).
- `mobile/`: Bản native React Native + Expo (iOS / Android / web) — xem [`mobile/README.md`](mobile/README.md).
- `slides/`: Bộ slide thuyết trình 8 trang (`slides/index.html`).
- `docs/`: Toàn bộ tài liệu PM, PRD (Markdown & `.docx`), kiến trúc Agent, kịch bản demo, khảo sát 30 PV sâu + 156 khảo sát diện rộng, 42 người dùng Beta.
- `serve.py`: Máy chủ cục bộ hỗ trợ thử nghiệm qua mạng LAN trên điện thoại thật.

## Chạy thử cục bộ

```bash
python serve.py
```

Sau đó mở `http://localhost:8080/` trên máy tính hoặc truy cập địa chỉ LAN hiển thị trên terminal bằng điện thoại.

Bản native (Expo):

```bash
cd mobile && npm install && npx expo start   # quét QR bằng Expo Go
```

