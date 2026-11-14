# PlanSnap | Pain point, thị trường và P&L 6 tháng

Cập nhật 14/11/2026, giờ Việt Nam. M1, M3 và M6 tính từ khi mở pilot. Kế hoạch dựa trên checkout quan sát `main @ 8780158` và [kế hoạch hackathon](PlanSnap-Hackathon-Plan.md). Số trong kế hoạch là giả định hoặc ngưỡng quyết định, ngoại trừ dữ kiện có nguồn.

Kịch bản sản phẩm hiện hành là ảnh → tạo/cập nhật sự kiện trên lịch đích. [PRD Task 01](PlanSnap-Task-01-PRD-Final.md) quy định phần bàn giao. Các nhận định về xếp phiên làm trong nghiên cứu áp dụng cho hướng mở rộng sau đó.

## 1. Pain point có thể trình bày

**Người dùng đầu tiên:** Sinh viên Hà Nội đang học nhiều môn hoặc làm bài nhóm, theo dõi bài tập trên hệ thống quản lý học tập của trường (LMS) và trong nhóm lớp. Tuyển ban đầu qua lớp trưởng hoặc ban học thuật của CLB, ưu tiên nơi đội có người giới thiệu. Chưa có trường hay CLB xác nhận tham gia.

**Khó khăn:** Khi bài tập được giao trên LMS nhưng hạn chót được xác nhận hoặc đổi trong nhóm lớp, sinh viên phải tìm lại thông báo mới nhất, xác định nó thuộc đầu việc nào, sửa hạn trong danh sách và dời giờ làm. Pain point cần đo là công sức đối chiếu và nguy cơ làm theo hạn cũ. Người chưa thấy thông báo nằm ngoài khả năng của luồng chọn ảnh hiện tại.

**Giá trị AI cần chứng minh:** Từ ảnh do sinh viên chọn, trích việc, hạn và dòng thông báo làm bằng chứng. Với hạn tương đối hoặc nhiều việc có thể khớp, yêu cầu người dùng xác nhận. Sau xác nhận, tạo hoặc cập nhật đúng sự kiện trên lịch đích. Đo thời gian từ ảnh đến lúc lưu đúng sự kiện và số lần phải sửa. Checkout hiện tại có chế độ xuất lịch thủ công; Task 01 sẽ bổ sung ghi và cập nhật trực tiếp.

