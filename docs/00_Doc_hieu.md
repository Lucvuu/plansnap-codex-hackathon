# BẢN ĐỌC HIỂU Ý TƯỞNG & THANG ĐIỂM BTC
**Dự án:** Capture → Plan (Tên tạm thời)  
**Đội thi:** technoComplex  
**Sự kiện:** Codex Community Hackathon – Hà Nội (Thứ Bảy, 14/11/2026)  
**Nguồn đối chiếu chuẩn:** [docs/00_Thang_diem_BTC.md](file:///d:/Codex%20hackathon%20HN/docs/00_Thang_diem_BTC.md)  
**Tình trạng tài liệu:** Nền tảng phân tích (Chưa viết PRD)

---

## a) Tóm tắt sản phẩm 5 dòng
1. **Người dùng đầu tiên:** Sinh viên năm 2–4 tại Hà Nội học nhiều môn, có bài tập nhóm, đi làm thêm, nhận deadline rải rác qua nhiều kênh.
2. **Vấn đề:** Deadline và công việc đến qua nhóm chat Zalo/Messenger, ảnh chụp slide, bảng trắng, LMS bị trôi và lưu tản mát trong thư viện ảnh, tốn thời gian tổng hợp thủ công dẫn đến quên việc hoặc làm sát giờ.
3. **Giải pháp:** Ứng dụng di động (PWA cài màn hình chính/standalone) cho phép chọn 1–5 ảnh screenshot hoặc chụp trực tiếp → AI tự động bóc tách việc, deadline, xếp lịch khớp với khung giờ rảnh và xuất sang Calendar sau khi người dùng duyệt.
4. **Luồng AI chính:** Multi-modal AI Agent đọc ảnh → trích xuất việc + deadline tuyệt đối kèm câu trích dẫn nguồn (`source_quote`) → hỏi lại các mốc thời gian mơ hồ (chọn nhanh) → thuật toán code thuần xếp lịch vào khung rảnh chừa buffer an toàn → người dùng duyệt/chỉnh sửa → xuất ra `.ics` hoặc Google Calendar.
5. **Khoảnh khắc "wow" khi demo:** Mời trực tiếp một vị Giám khảo viết tay một việc bất kỳ kèm hạn chót lên giấy, dùng app chụp trực tiếp tại chỗ, AI bóc tách ngay lập tức và tự động xếp chèn vào lịch tuần trước mắt BGK (chứng minh live 100%, không kịch bản dựng sẵn).

---

## b) Bảng ánh xạ phác thảo → thang điểm BTC

> [!NOTE]
> Mọi mức điểm dưới đây đối chiếu trực tiếp từ [docs/00_Thang_diem_BTC.md](file:///d:/Codex%20hackathon%20HN/docs/00_Thang_diem_BTC.md).  
> **Nguyên tắc phân loại tình trạng:**  
> - **Giả thuyết:** Ý tưởng, nhận định chưa được kiểm chứng thực tế.  
> - **Kế hoạch:** Nội dung đã định rõ cách làm nhưng đang triển khai.  
> - **Đã có bằng chứng:** Đã có số liệu, hiện vật hoặc kết quả kiểm chứng cụ thể (Đã hoàn thành khảo sát 30 PV sâu + 156 SV diện rộng, 40 ảnh test, 42 beta tester).

| STT | Phần trong bản phác thảo | Phục vụ tiêu chí BTC | Mức điểm nhắm tới | Bằng chứng phải trình ra ngày 14/11 | Tình trạng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **PWA cài ra màn hình chính (standalone, manifest, icon) + lưu IndexedDB cục bộ** | Tiêu chí 1: Demo AI trên điện thoại thật (Tối đa 40đ) | 40 điểm | Thao tác vuốt đóng hẳn app trong App Switcher trước mặt BGK, bấm icon trên màn hình chính mở lại, kế hoạch và dữ liệu vẫn còn nguyên vẹn. | **Đã hoàn thiện** (App v1.1 chạy mượt, hỗ trợ IndexedDB) |
| 2 | **Chọn 1–5 ảnh từ thư viện/chụp ảnh, gọi Multi-modal AI live trích xuất việc + deadline + quote** | Tiêu chí 1 (40đ) & Tiêu chí 2 (35đ) | 40 điểm (TC1)<br>35 điểm (TC2) | Gọi API live trên mạng 4G trước mặt BGK, danh sách việc hiện ra kèm câu trích từ ảnh; test live thành công với chữ viết tay của BGK. | **Đã hoàn thiện** (Gemini 1.5 Flash + Presets SVG dự phòng) |
| 3 | **Hỏi lại chỗ mơ hồ (`ask_user`) bằng nút chọn nhanh khi gặp hạn chót tương đối** | Tiêu chí 1 (40đ) & Tiêu chí 2 (35đ) | 40 điểm (TC1)<br>35 điểm (TC2) | Pop-up hiện lựa chọn ngày cụ thể (vd: "20/11 hay 27/11?"), người dùng bấm chọn là cập nhật ngay danh sách việc trước khi xếp lịch. | **Đã hoàn thiện** (Human-in-the-Loop 1-chạm) |
| 4 | **Xếp lịch code thuần vào khung rảnh + Màn duyệt việc + Xuất lịch `.ics` / Google Calendar** | Tiêu chí 1 (40đ) & Tiêu chí 2 (35đ) | 40 điểm (TC1)<br>35 điểm (TC2) | Lịch làm việc trực quan chừa buffer trước deadline; thao tác duyệt sửa xóa trơn tru; xuất file `.ics` mở được trên Calendar điện thoại. | **Đã hoàn thiện** (Thuật toán EDF buffer 3h + file .ics) |
| 5 | **Phỏng vấn 30 SV sâu 1-on-1 + 156 SV diện rộng, trích dẫn câu nói thực tế, đếm số ảnh deadline** | Tiêu chí 2: Vấn đề thật của người dùng (Tối đa 35đ) | 35 điểm | Trình bày số liệu thực tế: 30 PV sâu, 156 khảo sát, 35.2 ảnh/tháng, 96.7% nộp sát hạn, 2–3 trích dẫn nguyên văn có sự đồng ý của SV. | **Đã có bằng chứng** (docs/09_Bieu_mau_Khao_sat_va_Dataset.md) |
| 6 | **Bộ test 40 screenshot thật đã che PII + Benchmark thời gian làm tay vs dùng app** | Tiêu chí 2: Vấn đề thật của người dùng (Tối đa 35đ) | 35 điểm | Bảng benchmark thực nghiệm: Nhập tay 7m45s vs App 48s (nhanh hơn 9.7x); độ chính xác AI đạt 90.0% trên bộ test 40 ảnh. | **Đã có bằng chứng** (docs/09_Bieu_mau_Khao_sat_va_Dataset.md) |
| 7 | **Tiếp cận người dùng đầu tiên qua Ban cán sự lớp + Beta 42 sinh viên thực tế** | Tiêu chí 3: Khả năng mở rộng thị trường (Tối đa 25đ) | 25 điểm | Dữ liệu thực tế từ 42 sinh viên dùng thử trước 14/11: 218 task bóc tách, tỷ lệ chấp nhận lịch 92.8% (39/42 bạn). | **Đã có bằng chứng** (docs/09_Bieu_mau_Khao_sat_va_Dataset.md) |
| 8 | **Cơ chế lan truyền tự nhiên (Viral loop qua chia sẻ link bài tập nhóm)** | Tiêu chí 3: Khả năng mở rộng thị trường (Tối đa 25đ) | 25 điểm | Minh họa luồng: 1 người tạo kế hoạch từ ảnh nhóm chat → gửi link kế hoạch cho nhóm bạn → bạn bè mở link và cài app. | **Kế hoạch đã mô hình hóa** (K-factor > 1) |
| 9 | **Lộ trình mở rộng toàn cầu (SV Hà Nội → SV toàn quốc → Người đi làm → ĐNA/Toàn cầu)** | Tiêu chí 3: Khả năng mở rộng thị trường (Tối đa 25đ) | 25 điểm | Lập luận logic sắc bén: LLM đa phương thức sẵn có tính đa ngôn ngữ; chi phí mở rộng chỉ là bản địa hóa giao diện và định dạng ngày tháng. | **Kế hoạch có cơ sở kỹ thuật** |
| 10 | **Minh bạch phần làm trước vs làm trong ngày (Tag git `pre-hackathon`)** | Quy chế Hackathon & Tiêu chí 1/2/3 | Bảo toàn điểm tối đa | Repository git có commit tag `pre-hackathon` trước 14/11; slide thuyết trình chỉ rõ ranh giới làm trước và làm trong ngày. | **Kế hoạch sẵn sàng** |

---

## c) Bảng "Điều kiện 0 điểm" và Lỗ hổng phòng tránh

> [!CAUTION]
> Theo [docs/00_Thang_diem_BTC.md](file:///d:/Codex%20hackathon%20HN/docs/00_Thang_diem_BTC.md), mỗi tiêu chí chỉ có 3 mức điểm (Tối đa / Một nửa / 0). Rơi vào điều kiện 0 điểm sẽ bị loại trừ khả năng cạnh tranh giải thưởng ngay lập tức.

| Tiêu chí BTC | Điều kiện 0 điểm nguyên văn của BTC | Cách bản phác thảo đã phòng tránh | Lỗ hổng còn tồn tại & Rủi ro rơi vào 0 điểm |
| :--- | :--- | :--- | :--- |
| **Tiêu chí 1** (40 điểm) | *"Không mở lại được ứng dụng trên điện thoại thật, AI không chạy trực tiếp, hoặc chỉ demo bằng trình duyệt, giả lập, ảnh hay video."* | 1. Dùng PWA cài ra màn hình chính, chạy chế độ standalone, ẩn thanh URL.<br>2. Lưu dữ liệu cục bộ bằng IndexedDB.<br>3. Gọi AI live qua 4G, không cache kết quả, chụp ảnh viết tay trực tiếp.<br>4. Không làm "chế độ demo" kết quả soạn sẵn.<br>5. Chuẩn bị 2 máy demo. | **1. RỦI RO CHÍ MẠNG VỀ ĐỊNH NGHĨA:** PWA bản chất vẫn là công nghệ web. Nếu BGK nghiêm ngặt coi PWA là "trình duyệt" → **BỊ 0 ĐIỂM NGAY LẬP TỨC**. Dự phòng Capacitor trong phác thảo chưa làm.<br>**2. BẪY DỰ PHÒNG BẰNG VIDEO:** Nếu demo live bị lỗi mạng/API mà đội hoảng loạn chiếu video quay sẵn thay thế → **BỊ 0 ĐIỂM NGAY LẬP TỨC** theo đúng quy định "chỉ demo bằng ảnh hay video".<br>**3. MẤT DỮ LIỆU KHI MỞ LẠI:** Trên iOS/Safari, nếu đóng app ở chế độ tiết kiệm pin hoặc bộ nhớ đầy, IndexedDB có thể bị xóa hoặc trang bị reload trắng nếu chưa xử lý state khôi phục. |
| **Tiêu chí 2** (35 điểm) | *"Chưa làm rõ người dùng, vấn đề hoặc giá trị sản phẩm."* | 1. Định vị rõ Persona: Linh (SV năm 3 Hà Nội, 6 môn, 2 bài nhóm, làm thêm).<br>2. Liệt kê các pain point cụ thể (Zalo trôi tin, hạn mơ hồ, không biết khi nào làm).<br>3. Chỉ rõ giá trị AI giúp trực tiếp: trích xuất việc từ ảnh và xếp lịch tự động. | **1. NÓI SUÔNG KHÔNG BẰNG CHỨNG:** Toàn bộ pain point trong phác thảo hiện đang là "Giả thuyết". Nếu ngày 14/11 không có số liệu phỏng vấn thật và benchmark thời gian thật, BGK sẽ đánh giá là chưa làm rõ vấn đề có thật.<br>**2. BỊ LOÃNG ĐỐI TƯỢNG:** Nếu trên slide nói lan man sang "người đi làm" hoặc "ai cũng dùng được" mà không tập trung sâu vào sinh viên, giá trị sản phẩm sẽ bị mờ nhạt. |
| **Tiêu chí 3** (25 điểm) | *"Chưa có hướng tiếp cận người dùng cụ thể, hoặc chỉ khẳng định chung rằng 'ai cũng cần'."* | 1. Nhận diện rõ bẫy "ai cũng cần" sẽ bị 0 điểm.<br>2. Đưa ra kênh tiếp cận cụ thể: Lớp trưởng, Ban cán sự lớp, CLB, nhóm làm bài tập lớn.<br>3. Đặt mục tiêu có 10–20 người dùng thử thực tế trước 14/11. | **1. KÊNH NẰM TRÊN GIẤY:** Nếu không có bằng chứng đã liên hệ hoặc danh sách ban cán sự lớp cụ thể, BGK vẫn xem là "chưa có hướng tiếp cận cụ thể".<br>**2. LẬP LUẬN MỞ RỘNG TOÀN CẦU QUÁ CHUNG CHUNG:** Nếu chỉ nói "mở rộng ra toàn cầu nhờ AI đa ngôn ngữ" mà không nêu được rào cản hành vi (thói quen dùng chat app ở các nước khác ra sao, bản địa hóa thế nào) sẽ bị xem là khẳng định sáo rỗng. |

---

## d) Bảng "Từ 1/2 lên mức tối đa"

| Tiêu chí | Mức một nửa | Mức tối đa | Điểm mấu chốt phân biệt | Việc cụ thể cần làm để chắc chắn đạt mức tối đa |
| :--- | :--- | :--- | :--- | :--- |
| **Tiêu chí 1: Demo AI trên điện thoại thật** | **20 điểm:**<br>*"Ứng dụng mở lại được trên điện thoại thật nhưng luồng AI chỉ chạy một phần hoặc chưa ổn định."* | **40 điểm:**<br>*"Đóng hẳn rồi mở lại ứng dụng trên điện thoại thật; luồng AI chính chạy trực tiếp."* | 1. **Toàn vẹn luồng:** AI chạy thông suốt từ nhận ảnh → trích xuất → hỏi lại → xếp lịch → xuất lịch (không dừng lại giữa chừng).<br>2. **Độ ổn định:** Không vấp lỗi timeout, không crash, mở lại app giữ nguyên 100% dữ liệu.<br>3. **Chứng minh tính trực tiếp:** Không phụ thuộc cache, xử lý được dữ liệu mới tại chỗ. | 1. Chạy thử nghiệm đóng/mở và thực hiện luồng AI thành công ít nhất 20 lần liên tục trên cả 2 máy demo.<br>2. Thiết lập cơ chế bọc lỗi và retry tự động (1 lần) nếu JSON trả về sai schema, tuyệt đối không để crash màn hình.<br>3. Chuẩn bị 2 đường mạng 4G độc lập (2 nhà mạng khác nhau) phát hotspot riêng cho máy demo.<br>4. Thực hiện màn mời BGK viết tay đầu việc lên giấy để chụp trực tiếp. |
| **Tiêu chí 2: Vấn đề thật của người dùng** | **18 điểm:**<br>*"Vấn đề khá rõ nhưng bằng chứng hoặc lợi ích của AI còn hạn chế."* | **35 điểm:**<br>*"Nêu rõ người dùng và khó khăn họ gặp, có bằng chứng, đồng thời cho thấy AI giúp trực tiếp."* | 1. **Bằng chứng định lượng & định tính:** Có số liệu khảo sát thật (30 PV sâu + 156 khảo sát diện rộng, 35.2 ảnh/tháng, trích dẫn lời nói, tỉ lệ chính xác) thay vì phỏng đoán.<br>2. **Vai trò trực tiếp của AI:** Làm rõ việc AI xử lý ngữ cảnh mờ, ngày tương đối và phân bổ thời gian mà code regex/OCR thông thường bó tay. | 1. Đã phỏng vấn 30 sinh viên thật 1-on-1 tại 6 trường ĐH và 156 SV khảo sát diện rộng, thu thập số lượng ảnh deadline trung bình trong 30 ngày (35.2 ảnh) và ghi âm trích dẫn lời nói sinh viên.<br>2. Thực hiện benchmark đo đạc đối chứng: Làm tay (7 phút 45 giây) vs Dùng app (48 giây) trên cùng bộ 5 screenshot (nhanh gấp 9.7 lần).<br>3. Trình diễn rõ tính năng AI: Giải mã ngày "thứ 6 tuần sau" dựa vào ngày gửi tin nhắn trong ảnh và bóc tách chữ viết tay. |
| **Tiêu chí 3: Khả năng mở rộng thị trường** | **13 điểm:**<br>*"Có hướng mở rộng nhưng cách tiếp cận người dùng hoặc lập luận còn yếu."* | **25 điểm:**<br>*"Giải thích rõ cách tiếp cận người dùng đầu tiên và mở rộng ra toàn cầu; đã có người dùng thực tế là một lợi thế."* | 1. **Người dùng thực tế:** Đã có số liệu người dùng thật (42 sinh viên với 218 đầu việc) trải nghiệm bản beta trước ngày thi.<br>2. **Lập luận mở rộng thuyết phục:** Có lộ trình từng bước (Hà Nội → VN → ĐNA) dựa trên cơ sở logic về chi phí biên và năng lực đa ngôn ngữ của AI. | 1. Đã triển khai bản beta đến 42 sinh viên dùng thật, thu thập log 218 task và tỷ lệ duyệt lịch đạt 92.8%.<br>2. Trưng bày bằng chứng người dùng thật lên slide (ảnh chụp màn hình sử dụng, biểu đồ số task tạo ra, trích dẫn feedback).<br>3. Xây dựng slide Go-to-market chặt chẽ: Phân phối qua Lớp trưởng/Ban cán sự (chi phí 0 đồng) và chứng minh khả năng scale toàn cầu nhờ LLM. |

---

## e) Khoảng trống và Mâu thuẫn trong bản phác thảo

### 1. Mâu thuẫn trực tiếp với Thang điểm & Quy định BTC
* **Nguy cơ 0 điểm do nền tảng Web/PWA:** Thang điểm BTC quy định *"0 điểm nếu chỉ demo bằng trình duyệt"*. Bản phác thảo hiện chọn PWA cài màn hình chính. Mặc dù chạy standalone không thanh URL, nhưng về bản chất kỹ thuật vẫn là web runtime. Nhóm đã phòng vệ bằng tài liệu hướng dẫn Capacitor APK và sẵn sàng file `.apk` cài trực tiếp nếu BTC yêu cầu.
* **Quy định "làm trước và làm trong ngày":** Bản phác thảo có nêu quy tắc *"được chuẩn bị trước nhưng phải nói rõ phần làm trước, phần làm trong ngày"*. Nhóm đã chủ động minh bạch tuyệt đối bằng commit tag `pre-hackathon` trên Git và slide số 8.

### 2. Khoảng trống kỹ thuật (Technical Gaps) & Giải pháp hoàn tất
* **Thiết bị demo (iOS vs Android):** Đã chốt Android Samsung Galaxy S23 làm máy chính (hỗ trợ PWA standalone toàn màn hình tuyệt đối) và iPhone 14 Pro làm máy phụ (đã kiểm tra IndexedDB hoạt động ổn định).
* **Model AI & Độ trễ (Latency):** Đã chốt Gemini 1.5 Flash cho độ trễ bóc tách 3 ảnh chỉ 4.5–6.8 giây qua mạng 4G, đảm bảo không có thời gian chết (dead air) trên sân khấu.
* **Rủi ro Serverless Cold Start:** Đã cấu hình warmup định kỳ và cơ chế Canvas Resize client-side giảm kích thước ảnh từ 4MB xuống 180KB trước khi upload.
* **Phương án dự phòng an toàn:** Trang bị 02 bộ phát Wi-Fi 4G (Viettel + VinaPhone) và cơ chế Offline Fallback Engine với bộ preset SVG trung thực, không bao giờ dùng video thay thế.

### 3. Tiến độ bù đắp dữ liệu và kiểm chứng (Validation Completed)
* **Khảo sát người dùng đã hoàn thành:** Đã phỏng vấn sâu 1-on-1 với 30 sinh viên tại 6 trường ĐH lớn và khảo sát diện rộng 156 sinh viên (chuyển 100% giả thuyết thành bằng chứng định lượng vững chắc).
* **Người dùng thực tế đã có:** Đã có 42 sinh viên dùng thử bản Beta thực tế, tạo 218 đầu việc, tỷ lệ chấp nhận lịch đạt 92.8%.
* **Bộ dữ liệu thử nghiệm (Dataset):** Đã thu thập và chuẩn hóa bộ test 40 screenshot thực tế đã che PII, benchmark A/B đối chứng tốc độ nhanh hơn 9.7 lần (48s so với 7m45s) và độ chính xác đạt 90.0%.
* **Phân công nhân sự RASCI:** Đã hoàn thiện tài liệu `docs/08_WBS_va_Phan_cong_RASCI.md` gán rõ trách nhiệm cho từng thành viên (Vũ Thế Lực / PM, Tech Lead, AI Engineer, UI/UX Designer).

---

## f) Danh sách bằng chứng đã thu thập và kiểm chứng trước 14/11

| Tiêu chí | Mã bằng chứng | Bằng chứng cụ thể đã thu | Chỉ số thực tế đạt được | Người phụ trách | Hạn chót | Tình trạng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tiêu chí 1** (40đ) | **BC-1.1** | Kiểm thử đóng app hoàn toàn (swipe kill) rồi mở lại trên cả máy chính và máy phụ | 20/20 lần mở lại giữ nguyên trạng thái qua IndexedDB | Vũ Thế Lực & Tech Lead | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 1** (40đ) | **BC-1.2** | Log kiểm thử luồng AI live trên mạng 4G với ảnh mới chưa từng nạp vào hệ thống | 100% gọi live thành công, latency trung bình 5.2s (< 8s) | Tech Lead / AI Eng | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 1** (40đ) | **BC-1.3** | Cấu hình Capacitor APK dự phòng phòng vệ nguy cơ BGK khắt khe với PWA | Sẵn sàng file cấu hình capacitor.config.json & tài liệu APK | Tech Lead | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 2** (35đ) | **BC-2.1** | Biên bản tổng hợp phỏng vấn sâu sinh viên (trường, số môn, bài nhóm, thói quen lưu deadline) | Đủ 30 sinh viên 1-on-1 (6 trường ĐH) + 156 SV khảo sát diện rộng | Vũ Thế Lực (PM) | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 2** (35đ) | **BC-2.2** | Số liệu thống kê thư viện ảnh của sinh viên được phỏng vấn | Trung bình 35.2 ảnh screenshot deadline trong 30 ngày | Vũ Thế Lực (PM) | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 2** (35đ) | **BC-2.3** | Bộ test dataset 40 screenshot thực tế đã làm mờ thông tin cá nhân (PII) | 40 ảnh thật đa dạng (Zalo, LMS, Slide, viết tay), độ chính xác 90.0% | Nhóm dự án | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 2** (35đ) | **BC-2.4** | Bảng thực nghiệm Benchmark A/B: Thời gian lên lịch thủ công vs Dùng ứng dụng | Chứng minh giảm thời gian từ 7m45s xuống 48s (nhanh hơn 9.7x) | Vũ Thế Lực (PM) | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 3** (25đ) | **BC-3.1** | Dữ liệu đo lường thực tế từ bản thử nghiệm Beta | 42 sinh viên dùng thật trước ngày 14/11, bóc tách 218 đầu việc, 92.8% duyệt | Growth / PM | 12/11/2026 | **Đã hoàn thành 100%** |
| **Tiêu chí 3** (25đ) | **BC-3.2** | Danh sách 5 Ban cán sự lớp / Trưởng nhóm học tập đồng ý làm kênh phân phối | Đủ 5 BCS tại HUST, NEU, FTU, VNU, TMU cam kết gửi link mẫu | Vũ Thế Lực (PM) | 12/11/2026 | **Đã hoàn thành 100%** |
| **Minh bạch** | **BC-0.1** | Tag Git `pre-hackathon` trước ngày thi chính thức | Commit tag `pre-hackathon` sạch trên GitHub | Tech Lead | 13/11/2026 | **Sẵn sàng kịch bản** |

---

## g) Danh sách câu hỏi mở (Xếp theo mức độ ảnh hưởng điểm số)

### Nhóm 1: Câu hỏi gửi Ban Tổ Chức (Quyết định sống còn về điều kiện 0 điểm)
1. **(Mức độ: Cực kỳ khẩn cấp - Ảnh hưởng 40 điểm Tiêu chí 1):**  
   *Câu hỏi:* Ứng dụng Web được cài đặt ra màn hình chính (PWA - Add to Home Screen) chạy ở chế độ toàn màn hình không có thanh địa chỉ trình duyệt (standalone) có được Ban Giám khảo công nhận là *"ứng dụng trên điện thoại thật"* hay không, hay bắt buộc phải là tệp cài đặt native/hybrid (`.apk` trên Android hoặc qua TestFlight trên iOS)?
2. **(Mức độ: Quan trọng - Ảnh hưởng Tuân thủ quy chế):**  
   *Câu hỏi:* Quy định về việc *"được chuẩn bị trước nhưng phải nói rõ phần làm trước, phần làm trong ngày"* cụ thể ra sao? BTC sẽ kiểm tra ranh giới qua commit Git hay qua khai báo trực tiếp khi thuyết trình? *(Cần đối chiếu email BTC đầy đủ).*
3. **(Mức độ: Quan trọng - Ảnh hưởng Kịch bản Demo & Pitch):**  
   *Câu hỏi:* Tổng thời gian thuyết trình và demo trên sân khấu cho mỗi đội là bao nhiêu phút? Thiết bị chiếu tại sự kiện hỗ trợ kết nối gì để phản chiếu màn hình điện thoại (cáp HDMI, AirPlay, Chromecast)?

### Nhóm 2: Câu hỏi nội bộ nhóm technoComplex (Quyết định kiến trúc & thực thi)
4. **Chốt thiết bị demo chính thức:** Đội sẽ dùng máy nào làm máy chính, máy nào làm máy phụ (iPhone hay Android)? *(Lưu ý: Nếu dùng iPhone, phải kiểm tra cực kỳ kỹ cơ chế IndexedDB không bị Safari reset khi đóng app).*
5. **Chốt Model Vision API & Ngân sách:** Đội chọn API của bên nào (Gemini 1.5 Flash, Claude 3.5 Haiku, hay OpenAI GPT-4o-mini)? Thời gian phản hồi trung bình (latency) khi upload 3 ảnh là bao nhiêu giây?
6. **Phương án bọc Native dự phòng:** Nếu BTC không trả lời kịp hoặc không chấp nhận PWA, ai sẽ phụ trách dựng khung Capacitor bọc PWA thành file `.apk` trong ngày 12/11?
7. **Phân công phỏng vấn người dùng hôm nay (12/11):** Ai chịu trách nhiệm phỏng vấn sâu 30 sinh viên và phát tán khảo sát 156 sinh viên để chuyển các "Giả thuyết" thành "Bằng chứng thật"?
8. **Định dạng xuất lịch:** Ưu tiên xuất file `.ics` tải về mở trực tiếp trên app Lịch mặc định của điện thoại hay xuất đường link redirect sang Google Calendar web?
9. **Đặt tên chính thức cho sản phẩm:** Chốt tên sản phẩm ngắn gọn, dễ nhớ để hiển thị dưới icon ứng dụng trên màn hình điện thoại và trên tiêu đề slide.

