# PlanSnap Task 01 | PRD final bàn giao kỹ thuật

Ngày chốt 14/11/2026. Chủ trì triển khai và nghiệm thu thiết bị: Cường. Phạm vi này thay thế yêu cầu chỉ xuất .ics/link trong [PRD nền](../01_PRD.md) đối với Task 01.

## Kết quả cần bàn giao

Một sinh viên chọn ảnh có thông báo lịch trên Android, duyệt thông tin AI đọc được, cấp quyền khi lưu và thấy sự kiện trong lịch đã chọn. Sau đó, sinh viên chọn ảnh thông báo đổi lịch, duyệt giờ cũ → giờ mới và thấy **chính sự kiện đó được cập nhật** trên lịch. Lịch học, họp nhóm, Zalo, LMS, slide và ảnh bảng dùng cùng luồng.

**P0 và thứ tự triển khai.** Làm trọn luồng một sự kiện có giờ bắt đầu/kết thúc với Android Calendar trên điện thoại thật trước. Hợp đồng lịch dùng chung cho hai đích. Google Calendar trực tiếp qua OAuth là đích thứ hai trong phạm vi sản phẩm, dùng cùng bộ nghiệm thu khi kết nối sẵn. Task 01 chấp nhận một đích hoàn tất trên thiết bị thật. Nếu làm Google trước do đã có cấu hình thì vẫn nghiệm thu trên Android. Một người chọn một lịch đích cho mỗi sự kiện, tránh ghi hai bản khi Android đang hiển thị lịch Google đã đồng bộ. Bản đóng gói Android có thể tái dùng UI/JS của repo qua Capacitor và bridge native.

**Đầu ra mặc định.** Lịch có giờ là sự kiện tại đúng khoảng giờ trong nguồn. Thông báo chỉ có hạn nộp là loại riêng, hiển thị “Hạn nộp”, không suy ra một phiên làm việc. Hạn có ngày nhưng thiếu giờ có thể duyệt thành mốc cả ngày. Hạn có giờ nhưng thiếu khoảng sự kiện dùng mốc 15 phút được ghi rõ trong preview, người dùng có thể sửa hoặc đổi sang cả ngày. Lập lịch làm quanh giờ rảnh, sự kiện lặp, đa lịch đồng thời, mời khách và tóm tắt toàn cuộc họp là phần sau Task 01.

## Luồng và yêu cầu chức năng

