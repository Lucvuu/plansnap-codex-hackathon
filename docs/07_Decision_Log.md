# NHẬT KÝ QUYẾT ĐỊNH DỰ ÁN (DECISION LOG / ADR)
**Các quyết định kiến trúc, công nghệ và chiến lược sản phẩm then chốt**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội ngũ** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Mục đích** | Ghi nhận căn cứ, trade-offs và tác động điểm số của mọi quyết định kỹ thuật |
| **Tài liệu tham chiếu** | [00_Thang_diem_BTC.md](file:///d:/Codex%20hackathon%20HN/docs/00_Thang_diem_BTC.md) & `D:\AITHUCCHIEN\OnBoard-Agent---Ngu-Ho-Tuong\System_Onboarding\Docs\Doc\01_Project_Governance\AIB_01-06_Decision_Log_v0.1.xlsx` |

---

## Danh mục Quyết định Kiến trúc & Sản phẩm (Architecture Decision Records)

### DEC-01: Chọn Progressive Web App (PWA Standalone) làm nền tảng chính
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** Tech Lead / PM
* **Trạng thái:** **Đã chốt (Kèm điều kiện phòng ngừa rủi ro)**
* **Bối cảnh:**
  - Tiêu chí 1 yêu cầu *"Demo AI trên điện thoại thật — Đóng hẳn rồi mở lại ứng dụng; luồng AI chính chạy trực tiếp"*.
  - Phát triển ứng dụng Native thuần (Swift / Kotlin) trong 48 tiếng là bất khả thi và rủi ro phân mảnh thiết bị rất cao.
* **Quyết định:**
  - Xây dựng Web App với cấu hình **PWA Standalone**, `manifest.json`, `service-worker.js`, icon chuẩn mobile, cho phép cài đặt *"Thêm vào Màn hình chính"* (Add to Home Screen).
* **Đánh giá Trade-offs:**
  - *Ưu điểm:* Phát triển cực nhanh, giao diện đồng nhất, phân phối cho 10–20 người dùng beta qua 1 đường link duy nhất (không qua App Store / TestFlight duyệt lâu).
  - *Nhược điểm / Rủi ro:* Có nguy cơ bị BGK khắt khe đánh đồng với *"demo bằng trình duyệt"* (mất 40 điểm).
* **Biện pháp phòng thủ bắt buộc:**
  - Ẩn hoàn toàn thanh URL, chạy toàn màn hình từ icon riêng.
  - Chuẩn bị sẵn khung bọc **Capacitor** để đóng gói thành tệp `.apk` cài trực tiếp lên điện thoại Android trong trường hợp BTC không công nhận PWA.

---

### DEC-02: Kiến trúc Hybrid Agent: LLM trích xuất ngữ cảnh + Code thuần xếp lịch
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** AI Engineer / Tech Lead
* **Trạng thái:** **Đã chốt**
* **Bối cảnh:**
  - Nhiều đội thi cố gắng dùng LLM để tự tính toán thời gian và sinh toàn bộ lịch trình.
  - Tuy nhiên, LLM thường xuyên mắc lỗi số học thời gian (Arithmetic Hallucination), xếp chồng chéo khung giờ (Slot Collision) và không tuân thủ chính xác khoảng đệm an toàn (Buffer time).
* **Quyết định:**
  - Phân tách rõ ràng:
    - **Vision LLM:** Đảm nhận nhận dạng thị giác, OCR tiếng Việt, giải mã ngữ cảnh tem thời gian tin nhắn Zalo, bóc tách đầu việc và phát hiện điểm mơ hồ.
    - **Deterministic Engine (Code thuần):** Thuật toán Earliest Deadline First (EDF) phân bổ các phiên làm việc vào khung giờ rảnh, chừa khoảng đệm an toàn và ngăn ngừa xung đột 100%.
* **Đánh giá Trade-offs:**
  - *Ưu điểm:* Độ chính xác tuyệt đối, thời gian xếp lịch < 5ms, bảo đảm 100% không bị ảo giác trước mặt Ban Giám khảo.
  - *Nhược điểm:* Cần viết thêm module thuật toán xếp lịch và xử lý khung thời gian (Timezone handling) ở client/backend.

---

### DEC-03: Chọn Google Gemini 1.5 Flash làm Vision LLM chính
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** AI Engineer
* **Trạng thái:** **Đã chốt (Dự phòng Claude 3.5 Haiku)**
* **Bối cảnh:**
  - Màn demo trên sân khấu đòi hỏi thời gian phản hồi toàn luồng (Latency) phải dưới 8–10 giây. Nếu vượt quá 15 giây, BGK sẽ đánh giá ứng dụng chạy không ổn định (nguy cơ rơi xuống mức 20 điểm ở Tiêu chí 1).
* **Quyết định:**
  - Chọn **Gemini 1.5 Flash** (Google AI Studio) vì:
    - Khả năng xử lý đa ảnh (Multi-image prompt) vượt trội với context window lớn.
    - Tốc độ sinh token (TTFT và Throughput) nhanh nhất trong các model thị giác hiện nay.
    - Khả năng đọc hiểu tiếng Việt và chữ viết tay tốt.
    - Hỗ trợ chuẩn xác tính năng **Structured Outputs (JSON Schema)**.
* **Cấu hình Model:**
  - `temperature = 0.0` (Tối đa hóa tính xác định và loại trừ suy diễn bịa việc).
  - Chuẩn bị sẵn 02 API Keys dự phòng.

---

### DEC-04: Nén ảnh tại máy khách (Client-side Canvas Resize) trước khi gửi
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** Frontend Dev
* **Trạng thái:** **Đã chốt**
* **Bối cảnh:**
  - Ảnh chụp camera điện thoại hiện đại có dung lượng từ 5–12MB (độ phân giải 4000x3000px).
  - Tải 3–5 bức ảnh dung lượng 20–40MB qua mạng 4G tại hội trường đông người sẽ mất từ 15–30 giây, dẫn đến nghẽn mạng và timeout.
* **Quyết định:**
  - Sử dụng HTML5 Canvas API nén ảnh ngay tại trình duyệt của điện thoại trước khi upload:
    - Cạnh dài tối đa (max dimension): `1600px`.
    - Định dạng: `image/jpeg`.
    - Chất lượng (quality): `0.80`.
* **Kết quả:**
  - Dung lượng mỗi ảnh giảm từ ~8MB xuống còn ~250KB (giảm hơn 95%).
  - Thời gian upload 3 ảnh qua 4G giảm từ 15 giây xuống dưới 1.5 giây, trong khi chữ trên tài liệu và tin nhắn vẫn cực kỳ sắc nét để Vision LLM đọc chính xác.

---

### DEC-05: Lưu trữ trạng thái cục bộ bền vững bằng IndexedDB
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** Frontend Dev / PM
* **Trạng thái:** **Đã chốt**
* **Bối cảnh:**
  - Tiêu chí 1 quy định mức 40 điểm: *"Đóng hẳn rồi mở lại ứng dụng trên điện thoại thật"*.
  - Nếu chỉ lưu trong bộ nhớ RAM, khi người dùng vuốt tắt app trong App Switcher, dữ liệu sẽ biến mất hoàn toàn.
  - `localStorage` bị giới hạn 5MB và là synchronous API (có thể gây giật giao diện).
* **Quyết định:**
  - Sử dụng **IndexedDB** (qua thư viện nhẹ `idb` hoặc native wrapper) để lưu:
    - Cấu hình khung giờ rảnh hàng tuần (`availability`).
    - Lịch sử các task đã trích xuất (`extracted_tasks`).
    - Kế hoạch làm việc tuần hiện tại (`weekly_plan`).
* **Kết quả:**
  - Khi vuốt tắt hẳn app và mở lại, ứng dụng khôi phục trạng thái tức thì trong < 0.2 giây.

---

### DEC-06: Loại bỏ hoàn toàn tính năng Đăng nhập / Tài khoản trong bản MVP Hackathon
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** PM
* **Trạng thái:** **Đã chốt**
* **Bối cảnh:**
  - Đăng nhập (Auth) là tính năng tiêu tốn nhiều thời gian phát triển nhưng **không mang lại điểm số nào** trong 3 tiêu chí của BTC.
  - Nguy cơ kẹt ở màn hình login do hết hạn phiên (session expired), lỗi OTP hoặc quên mật khẩu khi đang demo trên sân khấu là cực kỳ cao (sẽ bị 0 điểm Tiêu chí 1).
* **Quyết định:**
  - Đưa tính năng Tài khoản/Đăng nhập vào danh mục **Won't-Have** cho ngày 14/11.
  - Ứng dụng chạy theo mô hình **Local-first (Ưu tiên cục bộ)**: Mở là dùng ngay, dữ liệu lưu trên máy người dùng, bảo đảm quyền riêng tư 100%.

---

### DEC-07: Xuất lịch 1 chiều qua tệp iCalendar (`.ics`) thay vì tích hợp OAuth Google Calendar 2 chiều
* **Ngày quyết định:** 12/11/2026
* **Người đề xuất:** Tech Lead
* **Trạng thái:** **Đã chốt**
* **Bối cảnh:**
  - Tích hợp Google Calendar API yêu cầu xác thực OAuth 2.0, đăng ký app trên Google Cloud Console, duyệt màn hình xác thực consent screen.
* **Quyết định:**
  - Xuất file `.ics` chuẩn RFC 5545 và mở trực tiếp bằng ứng dụng Lịch mặc định của điện thoại (hỗ trợ cả iOS Calendar, Google Calendar, Samsung Calendar).
  - Bổ sung nút link URL nhanh `https://calendar.google.com/calendar/render?action=TEMPLATE` cho từng sự kiện.
* **Kết quả:**
  - Không cần quyền truy cập nhạy cảm, không lo hết hạn token, tương thích với 100% thiết bị điện thoại thật.

