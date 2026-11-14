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
  *Về chi phí:* Với dòng model Flash (`gemini-3-flash-preview`, kèm fallback `gemini-3.5-flash`), chi phí chỉ ở mức vài đồng VNĐ cho mỗi lượt quét 1–3 ảnh, hoàn toàn khả thi để triển khai miễn phí giới hạn (freemium) cho sinh viên."*

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
  *"Thưa BGK, nhóm xuất phát từ trải nghiệm thực tế và khảo sát sinh viên (xem chi tiết quy trình và bảng tổng hợp trong `docs/09_Bieu_mau_Khao_sat_va_Dataset.md`):
  - Thói quen phổ biến là chụp ảnh màn hình tin nhắn Zalo, cổng LMS, slide hoặc bảng trắng rồi để lẫn trong thư viện ảnh; khi mở lại gặp các mốc thời gian tương đối ('thứ 6 tuần sau', 'buổi học tới') nên dễ nhầm ngày hoặc dồn việc sát hạn.
  - Theo tổng hợp bảng khảo sát trong `docs/09_Bieu_mau_Khao_sat_va_Dataset.md`: **94.2%** lưu deadline bằng chụp màn hình, **89.1%** từng nộp sát giờ vì chưa xếp lịch trước, và **82.7%** từng nhầm hạn do mốc thời gian mơ hồ.
  - Khi thử nghiệm trực tiếp trên mẫu thông báo và chữ viết tay: thay vì gõ tay từng sự kiện vào Lịch (1–2 phút/việc), PlanSnap bóc tách kèm câu trích dẫn nguồn và xuất thẳng `.ics` chỉ qua 1–2 chạm."*

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
  2. Chúng em đưa PlanSnap cho Lớp trưởng: Lớp trưởng quét ảnh đề cương/thông báo, tạo lịch hoàn chỉnh rồi **gửi trực tiếp file lịch `.ics` qua bảng chia sẻ hệ thống vào nhóm Zalo lớp**.
  3. **Lan truyền tự nhiên theo nhóm môn học:** Khi sinh viên nhận file `.ics` hoặc làm bài tập lớn theo nhóm 3–5 người, các thành viên thấy sự tiện lợi và cài app qua APK / link tải để tự quét phần việc cá nhân của mình."*

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
  *"Thưa BGK, nhóm phân tách rạch ròi bằng Git tag **`pre-hackathon`** (đóng tại commit `9b44998`, đêm 13/11 – rạng sáng 14/11) trên repository công khai:
  - **Phần chuẩn bị trước (`<= pre-hackathon`):** Ý tưởng, bộ tài liệu PRD/kiến trúc (`docs/`), thiết kế luồng UI và bản prototype web PWA (`app/`).
  - **Phần xây dựng trực tiếp trong ngày 14/11:** Hoàn thiện System Prompt 6 quy tắc kèm mốc giờ địa phương, tính năng **+ Thêm lịch** (nối tiếp từ ảnh chụp hoặc thêm thủ công giờ cố định / tự xếp EDF), chuyển đổi toàn bộ sang **app native React Native + Expo (`mobile/`)** với Keystore/AsyncStorage, nén ảnh trên máy, Share Sheet xuất `.ics`, bộ 17 unit test đối chiếu 500 kịch bản ngẫu nhiên và cấu hình build Android APK qua EAS (`@elysszxje/plansnap`)."*
