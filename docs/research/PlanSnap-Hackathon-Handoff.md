# PlanSnap | Nội dung nộp BTC và bàn giao pitch

**Đội:** technoComplex · **Sự kiện:** Codex Community Hackathon Hà Nội, 14/11/2026 · **Nền tảng demo:** Android, bản Expo APK.  
**Câu mở:** “Từ ảnh thông báo bài tập đến lịch làm việc có thể kiểm tra.”  
**Cách dùng:** Copy bảy câu ở phần 1 vào form. Dùng phần 2–4 và [prompt Antigravity](PlanSnap-Prompt-Antigravity.md) để làm slide/nhận diện. Lực và Cường điền các chỗ trong ngoặc vuông trước giờ nộp.

## 1. Nội dung điền form BTC

### 1. Người dùng, vấn đề và bằng chứng

PlanSnap phục vụ sinh viên theo dõi nhiều môn và bài nhóm qua LMS, Zalo và ảnh slide. Khi một thông báo có hạn chót nằm ngoài lịch cá nhân, sinh viên phải tìm lại thông báo, hiểu mốc thời gian và tự bố trí lúc làm. Một nghiên cứu năm 2026 phỏng vấn 15 sinh viên và người mới tốt nghiệp trong bối cảnh đại học công lập Việt Nam cho thấy người học phải tự phối hợp giữa nền tảng chính thức, kênh nhắn tin, bản lưu và bạn học. Nghiên cứu tại ĐH Thủ Dầu Một, với 112 bảng hỏi và 8 phỏng vấn sinh viên năm cuối ngành tiếng Anh, ghi nhận Zalo chủ yếu được dùng để điều phối việc học và theo dõi trao đổi. Hai nghiên cứu cung cấp bằng chứng về việc thông tin học tập phân tán. Đội dùng ảnh thông báo công khai để kiểm khả năng đọc ngày/giờ của app.

**Chỉ thêm khi có kết quả:** “Trong [n] lượt thử trên [nhóm], [x/n] người gặp [hành vi quan sát được]. Thời gian trung vị từ ảnh đến lịch đúng là [a] giây với PlanSnap và [b] giây theo cách hiện tại, trên [n] lượt đối chứng.” Ảnh công khai là bằng chứng về dạng dữ liệu, không dùng để tính nhu cầu hoặc tác động. Các số 30 phỏng vấn, 156 khảo sát, 42 beta users, 218 tác vụ và benchmark cũ cần dữ liệu gốc trước khi trích.

### 2. Tính năng AI và demo trực tiếp

Demo trên **Android thật**. Đội đóng hẳn PlanSnap rồi mở lại từ icon APK. Tiếp theo, đội chọn một ảnh thông báo từ thư viện và chạy Gemini trực tiếp để trích tên việc, hạn và câu nguồn. Khi thời hạn mơ hồ, người dùng xem câu trích và xác nhận ngày. PlanSnap đưa công việc vào lịch theo khung rảnh đã đặt. Đội mở tab Lịch và thực hiện xuất tệp .ics qua bảng chia sẻ của Android nếu bản demo đã kiểm thao tác đó. Người xem có thể đối chiếu ảnh đầu vào, hạn đã xác nhận và phiên làm việc trên cùng thiết bị.

**Chỉ thêm sau khi chứng minh trên APK:** “Ảnh thông báo mới cập nhật cùng sự kiện trong lịch đích, giữ nguyên ID và không tạo bản trùng.” Tích hợp ghi/sửa trực tiếp Android Calendar hoặc Google Calendar là yêu cầu Task 01; chưa thấy nó trong mã mobile tại ref đã kiểm. Dùng ảnh A/B lịch thi công khai để kiểm đọc và đổi ngày khi tính năng cập nhật đã có. Trong bản hiện tại dùng ảnh thật có hạn tương lai hoặc ảnh lớp được phép dùng với mốc tương lai để bộ xếp lịch sinh lịch có ý nghĩa. Tránh dùng ngày quá khứ của A/B làm ca chính cho xếp phiên.

### 3. Người dùng đầu tiên và hướng mở rộng

