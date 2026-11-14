# KỊCH BẢN DEMO TRÊN ĐIỆN THOẠI THẬT: PlanSnap
**Kịch bản thao tác thực tế từng giây – Nhắm trọn 40/40 điểm Tiêu chí 1**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Sự kiện** | Codex Community Hackathon Hà Nội (14/11/2026) |
| **Mục tiêu điểm số** | **40/40 điểm Tiêu chí 1** (Ưu tiên phá hòa số 1 của BTC) |
| **Thiết bị chính** | Điện thoại Android thật, cài app native PlanSnap (React Native + Expo) từ file APK — xem DEC-08 |
| **Phân vai** | 01 Speaker (Thuyết trình) + 01 Demo Operator (Thao tác tay trên máy) |
| **Nguồn quy chuẩn** | [00_Thang_diem_BTC.md](file:///d:/Codex%20hackathon%20HN/docs/00_Thang_diem_BTC.md) |

---

## 1. Danh mục chuẩn bị trước giờ G (Pre-flight Checklist)

> [!CAUTION]
> Bất kỳ sơ suất kỹ thuật nào làm ứng dụng không mở lại được hoặc phải dùng video thay thế đều sẽ bị Ban Giám khảo chấm **0 điểm ngay lập tức** theo quy chế.

- [ ] **Điện thoại demo chính (Phone A):**
  - Đã cài bản APK PlanSnap mới nhất (EAS profile `preview`), mở từ icon trên màn hình chính. Không demo qua Expo Go hay trình duyệt.
  - Đã nhập Gemini API Key trong tab Cài đặt (thiếu key thì ảnh thật không chạy AI).
  - Pin sạc trên 85%, tắt chế độ Tiết kiệm pin (Low Power Mode).
  - Bật chế độ **"Không làm phiền" (Do Not Disturb)** để chặn mọi tin nhắn, cuộc gọi riêng tư bật lên màn hình.
  - Tải sẵn vào thư viện ảnh: 5 screenshot thực tế (nhóm Zalo lớp, ảnh slide đề cương, ảnh chụp màn hình LMS).
- [ ] **Điện thoại dự phòng (Phone B):**
  - Cấu hình giống hệt Phone A, kết nối sẵn mạng, đặt cạnh bàn thuyết trình.
- [ ] **Đường truyền mạng độc lập:**
  - Chuẩn bị **02 bộ phát Wi-Fi 4G di động** riêng biệt của 2 nhà mạng khác nhau (1 SIM Viettel, 1 SIM VinaPhone). Tuyệt đối không phụ thuộc vào Wi-Fi hội trường.
- [ ] **Gọi thử Gemini (Warm-up):**
  - Đúng **03 phút trước khi lên sân khấu**, vào tab Cài đặt bấm **"Kiểm tra"** để gọi thử Gemini API, xác nhận key và model còn hoạt động.
- [ ] **Đạo cụ cho màn "Wow":**
  - Chuẩn bị sẵn 01 tập giấy ghi chú trắng và 01 bút dạ ngòi to màu đen sẵn sàng đưa cho Ban Giám khảo.

---

## 2. Kịch bản Demo chi tiết từng giây (Tổng thời lượng: 3 phút)

### Giai đoạn 1: Nêu vấn đề bằng thư viện ảnh thật (0:00 – 0:35)
* **Lời thoại của Speaker:**  
  *"Kính thưa Ban Giám khảo, đây là màn hình điện thoại thật của bạn Linh, sinh viên năm 3 tại Hà Nội. Trong thư viện ảnh của Linh, hàng chục ảnh bài tập, lịch thi, deadline Zalo nằm rải rác lẫn lộn giữa ảnh đi chơi và đồ ăn. Linh luôn biết mình có deadline, nhưng không biết khi nào làm, và việc thường xuyên bị dồn vào đêm sát hạn."*
* **Thao tác của Demo Operator:**  
  - Mở thư viện ảnh trên điện thoại đang được chiếu lên màn hình lớn.
  - Lướt nhanh qua 5 bức ảnh chụp màn hình Zalo, LMS, slide bài giảng để BGK thấy độ lộn xộn thực tế.

---

### Giai đoạn 2: BÀI TEST SỐNG CÒN 1 – Đóng hẳn & Mở lại app (0:35 – 1:00)
> **Mục đích:** Khẳng định trực quan điều kiện đạt điểm tối đa của Tiêu chí 1: *"Đóng hẳn rồi mở lại ứng dụng trên điện thoại thật"*.

* **Lời thoại của Speaker:**  
  *"Để chứng minh PlanSnap là một ứng dụng di động độc lập, có khả năng phục hồi dữ liệu hoàn toàn sau khi đóng ứng dụng:"*
* **Thao tác của Demo Operator (Thao tác chậm rãi, dứt khoát trước mắt BGK):**  
  1. Giơ điện thoại lên ngang ngực hướng về phía BGK.
  2. Vuốt mở màn hình chuyển ứng dụng (**App Switcher**).
  3. **Vuốt tắt hẳn ứng dụng PlanSnap** để giải phóng khỏi bộ nhớ RAM.
  4. Quay về màn hình chính điện thoại, **chạm vào biểu tượng (icon) PlanSnap** trên màn hình chính.
  5. Ứng dụng khởi chạy toàn màn hình trong 0.3 giây, hiển thị ngay giao diện chính với các dữ liệu đã lưu từ trước.
* **Lời thoại của Speaker:**  
  *"Ứng dụng khởi động lại ngay tức thì từ icon màn hình chính, toàn bộ đầu việc và cấu hình khung giờ rảnh được bảo toàn nguyên vẹn nhờ dữ liệu lưu cục bộ trên máy."*

---

### Giai đoạn 3: BÀI TEST SỐNG CÒN 2 – Luồng AI chính chạy trực tiếp (1:00 – 2:05)
> **Mục đích:** Chứng minh luồng AI xử lý ảnh đa phương thức live 100%, không cache, không dùng chế độ demo dựng sẵn.

* **Lời thoại của Speaker:**  
  *"Bây giờ, chúng tôi sẽ cho AI đọc trực tiếp 3 ảnh chụp màn hình chưa từng thấy để lên lịch làm việc tuần này."*
* **Thao tác của Demo Operator:**  
  1. Bấm nút **"Thêm ảnh"** trên ứng dụng PlanSnap.
  2. Chọn 3 ảnh từ thư viện:
     - Ảnh 1: Tin nhắn Zalo lớp có câu: *"Hạn nộp bản cuối tiểu luận trước 17h thứ 6 tuần sau nha"*.
     - Ảnh 2: Ảnh chụp slide đề cương bài tập lớn Marketing.
     - Ảnh 3: Ảnh chụp màn hình cổng LMS thông báo bài Quiz tiếng Anh.
  3. Bấm nút **"Quét & Xếp lịch"**.
  4. Màn hình hiện thanh tiến trình động: `Đang nén ảnh ➔ Đang đọc dữ liệu AI ➔ Đang đối chiếu hạn chót...`
  5. **(Sau 4–6 giây):** Màn hình hiển thị danh sách các việc bóc tách được:
     - Tên việc hiển thị rõ ràng.
     - Dưới mỗi việc có dòng chữ nhỏ: **"Nguồn trích dẫn: [Câu nói nguyên văn trong ảnh]"** (Chứng minh AI không bịa việc).
* **Điểm tương tác làm rõ (Human-in-the-Loop):**  
  - Một thẻ màu vàng nổi bật bật lên ở đầu danh sách: *"Phát hiện hạn chót mơ hồ: 'Thứ 6 tuần sau' là ngày nào?"*
  - Phía dưới có 2 nút bấm to: `[20/11/2026]` và `[27/11/2026]`.
  - Operator chạm nhanh vào nút `[20/11/2026]`.
  - Hệ thống tự động cập nhật hạn chót và kích hoạt thuật toán xếp lịch xác định.

---

### Giai đoạn 4: KHOẢNH KHẮC "WOW" – Thử thách chữ viết tay của BGK (2:05 – 2:40)
> **Mục đích:** Xóa bỏ 100% nghi ngờ về việc đội thi dùng kết quả nạp sẵn hoặc video quay lại; khẳng định AI chạy trực tiếp trên dữ liệu mới phát sinh.

* **Lời thoại của Speaker:**  
  *"Nhiều người sẽ nghĩ chúng tôi đã chuẩn bị sẵn 3 bức ảnh trên trong máy. Để chứng minh AI của PlanSnap hoàn toàn chạy live 100%, em xin phép mời một vị Giám khảo viết tay bất kỳ một đầu việc và hạn chót lên tờ giấy này!"*
* **Thao tác của Demo Operator & Speaker:**  
  1. Speaker nhanh chóng đưa tờ giấy trắng và bút dạ cho Giám khảo ngồi gần nhất.
  2. Giám khảo viết: ví dụ *"Nộp báo cáo tài chính trước 14h ngày mai"*.
  3. Demo Operator cầm điện thoại, mở camera ngay trong PlanSnap, bấm chụp tờ giấy của BGK.
  4. Bấm "Thêm vào kế hoạch".
  5. Trong vòng **3–5 giây**, màn hình hiện thêm một task mới: *"Nộp báo cáo tài chính"*, hạn chót `Ngày mai 14:00`, nguồn trích dẫn chữ viết tay của BGK.
  6. Thuật toán tự động xếp chèn một phiên làm việc 60 phút vào ngay tối nay (khung giờ rảnh) để chừa buffer trước 14h ngày mai!
* **Lời thoại của Speaker:**  
  *"AI đọc chính xác chữ viết tay của Thầy/Cô, tự động tính toán thời gian và chèn ngay phiên làm việc vào tối nay trước hạn chót!"*

---

### Giai đoạn 5: Xuất lịch ra ứng dụng di động & Kết thúc (2:40 – 3:00)
* **Thao tác của Demo Operator:**  
  1. Bấm nút **"Xuất vào Lịch"**.
  2. Bảng chia sẻ của Android hiện ra → chọn ứng dụng Lịch đã thử trước trên máy demo (mở được tệp `.ics`).
  3. Ứng dụng Lịch mặc định của điện thoại (Apple Calendar / Google Calendar) tự động mở ra, hiển thị các khối thời gian làm việc màu xanh đã được xếp khớp hoàn hảo với khung giờ rảnh, có chuông nhắc trước 15 phút.
* **Lời thoại của Speaker:**  
  *"Toàn bộ quá trình từ 4 bức ảnh lộn xộn đến một lịch làm việc hoàn chỉnh trên điện thoại diễn ra trong chưa đầy 1 phút. Không cần gõ phím, không sợ sót deadline. Đó là PlanSnap!"*

---

## 3. Ma trận Phòng ngừa Rủi ro Demo (Không bao giờ để rơi vào 0 điểm)

| Sự cố thực tế tại sân khấu | Nguy cơ | Thao tác xử lý tức thời của Đội |
|---|---|---|
| **Mạng 4G của SIM 1 bị ngắt kết nối** | AI báo lỗi mạng | Demo Operator chuyển sang Wi-Fi phát từ SIM 2 (mất 2 giây), bấm nút "Thử lại". Tuyệt đối không bật video thay thế. |
| **API Vision phản hồi chậm (> 10s)** | Khoảng lặng chết trên sân khấu | Speaker duy trì nói: giải thích cơ chế nén ảnh và lý do tại sao AI phải đọc kỹ tem thời gian trong ảnh Zalo để đối chiếu hạn chót. |
| **Máy chính bị lag hoặc hết pin đột ngột** | Không mở lại được app | Chuyển ngay sang Phone B dự phòng đặt sẵn trên bàn, bật màn hình tiếp tục demo từ bước chụp ảnh. |
| **BGK hỏi: "Đây có phải là trình duyệt web không?"** | Bị nghi ngờ demo bằng trình duyệt | Speaker trả lời ngay: *"Thưa BGK, đây là ứng dụng native viết bằng React Native + Expo, cài trực tiếp lên điện thoại từ file APK. Dữ liệu lưu cục bộ trên máy, API key nằm trong kho bảo mật Keystore của Android."* Operator có thể mở Cài đặt hệ thống → Ứng dụng → PlanSnap để BGK thấy app đã cài. |