| Mã | Bằng chứng truy được | Hàm ý và phạm vi |
|---|---|---|
| E1 | Le & Saito (2026), 15 phỏng vấn bán cấu trúc với sinh viên và người mới tốt nghiệp trong bối cảnh đại học công lập Việt Nam. Phần Abstract ghi nhận người học dùng nền tảng chính thức khi cần nguồn có thẩm quyền, kênh nhanh khi cần phản hồi, bản lưu cá nhân và mạng lưới bạn học khi thông tin thiếu rõ ràng. [Hồ sơ nghiên cứu Monash](https://research.monash.edu/en/publications/patchwork-lms-practices-student-coordination-across-fragmented-di/) | Bằng chứng Việt Nam sát nhất cho việc tự phối hợp giữa các kênh. Nghiên cứu định tính, không ước lượng tỷ lệ bỏ lỡ hạn hay nhu cầu trả tiền. |
| E2 | Trần Ngọc Minh (2026), 112 bảng hỏi và 8 phỏng vấn sinh viên năm cuối ngành tiếng Anh tại ĐH Thủ Dầu Một. Phần Abstract ghi nhận Zalo chủ yếu dùng để điều phối công việc và theo dõi, có áp lực theo kịp trao đổi. [Tạp chí ĐH Thủ Dầu Một](https://tdmujournal.vn/exploring-undergraduate-students-engagement-in-zalo-based-classroom-discussions-a-mixed-methods-study-of-english-majors-at-a-vietnamese-university-561-a25id.html) | Hỗ trợ chọn nhóm lớp Zalo làm nguồn ảnh và kênh tiếp cận. Mẫu thuộc một ngành tại một trường. |
| E3 | Phỏng vấn/thảo luận với 16 sinh viên y năm 3–5 tại ĐH Y Dược TP.HCM. Phần Results, Theme 2 ghi nhận sinh viên dùng Zalo hoặc email cho trao đổi học tập ngoài diễn đàn LMS. [Tạp chí Khoa học Sức khỏe ĐHQG TP.HCM](https://hs.vnuhcmjournal.com.vn/index.php/hs/article/view/608) | Thêm bằng chứng dùng song song kênh chính thức và nhắn tin. Mẫu riêng ở một trường ngành y. |
| E4 | Pathify và Thrive Analytics khảo sát 1.010 sinh viên Mỹ năm 2025. 47% tự báo từng lỡ một hạn quan trọng vì không biết đến hạn. Câu hỏi gồm cả bài tập, thanh toán, đăng ký. [Công bố của đơn vị khảo sát](https://pathify.com/news/new-survey-finds-fragmented-digital-systems-are-eroding-student-success-belonging-and-satisfaction-across-u-s-colleges-says-pathify/) | Tín hiệu ngoài Việt Nam. Khảo sát do nhà cung cấp nền tảng công bố. Phạm vi rộng hơn bài tập và không thể suy ra tỷ lệ cho Việt Nam. |
| E5 | Repo nêu 30 phỏng vấn, 156 khảo sát, 42 beta users, 218 đầu việc. Đã rà tài liệu 05/09 và danh mục file được Git theo dõi. Checkout có bảng tổng hợp và trích dẫn, chưa thấy bản xuất biểu mẫu, ghi chép gốc, bộ ảnh hay log beta để xác minh. [Tài liệu 09](C:/Users/Admin/Projects/plansnap-codex-hackathon/docs/09_Bieu_mau_Khao_sat_va_Dataset.md) | Nếu Lực có dữ liệu gốc, Vũ đối chiếu mẫu số, phương pháp, bản ghi và quyền công bố. Hiện chưa có số retention, trả tiền hay thử nghiệm người dùng độc lập của PlanSnap được xác minh. |

**Lấy bằng chứng riêng trong tháng đầu.** Phỏng vấn 12–15 sinh viên từ ít nhất hai lớp, tuyển cả người dùng lịch có sẵn và người thường chỉ lưu tin/ảnh. Hỏi trước khi giới thiệu app: “Lần gần nhất hạn được giao hoặc đổi ở đâu?”, “Bạn tìm lại và đổi kế hoạch bằng cách nào?”, “Có khi nào biết muộn hoặc dùng nhầm hạn trong 14 ngày qua, hậu quả gì?”. Hỏi cả trường hợp LMS hoặc nhắc lịch hiện tại đã đủ. Xin phép dùng ảnh đã che thông tin. Tuần đầu ưu tiên 3–5 ca có bằng chứng. Cuối tháng chạy tối thiểu 10 lượt đối chứng ghép cặp, đảo thứ tự cách làm tay/app trên hai bộ ảnh tương đương. Ghi thời gian từ khi có ảnh đến lịch được xác nhận, số việc/hạn đúng, số lần phải sửa và lỗi xếp sau hạn. Báo median thời gian, số ca đạt và mẫu số. Sau phỏng vấn, khảo sát định hướng ở hai lớp về số kênh, số lần đối chiếu hạn trong 14 ngày, cách lưu và hậu quả. Giữ nguyên mẫu số và giới hạn mẫu thuận tiện khi trình bày.

**Câu trình bày:** “Sinh viên phải tự ghép thông tin bài vở giữa LMS, nhóm chat và bản lưu cá nhân. PlanSnap lấy thông báo mà sinh viên chọn, chỉ ra việc nào đổi hạn và cập nhật lịch làm sau khi họ xác nhận.” Có thể thêm số liệu thử nghiệm sau khi thực đo.

## 2. Tiếp cận thị trường và gói bán thử

- Tháng đầu đi qua 2 nhóm lớp × khoảng 50 người. Dùng một ảnh minh họa, mời thử bằng ảnh của chính họ và gắn mã nhóm để đo nguồn. Kịch bản cơ sở M3 cần 8 nhóm mới/tháng, M6 cần 32 nhóm mới/tháng. M6 tương đương 8 đầu mối × 4 nhóm × 50 sinh viên tiếp cận mới/tháng. Đây là mục tiêu vận hành. Đo số người tiếp cận có bằng chứng, loại trùng và bỏ giả định 50 nếu thực tế khác. Tổng tiếp cận mới giả định 6 tháng là 4.000. Tổng số được kích hoạt mới là 1.600.
- Nếu hai đợt tại Việt Nam có quay lại và trả tiền, thử một cộng đồng sinh viên quốc tế dùng tiếng Anh. Kiểm ảnh thông báo WhatsApp/Discord và LMS, định dạng ngày và múi giờ bằng 20–30 người. Luồng nhận ảnh cho phép thử nhu cầu trước khi tích hợp tài khoản từng nền tảng. UNESCO ghi nhận 269 triệu người học giáo dục bậc cao toàn cầu năm 2024. Con số này chỉ mô tả quy mô nền. [UNESCO](https://www.unesco.org/en/articles/number-students-higher-education-more-doubled-20-years-inequalities-remain?f=prakharr2)
- MyStudyLife đã có planner miễn phí và gói trả tiền với AI, đồng bộ lịch. Semora đã đọc đề cương và kết nối nhiều LMS. Syncronos nhận ảnh Canvas và xây lịch học theo tuần. Cạnh tranh cần kiểm bằng dữ liệu tiếng Việt: từ ảnh nhóm lớp đến việc đúng, có nguồn, xử lý sửa hạn rõ ràng và ít thao tác hơn việc nhập tay hoặc dùng AI đa dụng. [MyStudyLife](https://mystudylife.com/msl-plus/) · [Semora](https://apps.apple.com/us/app/semora-ai-syllabus-planner/id6762589321) · [Syncronos](https://www.syncronos.app/)

| Gói | Giá và quyền sử dụng đề xuất | Khi nào thử |
|---|---|---|
| Free | 0đ, 5 lượt AI/tháng, xem và sửa việc/lịch đã lưu. Một lượt là một yêu cầu có tối đa 3 ảnh, chỉ trừ lượt khi có kết quả dùng được. | M1. Trải nghiệm ảnh đầu tiên không cần tự cấu hình khóa API. |
| Pro | 39.000đ/tháng, 50 lượt/tháng, xử lý ảnh mới và đổi hạn, thêm lịch sử thay đổi khi tính năng sẵn sàng. Quyền tạo/sửa sự kiện ở lịch đích dùng chung, giới hạn lượt là khác biệt đầu tiên. | Ưu tiên M3 nếu có quay lại. Test 29.000đ và 39.000đ với cùng quyền lợi trên các nhóm tương đương. Đo thanh toán thực hoặc đăng ký giữ chỗ, báo riêng hai loại. |
| Gói mùa thi | Giá thử 59.000đ/90 ngày, 90 lượt dùng một lần, không tự gia hạn. | Thử ở nhóm có nhu cầu theo đợt nhưng gia hạn yếu. Chưa cộng doanh thu vào P&L. Nếu thử bán, phân bổ doanh thu theo thời gian cung cấp dịch vụ, theo dõi tiền thu trước riêng. |
| Gói tài trợ | Một CLB hoặc đối tác trả cho 50 suất sử dụng trong một học kỳ. Chốt giá theo số suất kích hoạt, lượt thật và chi phí hỗ trợ sau thử nghiệm. | M6 nếu có một đầu mối chịu mua pilot. Chưa cộng doanh thu. |

## 3. Userbase, retention và mốc quyết định

Đếm theo ID người dùng giả danh bền vững, theo ngày ICT. Trong pilot cục bộ ID có thể là ID cài đặt. Ghi rõ giới hạn khi gỡ app hoặc đổi máy. Mốc và KPI dưới đây là giả thuyết để ra quyết định, chưa có kết quả thực đo.

| Chỉ số | Định nghĩa đo | M1 | M3 | M6 |
|---|---|---:|---:|---:|
| New users | Người dùng có lần mở hợp lệ đầu tiên trong kỳ, mỗi ID một lần | 60 | 240 | 960 |
| Kích hoạt mới | New user có ít nhất một lần tạo hoặc cập nhật sự kiện vào lịch thành công trong 7 ngày từ lần mở đầu | 40 | 160 | 640 |
| Active users | Người dùng có ≥1 sự kiện giá trị trong khoảng đo. Sự kiện giá trị là ghi lịch thành công hoặc chủ động mở chi tiết lịch đã lưu. Báo DAU theo ngày, WAU 7 ngày và MAU 30 ngày | 40 MAU | 204 MAU | 895 MAU |
| D1 | Cohort New users quay lại thực hiện sự kiện giá trị đúng ngày D0+1 | ≥20% | ≥25% | ≥30% |
| D7 | Cohort New users quay lại thực hiện sự kiện giá trị đúng ngày D0+7 | ≥12% | ≥15% | ≥18% |
| D28 | Cohort New users quay lại thực hiện sự kiện giá trị đúng ngày D0+28 | ≥5% | ≥8% | ≥10% |
| Paid/MRR | Thuê bao tháng tương đương và doanh thu thuê bao định kỳ gộp tại giá cơ sở | 0 / 0đ | 10 / 390.000đ | 72 / 2.808.000đ |

- D0 là ngày mở đầu. Retention tại Dn = số người trong cohort có sự kiện giá trị đúng ngày D0+n chia số người mới của cohort đã đủ thời gian quan sát. Dùng phân tích daily cohort chuẩn, theo nhóm tuyển và thời điểm học. Báo cả tử số/mẫu số. Nếu cohort cuối M1 chưa đủ 28 ngày thì ghi “chưa đủ dữ liệu”. Loại mở app tự động, traffic nội bộ/demo và xử lý preset. Đọc thêm tỷ lệ quay lại quét ảnh mới để phân biệt xem lịch đã lưu với tiếp tục dùng AI. [GA4 Cohort exploration](https://support.google.com/analytics/answer/9670133?hl=en)
- Base case giả định 60% số được tiếp cận có lượt mở đầu, 40% số tiếp cận kích hoạt tương đương 66,7% New users. MAU trong P&L dùng người mới kích hoạt và người hoạt động tháng trước quay lại, bỏ qua hiệu ứng cắt kỳ và người mở lịch giá trị trước khi có xác nhận ghi. Thay bằng MAU đo được khi có instrumentation. Giả định quay lại tháng liền kề 45% dùng cho P&L, có mẫu số và khoảng thời gian khác D28.
- Theo dõi thêm tỷ lệ tạo/sửa lịch thành công, lỗi sửa nhầm, median thời gian từ chọn ảnh đến lưu, tỷ lệ thanh toán trên người thấy giá, số gia hạn trên số thuê bao đến kỳ (mục tiêu thử ≥70%). Sự kiện cần ghi: `first_open`, `scan_result`, `calendar_write_success` (create/update + đích), `saved_event_viewed`, `offer_viewed`, `purchase`, `renewal`, `refund`. Gắn nguồn tiếp cận/mã cohort, transaction ID để khử trùng, số tiền và tiền tệ khi có giao dịch. Tránh log ảnh, câu nguồn, tên sự kiện, lịch ID thật hoặc token.

| Mốc | Đầu việc và điều kiện quyết định |
|---|---|
| M1 | Phỏng vấn và đo manual so với PlanSnap qua hai lớp, đo D1/D7 và đọc D28 khi cohort trưởng thành. Mục tiêu 10 thử đối chứng, median nhanh hơn 30%, giữ đúng ngày/giờ. Kênh sinh viên trước, ads = 0đ và ROAS để N/A. |
| M3 | Lặp kênh ở trường thứ hai. Chạy thử giá Pro khi đã có hành vi quay lại và có đo thanh toán/gia hạn. Đọc 2 cohort đủ ngày trước khi quyết định thử ads. |
| M6 | Mở thêm nhóm lớp qua đầu mối sinh viên. Thử một nhóm tiếng Anh nếu luồng giữ được độ chính xác ngày/giờ. Tăng ngân sách sau khi thấy retention, biên đóng góp và ROAS của paid cohort đạt mục tiêu. |

## 4. P&L quản trị, VND

Ngân sách chi tiền mặt, trước thuế, chưa tính lương founder, chi phí VAT/thuế, hoàn tiền, phí pháp nhân hoặc chi trả đối tác theo hợp đồng. Các khoản chi vận hành bao gồm hạ tầng, hỗ trợ/nghiên cứu và tiếp cận nhóm lớp. Chưa có số liệu doanh thu thực. Phí 15% là giả định phân phối để lập kịch bản, tương ứng phí subscription Google Play và mức Apple Small Business nếu đủ điều kiện. Cập nhật phí thực tế theo mô hình phân phối, quốc gia và phương thức thu. [Google Play](https://support.google.com/googleplay/android-developer/answer/112622?hl=en-en) · [Apple](https://developer.apple.com/app-store/small-business-program/)

**Định mức AI.** Dùng Gemini 3.5 Flash-Lite làm mốc tính, cần benchmark trước khi chọn model. Bảng giá Standard là 0,30 USD/triệu token vào text/ảnh và 2,50 USD/triệu token ra kể cả thinking. Giả định 2.500 token vào và 850 token ra/lượt, quy đổi nội bộ 26.000đ/USD và cộng 20% cho retry/fallback. Kết quả 89,7đ, làm tròn 90đ/lượt. Cường thay bằng token và hóa đơn thực của ảnh mức p50/p95. Model giả định khác model mặc định đang được cấu hình trong checkout. [Giá Google AI Studio](https://aistudio.google.com/docs/pricing#gemini-3.5-flash-lite)

- MAU = làm tròn (tiếp cận mới × 40%) + làm tròn (MAU tháng trước × 45%). Bỏ qua người tái kích hoạt từ cohort cũ trong mô hình giản lược.
- Paid = làm tròn (MAU × tỷ trọng trả tiền 0%/0%/5%/6%/7%/8%). Paid là số thuê bao tháng tương đương tính đủ tháng. Chưa dự báo riêng theo ngày vào gói.
- Lượt AI = (MAU − Paid) × 4 + Paid × 18. Đây là lượt trung bình giả định, hạn mức gói lần lượt 5 và 50.
- Doanh thu = Paid × 39.000đ. Phí = 15% × doanh thu. Chi AI = lượt × 90đ. Kết quả = doanh thu − phí − chi AI − chi vận hành. Chi vận hành theo tháng M1→M6 lần lượt (triệu đồng): hạ tầng 0,3/0,4/0,5/0,6/0,7/0,9, hỗ trợ/nghiên cứu 0,5/0,6/0,7/0,7/0,8/1,0, tiếp cận 0,2/0,2/0,3/0,4/0,5/0,6.

| Tháng | Nhóm mới | Tiếp cận mới | Kích hoạt mới | Quay lại | MAU | Paid | Lượt AI | Doanh thu | Phí | Chi AI | Chi vận hành | Lãi/lỗ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 2 | 100 | 40 | 0 | 40 | 0 | 160 | 0 | 0 | 14.400 | 1.000.000 | -1.014.400 |
| 2 | 4 | 200 | 80 | 18 | 98 | 0 | 392 | 0 | 0 | 35.280 | 1.200.000 | -1.235.280 |
| 3 | 8 | 400 | 160 | 44 | 204 | 10 | 956 | 390.000 | 58.500 | 86.040 | 1.500.000 | -1.254.540 |
| 4 | 14 | 700 | 280 | 92 | 372 | 22 | 1.796 | 858.000 | 128.700 | 161.640 | 1.700.000 | -1.132.340 |
| 5 | 20 | 1.000 | 400 | 167 | 567 | 40 | 2.828 | 1.560.000 | 234.000 | 254.520 | 2.000.000 | -928.520 |
| 6 | 32 | 1.600 | 640 | 255 | 895 | 72 | 4.588 | 2.808.000 | 421.200 | 412.920 | 2.500.000 | -526.120 |
| Tổng 6 tháng | 80 | 4.000 | 1.600 | | | | 10.720 | 5.616.000 | 842.400 | 964.800 | 9.900.000 | -6.091.200 |

**Đơn vị kinh tế.** Pro đóng góp 31.530đ/người/tháng sau phí và 18 lượt AI trung bình, trước trợ giá người dùng Free và chi vận hành. Free tốn 360đ/người/tháng cho AI. Ở cơ cấu 8% trả tiền và chi vận hành 2,5 triệu/tháng, điểm hòa vốn mô hình khoảng 1.141 MAU. Với 895 MAU, cần tối thiểu 89 thuê bao, xấp xỉ 10%. Nếu người dùng quét tới giới hạn 5/50 lượt ở M6, chi AI tăng từ khoảng 413.000đ lên 694.000đ và lỗ tháng tăng lên khoảng 808.000đ. Nếu thử giá 29.000đ với cùng chi phí và 895 MAU, hòa vốn cần khoảng 121 thuê bao (13,5%) so với 89 thuê bao ở giá 39.000đ. Nếu phân bổ thêm chi phí nhân sự, cộng vào chi vận hành trước khi tính hòa vốn. Chưa có dữ liệu đủ để ước tính LTV.

| Kịch bản | Kích hoạt / quay lại theo tháng / tỷ trọng paid M6 / chi AI mỗi lượt | M6 MAU / paid | Lãi/lỗ M6 | Lãi/lỗ 6 tháng |
|---|---|---|---:|---:|
| Thận trọng | 30% / 35% / 3% / 180đ | 617 / 19 | -2.362.270 | -9.673.710 |
| Cơ sở | 40% / 45% / 8% / 90đ | 895 / 72 | -526.120 | -6.091.200 |
| Thuận lợi | 50% / 55% / 12% / 60đ | 1.226 / 147 | +1.955.330 | +119.640 |

Kịch bản thận trọng và thuận lợi dùng 3% và 12% paid cố định từ M3. Ba kịch bản giữ cùng kế hoạch tiếp cận và chi vận hành. Đây là kiểm độ nhạy, chưa phải xác suất hay cam kết ngân sách.

## 5. Doanh thu, ROAS và nội dung pitch

[Bản slide HTML](PlanSnap-Business-Pitch.html) chuyển cấu trúc từ hai báo cáo Tongits US và Dummy TH T4–T5/2026: P&L theo kỳ, Userbase theo nhóm, Monet theo người trả và ROAS theo cohort. Slide dùng giả định PlanSnap. Các ô Actual/Baseline được bổ sung khi có dữ liệu pilot. Khi có Actual, ghi chênh lệch retention/PayRate theo điểm phần trăm, doanh thu/chi phí theo VND và % so với kỳ.


- Revenue theo báo cáo là doanh thu thuê bao gộp được ghi nhận theo kỳ. MRR là giá trị thuê bao định kỳ đang hoạt động quy tháng, gói một lần và thu trước được theo dõi riêng. Trong P&L cơ sở giản lược, mọi thuê bao Pro được tính đủ tháng nên hai chỉ số bằng nhau. Báo kèm trả tiền mới, paid conversion trên số người thấy giá, gia hạn, hoàn tiền và nguồn.
- ROAS doanh thu D7/D28 = số tiền thực thu sau hoàn tiền và trước phí nền tảng từ cohort gán cho chiến dịch trong 7/28 ngày kể từ first open, chia số tiền quảng cáo của cohort. Dùng cùng quy tắc gán nguồn và cửa sổ cho cả tử và mẫu, tách organic và đợi cohort đủ ngày. Ads spend = 0 thì để N/A. Chi tiếp cận nhóm lớp ở P&L là hoạt động cộng đồng, không gộp vào ads spend. CAC paid = ads spend / khách trả tiền mới gắn với ads. [Google Ads về ROAS](https://support.google.com/google-ads/answer/6268637?hl=en)
- Thử ads nhỏ, nếu đủ điều kiện, với ngân sách minh họa 300.000đ và theo dõi đủ D28. Nếu có 10 khách Pro ở 39.000đ, ROAS doanh thu là 130%, CAC 30.000đ. Biên đóng góp từ 10 khách khoảng 315.300đ trước chi hỗ trợ và chi AI của Free đến từ cùng chiến dịch. Mức hòa vốn quảng cáo lý thuyết khoảng 124% ROAS khi chỉ tính phí 15% và 18 lượt AI/khách trả. Mục tiêu thử ≥150% và biên đóng góp sau ads dương khi tính cả Free và hoàn tiền, trước khi tăng chi. Ví dụ cần ít nhất 12 khách ở giá 39.000đ để vượt 150% với ngân sách trên. Kịch bản ads độc lập, chưa cộng vào P&L cơ sở.
- Pitch dùng một chuỗi: **hai lớp → 100 tiếp cận → 60 người mở lần đầu → 40 kích hoạt** (mục tiêu M1), đo D1/D7/D28, rồi thử Pro 39.000đ. Kịch bản M6 cho thấy 895 MAU / 72 thuê bao / 2,81 triệu doanh thu tháng và vẫn lỗ khoảng 526.000đ. Điểm cần chứng minh là người dùng tiếp tục dùng và trả tiền ở một kênh có thể lặp lại. Pitch chỉ gọi là traction khi có dữ liệu thực.
- Tách rõ điều chỉnh phạm vi sản phẩm: [PRD Task 01](PlanSnap-Task-01-PRD-Final.md) ưu tiên tạo/cập nhật đúng sự kiện ngoài PlanSnap. Phần phân bổ giờ làm trong nghiên cứu bên trên là hướng tiếp theo.

## Checkpoint

- Đã rà nghiên cứu định tính Việt Nam, khảo sát quốc tế, giá và tính năng đối thủ, bảng giá AI, phí phân phối và tài liệu repo 05/09. Nguồn và giới hạn ở bên trên. Đã tính lại toàn bộ 6 tháng, độ nhạy và điểm hòa vốn.
- Còn thiếu dữ liệu gốc của đội, phỏng vấn mới, lượt đối chứng, log thu tiền, gia hạn và hóa đơn AI. Lực tìm nguồn gốc bảng khảo sát, Minh xác định hai đầu mối lớp, Vũ chạy các ca đầu tiên. Không có thay đổi repo.
- Khi nối tiếp, đọc phần 1–4 của tài liệu này và checkpoint hackathon. Đối chiếu log pilot trước khi thay giả định. Bước kế tiếp là chọn hai nhóm lớp có đầu mối và thu ba tình huống gần nhất có ảnh hoặc tài liệu chứng minh.
