# PlanSnap | Kế hoạch thi 14/11/2026

Phạm vi triển khai hiện hành chuyển sang tạo và cập nhật sự kiện trên lịch đích. Xem [PRD Task 01 Final](PlanSnap-Task-01-PRD-Final.md). Timeline và phân công thi bên dưới là bản kế hoạch ban đầu.

## Quyết định đề xuất

Giữ PlanSnap, tập trung vào sinh viên nhận deadline qua nhóm lớp và LMS. Làm một luồng mới trong sprint: từ ảnh thông báo đổi hạn, AI đề xuất sửa đúng đầu việc đã lưu, hiển thị hạn cũ → hạn mới và trích dẫn nguồn. Người dùng xác nhận rồi app xếp lại việc đó theo giờ rảnh. Giữ các việc khác và báo rõ khi hết chỗ trước hạn. Một thông báo đổi hạn cho một việc là đủ. Tạm gác đồng bộ Calendar, nhập thời khóa biểu, đa ngôn ngữ và thiết kế lại giao diện.

Ca demo: lưu sẵn bài Báo cáo môn X và một việc khác trên bản thi. Đóng app, mở bằng icon, chọn ảnh mới của thông báo dời hạn có quyền sử dụng. AI đọc ảnh live, nhận ra bài Báo cáo môn X và đưa dòng trích. Người demo xác nhận, xem lịch mới hoặc trạng thái thiếu giờ. Đóng mở lần nữa để kiểm việc đã cập nhật và việc còn lại. Có thể chuẩn bị ảnh demo để kiểm soát thời lượng, nhưng ảnh phải được gửi mới cho AI trực tiếp.

## Thể lệ và bằng chứng