| Mã | Hành vi chốt | Tiêu chí chấp nhận |
|---|---|---|
| F01 | Từ màn chính chọn một ảnh Android để quét. Có preview, đổi/bỏ ảnh trước khi gửi. Ảnh không đọc được thì có trạng thái thử lại. | Ảnh từ hệ thống chọn ảnh hoặc ảnh camera đã lưu mở được. Quay lui hoặc hủy không ghi gì. Ảnh lỗi, quá lớn, mất mạng hoặc không có lịch cho phản hồi rõ ràng. |
| F02 | AI trả về tiêu đề, loại, ngày/giờ, timezone nếu có, địa điểm hoặc link nếu có, câu trích và trường thiếu/mâu thuẫn. Với ảnh đổi lịch, trả thêm tên lịch được nhắc và mốc cũ khi có. | Hiển thị riêng dữ liệu đọc được và dữ liệu cần hỏi. Giữ ngày địa phương và múi giờ đến lúc ghi. Thiếu năm, giờ thiếu, thứ/ngày mâu thuẫn hoặc mốc tương đối thiếu ngày gửi thì hỏi xác nhận. Với nhiều ứng viên người dùng chọn một. Ảnh không có lịch không tạo preview có thể ghi thẳng. |
| F03 | Preview cho xem ảnh nguồn trong phiên, câu trích, tên sự kiện, ngày/giờ, địa điểm và lịch đích. Người dùng sửa được và bấm xác nhận. | Múi giờ mặc định theo máy được hiển thị. Nếu ảnh chỉ ghi “hôm nay/mai” và không có mốc đáng tin thì người dùng xác nhận ngày. End phải sau start, sự kiện cả ngày hiển thị đúng ngày, link và địa điểm trống nếu ảnh thiếu. |
| F04 | Khi người dùng chọn ghi, xin quyền Android Calendar hoặc Google OAuth tùy đích. Chỉ liệt kê/cho chọn lịch ghi được trên đường Android. Đường Google mặc định dùng lịch phụ PlanSnap do app tạo. | Từ chối hoặc hủy cấp quyền giữ bản nháp và cho thử lại. Chỉ báo “Đã lưu vào lịch” sau phản hồi ghi thành công, lưu ID thật và cho xem tên lịch đích hoặc mở lịch. Tạo lại cùng thao tác sau lỗi không nhân bản. |
| F05 | Từ chi tiết sự kiện bấm “Cập nhật từ ảnh mới”. Sự kiện đang mở là đích cập nhật. Nếu bắt đầu từ màn quét, chọn cụ thể một sự kiện PlanSnap đã lưu. Sau đó AI đọc ảnh mới và user duyệt phần thay đổi. | So sánh cũ/mới và cảnh báo nếu ảnh có tên/sự kiện khác hoặc xung đột. Chỉ sửa trường có thay đổi được người dùng xác nhận. Trường không nhắc trong ảnh mới giữ giá trị cũ. Chụp lại ảnh y hệt hoặc áp dụng cùng giá trị đưa ra “Không có thay đổi”. |
| F06 | Cập nhật bản ghi cũ bằng calendarId + eventId cùng đích đã lưu. Mở lại đúng ngày/giờ. | Event ID giữ nguyên, chỉ có một sự kiện, các lịch khác không đổi. Nếu bị sửa ngoài app từ lần gần nhất, hiện trạng thái xung đột và cho duyệt trên dữ liệu mới. Mất quyền, mất mạng, sai tài khoản, lịch chỉ đọc hoặc sự kiện bị xóa giữ đề xuất để người dùng xử lý. Nếu sự kiện đã bị xóa, chỉ tạo lại sau một xác nhận tạo mới. |
| F07 | Giữ liên kết và trạng thái ghi bền vững qua đóng/mở. | Sau force-stop/mở lại vẫn biết sự kiện và đích. Không hiển thị đã cập nhật trong khi ghi lỗi. Nếu mất kết nối hoặc app tắt giữa yêu cầu ghi và nhận phản hồi, vào trạng thái cần đối chiếu, đọc lại bản ghi/khóa thao tác trước khi cho retry. Nếu chưa đối chiếu được thì giữ trạng thái chờ. |

### Quy tắc thời gian và dữ liệu

