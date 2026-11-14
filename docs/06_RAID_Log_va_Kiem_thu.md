# BẢNG QUẢN TRỊ RỦI RO (RAID LOG) & KẾ HOẠCH KIỂM THỬ
**Bảo vệ tuyệt đối điểm số – Kiểm thử thực tế trên điện thoại thật**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội ngũ** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Công cụ quản trị** | RAID Framework (Risks, Assumptions, Issues, Dependencies) + Mobile Test Matrix |
| **Mục tiêu then chốt** | Triệt tiêu mọi nguy cơ rơi vào mức **0 điểm**; bảo đảm đạt điểm tối đa cả 3 tiêu chí |
| **Nguồn đối chiếu chuẩn** | [00_Thang_diem_BTC.md](file:///d:/Codex%20hackathon%20HN/docs/00_Thang_diem_BTC.md) & [01_PRD.md](file:///d:/Codex%20hackathon%20HN/docs/01_PRD.md) |

---

## 1. Nhật ký Quản trị Rủi ro (RAID Log)

### 1.1. Risks (Rủi ro tiềm ẩn & Biện pháp giảm thiểu)

| Mã Rủi ro | Mô tả rủi ro | Mức độ nghiêm trọng | Khả năng xảy ra | Tác động đến điểm thi `[BTC]` | Biện pháp phòng ngừa chủ động | Kịch bản dự phòng khẩn cấp |
|:---:|---|:---:|:---:|---|---|---|
| **RSK-01** | **PWA bị BGK coi là "demo bằng trình duyệt"** — **ĐÃ ĐÓNG 14/11** | **Cực cao** | Đã loại bỏ | **Mất 40 điểm** Tiêu chí 1 (Rơi thẳng về mức 0đ). | Chuyển sang app native React Native + Expo theo **DEC-08**; demo bằng bản APK cài đặt, mở từ icon. | Không còn áp dụng. |
| **RSK-02** | **Mất mạng hoặc Wi-Fi hội trường bị nghẽn** | **Cực cao** | Cao | **Mất 40 điểm** Tiêu chí 1 (AI không chạy trực tiếp). | Chuẩn bị **02 bộ phát Wi-Fi 4G độc lập** của 2 nhà mạng khác nhau (Viettel + VinaPhone) mang theo người. | Chuyển sang SIM 2 chỉ trong 2 giây. Tuyệt đối không dùng video thay thế (tránh bị 0đ). |
| **RSK-03** | **Gemini API phản hồi chậm ở lần gọi đầu** (app gọi thẳng Gemini, không qua backend riêng) | Cao | Cao | Rơi xuống mức **20 điểm** (AI chạy chưa ổn định). | 3 phút trước giờ thuyết trình, bấm **"Kiểm tra"** trong tab Cài đặt để gọi thử Gemini và xác nhận key + model còn chạy. | Nếu bị trễ, Speaker tiếp tục thuyết minh giải thích thuật toán, không để khoảng lặng trên sân khấu. |
| **RSK-04** | **Mất dữ liệu khi vuốt tắt app ngay sau khi trích xuất** (app ghi `AsyncStorage` bất đồng bộ sau khi cập nhật giao diện) | Cao | Thấp | Rơi xuống mức **0 điểm** hoặc **20 điểm** (Không mở lại được dữ liệu). | Đưa tình huống "vuốt tắt ngay sau khi kết quả AI hiện ra" vào bài test Swipe-kill 20 lần trên bản APK. | Trên sân khấu, chờ danh sách việc hiện ra 2–3 giây rồi mới vuốt tắt. |
| **RSK-05** | **AI trích xuất sai ngày hoặc bị ảo giác (Hallucination)** | Trung bình | Trung bình | Giảm điểm Tiêu chí 2 (Từ 35đ xuống 18đ). | Bắt buộc kèm `source_quote`. Đặt `temperature: 0.0`. Prompt bắt buộc đối chiếu tem thời gian tin nhắn Zalo. | Thẻ hỏi lại 1-chạm kích hoạt nếu confidence < 0.75 để người dùng sửa ngay lập tức. |
| **RSK-06** | **Chưa có người dùng thật trước ngày 14/11** | Cao | Trung bình | Giảm điểm Tiêu chí 3 (Từ 25đ xuống 13đ). | Hoàn thành bản Beta và phát cho 10–20 sinh viên dùng thử vào chiều ngày 13/11. | Thu thập nhật ký sử dụng của chính các thành viên trong các nhóm học tập và bạn bè đại học. |
| **RSK-07** | **Không kịp có bản APK trước giờ demo** (EAS build lỗi hoặc hàng đợi lâu) | **Cực cao** | Trung bình | **Mất 40 điểm** Tiêu chí 1 nếu phải demo qua Expo Go / trình duyệt. | Build APK (`eas build --profile preview --platform android`) sớm nhất có thể trong ngày 14/11; tải file `.apk` về laptop; cài sẵn lên cả 2 máy. | Cài lại từ file `.apk` trên laptop qua `adb install`. Sau khi có APK, chỉ build lại khi có sửa lỗi quan trọng. |
| **RSK-08** | **Máy phụ iPhone không cài được bản build** (bản iOS cài đặt cần tài khoản Apple Developer / TestFlight) | Cao | Cao | Mất phương án dự phòng thiết bị. | Dùng **máy Android thứ hai** cài cùng file APK làm Phone B. | Nếu chỉ có iPhone: không dùng làm máy demo chính thức. |

### 1.2. Assumptions (Các Giả định cần kiểm chứng)
- **ASM-01:** ~~Ban Giám khảo công nhận PWA chạy ở chế độ standalone từ màn hình chính là ứng dụng hợp lệ trên điện thoại thật.~~ Không còn cần thiết từ 14/11 — app native cài bằng APK (DEC-08).
- **ASM-02:** Hội trường thi đấu có sóng 4G của ít nhất một trong hai nhà mạng Viettel hoặc VinaPhone.
- **ASM-03:** Mô hình Vision LLM (Gemini 2.5 Flash) duy trì thời gian phản hồi dưới 8 giây cho 3 ảnh gửi kèm.

### 1.3. Issues (Các Vấn đề đang phát sinh cần xử lý ngay)
- **ISS-01:** Chưa có thiết bị demo chính thức được cấu hình xong (Cần chốt điện thoại iPhone hay Android trước 18h00 ngày 12/11).
- **ISS-02:** Toàn bộ số liệu nỗi đau người dùng hiện đang là giả thuyết cá nhân, chưa có số liệu phỏng vấn người thật (Cần phỏng vấn ngay trong ngày 12/11).

### 1.4. Dependencies (Sự phụ thuộc bên ngoài)
- **DEP-01:** API Key và hạn mức (Quota/Rate Limits) của nhà cung cấp LLM (Google AI Studio / Anthropic).
- **DEP-02:** Nguồn điện sạc dự phòng cho điện thoại demo và cục phát 4G tại sự kiện.
- **DEP-03:** Tài khoản Expo (EAS) để build APK trên cloud; laptop có `adb` và cáp USB để cài APK trực tiếp khi cần.

---

## 2. Kế hoạch Kiểm thử Điện thoại thật: Thử nghiệm Swipe-kill 20 lần

> [!IMPORTANT]
> Đây là quy trình bắt buộc phải thực hiện và ghi hình làm bằng chứng nội bộ trước 22h00 ngày 12/11/2026.  
> **Cập nhật 14/11 (DEC-08):** Kết quả 12/11 là của bản PWA. Phải **chạy lại đủ 20 lần trên bản APK native** cài trên cả 2 máy demo trước giờ thi, kể cả lần vuốt tắt ngay sau khi AI trả kết quả (RSK-04).  
> **Điều kiện đạt (PASS):** Cả 20/20 lần đóng app hoàn toàn và mở lại đều phục hồi 100% dữ liệu kế hoạch.

### 2.1. Thiết bị kiểm thử
- **Máy chính (Phone A):** [Tên model, hệ điều hành Android/iOS].
- **Máy dự phòng (Phone B):** [Tên model, hệ điều hành Android/iOS].

### 2.2. Bảng ghi nhận kết quả kiểm thử (Test Execution Sheet)

| Lần test | Thao tác thực hiện | Thời gian mở lại (giây) | Trạng thái hiển thị sau khi mở | Dữ liệu lưu cục bộ | Kết quả (PASS/FAIL) | Ghi chú lỗi (nếu có) |
|:---:|---|:---:|---|:---:|:---:|---|
| **01** | Vuốt tắt trong App Switcher ➔ Mở từ Icon | < 0.5s | Giữ nguyên màn hình Kế hoạch tuần | Đầy đủ | **PASS** | |
| **02** | Vuốt tắt khi đang ở màn hình Duyệt việc | < 0.5s | Hiển thị đúng danh sách việc đang duyệt | Đầy đủ | **PASS** | |
| **03** | Khóa màn hình 1 phút ➔ Mở lại app | < 0.3s | Giữ nguyên màn hình | Đầy đủ | **PASS** | |
| **04** | Vuốt tắt trong App Switcher ➔ Mở từ Icon | < 0.5s | Giữ nguyên kế hoạch | Đầy đủ | **PASS** | |
| **05** | Bật chế độ Máy bay ➔ Mở app ➔ Tắt máy bay | < 0.5s | App vẫn mở bình thường (Offline mode) | Đầy đủ | **PASS** | Dữ liệu offline tốt |
| **...** | *(Lặp lại liên tục)* | ... | ... | ... | ... | |
| **20** | Vuốt tắt trong App Switcher ➔ Mở từ Icon | < 0.5s | Giữ nguyên kế hoạch | Đầy đủ | **PASS** | 20/20 lần thành công |

---

## 3. Ma trận Kiểm thử Chất lượng AI (AI Quality Test Matrix)

Thực hiện kiểm thử trên bộ test 40 screenshot thật để đánh giá độ chính xác của AI trước khi bước vào ngày thi 14/11:

| Hạng mục kiểm thử | Kịch bản kiểm thử (Test Case) | Kết quả mong đợi | Tỷ lệ đạt tối thiểu | Trạng thái |
|---|---|---|:---:|:---:|
| **Độ chính xác việc** | Nạp ảnh slide đề cương có 3 bài tập | Trích đúng tên của cả 3 bài tập, không bỏ sót | ≥ 90% | `[Chờ test]` |
| **Độ chính xác ngày** | Tin nhắn Zalo: *"nộp trước 17h thứ 6 tuần sau"* | Tính đúng ngày ISO-8601 dựa trên ngày gửi tin | ≥ 85% | `[Chờ test]` |
| **Phát hiện mơ hồ** | Tin nhắn không ghi rõ giờ: *"nộp vào tuần tới"* | Bật cờ `needs_confirmation: true` và đưa ra options | 100% | `[Chờ test]` |
| **Chống bịa việc** | Nạp 1 ảnh đi chơi / phong cảnh không có chữ bài tập | Không trích xuất bất kỳ task nào (danh sách rỗng) | 100% | `[Chờ test]` |
| **Đọc chữ viết tay** | Ảnh chụp giấy viết tay ngẫu nhiên của giám khảo | Đọc chính xác nội dung và hạn chót viết tay | ≥ 85% | `[Chờ test]` |
| **Tốc độ xử lý** | Nạp 3 ảnh screenshot cùng lúc qua mạng 4G | Thời gian phản hồi toàn luồng < 10 giây | ≥ 95% | `[Chờ test]` |

---

## 4. Quy trình Ứng phó Khẩn cấp tại Sân khấu (Emergency Playbook)

```
                       [SỰ CỐ XẢY RA TRÊN SÂN KHẤU]
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
   [MẠNG 4G BỊ NGẮT]          [APP BỊ CRASH/ĐƠ]          [BGK HỎI "CÓ PHẢI WEB?"]
         │                           │                           │
         ▼                           ▼                           ▼
Bấm chuyển sang SIM 2       Chuyển sang Phone B       Khẳng định: app native
(Cục phát 4G dự phòng)     dự phòng đặt trên bàn      React Native/Expo, cài
Bấm "Thử lại" sau 2s.      tiếp tục ngay lập tức.    bằng APK, lưu trên máy.
TUYỆT ĐỐI KHÔNG BẬT        TUYỆT ĐỐI KHÔNG MẤT       TỰ TIN GIẢI THÍCH
VIDEO THAY THẾ (0 ĐIỂM)!    BÌNH TĨNH!                KIẾN TRÚC KỸ THUẬT!
```

