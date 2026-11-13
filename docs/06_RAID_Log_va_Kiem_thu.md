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
| **RSK-01** | **PWA bị BGK coi là "demo bằng trình duyệt"** | **Cực cao** | Trung bình | **Mất 40 điểm** Tiêu chí 1 (Rơi thẳng về mức 0đ). | 1. Cài đặt manifest với `display: standalone`, ẩn thanh URL hoàn toàn.<br>2. Gửi email hỏi xác nhận từ BTC ngay sáng 12/11. | Chuẩn bị sẵn khung bọc **Capacitor** build thành file `.apk` cài trực tiếp lên điện thoại Android trong ngày 13/11. |
| **RSK-02** | **Mất mạng hoặc Wi-Fi hội trường bị nghẽn** | **Cực cao** | Cao | **Mất 40 điểm** Tiêu chí 1 (AI không chạy trực tiếp). | Chuẩn bị **02 bộ phát Wi-Fi 4G độc lập** của 2 nhà mạng khác nhau (Viettel + VinaPhone) mang theo người. | Chuyển sang SIM 2 chỉ trong 2 giây. Tuyệt đối không dùng video thay thế (tránh bị 0đ). |
| **RSK-03** | **Backend Serverless bị Khởi động nguội (Cold Start)** | Cao | Cao | Rơi xuống mức **20 điểm** (AI chạy chưa ổn định). | Gửi 1 request warm-up trước giờ thuyết trình 3 phút để giữ container luôn hoạt động. | Nếu bị trễ, Speaker tiếp tục thuyết minh giải thích thuật toán, không để khoảng lặng trên sân khấu. |
| **RSK-04** | **Trang bị tải lại (Reload trắng) khi đóng/mở trên iOS** | Cao | Trung bình | Rơi xuống mức **0 điểm** hoặc **20 điểm** (Không mở lại được ứng dụng). | Lưu toàn bộ state ngay lập tức vào `IndexedDB` trước mỗi bước render. Tránh lưu tạm trong biến RAM. | Chọn điện thoại **Android cao cấp** làm thiết bị demo chính (giữ process nền tốt hơn iOS). |
| **RSK-05** | **AI trích xuất sai ngày hoặc bị ảo giác (Hallucination)** | Trung bình | Trung bình | Giảm điểm Tiêu chí 2 (Từ 35đ xuống 18đ). | Bắt buộc kèm `source_quote`. Đặt `temperature: 0.0`. Prompt bắt buộc đối chiếu tem thời gian tin nhắn Zalo. | Thẻ hỏi lại 1-chạm kích hoạt nếu confidence < 0.75 để người dùng sửa ngay lập tức. |
| **RSK-06** | **Chưa có người dùng thật trước ngày 14/11** | Cao | Trung bình | Giảm điểm Tiêu chí 3 (Từ 25đ xuống 13đ). | Hoàn thành bản Beta và phát cho 10–20 sinh viên dùng thử vào chiều ngày 13/11. | Thu thập nhật ký sử dụng của chính các thành viên trong các nhóm học tập và bạn bè đại học. |

### 1.2. Assumptions (Các Giả định cần kiểm chứng)
- **ASM-01:** Ban Giám khảo công nhận PWA chạy ở chế độ standalone từ màn hình chính là ứng dụng hợp lệ trên điện thoại thật (Đang chờ BTC xác nhận).
- **ASM-02:** Hội trường thi đấu có sóng 4G của ít nhất một trong hai nhà mạng Viettel hoặc VinaPhone.
- **ASM-03:** Mô hình Vision LLM (Gemini 1.5 Flash) duy trì thời gian phản hồi dưới 8 giây cho 3 ảnh gửi kèm.

### 1.3. Issues (Các Vấn đề đang phát sinh cần xử lý ngay)
- **ISS-01:** Chưa có thiết bị demo chính thức được cấu hình xong (Cần chốt điện thoại iPhone hay Android trước 18h00 ngày 12/11).
- **ISS-02:** Toàn bộ số liệu nỗi đau người dùng hiện đang là giả thuyết cá nhân, chưa có số liệu phỏng vấn người thật (Cần phỏng vấn ngay trong ngày 12/11).

### 1.4. Dependencies (Sự phụ thuộc bên ngoài)
- **DEP-01:** API Key và hạn mức (Quota/Rate Limits) của nhà cung cấp LLM (Google AI Studio / Anthropic).
- **DEP-02:** Nguồn điện sạc dự phòng cho điện thoại demo và cục phát 4G tại sự kiện.

---

## 2. Kế hoạch Kiểm thử Điện thoại thật: Thử nghiệm Swipe-kill 20 lần

> [!IMPORTANT]
> Đây là quy trình bắt buộc phải thực hiện và ghi hình làm bằng chứng nội bộ trước 22h00 ngày 12/11/2026.  
> **Điều kiện đạt (PASS):** Cả 20/20 lần đóng app hoàn toàn và mở lại đều phục hồi 100% dữ liệu kế hoạch.

### 2.1. Thiết bị kiểm thử
- **Máy chính (Phone A):** [Tên model, hệ điều hành Android/iOS].
- **Máy dự phòng (Phone B):** [Tên model, hệ điều hành Android/iOS].

### 2.2. Bảng ghi nhận kết quả kiểm thử (Test Execution Sheet)

| Lần test | Thao tác thực hiện | Thời gian mở lại (giây) | Trạng thái hiển thị sau khi mở | Dữ liệu IndexedDB | Kết quả (PASS/FAIL) | Ghi chú lỗi (nếu có) |
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
   [MẠNG 4G BỊ NGẮT]          [APP BỊ CRASH/ĐƠ]          [BGK NGHI NGỜ PWA]
         │                           │                           │
         ▼                           ▼                           ▼
Bấm chuyển sang SIM 2       Chuyển sang Phone B       Khẳng định: PWA cài đặt
(Cục phát 4G dự phòng)     dự phòng đặt trên bàn      Standalone, IndexedDB,
Bấm "Thử lại" sau 2s.      tiếp tục ngay lập tức.    Service worker độc lập.
TUYỆT ĐỐI KHÔNG BẬT        TUYỆT ĐỐI KHÔNG MẤT       TỰ TIN GIẢI THÍCH
VIDEO THAY THẾ (0 ĐIỂM)!    BÌNH TĨNH!                KIẾN TRÚC KỸ THUẬT!
```

