# HƯỚNG DẪN ĐÓNG GÓI NATIVE APK BẰNG CAPACITOR (KỊCH BẢN DỰ PHÒNG 0 ĐIỂM)
**Phương án dự phòng khẩn cấp nếu Ban Giám khảo không chấp nhận PWA**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội thi** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Mục đích** | Đóng gói PWA thành tệp `.apk` cài trực tiếp lên điện thoại Android trong dưới 15 phút |
| **Rủi ro đối phó** | **RSK-01** (Mất 40 điểm Tiêu chí 1 do BGK coi PWA là trình duyệt) |
| **Cấu hình** | [`capacitor.config.json`](file:///d:/Codex%20hackathon%20HN/capacitor.config.json) |

---

## 1. Khi nào kích hoạt Kịch bản này?

Kịch bản này **chỉ kích hoạt** khi một trong hai tình huống sau xảy ra:
1. Ban Tổ Chức phản hồi bằng văn bản rằng: *"Chỉ chấp nhận ứng dụng cài đặt qua file APK/IPA, không chấp nhận PWA Add to Home Screen"*.
2. Trong buổi tổng duyệt ngày 13/11, nhóm muốn có thêm 1 phương án dự phòng cài đặt song song trên Điện thoại B (Android) để phòng vệ tuyệt đối.

---

## 2. Quy trình 3 bước Đóng gói APK trong 15 phút

### Bước 1: Khởi tạo Capacitor trong dự án
Mở terminal tại thư mục gốc `d:\Codex hackathon HN\` và chạy lệnh:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init PlanSnap com.technocomplex.plansnap --web-dir app
```

### Bước 2: Thêm nền tảng Android và đồng bộ mã nguồn
```bash
npx cap add android
npx cap copy android
```
*Lưu ý:* Lệnh này sẽ tự động sao chép toàn bộ thư mục `app/` (gồm HTML, CSS, JS, manifest) vào thư mục `android/app/src/main/assets/public/`.

### Bước 3: Mở Android Studio và Build APK
```bash
npx cap open android
```
Trong Android Studio:
1. Chọn menu: **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**.
2. File APK đầu ra nằm tại: `android/app/build/outputs/apk/debug/app-debug.apk`.
3. Cắm cáp USB vào điện thoại Android demo và cài đặt trực tiếp:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 3. Kiểm tra tính năng sau khi đóng gói APK
- [ ] Mở ứng dụng từ icon **PlanSnap** trên màn hình Android (biểu tượng tia sét).
- [ ] Không có bất kỳ thanh URL hay giao diện trình duyệt nào.
- [ ] Kiểm tra tính năng IndexedDB: Bóc tách bài tập, đóng app trong màn hình đa nhiệm rồi mở lại ➔ Kế hoạch vẫn còn nguyên vẹn.
- [ ] Kiểm tra tính năng Camera: Chụp trực tiếp chữ viết tay của BGK.

