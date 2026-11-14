# PlanSnap | Quy chuẩn Nhận diện Thương hiệu & Thiết kế (Brand Guidelines)

**Đội:** technoComplex · **Dự án:** PlanSnap · **Sự kiện:** Codex Community Hackathon Hà Nội 2026  
**Câu định vị thương hiệu:** “Từ ảnh thông báo đến lịch làm việc.”  
**Wordmark chuẩn:** **PlanSnap** *(Chữ P và S viết hoa, viết liền, không dấu cách)*.

---

## 1. Triết lý Thiết kế & Định vị Nhận diện

PlanSnap sinh ra nhằm giải quyết một vấn đề bức xúc nhưng thường trực của sinh viên đại học: thông tin bài tập, đề cương và hạn chót bị xé lẻ giữa hệ thống LMS trường, nhóm chat Zalo và ảnh chụp slide trên lớp.

Định hướng thiết kế của PlanSnap tuân thủ 4 nguyên tắc cốt lõi:
1. **Phẳng & Hình học (Pure Geometric):** Sử dụng các khối hình học cơ bản, đường nét dứt khoát, loại bỏ hoàn toàn các chi tiết rườm rà, hiệu ứng đổ bóng phức tạp hay hình ảnh 3D lỗi thời.
2. **Không biểu tượng AI sáo rỗng:** Tuyệt đối tránh hình ảnh robot, tia sáng ma thuật (sparkles), đũa thần hay chữ "AI" thu nhỏ. AI trong PlanSnap là động cơ ngầm bên dưới, giá trị thực sự người dùng nhận được là **Sự chắc chắn và Lịch làm việc rõ ràng**.
3. **Khoảng âm mạnh mẽ (Punchy Negative Space):** Các đường cắt và khoảng hở âm bản tạo nên nhịp điệu thị giác sắc nét, giúp biểu tượng dễ nhận biết ngay cả ở kích thước siêu nhỏ 24px.
4. **Chuẩn mực Android & Nghiêm túc:** Phù hợp với ngôn ngữ thiết kế hiện đại của Android 14/15, đủ trẻ trung cho sinh viên và đủ chuẩn mực, tin cậy trước Ban Giám khảo.

---

## 2. Đề xuất Ba Phương án Biểu tượng & Quyết định

Ba phương án biểu tượng được nghiên cứu và dựng hình vector độc lập:

| Phương án | Ý niệm thị giác | Silhouette & Nhận diện | Đánh giá |
|---|---|---|---|
| **Phương án 1 (Ưu tiên)**<br>*(Focus Frame & Day Grid)* | 4 góc khung ngắm máy ảnh (`┌ ┐ └ ┘`) ôm trọn một ô ngày lịch hình học phẳng với đường cắt âm bản thể hiện thanh tiêu đề tháng và ô ngày làm việc. | Cân xứng hoàn hảo, 4 góc khung ngắm định vị tức thì thao tác "Snap", khối lịch vuông định vị "Plan". Rõ nét ở 24px. | **ĐƯỢC CHỌN LÀM BIỂU TƯỢNG CHÍNH THỨC** |
| **Phương án 2**<br>*(Converging Sheet & Timeline)* | Một tờ ảnh thông báo góc gấp 45° (photo sheet) thu nhỏ và chuyển hóa dần xuống một khối sự kiện lịch ngang (time-slot block). | Dòng chuyển động từ trên xuống dưới mô phỏng luồng xử lý dữ liệu. | Tốt ở kích thước lớn, nhưng kém cân đối ở 24px trên icon launcher tròn. |
| **Phương án 3**<br>*(Shutter 'P' & Time Pin)* | Chữ 'P' monogram cách điệu với nét dọc và vai trên tạo bởi khung ngắm, bụng chữ P ôm một dấu mốc thời gian / calendar pin. | Tính nhận diện chữ cái cao, mang dáng dấp logo công nghệ. | Dễ nhầm lẫn với các app ghi chú/ảnh khác; không trực quan bằng biểu tượng ô ngày. |

### Lý do lựa chọn Phương án 1 (Trình bày 2 câu):
> **Biểu tượng Phương án 1 kết hợp trực quan giữa 4 góc khung chụp (Snap) ôm trọn ô ngày lịch (Plan), truyền tải trực tiếp thông điệp “Từ ảnh thông báo đến lịch làm việc” mà không cần chi tiết AI hay tia sáng trang trí thừa thãi.**  
> **Hình khối phẳng với khoảng âm dứt khoát duy trì độ nhận diện tức thì ở 24px trên thanh trạng thái Android, đồng thời giữ vững tính kỷ luật và nghiêm túc cần thiết trước Ban Giám khảo.**

