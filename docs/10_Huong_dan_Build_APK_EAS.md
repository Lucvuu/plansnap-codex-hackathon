# HƯỚNG DẪN BUILD & CÀI APK APP NATIVE (EAS BUILD)
**Đưa app native PlanSnap (React Native + Expo) lên điện thoại demo**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội thi** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Mục đích** | Build file `.apk` từ `mobile/` và cài lên 2 máy Android demo |
| **Căn cứ** | **DEC-08** (chuyển sang app native, 14/11/2026) — thay thế hướng dẫn Capacitor cũ |
| **Rủi ro đối phó** | **RSK-07** (không kịp có APK), **RSK-08** (máy phụ iPhone) |
| **Cấu hình** | `mobile/app.json`, `mobile/eas.json` (profile `preview` → APK) |

---

## 1. Khi nào build

- Build **sớm nhất có thể** trong ngày 14/11, ngay khi code trên `dev` chạy ổn.
- Sau đó chỉ build lại khi có sửa lỗi ảnh hưởng tới luồng demo. Mỗi lần build lại phải cài lại và chạy lại Swipe-kill (WBS 04.4).

## 2. Kiểm tra trước khi build

```bash
cd mobile
npm ci
npm run typecheck
npm run lint
TZ=Asia/Ho_Chi_Minh node --test "src/lib/__tests__/*.test.ts"   # trên Windows chạy trong Git Bash
```

## 3. Build APK trên cloud (EAS)

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile preview --platform android
```

- Lần đầu, CLI sẽ hỏi tạo project EAS và tạo Android keystore → chọn **Yes** để EAS tự quản lý.
- Build xong, EAS in ra **link tải APK + mã QR**. Tải file `.apk` về laptop để cài lại khi cần.

## 4. Cài lên điện thoại

- **Cách 1:** Mở link / quét QR trên điện thoại → tải APK → cho phép "Cài ứng dụng không rõ nguồn gốc" → Cài đặt.
- **Cách 2 (không cần mạng):** Bật USB debugging, cắm cáp, chạy `adb install -r <file>.apk`.

## 5. Kiểm tra sau khi cài

- [ ] Mở app từ icon **PlanSnap** trên màn hình chính (không qua Expo Go, không qua trình duyệt).
- [ ] Nhập Gemini API Key trong Cài đặt → bấm **Kiểm tra** → báo kết nối thành công.
- [ ] Quét 3 ảnh mẫu → có danh sách việc kèm câu trích → chạm chọn ngày ở thẻ hỏi lại → có lịch.
- [ ] Vuốt tắt app trong màn hình đa nhiệm rồi mở lại → đầu việc và lịch còn nguyên.
- [ ] Chụp ảnh bằng camera → AI đọc được → việc mới được xếp lịch.
- [ ] Bấm xuất lịch → share sheet hiện ra → mở được bằng app Lịch trên máy.

## 6. Lưu ý

- **Không demo bằng Expo Go**: Expo Go là app trung gian tải code từ máy tính, BGK có thể không coi là "ứng dụng trên điện thoại thật".
- **iOS:** cài bản build lên iPhone cần tài khoản Apple Developer (TestFlight). Không có thì dùng máy Android thứ hai làm máy phụ (RSK-08).
- Không sửa tay thư mục `android/` / `ios/` (nếu có): cấu hình native nằm trong `app.json` (xem `mobile/AGENTS.md`).