Đội dự kiến pilot tại hai nhóm lớp ở Hà Nội qua lớp trưởng hoặc ban học thuật CLB. Cho sinh viên thử bằng thông báo của chính họ, theo dõi tỷ lệ tạo được lịch đầu tiên và quay lại ở D1/D7/D28 theo từng nhóm. Sau khi lặp được cách tuyển ở trường thứ hai, thử một cộng đồng sinh viên dùng tiếng Anh nhận thông báo qua WhatsApp, Discord hoặc LMS. Kịch bản thử giữ cùng thao tác chọn ảnh, kiểm thêm định dạng ngày, ngôn ngữ, múi giờ và độ chính xác. Giá thử là Free 5 lượt AI/tháng, Pro 39.000đ/tháng nếu pilot có người quay lại, với 29.000đ làm giá đối chứng.

### 4. Phần làm hôm nay và phần có sẵn

Trước sự kiện, đội có prototype PWA, giao diện quét và quản lý đầu việc, prompt Gemini đọc ảnh, cơ chế xác nhận hạn chưa rõ và bộ xếp lịch. Trong ngày 14/11, đội chuyển luồng đó sang ứng dụng React Native/Expo để cài và mở độc lập trên Android, thêm chọn ảnh và nén ảnh native, lưu dữ liệu ứng dụng trên máy, lưu khóa Gemini qua SecureStore và chia sẻ .ics qua Android. Phần chuyển native nằm ở commit 4df37e0. Nhánh main đồng thời có cải tiến thêm lịch từ ảnh và giờ cố định trên bản web ở e81bbe5; phạm vi mobile trình diễn theo SHA của APK nộp.

Thư viện/dịch vụ bên thứ ba gồm React Native, Expo/Expo Router, Gemini API, AsyncStorage, Expo SecureStore và Expo Sharing. Ảnh test công khai có nguồn tại danh mục ảnh Android. Nếu demo dùng ảnh riêng, ghi nguồn và quyền dùng theo thực tế. Các preset Zalo/LMS/slide/chữ viết tay và kết quả preset không gửi API là dữ liệu mô phỏng. Các số KPI/P&L là mục tiêu hoặc dự phóng. **Điền:** “[SHA build nộp] · [nguồn và quyền của ảnh thực sự dùng] · [bổ sung thay đổi phát sinh có commit, nếu có].”

### 5. Công nghệ, công cụ và bài học

Bản Android dùng React Native, Expo Router, TypeScript và EAS Build. Gemini Vision đọc ảnh và trả về dữ liệu có cấu trúc. Logic xếp lịch trên máy dùng hạn và khung giờ rảnh đã khai báo, còn AsyncStorage lưu đầu việc để phục hồi sau khi mở lại. Bài học rút ra khi thiết kế luồng là mốc như “thứ Sáu tuần sau” cần ngày tham chiếu. Hiển thị câu nguồn và hỏi lại trước khi xếp lịch giúp người dùng kiểm được quyết định. Codex đã hỗ trợ rà PRD với code, xác định tiêu chí nghiệm thu và chuẩn bị ca kiểm tra và nội dung demo. Nếu đội có dùng Codex để viết hoặc sửa mã trong sprint, bổ sung một ví dụ cụ thể có diff.

### 6. Link sản phẩm hoặc mã nguồn

**Link điền trước mắt:** https://github.com/Lucvuu/plansnap-codex-hackathon/tree/dev/mobile

Đây là nhánh có mã native. GitHub báo repo public và nhánh đọc được qua connector. Đội vẫn nên mở link cuối trong cửa sổ đăng xuất trước khi nộp. Nếu đã có link APK cài được và mở được ngoài tài khoản đội, ưu tiên nộp **[LINK APK ĐÃ MỞ ẨN DANH VÀ CÀI THỬ]**. Không dùng QR của bản web như link APK.

### 7. Link video dự phòng

**Điền:** [LINK VIDEO 60–90 GIÂY ĐÃ MỞ ẨN DANH]. Chưa có link video trong checkout đã rà.