---

## 3. Quy chuẩn Bảng màu Hệ thống (Color System)

Bảng màu được trích xuất đồng bộ từ `mobile/src/theme.ts` và `app/css/style.css`:

### 3.1. Màu Thương hiệu & Giao diện Chính

| Tên Token | Mã Hex | RGB | Vai trò & Ứng dụng | Tương phản WCAG |
|---|---|---|---|---|
| **Brand Blue** | `#2563EB` | `rgb(37, 99, 235)` | Màu nhận diện chủ đạo, nút bấm chính, icon nền, ngày kích hoạt | 4.9:1 trên nền trắng (Đạt AA) |
| **Blue Hover/Active** | `#1D4ED8` | `rgb(29, 78, 216)` | Trạng thái nhấn giữ (pressed), viền tập trung (focus), gradient chân | 6.2:1 trên nền trắng (Đạt AAA) |
| **Blue Soft** | `#EFF6FF` | `rgb(239, 246, 255)` | Nền thẻ làm việc được chọn, ô lịch phụ, badge thông tin | Nền phụ tương phản cao với chữ đậm |
| **Background** | `#F5F5F7` | `rgb(245, 245, 247)` | Nền toàn ứng dụng (Neutral canvas dịu mắt) | Nền chuẩn cho Android & Splash |
| **Surface** | `#FFFFFF` | `rgb(255, 255, 255)` | Nền thẻ card, bottom sheet, calendar day cell, modal | Nền tương phản cao |
| **Text Primary (Ink)** | `#111827` | `rgb(17, 24, 39)` | Tiêu đề, tên công việc, chữ wordmark "Plan" | 16.1:1 trên nền trắng (Đạt AAA) |
| **Text Secondary** | `#4B5563` | `rgb(75, 85, 99)` | Đoạn trích dẫn nguyên văn, câu thương hiệu, nhãn mô tả | 7.0:1 trên nền trắng (Đạt AAA) |
| **Text Muted** | `#6B7280` | `rgb(107, 114, 128)` | Thời gian phụ, watermark, placeholder | 4.5:1 trên nền trắng (Đạt AA) |
| **Border / Subtle** | `#E5E7EB` | `rgb(229, 231, 235)` | Viền thẻ, đường ngăn cách tab, divider | Viền phân định cấu trúc |

### 3.2. Màu Trạng thái Ngữ nghĩa (Semantic Status Colors)

> [!IMPORTANT]
> **Nguyên tắc Tiếp cận (Accessibility Rule):** Tuyệt đối không dùng độc lập màu sắc để báo trạng thái. Mọi thẻ trạng thái đều phải kết hợp giữa màu nền, màu chữ, biểu tượng trực quan (icon) và nhãn chữ mô tả rõ ràng.

| Trạng thái | Mã Hex Màu | Mã Hex Nền Nhạt | Biểu tượng đi kèm | Ý nghĩa trong PlanSnap |
|---|---|---|---|---|
| **Đã xác nhận (Confirmed)** | `#059669` *(Emerald)* | `#ECFDF5` | Icon dấu tích tròn (Checkmark) | Hạn chót rõ ràng từ ảnh hoặc người dùng đã bấm duyệt ngày. |
| **Cần kiểm lại (Review Needed)** | `#D97706` *(Amber)* | `#FFFBEB` | Icon chấm than tam giác (Alert) | Hạn tương đối ("thứ 6 tuần sau") cần người dùng chọn ngày chính xác. |
| **Lỗi / Xung đột (Error)** | `#DC2626` *(Crimson)* | `#FEF2F2` | Icon dấu nhân tròn (Cross) | Ảnh mờ không đọc được ngày, hoặc khung giờ bị trùng lịch cứng. |

---

## 4. Quy chuẩn Kiểu chữ (Typography)

Ứng dụng PlanSnap và toàn bộ tài liệu trình chiếu sử dụng duy nhất họ phông chữ **Be Vietnam Pro** (đã tích hợp trong package `@expo-google-fonts/be-vietnam-pro`).