- [Luma đúng đợt 14/11](https://luma.com/l0ro71hq), chủ đề AI trong lòng bàn tay. Dùng Codex có ý nghĩa, xây luồng mobile và AI trong sự kiện, khai báo phần có trước và trình diễn phần mới đáng kể, có quyền sử dụng code, dữ liệu và media. Lịch dự kiến ICT 11:00–16:00 build, 16:00 nộp, 16:15 bắt đầu pitch 5 phút/đội, đối chiếu giờ cuối trong email BTC.
- [Luma link ban đầu](https://luma.com/h16o7bq4) thuộc đợt 27/06. Áp dụng rubric 40/35/25 đội cung cấp cho kế hoạch. Ưu tiên khi hòa là 40 → 35 → 25. Luma đợt tháng 11 có nhắc giả lập trong mô tả chung, còn mức 40 của rubric cần điện thoại thật. Luma chưa nói rõ PWA cài standalone có được tính. Lực xác nhận tại bàn BTC đồng thời Cường thử bản cài được.
- 40 điểm: chạy bản cài trên điện thoại thật, đóng hẳn, mở bằng icon và gửi ảnh mới cho AI live. Trước nộp chạy 3 lượt liên tiếp trên máy chính, thử 1 lượt trên máy dự phòng nếu có. Ghi commit/build, máy/OS, hình thức cài, mạng, thời gian bấm → thấy đề xuất và thực đạt. APK nếu công cụ sẵn và cài được sớm. PWA standalone qua HTTPS nếu BTC chấp nhận và đã chạy. Chuẩn bị hotspot, ảnh hợp lệ và thông tin cấu hình API trên máy. Preset chỉ dùng để diễn tập.
- 35 điểm: Vũ lấy bằng chứng từ 3–5 sinh viên đúng nhóm mục tiêu nếu tuyển được. Mỗi ca ghi nguồn deadline đã ẩn thông tin cá nhân và được đồng ý, vấn đề đã xảy ra, trích dẫn và kết quả thao tác. Làm bài đối chứng cùng người và độ khó tương đương: cập nhật deadline và lịch theo cách hiện tại so với PlanSnap, ghi thời gian và lỗi/đúng, báo số người thực đo và ghi rõ giới hạn mẫu nhỏ. Ưu tiên 1 ca đầy đủ hơn số lượng lớn thiếu dữ liệu gốc.
- 25 điểm: Minh tiếp cận qua lớp trưởng/CLB ở một trường trước, mời 10 người từ một nhóm lớp đang dùng Zalo. Đo người thử đã xác nhận được việc từ ảnh đầu tiên và số quay lại quét ảnh thứ hai trong 7 ngày. Đây là mục tiêu pilot. Sau khi có tín hiệu, lặp ở trường thứ hai, rồi thử luồng tương tự cho nhóm sinh viên quốc tế dùng WhatsApp, Discord hoặc Canvas, kiểm ngôn ngữ, kiểu ngày và múi giờ. Sản phẩm nhận ảnh người dùng chọn nên có thể kiểm từng nguồn mà chưa cần tích hợp với từng nền tảng. Chỉ gọi là traction khi có dữ liệu sử dụng truy được.
- Tài liệu 09 và slide nêu 30 phỏng vấn, 156 khảo sát, 42 beta users, 218 việc. Checkout có bảng tổng hợp, chưa thấy export khảo sát, bản ghi có thể kiểm tra, log beta hoặc tập ảnh gốc đi kèm. Xác thực bằng bản gốc và quyền dùng trước khi đưa các số này vào pitch.

## Ai làm gì

| Người | Phần phụ trách | Kết quả cần giao |
|---|---|---|
| Cường | Tech lead, UI duyệt, lưu gộp, scheduler, bản cài và nhánh tích hợp. | App mở lại được trên máy thật. Áp dụng cập nhật đúng việc, không ghi đè việc khác, không tạo phiên sau hạn. Nếu không thể giữ đệm 3 giờ theo PRD thì hiển thị trạng thái thiếu giờ thay vì âm thầm tạo phiên. |
| Vũ | Dữ liệu và kiểm chất lượng AI. Chủ trì bộ ca ảnh và kết quả đúng mong đợi, làm việc với Cường về hợp đồng output. Có thể sửa prompt/test trên nhánh riêng nếu Cường chốt ranh giới file. CV có kinh nghiệm khảo sát/BA, Gemini, Python và kiểm kết quả theo log. | 3–5 ảnh có quyền dùng, gồm đổi hạn rõ, ảnh mơ hồ và ảnh không khớp. Mỗi ca có kết quả thực đo. |
| Lực | PM/PRD, đầu mối BTC, chốt phần có trước/phần mới, điều phối giờ, gom hồ sơ nộp và dẫn demo. | Hình thức app đã xác nhận khi có phản hồi BTC, baseline và diff trình bày được, hồ sơ nộp đúng giờ. |
| Minh | Tuyển người dùng mục tiêu, thử máy và mạng dự phòng, sở hữu câu chuyện tiếp cận thị trường. Đây là vai trò đề xuất vì chưa có hồ sơ kỹ năng cụ thể. | Có ít nhất một đầu mối tiếp cận cụ thể nếu kết nối được, số bài test thực và kế hoạch pilot 7 ngày. |

Nhánh đề xuất: nhánh tích hợp `codex/hackathon-demo`, Cường tách `codex/deadline-update` khi cần, Vũ dùng `codex/vision-eval` nếu sửa code. Cường review và tích hợp. Ghi SHA lúc bắt đầu, giờ đầu/cuối theo ICT và SHA nộp. Dùng Codex để bóc tách việc, triển khai hoặc kiểm thử có bằng chứng từ diff và kết quả test. Giữ CV và ảnh người dùng ngoài commit.

## Trình tự theo giờ ICT

| Giờ dự kiến | Điểm kiểm tra |
|---|---|
| 11:00–12:20 | Chụp baseline. Tìm đường cài và chạy một lượt scan live trên máy thật. Song song Lực xác nhận thể lệ, Minh tuyển người thử, Vũ chuẩn bị ca đổi hạn. Nếu giờ thực đã qua phần đầu, làm các việc này ngay. |
| 12:20–13:45 | Nối luồng AI nhận thông báo → ứng viên việc → xác nhận → cập nhật lưu bền → lịch mới. Ưu tiên một ảnh và một việc. Nếu không có ứng viên rõ hoặc có từ hai ứng viên, hỏi người dùng chọn thay vì tự ghi. |
| 13:45–14:45 | Kiểm luồng mới trên thiết bị thật và chạy đối chứng với người dùng. Thử đóng mở, Wi-Fi/hotspot, thiếu giờ, ảnh mơ hồ và bảo toàn việc cũ. |
| 14:45–15:30 | Sửa lỗi có thể làm hỏng demo và chạy lại. Chốt 1 ca demo chính. Nếu tự ghép chưa ổn, dùng luồng chọn 1 việc rồi để AI đọc thông báo và đề xuất sửa hạn có nguồn. |
| 15:30–16:00 | Chốt bản cài đã kiểm, khóa SHA, nộp demo và khai báo phần mới. Tổng duyệt 5 phút: 40 giây vấn đề, 2 phút demo live, 1 phút kết quả thật, 50 giây pilot toàn cầu và phần mới, 30 giây đệm. |

## Checkpoint và cách nối lại

- Workspace `C:/Users/Admin/Projects/plansnap-codex-hackathon`. Baseline quan sát `main @ 8780158`, cùng SHA với ref `origin/main` cục bộ, commit ghi 08:27 ICT ngày thi. Tài liệu PRD Markdown là bản đọc kỹ thuật đã dùng. Tài liệu hiện hành trong repo: rubric (00), PRD (01), WBS (08), bằng chứng (09) và APK (10).
- Đã đọc Luma, các phần PRD/WBS liên quan, mã lõi và CV Vũ. Kiểm tra cú pháp 7 file JavaScript, 2 cấu hình JSON và `serve.py` đều qua. Smoke test scheduler qua cho slot hợp lệ và loại hạn chưa xác nhận. Đã tái hiện trường hợp có phiên sau hạn. Code lần scan mới đang thay toàn bộ danh sách, luồng ảnh thật cần khóa Gemini, mock áp dụng cho preset khi thiếu khóa. IndexedDB đã nối; lúc mở lại lịch được tính lại từ đầu việc lưu. Chưa có `android/`, package manifest hay APK trong checkout. URL Pages trong repo chưa truy cập xác minh được từ công cụ web.
- Mục tiêu lập kế hoạch và phân công đã hoàn tất. Việc thi còn mở: BTC duyệt loại cài, cài bản thật, chạy AI trực tiếp trên máy và xác thực số liệu gốc. Chưa sửa code, chưa tạo nhánh, chưa commit/push. CV có trong checkout dưới dạng file chưa được Git theo dõi.
- Đọc tiếp: checkpoint này, `app/js/app.js` (runExtraction/loadPersistedState), `app/js/vision-agent.js`, `app/js/scheduler.js`, `docs/00_Thang_diem_BTC.md`. Đối chiếu Git và thiết bị thật. Việc đầu tiên là Lực xác nhận loại bản cài được chấm, Cường chạy ảnh live trên máy thật và ghi kết quả để chọn đường demo.