- **0–12 giây:** Quay từ máy thứ hai hoặc ghi hình màn hình đủ thấy thao tác đóng hẳn và mở lại PlanSnap từ icon.
- **12–37 giây:** Chọn ảnh thật đã được phép dùng, nhấn quét, giữ đoạn xử lý live. Cho thấy ảnh/câu nguồn và hạn AI đọc.
- **37–58 giây:** Duyệt dữ liệu hoặc xác nhận ngày nếu app hỏi, mở tab lịch, chỉ vào phiên vừa sinh.
- **58–77 giây:** Xuất .ics nếu bản build đã kiểm được, chốt kết quả và tên app. Nếu mở được lịch hệ thống từ bảng chia sẻ, cho thấy kết quả thật. Giữ tổng thời lượng trong 60–90 giây.
- Dùng phụ đề ngắn, tắt thông báo cá nhân, không lộ API key. Thử mở link ở một phiên đăng xuất và xem được cả tiếng lẫn hình.

## 2. Nội dung để Antigravity dựng bài pitch

Tổng 5 phút theo lịch công khai. Đề xuất 5 khung nội dung và một phụ lục. Phần live dành 2 phút 15 giây.

| Khung | Nội dung ưu tiên trên màn hình | Lời nói và visual |
|---|---|---|
| 1 · 20 giây | **PlanSnap** · Từ ảnh thông báo đến lịch làm việc. | “Một deadline ở Zalo, một ở LMS. Việc phải làm trước khi bắt đầu học là đi tìm và nhập lại chúng.” Hình chính là ảnh dữ liệu được phép dùng cạnh màn lịch thật. |
| 2 · 45 giây | **Sinh viên phải tự ghép thông tin giữa nhiều kênh.** | Vẽ luồng Zalo / LMS / slide → tìm lần nữa → xác minh ngày → nhập lịch. Đặt bằng chứng nghiên cứu Việt Nam 15 phỏng vấn ở lề, mẫu Thủ Dầu Một có thể làm chú thích. Nếu có một case thật do đội thu, ưu tiên câu nói đã được đồng ý và con số đo có mẫu số. |
| 3 · 2 phút 15 giây | **Demo Android thật** · đóng → mở → quét → duyệt → xem lịch. | Chủ yếu chiếu trực tiếp màn hình điện thoại. Nói “Gemini đọc ảnh và trích câu nguồn. Phần xếp giờ dùng hạn đã rõ và khung rảnh.” Một slide giữ trạng thái chờ là đủ. Khi gặp thiếu mạng, thử lại bằng hotspot nếu có. Video chỉ là nội dung dự phòng cho form. |
| 4 · 55 giây | **Hai lớp là điểm bắt đầu.** | Funnel M1 có nhãn Mục tiêu: 100 tiếp cận → 60 mở lần đầu → 40 lưu lịch trong app. Nêu D7 để kiểm dùng lại và D28 để kiểm sau một chu kỳ dài hơn. Mở rộng một trường rồi thử một nhóm tiếng Anh. |
| 5 · 45 giây | **Thử Free → Pro** · phần làm trong ngày đặt ở cuối. | Thẻ Free 5 lượt/tháng và Pro 39.000đ/50 lượt. Nêu giả thuyết mức giá, mục tiêu 10 thuê bao M3 và điều kiện mở ads. Một dòng chốt “PWA có trước → app Android Expo được port trong ngày”. Kết bằng “Lần thử đầu tiên cho thấy mỗi ảnh có thể trở thành một đầu việc và một giờ làm cụ thể” chỉ khi demo vừa thể hiện điều đó. |
| Phụ lục Q&A | **Userbase, Monet, P&L và Work built today** | Bảng M1/M3/M6, phân loại KPI/dự phóng, công thức ROAS, so sánh SHA, tài liệu nguồn và số liệu thử nghiệm đã xác minh. Không đưa số nội bộ ZingPlay/VNG vào slide. |

## 3. KPI, lập luận và hình nên giao Antigravity

Chuyển format từ **Tongits US và Dummy TH T4–T5/2026**. Userbase nhìn số người mới và hoạt động trước, sau đó đọc retention theo nhóm. Monet nhìn số người trả, tỷ lệ trả, ARPPU và doanh thu. ROAS đọc theo cohort có chi ads. P&L tách doanh thu, phí, AI, vận hành và lãi/lỗ. Format này giúp truy được động lực tăng/giảm khi đã có hai kỳ Actual. Pitch hôm nay dùng tên kỳ M1/M3/M6 và dán nhãn **Mục tiêu** hoặc **Dự phóng** rõ trên mỗi visual.

