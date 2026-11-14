# BỘ CÂU HỎI & TRẢ LỜI CHẤT VẤN CỦA BAN GIÁM KHẢO (JUDGE Q&A DEFENSE BIBLE)
**Kịch bản phòng thủ và phản biện xuất sắc trong 3–5 phút Q&A tại Hackathon**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội thi** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Mục đích** | Chuẩn bị sẵn câu trả lời sắc bén, logic và có số liệu cho mọi câu hỏi hóc búa của BGK |
| **Chiến lược** | Mọi câu trả lời đều dẫn về: **Bằng chứng thực tế + Kiến trúc kỹ thuật vượt trội + Thang điểm BTC** |

---

## 1. Nhóm câu hỏi về Kỹ thuật & Công nghệ (Tiêu chí 1: 40 Điểm)

### Câu hỏi 1: "Bản beta là web app, sao hôm nay lại là app native? Các bạn dùng công nghệ gì?"
* **Trả lời sắc bén của Speaker:**  
  *"Thưa Ban Giám khảo, nhóm đi theo 2 giai đoạn có chủ đích:**
  1. **Trước ngày thi – web app (PWA) để có người dùng nhanh:** Sinh viên dùng thử chỉ qua 1 đường link trong nhóm Zalo lớp, không phải chờ duyệt App Store. Nhờ đó nhóm có dữ liệu beta trước ngày hôm nay.
  2. **Ngày thi – app native React Native + Expo:** Hôm nay nhóm chuyển toàn bộ tính năng sang app native, build thành file APK cài trực tiếp lên Android. App mở từ icon, dữ liệu lưu cục bộ trên máy nên vuốt tắt rồi mở lại vẫn còn nguyên; API key nằm trong kho bảo mật Keystore.
  3. **Một mã nguồn cho cả Android, iOS và web:** Mở rộng sang iOS chỉ cần build và phát hành, không phải viết lại."*

---

### Câu hỏi 2: "Tại sao phải dùng Vision LLM đắt tiền mà không dùng OCR truyền thống (như Tesseract) kết hợp Regex?"
* **Trả lời sắc bén của Speaker:**  
  *"OCR truyền thống và Regex hoàn toàn bó tay trước bài toán này vì 3 rào cản ngữ cảnh:**
  1. **Tem thời gian tương đối:** Khi giảng viên nhắn 'thứ 6 tuần sau nộp', OCR chỉ đọc được chữ 'thứ 6 tuần sau', nhưng không biết là ngày nào. Vision LLM có khả năng liên kết tem thời gian gửi tin nhắn Zalo (ví dụ: 'Hôm qua lúc 16:45') với câu nói để suy luận ra ngày tuyệt đối.
  2. **Cấu trúc lộn xộn:** Slide bài giảng, ảnh bảng trắng họp nhóm và chữ viết tay không có định dạng cố định để viết Regex.
  3. **Phát hiện sự mơ hồ:** Chỉ có LLM mới đánh giá được mức độ tin cậy để kích hoạt thẻ hỏi lại 1-chạm (Human-in-the-Loop) khi deadline không rõ ràng.  
  *Về chi phí:* Với Gemini 2.5 Flash, chi phí chỉ khoảng $0.0003 cho 3 ảnh (chưa tới 10 đồng VNĐ), hoàn toàn khả thi về mặt kinh tế."*

---

### Câu hỏi 3: "Tại sao các bạn không để AI tự xếp luôn lịch làm việc mà lại dùng thuật toán Code thuần?"
* **Trả lời sắc bén của Speaker:**  
  *"Đây chính là quyết định kiến trúc cốt tử giúp PlanSnap không bao giờ bị lỗi ảo giác (Zero Hallucination):**
  - LLM rất giỏi về nhận diện thị giác và hiểu ngữ cảnh tiếng Việt, nhưng lại rất yếu về tính toán số học thời gian và kiểm tra va chạm khung giờ (Slot Collision).
  - Nếu để LLM xếp lịch, lịch thường bị trùng giờ học, không bảo đảm đúng buffer 3 tiếng, hoặc xếp việc vào lúc nửa đêm.
  - PlanSnap áp dụng mô hình **Hybrid AI Agent**: AI đóng vai trò 'Mắt thần' trích xuất dữ liệu sạch, còn **Thuật toán Code thuần Earliest Deadline First (EDF)** đảm nhận xếp lịch. Cách này bảo đảm lịch chính xác 100%, thời gian xếp < 5ms và giải thích minh bạch được với BGK."*

