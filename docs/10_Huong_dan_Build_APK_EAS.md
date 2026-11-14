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
# Một lần: đưa Gemini API key dùng chung lên EAS (file mobile/.env không được upload khi build cloud)
npx eas-cli@latest env:set --name EXPO_PUBLIC_GEMINI_API_KEY --value "<API key>" --environment preview --environment production --visibility sensitive
npx eas-cli@latest build --profile preview --platform android
```

- Key được nhúng vào APK lúc build (ai có APK đều trích ra được): dùng key có giới hạn ngân sách/quota trong Google Cloud và **xóa/đổi key sau demo**, rồi build lại.

- Lần đầu, CLI sẽ hỏi tạo project EAS và tạo Android keystore → chọn **Yes** để EAS tự quản lý.
- Build xong, EAS in ra **link tải APK + mã QR**. Tải file `.apk` về laptop để cài lại khi cần.

## 4. Cài lên điện thoại

- **Cách 1:** Mở link / quét QR trên điện thoại → tải APK → cho phép "Cài ứng dụng không rõ nguồn gốc" → Cài đặt.
- **Cách 2 (không cần mạng):** Bật USB debugging, cắm cáp, chạy `adb install -r <file>.apk`.

## 5. Kiểm tra sau khi cài

- [ ] Mở app từ icon **PlanSnap** trên màn hình chính (không qua Expo Go, không qua trình duyệt).
- [ ] Góc trên bên phải hiện **Gemini Live** (không phải **Demo**) → key đã được nhúng đúng.
- [ ] Quét 3 ảnh mẫu → có danh sách việc kèm câu trích → chạm chọn ngày ở thẻ hỏi lại → có lịch.
- [ ] Vuốt tắt app trong màn hình đa nhiệm rồi mở lại → đầu việc và lịch còn nguyên.
- [ ] Chụp ảnh bằng camera → AI đọc được → việc mới được xếp lịch.
- [ ] Bấm xuất lịch → share sheet hiện ra → mở được bằng app Lịch trên máy.

## 6. Cập nhật code qua mạng, không cần build lại (EAS Update)

Từ bản build có `expo-updates` (commit `16acbf1`), các sửa đổi **chỉ đụng tới JS/TS** được đẩy thẳng xuống APK đã cài:

```bash
cd mobile
eas update --channel preview --environment preview --platform android --message "mô tả ngắn"
```

- Trên điện thoại: **vuốt tắt app rồi mở lại 2 lần** — lần đầu app tải bản mới về, lần sau mới chạy bản mới.
- Phải **build lại APK** khi: thêm/bớt thư viện có code native, đổi `app.json` (icon, quyền, plugin), hoặc đổi `version` (bản cập nhật chỉ áp cho APK cùng `version`, theo `runtimeVersion.policy = appVersion`).
- **Không publish update trong giờ demo.** Nếu có bản mới trên server, lần vuốt tắt – mở lại trước BGK có thể đổi sang code mới giữa chừng. Chốt bản cuối, mở app 2 lần để chắc đã nhận, rồi mới lên sân khấu.
- APK chỉ build cho CPU ARM (`arm64-v8a`, `armeabi-v7a`) nên không cài được trên máy ảo x86.

## 7. Lưu ý

- **Không demo bằng Expo Go**: Expo Go là app trung gian tải code từ máy tính, BGK có thể không coi là "ứng dụng trên điện thoại thật".
- **iOS:** cài bản build lên iPhone cần tài khoản Apple Developer (TestFlight). Không có thì dùng máy Android thứ hai làm máy phụ (RSK-08).
- Không sửa tay thư mục `android/` / `ios/` (nếu có): cấu hình native nằm trong `app.json` (xem `mobile/AGENTS.md`).