| Chỉ số / mốc | M1 | M3 | M6 |
|---|---:|---:|---:|
| Số tiếp cận mới / lớp tương đương 50 người | 100 / 2 | 400 / 8 | 1.600 / 32 |
| New users · lần mở đầu tiên | 60 | 240 | 960 |
| Kích hoạt mới · lần đầu có đầu việc từ ảnh thật được lưu và xuất hiện trong lịch PlanSnap trong 7 ngày | 40 | 160 | 640 |
| MAU · mô hình cơ sở | 40 | 204 | 895 |
| Retention D1 / D7 / D28 · mục tiêu | 20% / 12% / 5% | 25% / 15% / 8% | 30% / 18% / 10% |
| Người trả tiền / Paid share trên MAU | 0 / 0% | 10 / 4,9% | 72 / 8,0% |
| Doanh thu Pro gộp tháng | 0đ | 390.000đ | 2.808.000đ |
| Lãi/lỗ tháng · dự phóng | −1.014.400đ | −1.254.540đ | −526.120đ |
| Chi ads và ROAS thực tế | 0đ theo kế hoạch / N/A | Chỉ khi chạy / N/A hiện tại | Chỉ khi chạy / N/A hiện tại |

**Vì sao chọn số và cách kiểm.**

- **Phễu tuyển.** Hai nhóm × 50 là quy mô tiếp cận có thể kiểm từng lớp, chưa có lớp cam kết hay tỷ lệ chuyển đổi thực. 60% mở và 2/3 số người mở kích hoạt cho 40/100. Tracking bằng mã nhóm. Phỏng vấn người bỏ để phân biệt thiếu ảnh phù hợp, AI sai, khó mở app hay chưa thấy giá trị.
- **Hành vi quay lại.** Cohort theo ngày mở đầu D0, mẫu số là số người đủ thời gian quan sát. Tử số có hành động giá trị đúng ngày D+n: thêm/duyệt việc từ ảnh thật vào lịch app hoặc chủ động xem lịch đã lưu. Đo thêm tỷ lệ quay lại quét ảnh mới. Mốc D1 là phản hồi sớm, D7 theo nhịp học tuần, D28 xem có dùng qua nhiều tuần; vì hành vi theo lịch học, thêm tỷ lệ quay lại trong ngày 7–13 khi cần chẩn đoán. 20/12/5% là ngưỡng thử M1, không phải benchmark thị trường. Với cohort 60 đầy đủ, tương đương 12/8/3 người tối thiểu để đạt các mốc. Báo số đếm, gộp ít nhất hai cohort trước quyết định tăng chi. Khi đo đủ, tách người mới, quay lại tháng trước và tái kích hoạt. Mô hình kế hoạch giản lược MAU bỏ tái kích hoạt và dùng 45% MAU tháng trước quay lại. 45% có mẫu số khác D28.
- **Giá và willingness to pay.** Free và Pro cùng sửa/xem lịch đã lưu. Lý do thu tiền là tần suất xử lý ảnh hoặc khối lượng lớn. Chạy test 29.000đ và 39.000đ với quyền lợi giống nhau, đọc số thanh toán/gia hạn thực, tách đăng ký quan tâm. Gói 59.000đ/90 ngày với 90 lượt là lựa chọn thử nếu dùng theo mùa, chưa cộng vào doanh thu cơ sở. ARPPU của mô hình = doanh thu gộp/người trả, bằng 39.000đ khi chỉ có Pro.
- **Lợi nhuận và ROAS.** Phí phân phối giả định 15%, AI 90đ/lượt với 4 lượt Free, 18 lượt Pro trung bình. M6 phí 421.200đ + AI 412.920đ + vận hành 2.500.000đ. Lỗ lũy kế 6,09 triệu đồng trước lương founder và thuế. Ở 895 MAU, cần khoảng 89 thuê bao ở giá 39.000đ để hòa vốn theo cùng chi phí. Chưa có spend thì ROAS là N/A. Ví dụ minh họa 300.000đ spend, 12 khách × 39.000đ = 468.000đ, ROAS D28 là 156% nếu toàn bộ doanh thu đó phát sinh trong cửa sổ đo và được gán đúng chiến dịch. Mục tiêu ≥150% và phần đóng góp sau phí, AI của cả Free/Pro, hoàn tiền và ads dương. Chỉ thử ads sau khi hai cohort đạt retention và có giao dịch thật.
- **Chứng minh giá trị sản phẩm.** Mục tiêu tuần đầu ba đến năm ca thật. M1 thực hiện ít nhất 10 cặp đối chứng với ảnh tương đương, đổi thứ tự manual/app, đo median từ lúc có ảnh đến khi có lịch đúng. Mục tiêu thử nhanh hơn 30%, báo lỗi lệch ngày/giờ và sửa nhầm. Ảnh bảng công khai có thể kiểm OCR, còn ngày giờ cũ trong nguồn có thể không phù hợp để demo xếp phiên tương lai.