- Khi tạo ghi `itemId`, loại, tiêu đề, start/end hoặc date, IANA timezone, địa điểm, dòng trích đã duyệt, các nguồn tham chiếu tối thiểu, `provider + calendarId + externalEventId`, revision/etag nếu provider có và fingerprint các trường đã đọc/ghi. Provider state: nháp, đang ghi, đã đồng bộ, lỗi hoặc cần đối chiếu. Metadata về quyền và tài khoản phải gắn với đích đã chọn.
- Lưu timestamp tuyệt đối cùng timezone cho sự kiện có giờ. Calendar Provider dùng millis và timezone theo hợp đồng nền tảng. Google dùng dateTime có offset/timeZone hoặc date cho cả ngày. Kiểm ngày cả ngày với end là ngày kế tiếp theo quy ước API và cách Android hiển thị.
- Xử lý thao tác tuần tự theo item. Mỗi lần xác nhận có khóa thao tác bền vững. Google insert dùng event ID hợp lệ sinh ổn định, tra lại ID khi kết quả không rõ. Android insert cần lưu khóa nhận diện ổn định với sự kiện và ledger trước khi gọi Provider, đối chiếu lịch đích với khóa trước khi insert lại. Nếu không phân biệt chắc chắn được bản ghi thì yêu cầu duyệt thủ công.
- Trên Android, đọc/lấy lịch ghi được và đối chiếu sự kiện cần quyền đọc, ghi trực tiếp cần quyền ghi theo Calendar Provider. Trên Google, ưu tiên scope `calendar.app.created` cho lịch phụ PlanSnap. Thiết lập consent và account test trước khi chạy. Nếu sau này người dùng chọn lịch Google cá nhân hiện hữu thì thiết kế cấp quyền cho phạm vi khác. Chỉ xin quyền khi người dùng chọn đích; tránh token trong log hoặc source.
- Với đường Google, tải bản hiện tại và dùng điều kiện phiên bản (ETag/If-Match) khi có thể. Đường Android cập nhật theo ID và điều kiện khớp các trường đã đối chiếu nếu provider hỗ trợ selection; nếu số hàng cập nhật bằng 0, đọc lại để xử lý xung đột hoặc bản ghi bị xóa. Luôn đọc lại sau ghi. Chỉ thay trường đã duyệt. Lưu ý .ics và link tạo lịch chỉ phục vụ xuất thủ công, không đủ bằng chứng để đạt F05–F07.
- Khi gửi ảnh lên API, hiển thị ảnh do người dùng chọn được dùng để trích lịch. Lịch đích chỉ nhận dữ liệu sự kiện cần thiết. Dòng trích và ảnh không đi vào Calendar mặc định. Ảnh preview chỉ cần trong phiên; không ghi ảnh thật, nội dung nguồn hay token vào telemetry. Nếu dùng ảnh làm bằng chứng thử nghiệm, dùng mock hoặc ảnh đã ẩn thông tin và được đồng ý.

## Thứ tự code và nghiệm thu

1. Cường chạy thử create/update cùng ID trên một lịch thật Android (hoặc Google nếu đã cấp consent). Chốt build, máy, lịch ghi được và khả năng đọc lại. Dùng nhánh riêng, ví dụ `codex/calendar-image-update`, trước khi đưa thay đổi lên Git.
2. Nối bản UI preview + xác nhận với dữ liệu fixture và kiểm F03–F07. Kết nối AI ảnh live và chạy lại chính cặp ảnh đó để kiểm F01–F02. Android là thiết bị nghiệm thu kể cả khi đích là Google.
3. Kiểm lần lượt một lượt tạo và sửa, force-stop/mở lại, quét lặp, từ chối quyền, mất kết nối, sửa ngoài app hoặc xóa sự kiện. Vũ ghi case, build/commit, Android/OS, lịch đích, ID đã ẩn, expected/actual, thời gian và ảnh trước/sau.

**Done Task 01:** Trên điện thoại Android thật, 3 lượt độc lập qua cặp ảnh thật tạo/đổi lịch có giờ có kết quả đúng và cùng ID trong từng lượt, trong đó có một lần đóng hẳn rồi mở lại giữa A và B. Quét lại B không tạo bản thứ hai. Cất log nghiệm thu, ghi chính xác đích đã kiểm. Mục tiêu pilot chẩn đoán: median từ chọn ảnh đến preview ≤ 10 giây trên set ảnh rõ, và sự kiện khớp ngày/giờ trong tất cả lượt chính. Bộ ảnh công khai A/B dùng kiểm đổi ngày. Để nghiệm thu ca có giờ, bổ sung cặp ảnh thật có đủ giờ và gọi AI live.

## Nguồn và tài liệu dùng kèm

- [Android Calendar Provider](https://developer.android.com/identity/providers/calendar-provider) · [Android Google authorization](https://developer.android.com/identity/authorization)
- [Google Calendar OAuth scopes](https://developers.google.com/workspace/calendar/api/auth) · [Create events](https://developers.google.com/workspace/calendar/api/guides/create-events) · [Patch events](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch) · [Conditional modification](https://developers.google.com/workspace/calendar/api/guides/version-resources)
- [Ảnh công khai và ca Android](android-calendar-test/README.md)
