# PlanSnap Mobile (React Native + Expo)

Bản native của PWA trong `../app/`, viết bằng **Expo SDK 58 + Expo Router + TypeScript**. Chạy trên iOS, Android và web từ cùng một mã nguồn.

## Chạy thử

```bash
cd mobile
npm install
npx expo start          # quét QR bằng Expo Go (iOS/Android)
npx expo start --web    # chạy trên trình duyệt
```

Mọi module native dùng trong app đều có sẵn trong **Expo Go**, không cần development build.

## Build cài đặt

```bash
npx eas-cli@latest build --profile preview --platform android   # APK cài trực tiếp
npx eas-cli@latest build --profile production --platform ios    # bản lên App Store / TestFlight
```

Thư mục `ios/` và `android/` được sinh tự động (`npx expo prebuild`) — không sửa tay, cấu hình native nằm trong `app.json`.

## Kiểm tra

```bash
npm test            # unit test: scheduler (đối chiếu 500 kịch bản với app/js/scheduler.js), iCal, định dạng, Gemini helpers
npm run typecheck   # tsc cho app + test
npm run lint        # expo lint
```

## Cấu trúc

| PWA (`app/`) | Expo (`mobile/src/`) |
| --- | --- |
| `index.html` 4 tab + bottom nav | `app/(tabs)/` — `index` (Quét ảnh), `tasks`, `schedule`, `settings` (Expo Router JS tabs) |
| `js/app.js` (state + event handlers) | `state/AppStore.tsx` (React context) |
| `js/scheduler.js` | `lib/scheduler.ts` |
| `js/vision-agent.js` | `lib/vision-agent.ts`, `lib/gemini.ts`, `lib/prompt.ts` (prompt giữ nguyên văn), `lib/demo-tasks.ts` |
| `js/compressor.js` (Canvas) | `lib/image.ts` (`expo-image-manipulator`, tối đa 1200px, JPEG 0.78) |
| `<input type=file capture>` | `lib/pick-images.ts` (`expo-image-picker`: thư viện ảnh / máy ảnh) |
| `js/storage.js` (IndexedDB) | `lib/storage.ts` (AsyncStorage) + `lib/secure-key.ts` (API key trong Keychain/Keystore) |
| `js/ical-export.js` | `lib/ical.ts` + `lib/export-ics.ts` (share sheet) / `export-ics.web.ts` (tải file) |
| Ảnh mẫu SVG inline | `assets/samples/*.png` (render sẵn từ chính các SVG đó) |
| `css/style.css` | `theme.ts` + `StyleSheet` trong từng màn hình |

## Khác biệt so với PWA

- **API key** lưu trong kho bảo mật của thiết bị (bản web vẫn dùng localStorage) và gửi qua header `x-goog-api-key` thay vì query string.
- **Xuất .ics** mở share sheet của hệ điều hành (Lưu vào Tệp, Lịch, Zalo, Gmail…); bản web vẫn tải file. Tệp .ics được escape và gập dòng đúng RFC 5545.
- **Đánh số phiên**: khi khung giờ rảnh bị chia nhỏ, PWA có thể hiện "Phiên 3/2"; bản này đánh số theo số phiên thực tế.
- **Xóa dữ liệu** xóa cả API key đã lưu (PWA chỉ xóa trên giao diện, key vẫn còn trong IndexedDB).
- Lịch tự tính lại khi mở lại app (mốc "bây giờ" được cập nhật).
- **Thử thách viết tay (FR-5.2)**: một nút mở máy ảnh → AI đọc → nối việc mới vào lịch, không qua bước chọn ảnh.
- **Gọi Gemini**: hết giờ sau 15 giây; tự thử lại 1 lần khi rớt kết nối hoặc JSON trả về không đọc được (NFR-04).
- **Mở lại đúng tab** đang xem trước khi app bị đóng (NFR-02).
- Không có kéo-thả ảnh và cầu nối `postMessage` cho trình giả lập desktop (chỉ có ý nghĩa với iframe web).
