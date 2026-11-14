# PlanSnap (Capture → Plan)

**Team technoComplex** — Hackathon Hà Nội (14/11/2026)

PlanSnap biến ảnh chụp thông báo bài tập (Zalo, Messenger, LMS, slide bài giảng, bảng trắng và ghi chú viết tay) thành lịch làm việc cá nhân có bằng chứng nguồn trong chưa đầy 1 phút.

## Kiến trúc & Điểm nổi bật

- **App Native React Native + Expo (`mobile/`):** Nền tảng chính từ 14/11 (xem `docs/07_Decision_Log.md`, DEC-08). Cài trên Android bằng APK build qua EAS (`@elysszxje/plansnap`), lưu dữ liệu cục bộ bằng `AsyncStorage` (khôi phục nguyên trạng sau khi swipe-kill), API key bảo mật trong Android Keystore / iOS Keychain (`expo-secure-store`), nén ảnh ngay trên máy.
- **Hybrid AI Agent (`mobile/src/lib/vision-agent.ts`, `mobile/src/lib/prompt.ts`):** Kết nối Google Gemini Vision API (`gemini-3-flash-preview`, tự chuyển sang `gemini-3.5-flash` / `gemini-3.8-flash` khi 404/503) với System Prompt 6 quy tắc chuẩn `ExtractionResult` (bắt buộc trích dẫn nguồn `source_quote`, chuẩn ngày `dd/mm`, neo tem thời gian chat, chế độ chữ viết tay và hỏi lại 1 chạm khi hạn mơ hồ).
- **Deterministic EDF Scheduler + Giờ cố định (`mobile/src/lib/scheduler.ts`):** Thuật toán Earliest Deadline First chia phiên làm việc 60–90 phút vào khung giờ rảnh thực tế, chừa khoảng đệm 3 giờ trước hạn chót, hỗ trợ **+ Thêm lịch** (quét ảnh nối tiếp hoặc đặt **Giờ cố định** / **Tự xếp giờ rảnh** thủ công), và xuất tệp `.ics` chuẩn RFC 5545 qua bảng chia sẻ.

## Cấu trúc thư mục

- `mobile/`: Ứng dụng Native React Native 0.88.1 + Expo SDK 58 (xem [`mobile/README.md`](mobile/README.md)).
- `app/`: Bản web app PWA tiền nhiệm (vẫn giữ đồng bộ thuật toán scheduler & prompt phục vụ trình giả lập web).
- `index.html`: Trang giới thiệu và trình giả lập tương tác trên web.
- `slides/`: Bộ slide thuyết trình 8 trang (`slides/index.html`).
- `docs/`: Toàn bộ tài liệu PM (PRD Markdown & `.docx`, kiến trúc Agent, Decision Log, kịch bản demo, Q&A BGK).
- `tests/`: Bộ kiểm thử đơn vị cho scheduler, iCal và Vision contract.

## Chạy thử & Kiểm thử

```bash
# Kiểm thử đơn vị bản Mobile Native (17 tests gồm đối chiếu 500 kịch bản ngẫu nhiên)
cd mobile && node --test "src/lib/__tests__/*.test.ts"

# Khởi chạy Expo dev server
npx expo start
```

Bản web giới thiệu / giả lập PWA chạy cục bộ:

```bash
python serve.py
```
Mở `http://localhost:8080/` trên trình duyệt.