---

### Câu hỏi 4: "Nếu tại hội trường bị mất sóng 4G hoàn toàn thì ứng dụng có chạy được không?"
* **Trả lời sắc bén của Speaker:**  
  *"Nhóm đã chuẩn bị sẵn kịch bản phòng thủ đa tầng:**
  1. Đội mang theo **02 bộ phát Wi-Fi 4G độc lập** của 2 nhà mạng khác nhau (Viettel và VinaPhone), chuyển đổi chỉ mất 2 giây.
  2. Khi mất mạng, app vẫn mở bình thường và giữ nguyên toàn bộ đầu việc, lịch đã lưu trên máy; chỉ bước AI đọc ảnh cần mạng. Nhóm không thay bằng kết quả soạn sẵn hay video, mà chuyển mạng rồi bấm thử lại."*

---

## 2. Nhóm câu hỏi về Vấn đề Người dùng & Bằng chứng (Tiêu chí 2: 35 Điểm)

### Câu hỏi 5: "Làm sao các bạn chứng minh sinh viên thật sự có nhu cầu này chứ không phải do nhóm tự nghĩ ra?"
* **Trả lời sắc bén của Speaker:**  
  *"Thưa BGK, nhóm không suy đoán mà đã đi khảo sát thực tế với **30 sinh viên phỏng vấn sâu 1-on-1** tại 6 trường ĐH lớn ở Hà Nội (Bách Khoa, Kinh tế Quốc dân, Ngoại thương, Quốc gia, Học viện Ngân hàng, Thương mại) cùng **156 sinh viên tham gia khảo sát định lượng diện rộng** vào ngày 12/11 vừa qua:**
  - **100%** sinh viên thừa nhận họ lưu trữ deadline bằng cách chụp ảnh màn hình.
  - Trung bình mỗi sinh viên có **35.2 ảnh screenshot chứa deadline** nằm lẫn lộn trong thư viện ảnh mỗi tháng (nhóm đã trực tiếp kiểm tra hơn 1.000 bức ảnh thư viện của sinh viên).
  - **96.7%** từng nộp bài sát giờ (< 2 tiếng trước hạn) vì không biết khi nào cần bắt đầu làm.
  - **86.7%** từng nhầm hạn hoặc bỏ sót bài do các mốc thời gian mơ hồ ('thứ 6 tuần sau', 'buổi học tới').
  - Đã có **42 sinh viên dùng thử bản Beta thực tế**, bóc tách **218 đầu việc** với tỷ lệ duyệt lịch đạt **92.8%**.
  - Trong thử nghiệm đối chứng Benchmark A/B với 5 bạn: Nhập tay mất **7 phút 45 giây**, dùng PlanSnap chỉ mất **48 giây** (nhanh hơn gấp 9.7 lần). Toàn bộ số liệu và trích dẫn nguyên văn được lưu trong tài liệu `docs/09_Bieu_mau_Khao_sat_va_Dataset.md` của nhóm."*

---

### Câu hỏi 6: "Tại sao sinh viên không tự dùng Google Calendar hay Notion để lên lịch?"
* **Trả lời sắc bén của Speaker:**  
  *"Google Calendar và Notion là công cụ quản lý lịch tuyệt vời, nhưng chúng đòi hỏi **rào cản nhập liệu thủ công quá lớn**:**
  - Sinh viên phải mở ảnh, đọc tin nhắn, chuyển sang app Calendar, gõ tên việc, chọn ngày, chọn giờ bắt đầu, giờ kết thúc, đặt chuông nhắc. Quy trình này mất 1–2 phút cho mỗi bài tập.
  - Vì lười nhập liệu, sinh viên chọn cách nhớ trong đầu hoặc ghim tin nhắn ➔ dẫn đến quên việc hoặc làm sát hạn.
  - PlanSnap **không thay thế Google Calendar**, mà là **chiếc phễu đầu vào (Input Funnel)**: Biến ảnh chụp thành lịch trong 48 giây, rồi xuất thẳng vào Google Calendar chỉ với 1 chạm."*

---

## 3. Nhóm câu hỏi về Mở rộng Thị trường & Kinh doanh (Tiêu chí 3: 25 Điểm)

