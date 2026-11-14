# Prompt giao Antigravity | PlanSnap

Copy toàn bộ nội dung bên dưới và đính kèm [PlanSnap-Hackathon-Handoff.md](PlanSnap-Hackathon-Handoff.md). Nếu Antigravity có quyền đọc repo, cho đọc nhánh dev và các tệp được chỉ định. Dùng prompt thiết kế nhận diện riêng nếu cần làm logo trước slide.

## Prompt A · Thiết kế logo và bộ nhận diện

Bạn là designer phụ trách PlanSnap của đội technoComplex. Đây là app Android giúp sinh viên chọn ảnh thông báo, để AI đọc đầu việc và hạn, rồi chuyển thành lịch làm việc. Câu thương hiệu chính: “Từ ảnh thông báo đến lịch làm việc.” Wordmark viết đúng PlanSnap.

1. Xem app Expo tại `mobile/src/theme.ts`, `mobile/app.json` và `mobile/assets/` trên nhánh dev. Nếu thiếu ảnh màn hình, dùng ảnh chụp APK do đội cấp sau buổi test. Dùng app hiện tại làm nguồn màu và nhịp thị giác.
2. Đề xuất ba phương án biểu tượng. Hướng ưu tiên là **khung chụp tối giản ôm một ô ngày**. Có thể thử hình tờ ảnh thu gọn vào một mục lịch hoặc chữ P tạo bởi khung chụp và một dấu mốc. Mỗi phương án dùng một silhouette rõ, đọc được ở 24px. Tránh ghép nhiều biểu tượng, tia sáng AI, robot, chữ nhỏ, thu nhỏ wordmark vào icon và hình tương tự icon thương hiệu khác.
3. Chọn một biểu tượng chính và trình bày lý do trong hai câu, kèm mẫu ở 24/48px, nền sáng/tối và bản đơn sắc. Không cần đợi phản hồi để đưa phương án đề xuất. Định hướng sạch, rõ, thao tác nhanh, phù hợp sinh viên và vẫn đủ nghiêm túc cho BGK. Ưu tiên hình học phẳng, khoảng âm rõ, tương phản tốt.
4. Dùng bảng màu theo app. Nền `#F5F5F7`, surface `#FFFFFF`, chữ `#111827`, chữ phụ `#4B5563`, thương hiệu `#2563EB`, hover `#1D4ED8`, nền nhạt `#EFF6FF`. Xanh lá `#059669` cho đã xác nhận, hổ phách `#D97706` cho cần kiểm lại, đỏ `#DC2626` cho lỗi. Đừng dùng mỗi màu để báo trạng thái. Font chính **Be Vietnam Pro** theo app và bảo toàn dấu tiếng Việt.
5. Bàn giao logo mark, wordmark ngang, bản đơn sắc, PNG 1024 và SVG nếu công cụ hỗ trợ; Android adaptive icon gồm foreground có vùng an toàn, background và monochrome riêng. Thêm một trang quy định màu, kiểu chữ, khoảng trống, kích thước tối thiểu và hai ví dụ ứng dụng trên màn mở app và pitch cover. Đối chiếu đường dẫn asset và crop trong `mobile/app.json` trước khi chuyển cho Cường. Chuyển file thiết kế vào thư mục bàn giao; Cường sẽ tích hợp đồng bộ theo build chốt.

## Prompt B · Dựng pitch từ nội dung đã duyệt

Bạn là designer làm pitch 5 phút cho Hackathon. Đọc **PlanSnap-Hackathon-Handoff.md** từ đầu đến cuối. Phần 1 là câu trả lời form BTC, phần 2 là thứ tự và nhịp kể, phần 3 là bảng số liệu và logic chứng minh, phần 4 là các xác nhận trước khi nộp. Dùng bộ nhận diện Prompt A.

- Dựng 5 khung chính theo thứ tự: Mở với vấn đề → Người dùng và bằng chứng → Demo Android thật → Người dùng đầu tiên → Free/Pro và phần làm trong ngày. Thêm phụ lục ngắn P&L, Userbase, Monet/ROAS và ranh giới build. Cho mỗi khung một câu kết luận dễ nói, phần chi tiết vào speaker notes. Chừa hơn 2 phút cho demo live.
- Thiết kế 16:9, chữ dễ đọc từ xa, dùng màu và Be Vietnam Pro như APK. Ít chữ và khoảng thở rõ. Ưu tiên ảnh input có quyền sử dụng và ảnh màn hình APK thật. Nếu chưa có asset, để khung chờ có nội dung cụ thể, không dựng mockup dễ bị hiểu là giao diện đã triển khai.
- Màn bằng chứng dùng nhãn “Nghiên cứu công khai” và mẫu số, ghi tên nguồn nhỏ nhưng đọc được. Thêm dữ liệu thử nghiệm của đội chỉ khi có bằng chứng và quyền dùng. Không lấy số beta hoặc khảo sát chưa xác minh. Các ảnh công khai minh họa đầu vào, không dùng để kết luận về nhu cầu.
- Userbase lấy cấu trúc báo cáo Tongits US/Dummy TH của Minh: phễu 100 → 60 → 40 có nhãn Mục tiêu M1; D1/D7/D28 trình bày trên trục chung, ghi rõ cohort. Monet dùng hai thẻ Free/Pro cạnh chỉ số số người trả tiền, PayRate, ARPPU và MRR. P&L dùng bảng M1/M3/M6 hoặc waterfall M6. ROAS N/A khi chưa chi, ví dụ 156% phải gắn nhãn minh họa và cùng cửa sổ D28. Không đưa số liệu nội bộ ZingPlay/VNG lên deck.
- Gắn nhãn “Mục tiêu”, “Dự phóng” hoặc “Đã đo” cạnh số và tránh trộn trên cùng thang. Dùng đầy đủ đơn vị VND/đ và tên kỳ. Nêu nguy cơ scale: M6 cần 32 nhóm mới/tháng theo giả định, chỉ mở rộng khi kênh sinh viên lặp được, retention thực đủ mẫu và có thanh toán thật. Giữ kịch bản tiếng Anh làm bước thử thị trường kế tiếp.
- Màn demo khai báo đúng bản đã kiểm trên Android. Phạm vi hiện đã đọc là quét ảnh Gemini live, hỏi lại, xếp lịch trong PlanSnap và chia sẻ .ics. Chỉ mô tả cập nhật event ngoài app và OAuth nếu Cường xác nhận APK mới có và chạy đúng. Không gọi preset AI live. Phần build trong ngày bám commit của bản APK. Chỗ chưa có thì giữ placeholder rõ, không tự tạo link, kết quả test hay câu trích người dùng.
- Bàn giao deck có speaker notes, file nguồn thiết kế và danh sách các chỗ đang chờ ảnh thực tế, link APK/video hoặc số liệu. Rà số liệu, tương phản, chữ Việt có dấu và vùng an toàn trước khi gửi. Giữ tổng lời khoảng 5 phút tính cả thao tác thật.
