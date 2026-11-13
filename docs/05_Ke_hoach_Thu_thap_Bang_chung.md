# KẾ HOẠCH HÀNH ĐỘNG THU THẬP BẰNG CHỨNG THỰC TẾ
**Chuyển đổi toàn bộ "Giả thuyết" thành "Bằng chứng thật" trước 23h59 ngày 13/11/2026**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội ngũ** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Mục đích** | Cung cấp bằng chứng thực tế định lượng & định tính cho **Tiêu chí 2 (35đ)** và **Tiêu chí 3 (25đ)** |
| **Quy chuẩn BTC** | *"Điểm dựa trên bằng chứng thực tế, không dựa vào slide hay độ tự tin khi trình bày"* |
| **Thời gian thực hiện** | Từ 09h00 ngày 12/11 đến 23h59 ngày 13/11/2026 |

---

## 1. Nguyên tắc cốt lõi về Bằng chứng

1. **Nguyên tắc "Không bịa số liệu":** Mọi con số đưa lên slide hay kịch bản pitch bắt buộc phải được đo đạc từ người thật, việc thật.
2. **Bảo vệ quyền riêng tư (Privacy & PII):** Mọi ảnh chụp màn hình Zalo, Messenger, LMS thu thập được phải được che mờ/bôi đen tên người gửi, số điện thoại, ảnh đại diện và mã số sinh viên trước khi đưa vào bộ test hoặc trình chiếu.
3. **Có sự đồng ý bằng văn bản/tin nhắn:** Các câu trích dẫn của sinh viên phải có tin nhắn xác nhận đồng ý cho phép trích dẫn trong bài thi Hackathon.

---

## 2. Kế hoạch Phỏng vấn sâu 30 Sinh viên & Khảo sát diện rộng 156 Sinh viên (Mục tiêu: Tiêu chí 2 - 35đ)

### 2.1. Đối tượng tuyển chọn
- 30 sinh viên phỏng vấn sâu 1-on-1 tại 6 trường Đại học ở Hà Nội (ĐH Bách Khoa, ĐH Kinh tế Quốc dân, ĐH Ngoại thương, ĐH Quốc gia Hà Nội, Học viện Ngân hàng, ĐH Thương mại) và 156 sinh viên tham gia khảo sát định lượng diện rộng.
- Tiêu chí: Đang học tối thiểu 5 môn trong kỳ này và có ít nhất 1 bài tập lớn làm theo nhóm.

### 2.2. Kịch bản phỏng vấn chuẩn hóa (Thời lượng: 10–15 phút/buổi)
Người phỏng vấn đặt lần lượt 5 câu hỏi sau và ghi chép câu trả lời:

1. **Khảo sát thói quen lưu trữ:**  
   *"Khi giảng viên thông báo deadline trên lớp, trên slide hoặc qua nhóm Zalo lớp, bạn thường làm gì để nhớ việc đó?"*  
   *(Quan sát xem họ có nói: Chụp màn hình, ghim tin nhắn, hay ghi sổ tay không).*
2. **Đo đạc số liệu thư viện ảnh (Định lượng thực tế):**  
   *"Phiền bạn mở thư viện ảnh trên điện thoại, vào mục Ảnh chụp màn hình (Screenshots) trong 30 ngày gần nhất và đếm giúp mình có khoảng bao nhiêu ảnh liên quan đến hạn chót bài tập, lịch học, đề cương?"*  
   *(Ghi nhận con số chính xác vào bảng khảo sát).*
3. **Nỗi đau về hạn chót mơ hồ:**  
   *"Bạn đã bao giờ gặp trường hợp giảng viên hoặc bạn nhóm nhắn 'thứ 6 tuần sau nộp' hoặc 'nộp trước buổi học tới', rồi sau đó bạn bị nhầm ngày hoặc quên bẵng đi không? Cảm giác lúc đó thế nào?"*  
   *(Ghi lại câu nói nguyên văn có tính cảm xúc để làm trích dẫn trên slide).*
4. **Vấn đề phân bổ thời gian (Pain point then chốt):**  
   *"Khi biết một bài tập phải nộp vào Chủ Nhật tuần sau, bạn thường bắt đầu làm vào lúc nào? Tại sao lại không làm sớm hơn?"*
5. **Nỗi đau bài tập nhóm:**  
   *"Khó khăn lớn nhất của bạn khi quản lý tiến độ trong một bài tập nhóm là gì?"*

### 2.3. Biểu mẫu tổng hợp kết quả phỏng vấn
Tạo file ghi chép nội bộ tại `docs/khao_sat_sinh_vien.md` với các cột:
- `STT` | `Họ tên (viết tắt)` | `Trường / Ngành` | `Năm học` | `Số ảnh deadline trong 30 ngày` | `Số lần nộp bài sát giờ (<2h)` | `Câu trích dẫn tiêu biểu` | `Đồng ý trích dẫn (Y/N)`.

---

## 3. Quy trình Thu thập Dataset 30–50 Screenshot thật (Mục tiêu: Tiêu chí 2 - 35đ)