### Câu hỏi 7: "Làm thế nào các bạn tiếp cận 1.000 sinh viên đầu tiên mà không tốn tiền quảng cáo?"
* **Trả lời sắc bén của Speaker:**  
  *"Nhóm tiếp cận chính xác qua **Kênh Lớp trưởng và Ban Cán Sự Lớp**:**
  1. Lớp trưởng là người nhận thông báo từ giảng viên và đăng vào nhóm Zalo lớp. Họ chịu áp lực lớn nhất khi cả lớp quên nộp bài tập lớn.
  2. Chúng em đưa PlanSnap cho Lớp trưởng: Lớp trưởng quét ảnh đề cương, tạo kế hoạch mẫu và chia sẻ đường link lịch cho cả lớp.
  3. **Vòng lan truyền (Viral Loop):** Khi một sinh viên bóc tách deadline bài tập nhóm, bạn ấy chia sẻ link kế hoạch cho 4 bạn cùng nhóm để phân chia tiến độ. 4 bạn này mở link và tải app về máy. Đây là kênh phân phối 0 đồng với hệ số lan truyền tự nhiên K-factor > 1."*

---

### Câu hỏi 8: "Lộ trình mở rộng ra toàn cầu của các bạn là gì khi thị trường mỗi nước mỗi khác?"
* **Trả lời sắc bén của Speaker:**  
  *"Lộ trình mở rộng của PlanSnap gồm 3 bước dựa trên lợi thế công nghệ:**
  - **Giai đoạn 1:** 5.000 sinh viên tại Hà Nội (tối ưu hóa với Zalo và cổng LMS trường).
  - **Giai đoạn 2:** Mở rộng ra toàn quốc và đối tượng Người mới đi làm (bóc tách biên bản họp, ảnh bảng Kanban).
  - **Giai đoạn 3 (Toàn cầu):** Mở rộng sang Đông Nam Á (Thái Lan, Indonesia, Philippines) – những quốc gia có cùng thói quen giao việc qua Line/WhatsApp/Telegram và ảnh chụp tương tự Việt Nam.
  - **Lợi thế cốt lõi:** Mô hình Vision LLM đã hỗ trợ đa ngôn ngữ bẩm sinh. Khi mở rộng quốc tế, nhóm không cần train lại model, mà chỉ cần cấu hình ngôn ngữ hiển thị và định dạng ngày tháng cục bộ. Chi phí kỹ thuật biên gần như bằng 0."*

---

## 4. Nhóm câu hỏi về Quyền riêng tư & Bảo mật dữ liệu

### Câu hỏi 9: "Ảnh chụp màn hình tin nhắn Zalo của sinh viên có bị lộ thông tin cá nhân lên server của bạn không?"
* **Trả lời sắc bén của Speaker:**  
  *"PlanSnap được xây dựng theo nguyên tắc **Privacy by Design & Local-first**:**
  1. Ảnh được nén ngay trên điện thoại rồi gửi thẳng tới Gemini API của Google qua HTTPS để đọc; **nhóm không vận hành máy chủ riêng nên không lưu bất kỳ ảnh nào**.
  2. Toàn bộ kế hoạch học tập, khung giờ rảnh và dữ liệu cá nhân chỉ lưu cục bộ trên chính điện thoại của người dùng; API key nằm trong kho bảo mật Keychain/Keystore của máy.
  3. Ứng dụng không yêu cầu đăng ký tài khoản, không thu thập số điện thoại hay email, bảo đảm an toàn quyền riêng tư 100%."*

---

## 5. Nhóm câu hỏi về Tính minh bạch Hackathon

### Câu hỏi 10: "Phần nào các bạn đã làm trước, và phần nào các bạn làm trong ngày hôm nay tại Hackathon?"
* **Trả lời sắc bén của Speaker:**  
  *"Thưa BGK, nhóm tuân thủ tuyệt đối quy định của BTC và đã đóng dấu commit tag `pre-hackathon` trên Git repository trước ngày 14/11:
  - **Phần chuẩn bị trước (Đã gắn Git Tag):** Khảo sát 30 sinh viên phỏng vấn sâu 1-on-1 và 156 sinh viên khảo sát diện rộng, thu thập bộ test 40 screenshot che PII, dựng bản web app PWA và bản thử nghiệm Beta với 42 người dùng thực tế (218 đầu việc).
  - **Phần phát triển trực tiếp tại sự kiện:** Chuyển toàn bộ ứng dụng sang app native React Native + Expo và build APK, tối ưu độ trễ và tích hợp kịch bản demo chụp chữ viết tay của BGK."*
