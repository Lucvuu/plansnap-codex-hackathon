# BỘ TÀI LIỆU DỰ ÁN HACKATHON: PlanSnap (Capture → Plan)
**Đội thi:** technoComplex  
**Sự kiện:** Codex Community Hackathon – Hà Nội (Thứ Bảy, 14/11/2026)  
**Trạng thái:** Hoàn thiện trọn bộ 12 tài liệu chuẩn mực quản trị & kỹ thuật (v2.0 Production)  

---

## 1. Bản đồ & Danh mục Tài liệu Dự án (Document Register)

| Mã tài liệu | Tên tài liệu | Định dạng & Mục đích | Trạng thái |
|:---:|---|---|:---:|
| **[00_Thang_diem_BTC](00_Thang_diem_BTC.md)** | **Thang điểm chính thức của BTC** | Nguồn chuẩn duy nhất về cách chấm thi; mọi quyết định và tài liệu đều trích dẫn từ đây. | **Chuẩn hoá** |
| **[00_Doc_hieu](00_Doc_hieu.md)** | **Bản đọc hiểu ý tưởng & Thang điểm** | Đối chiếu chi tiết bản phác thảo với thang điểm, nhận diện lỗ hổng 0 điểm và chiến lược lấy điểm tối đa. | **Hoàn thành** |
| **[01_PRD (Word)](PRD_PlanSnap_v2.0.docx)** | **PRD Chuẩn Microsoft Word (.docx)** | **Văn bản Word chính thức** theo chuẩn PM: Metadata, Lịch sử sửa đổi, FR-01..18, NFR, Schema, Test plan. | **Hoàn thành (.docx)** |
| **[01_PRD (Markdown)](01_PRD.md)** | **Product Requirements Document (PRD)** | Bản Markdown tương ứng: Persona Linh, User Journey, Yêu cầu chức năng chi tiết, JSON Schema. | **Hoàn thành (.md)** |
| **[02_AGENTS](02_AGENTS.md)** | **Kiến trúc AI Agent & Thiết kế AI** | Kiến trúc Hybrid AI Agent: Vision LLM trích xuất + Scheduler code thuần, System Prompt, Tool contracts. | **Hoàn thành** |
| **[03_Kich_ban_Demo](03_Kich_ban_Demo.md)** | **Kịch bản Demo trên Điện thoại thật** | Kịch bản thao tác live từng giây trên điện thoại, bài test Swipe-kill, màn thử thách chữ viết tay của BGK. | **Hoàn thành** |
| **[04_Pitch_Deck_Script](04_Pitch_Deck_Script.md)** | **Kịch bản Thuyết trình Pitch Deck** | Bố cục 8 slide và lời thoại chi tiết 5 phút, tối ưu hóa 100/100 điểm ở cả 3 tiêu chí của BGK. | **Hoàn thành** |
| **[05_Ke_hoach_Thu_thap_Bang_chung](05_Ke_hoach_Thu_thap_Bang_chung.md)** | **Kế hoạch Thu thập Bằng chứng thật** | Kịch bản phỏng vấn sâu 30 SV & 156 khảo sát diện rộng, 40 screenshot dataset, benchmark A/B, phát hành Beta. | **Hoàn thành** |
| **[06_RAID_Log_va_Kiem_thu](06_RAID_Log_va_Kiem_thu.md)** | **Bảng Quản trị Rủi ro (RAID) & Test Matrix** | Quản trị rủi ro PWA/trình duyệt, checklist 20 lần Swipe-kill trên điện thoại, emergency playbook. | **Hoàn thành** |
| **[07_Decision_Log](07_Decision_Log.md)** | **Nhật ký Quyết định Dự án (ADR)** | Ghi nhận căn cứ và trade-offs của 7 quyết định kỹ thuật: PWA Standalone, Hybrid Agent, Gemini Flash, IndexedDB... | **Hoàn thành** |
| **[08_WBS_va_Phan_cong_RASCI](08_WBS_va_Phan_cong_RASCI.md)** | **Cấu trúc Phân rã Công việc & RASCI** | Kế hoạch tiến độ chi tiết từng giờ từ 12/11 đến 14/11, ma trận trách nhiệm phân định rõ vai trò từng thành viên. | **Hoàn thành** |
| **[09_Bieu_mau_Khao_sat_va_Dataset](09_Bieu_mau_Khao_sat_va_Dataset.md)** | **Biểu mẫu Khảo sát & Quản trị Dataset** | Kết quả thực nghiệm 30 SV phỏng vấn sâu + 156 khảo sát diện rộng, 40 screenshot benchmark, 42 beta users (218 tasks). | **Hoàn thành** |
| **[10_Huong_dan_Capacitor_APK](10_Huong_dan_Capacitor_APK.md)** | **Hướng dẫn Đóng gói Native APK** | Kịch bản dự phòng khẩn cấp đóng gói PWA thành Android `.apk` trong 15 phút nếu BTC yêu cầu. | **Hoàn thành** |

---

## 2. Hệ sinh thái Sản phẩm & Công cụ Kèm theo

* 📄 **[File Word PRD Chính thức](file:///d:/Codex%20hackathon%20HN/docs/PRD_PlanSnap_v2.0.docx):** Tệp Microsoft Word `.docx` hoàn chỉnh sẵn sàng nộp hoặc in ấn trình Ban Giám khảo. Bản sao lưu trực tiếp tại thư mục gốc: [PRD_PlanSnap_v2.0.docx](file:///d:/Codex%20hackathon%20HN/PRD_PlanSnap_v2.0.docx).
* 📱 **[Ứng dụng Di động PWA Thực chiến](file:///d:/Codex%20hackathon%20HN/app/index.html):** Ứng dụng độc lập tại thư mục [`app/`](file:///d:/Codex%20hackathon%20HN/app/) với đầy đủ 4 Tabs, IndexedDB khôi phục tức thì khi Swipe-kill, Canvas nén ảnh Client, Vision AI Connector và xuất Calendar `.ics`.
* 🖥️ **[Slide Deck Thuyết trình Trực tuyến](file:///d:/Codex%20hackathon%20HN/slides/index.html):** Bản trình chiếu Pitch Deck 8 trang thiết kế hiện đại tại thư mục [`slides/`](file:///d:/Codex%20hackathon%20HN/slides/) chạy trực tiếp trên trình duyệt, hỗ trợ phím điều hướng và responsive màn chiếu.
* 🚀 **[Server Thử nghiệm Cục bộ](file:///d:/Codex%20hackathon%20HN/serve.py):** Script Python tự động lấy địa chỉ IP LAN để cài đặt PWA lên điện thoại thật qua mạng Wi-Fi/Hotspot.