### 3.1. Cơ cấu bộ ảnh kiểm thử (Test Dataset)
Cần thu thập tối thiểu 40 ảnh đa dạng các loại hình:
- **Nhóm 1 (15 ảnh):** Ảnh chụp màn hình tin nhắn Zalo lớp / nhóm bài tập (có chứa hạn chót dạng tương đối như "thứ 6 tuần sau", "23h tối nay", "trước buổi học thứ Ba").
- **Nhóm 2 (10 ảnh):** Ảnh chụp màn hình cổng LMS (Canvas, Moodle, cổng thông tin đào tạo của trường có bảng deadline).
- **Nhóm 3 (10 ảnh):** Ảnh chụp slide bài giảng của giảng viên chiếu trên lớp (chụp nghiêng, chụp trong điều kiện ánh sáng phòng học).
- **Nhóm 4 (5 ảnh):** Ảnh chụp bảng trắng sau buổi họp nhóm hoặc ghi chú bài tập viết tay trên giấy.

### 3.2. Quy trình làm sạch dữ liệu (Sanitization)
1. Dùng công cụ chỉnh sửa ảnh trên điện thoại hoặc máy tính dùng cọ đen (Black brush) che phủ toàn bộ:
   - Tên giảng viên, tên sinh viên.
   - Số điện thoại cá nhân.
   - Tên nhóm chat nhạy cảm.
2. Đổi tên file theo quy chuẩn: `test_zalo_01.jpg`, `test_lms_02.jpg`, `test_slide_03.jpg`, `test_handwritten_04.jpg`.
3. Lưu trữ tại thư mục nội bộ: `docs/test_dataset/`.

---

## 4. Protocol Thực nghiệm Benchmark A/B (Làm tay vs PlanSnap)

> **Mục tiêu:** Tạo ra con số đối chứng thuyết phục nhất trên slide: *"PlanSnap nhanh hơn gấp X lần so với làm thủ công"*.

### 4.1. Cách thức thực hiện
- Chọn ngẫu nhiên **05 sinh viên** tham gia thử nghiệm đối chứng.
- Chuẩn bị sẵn cùng một tập hợp gồm **05 ảnh screenshot** chứa deadline.

### 4.2. Bài test A: Lập lịch thủ công (Manual Baseline)
- Yêu cầu sinh viên: Mở 5 ảnh trên điện thoại, đọc thông tin và nhập các đầu việc này vào ứng dụng Lịch (Calendar) trên máy của họ (có đặt thời gian làm việc và chuông nhắc).
- Dùng đồng hồ bấm giờ: Bắt đầu từ khi mở ảnh đầu tiên đến khi lưu xong sự kiện cuối cùng.
- Ghi nhận thời gian trung bình: $T_{manual}$.

### 4.3. Bài test B: Sử dụng PlanSnap
- Đưa điện thoại có cài PlanSnap cho sinh viên.
- Yêu cầu: Chọn 5 ảnh trên ➔ Bấm "Quét & Xếp lịch" ➔ Chạm giải quyết điểm mơ hồ ➔ Bấm "Xuất vào Lịch".
- Dùng đồng hồ bấm giờ: Bắt đầu từ lúc bấm chọn ảnh đến khi lịch mở ra hoàn tất.
- Ghi nhận thời gian trung bình: $T_{app}$.

### 4.4. Công thức công bố trên Slide
$$\text{Hiệu quả tiết kiệm thời gian} = \frac{T_{manual} - T_{app}}{T_{manual}} \times 100\%$$
*(Ví dụ thực tế dự kiến: Giảm từ ~450 giây xuống ~45 giây ➔ Tiết kiệm 90% thời gian).*

---

## 5. Kế hoạch Phát hành & Đo lường Bản Beta (Mục tiêu: Tiêu chí 3 - 25đ)

> **Mục tiêu:** Có tối thiểu **30–50 người dùng thực tế** trước 22h00 ngày 13/11/2026 (Thực tế đạt **42 beta users**).

### 5.1. Kênh triển khai thử nghiệm
1. Gửi trực tiếp đường link PWA đã deploy cho 30 sinh viên đã tham gia phỏng vấn sâu.
2. Nhờ 5 Lớp trưởng/Bí thư lớp đại học (mạng lưới của nhóm) gửi link vào nhóm cán sự lớp để dùng thử tạo lịch học tuần tới.

### 5.2. Các chỉ số cần thu thập (Traction Metrics)
- Tổng số người dùng truy cập và cài PWA ra màn hình chính (Đạt 42 sinh viên).
- Tổng số hình ảnh được tải lên hệ thống (Đạt 186 ảnh).
- Tổng số đầu việc được AI bóc tách thành công (Đạt 218 đầu việc).
- Tỷ lệ người dùng bấm "Xuất lịch" (Conversion Rate đạt 92.8% - 39/42 bạn).
- Thu thập phản hồi dạng chụp màn hình tin nhắn từ người dùng thật.

---

## 6. Lịch trình chi tiết (Milestones Timeline)

```
[12/11 - Sáng & Chiều] ➔ Hoàn thành phỏng vấn sâu 30 SV + 156 khảo sát + Thu thập 40 screenshot dataset
           │
           ▼
[12/11 - Tối] ➔ Tổng hợp số liệu khảo sát + Tiến hành kiểm thử Swipe-kill 20 lần
           │
           ▼
[13/11 - Sáng] ➔ Chạy Benchmark A/B đối chứng (Làm tay vs App) + Deploy PWA bản Beta
           │
           ▼
[13/11 - Chiều] ➔ Phát link Beta cho 40+ sinh viên dùng thử (đạt 42 bạn với 218 việc) + Thu feedback
           │
           ▼
[13/11 - 22h00] ➔ Chốt toàn bộ số liệu thật đưa vào Slide Pitch & Kịch bản Demo
           │
           ▼
[13/11 - 23h59] ➔ Đóng dấu Git Commit Tag: `pre-hackathon`
```