**Visual giao thiết kế.** Phễu ba bước với số đếm trên mỗi bước. Retention dùng ba cột hoặc ba điểm trên trục D1/D7/D28, trục phần trăm chung, ghi nhãn mục tiêu. Khi có Actual, đặt cạnh Target và nêu chênh lệch điểm phần trăm. Phụ lục P&L dùng bảng có số âm dễ đọc hoặc waterfall M6. Monet dùng hai thẻ giá và bảng Paid / Paid share / ARPPU / MRR; ROAS để trong box nhỏ có công thức và nhãn minh họa. Giữ mỗi màn hình một ý nói.

## 4. Kiểm tra trước khi nộp và điểm nối việc

1. **Cường:** Điền SHA APK, máy/OS, verify đóng hẳn → mở lại → Gemini xử lý ảnh mới → câu nguồn → lịch; thử hai lần cùng kịch bản. Kiểm kết quả .ics trên chính máy nếu đưa vào form.
2. **Vũ:** Chọn ảnh công khai hoặc ảnh nhóm lớp được phép dùng, lưu đáp án và nguồn. Ghi một ca test có expected/actual và một trích dẫn người dùng nếu có consent.
3. **Lực:** Kiểm bảy trường form, link APK/repo và video trong cửa sổ đăng xuất. Chốt phần làm trong ngày dựa trên SHA và báo mọi phần có trước. Dùng lịch BTC trong email nếu khác Luma.
4. **Minh:** Chuyển tài liệu này và prompt cho Antigravity. Chốt thứ tự pitch, hai lớp sẽ tiếp cận và người bấm demo. Khi có kết quả thật, thay đúng dòng bằng mẫu số và nguồn.

**Nguồn đã rà:** Checkout nhánh local `codex/minh-prd-final @ d88b444`, GitHub `main @ 10e7a5e`, `dev @ 11bb697`. Native tách từ baseline `8780158`; port `4df37e0`; `e81bbe5` thêm luồng lịch web. Rà cây tệp và đối chiếu README, PRD, demo, pitch, RASCI, RAID, decision log, bằng chứng, tài liệu nghiên cứu, app native và bản web. Hai DOCX PRD local cùng SHA-256, bản PRD main mới chênh FR-3.3. Đã chạy lint/test/build của checkout hiện tại: 8 unit test và kiểm cấu hình web qua. Chưa build hoặc test APK trong lượt này. Slide HTML cũ chỉ là tham chiếu, nội dung hiện hành dùng tài liệu này. Không có thao tác push trong lượt này.

- [Luma và quy định](https://luma.com/l0ro71hq) · [Mã native dev](https://github.com/Lucvuu/plansnap-codex-hackathon/tree/dev/mobile) · [Port Android](https://github.com/Lucvuu/plansnap-codex-hackathon/commit/4df37e0) · [Thay đổi web](https://github.com/Lucvuu/plansnap-codex-hackathon/commit/e81bbe5)
- [Le & Saito, Monash](https://research.monash.edu/en/publications/patchwork-lms-practices-student-coordination-across-fragmented-di/) · [Nguồn ĐH Thủ Dầu Một](https://tdmujournal.vn/exploring-undergraduate-students-engagement-in-zalo-based-classroom-discussions-a-mixed-methods-study-of-english-majors-at-a-vietnamese-university-561-a25id.html)
- [Ảnh Android](android-calendar-test/README.md) · [Giả định kinh doanh, nghiên cứu và P&L đủ tháng](PlanSnap-Pain-Point-va-Ke-hoach-Kinh-doanh.md) · [PRD Task 01](PlanSnap-Task-01-PRD-Final.md) · [Thang điểm](../00_Thang_diem_BTC.md)