- **Đặc tính:** Thiết kế hình học hiện đại (geometric sans-serif), tối ưu hóa đặc biệt cho tiếng Việt với dấu thanh được căn chỉnh hoàn hảo, không bị đè dấu hay vỡ layout trên màn hình mật độ điểm ảnh cao của Android.
- **Quy tắc bảo toàn dấu tiếng Việt:** Luôn hiển thị đầy đủ dấu câu (`À, Ả, Ã, Á, Ạ, Ă, Â, Ê, Ô, Ơ, Ư, Đ`), không viết tắt cẩu thả.
- **Chữ số dạng bảng (Tabular Nums):** Bật thuộc tính `fontVariant: ['tabular-nums']` cho các trường ngày giờ, đồng hồ đếm ngược và bảng số liệu tài chính để các con số thẳng hàng tuyệt đối.

### Thang đo kiểu chữ:
- **Display (Tiêu đề Slide / Splash):** 40px – 56px, SemiBold 600 / Bold 700, letter-spacing -1.5px.
- **Heading 1 (Tên màn hình, Modal):** 24px – 28px, Bold 700, letter-spacing -0.5px.
- **Heading 2 (Thẻ công việc, Section):** 18px – 20px, SemiBold 600.
- **Body Regular (Đoạn văn, Mô tả):** 15px – 16px, Regular 400, line-height 1.5.
- **Caption / Meta (Câu trích dẫn, Giờ):** 12px – 13px, Medium 500, Text Secondary.

---

## 5. Khoảng trống An toàn & Kích thước Tối thiểu

### 5.1. Khoảng trống an toàn (Clear Space)
- Vùng cách ly an toàn xung quanh Logo Mark và Wordmark có kích thước tối thiểu là **1X**, trong đó **X** bằng bề dày của thanh góc khung ngắm (tương đương 1/8 chiều cao logo).
- Không được để bất kỳ yếu tố đồ họa, chữ viết hoặc cạnh viền nào xâm phạm vào vùng cách ly này.

### 5.2. Kích thước tối thiểu (Minimum Sizes)
- **Kỹ thuật số (Digital):**
  - Logo Mark đơn lẻ: Tối thiểu **24px × 24px** (Thanh trạng thái, Favicon).
  - Wordmark ngang đầy đủ: Tối thiểu **120px × 32px**.
- **In ấn (Print):**
  - Logo Mark: Tối thiểu **8mm × 8mm**.
  - Wordmark ngang: Tối thiểu **35mm × 10mm**.

### 5.3. Các biến thể màu sắc cho phép
1. **Bản màu chính (Full Color):** Khung ngắm và ô lịch màu Brand Blue `#2563EB` trên nền trắng hoặc nền xám `#F5F5F7`.
2. **Bản đơn sắc âm bản (Monochrome Light):** Toàn bộ biểu tượng màu trắng `#FFFFFF` trên nền xanh `#2563EB` hoặc nền đen `#111827`.
3. **Bản đơn sắc dương bản (Monochrome Dark):** Toàn bộ biểu tượng màu mực `#111827` trên nền sáng.
4. **Cấm kỵ:** Không tự ý đổi màu khung ngắm sang màu khác (ví dụ đỏ/vàng), không đổ bóng 3D, không bóp méo tỷ lệ width/height, không ghép tia sáng AI vào các góc biểu tượng.

---

## 6. Android Adaptive Icon & Đối chiếu Kỹ thuật EAS Build

Thiết kế Adaptive Icon của PlanSnap tuân thủ nghiêm ngặt quy chuẩn của Android:
- **Kích thước canvas tổng thể:** 108dp × 108dp (1024px × 1024px trong tệp nguồn).
- **Vùng an toàn (Safe Zone):** Hình tròn đường kính 72dp (682.6px trong tệp 1024px) đặt tại tâm. Toàn bộ chi tiết quan trọng của biểu tượng (4 góc khung ngắm và ô ngày lịch) nằm gọn trong bounding box 544px × 544px, cách mép vùng an toàn hơn 30px. Đảm bảo biểu tượng **không bao giờ bị cắt xén** trên mọi launcher của Android (Pixel hình tròn, Samsung Squircle, Xiaomi vuông bo góc).

### Đối chiếu đường dẫn Asset với `mobile/app.json`:

| Khai báo trong `mobile/app.json` | Đường dẫn tệp bàn giao | Kích thước | Mô tả kỹ thuật | Trạng thái |
|---|---|---|---|---|
| `"icon": "./assets/icon.png"` | `mobile/assets/icon.png` | 1024 × 1024 | Nền `#2563EB`, logo mark trắng ở tâm. Dùng cho Google Play Store, iOS và launcher cũ. | **ĐÃ BÀN GIAO** |
| `"android.adaptiveIcon.backgroundColor": "#2563eb"` | *Khai báo màu* | Hex | Màu nền hệ thống khi mở rộng layer nền. | **KHỚP 100%** |
| `"android.adaptiveIcon.backgroundImage": "./assets/android-icon-background.png"` | `mobile/assets/android-icon-background.png` | 1024 × 1024 | Layer nền đơn sắc `#2563EB`. | **ĐÃ BÀN GIAO** |
| `"android.adaptiveIcon.foregroundImage": "./assets/android-icon-foreground.png"` | `mobile/assets/android-icon-foreground.png` | 1024 × 1024 | Layer tiền cảnh: Biểu tượng trắng trên nền trong suốt, nằm trong vùng an toàn 72dp. | **ĐÃ BÀN GIAO** |
| `"android.adaptiveIcon.monochromeImage": "./assets/android-icon-monochrome.png"` | `mobile/assets/android-icon-monochrome.png` | 1024 × 1024 | Layer biểu tượng trắng trên nền trong suốt dành riêng cho tính năng Themed Icons (Android 13+). | **ĐÃ BÀN GIAO** |
| `"splash.image": "./assets/splash-icon.png"` | `mobile/assets/splash-icon.png` | 1024 × 1024 | Biểu tượng xanh `#2563EB` trên nền trong suốt (hiển thị trên nền splash `#F5F5F7` của Expo). | **ĐÃ BÀN GIAO** |
| `"web.favicon": "./assets/favicon.png"` | `mobile/assets/favicon.png` | 48 × 48 | Icon app thu nhỏ chuẩn pixel-perfect cho tab trình duyệt. | **ĐÃ BÀN GIAO** |

---

## 7. Hai Ví dụ Ứng dụng Thực tế (Application Mockups)

### 7.1. Màn hình Khởi động Ứng dụng (App Splash Screen)
- **Tỷ lệ:** 9:16 (Màn hình dọc điện thoại Android).
- **Màu nền:** `#F5F5F7` (khớp chính xác thuộc tính `backgroundColor` trong `app.json`).
- **Trung tâm:** Biểu tượng Logo Mark Phương án 1 màu Brand Blue `#2563EB`, hiển thị với kích thước tương đương `imageWidth: 120dp`.
- **Dưới cùng:** Wordmark "PlanSnap" và câu định vị "Từ ảnh thông báo đến lịch làm việc." bằng màu Text Secondary `#4B5563`, mang lại cảm giác khởi động êm ái, chuyên nghiệp trong 0.3 giây.

### 7.2. Bìa Trình chiếu Hackathon (Pitch Deck Cover)
- **Tỷ lệ:** 16:9 (Chuẩn máy chiếu hội trường).
- **Bố cục:** Bên trái là Wordmark cỡ lớn, câu định vị thương hiệu và thông tin đội thi technoComplex; bên phải là mô phỏng ảnh thông báo Zalo/LMS chuyển dịch mượt mà vào khung lịch làm việc đã xếp giờ.

---

## 8. Danh mục Tệp Thiết kế Bàn giao (Delivery Manifest)

Thư mục bàn giao chính: `assets/brand/` và `mobile/assets/`:
- `assets/brand/logo-mark.svg` *(Master Vector Mark)*
- `assets/brand/logo-mark-1024.png` *(High-res 1024x1024)*
- `assets/brand/logo-wordmark.svg` *(Master Horizontal Wordmark)*
- `assets/brand/logo-wordmark-1024.png` *(High-res Horizontal Wordmark)*
- `assets/brand/logo-monochrome-dark.svg` & `.png` *(Bản đơn sắc tối)*
- `assets/brand/logo-monochrome-light.svg` & `.png` *(Bản đơn sắc sáng)*
- `assets/brand/symbol-options.svg` *(Bảng so sánh 3 phương án)*
- `mobile/assets/icon.png` *(App Icon)*
- `mobile/assets/android-icon-foreground.png` *(Adaptive Foreground)*
- `mobile/assets/android-icon-background.png` *(Adaptive Background)*
- `mobile/assets/android-icon-monochrome.png` *(Adaptive Themed Monochrome)*
- `mobile/assets/splash-icon.png` *(Splash Icon)*
- `mobile/assets/favicon.png` *(Favicon 48px)*
