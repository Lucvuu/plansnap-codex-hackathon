# CẤU TRÚC PHÂN RÃ CÔNG VIỆC (WBS) & MA TRẬN PHÂN CÔNG TRÁCH NHIỆM (RASCI)
**Phân bổ nguồn lực và quản lý tiến độ chi tiết từng giờ hướng tới ngày thi 14/11/2026**

| | |
|---|---|
| **Dự án** | **PlanSnap** (Capture → Plan) |
| **Đội thi** | **technoComplex** – Codex Community Hackathon Hà Nội |
| **Mục tiêu quản trị** | Không chồng chéo đầu việc, không bỏ sót mốc thời gian, bảo đảm 100% bằng chứng trước giờ thi |
| **Chuẩn tham chiếu** | `D:\AITHUCCHIEN\OnBoard-Agent---Ngu-Ho-Tuong\System_Onboarding\Docs\Doc\01_Project_Governance\AIB_01-02_RASCI_v0.2.xlsx` |

---

## 1. Định nghĩa Vai trò trong Đội thi (Team Roles)

| Mã vai trò | Chức danh đảm nhiệm | Đại diện nhân sự | Trách nhiệm chính |
|:---:|---|---|---|
| **PM** | **Product Lead / PM** | Vũ Thế Lực | Quản trị tiến độ, bám sát thang điểm BTC, kịch bản pitch deck, quan hệ BTC, tổng hợp bằng chứng. |
| **TL** | **Tech Lead / System Architect** | Thành viên Kỹ thuật 1 | Kiến trúc hệ thống, PWA Core, IndexedDB persistence, chuẩn bị khung Capacitor `.apk` dự phòng. |
| **AI** | **AI / Backend Engineer** | Thành viên Kỹ thuật 2 | Vision LLM API (Gemini Flash), prompt engineering tiếng Việt, Structured Output schema, auto-retry logic. |
| **FE** | **Frontend / UI-UX Developer** | Thành viên Kỹ thuật 3 | Mobile PWA UI, module Canvas nén ảnh client, giao diện duyệt việc, module xuất `.ics`. |
| **UR** | **User Researcher / Growth** | Thành viên Hỗ trợ / Cả nhóm | Phỏng vấn sâu 30 SV 1-on-1, khảo sát diện rộng 156 SV, thu thập 40 screenshot dataset che PII, chạy benchmark đối chứng, thu feedback beta 42 users. |

---

## 2. Quy ước Ma trận Trách nhiệm RASCI

- **R (Responsible):** Người trực tiếp bắt tay vào thực hiện công việc.
- **A (Accountable):** Người duy nhất chịu trách nhiệm cuối cùng về chất lượng và hạn chót (Mỗi đầu việc chỉ có 1 chữ A).
- **S (Support):** Người tham gia hỗ trợ, cung cấp tài nguyên để hoàn thành.
- **C (Consulted):** Người được hỏi ý kiến chuyên môn trước khi ra quyết định.
- **I (Informed):** Người được thông báo kết quả sau khi hoàn thành.

---

## 3. Ma trận Phân công Trách nhiệm (RASCI Matrix)

| Mã WBS | Gói công việc (Work Package) | Hạn chót (Deadline) | Sản phẩm đầu ra (Deliverables) | PM | TL | AI | FE | UR |
|:---:|---|:---:|---|:---:|:---:|:---:|:---:|:---:|
| **WBS-01** | **Quản trị & Chiến lược Điểm số** | | | | | | | |
| 01.1 | Lập Thang điểm chuẩn & Bản đọc hiểu | 10h00 12/11 | [00_Thang_diem_BTC.md](00_Thang_diem_BTC.md) & [00_Doc_hieu.md](00_Doc_hieu.md) | **A/R** | C | C | I | I |
| 01.2 | Soạn thảo PRD & Thiết kế Kiến trúc Agent | 14h00 12/11 | [01_PRD.md](01_PRD.md) & [02_AGENTS.md](02_AGENTS.md) | **A** | R | R | C | I |
| 01.3 | Gửi email hỏi xác nhận PWA tới BTC | 11h00 12/11 | Email gửi BTC, ghi nhận phản hồi | **A/R** | C | I | I | I |
| 01.4 | Xây dựng RAID Log & Emergency Playbook | 16h00 12/11 | [06_RAID_Log_va_Kiem_thu.md](06_RAID_Log_va_Kiem_thu.md) | **A/R** | C | C | C | I |
| **WBS-02** | **Thu thập Bằng chứng thực tế (Tiêu chí 2 & 3)** | | | | | | | |
| 02.1 | Phỏng vấn sâu 30 SV 1-on-1 & khảo sát 156 SV | 18h00 12/11 | Biên bản phỏng vấn, 5 trích dẫn nguyên văn | A | I | I | I | **R** |
| 02.2 | Thu thập số liệu thư viện ảnh (đếm ảnh deadline) | 20h00 12/11 | Số liệu định lượng đưa vào Slide 2 | A | I | I | I | **R** |
| 02.3 | Thu thập 40 screenshot dataset thật đã che PII | 12h00 13/11 | Bộ test 40 ảnh đa dạng trong `test_dataset/` | S | I | C | I | **A/R** |
| 02.4 | Thực nghiệm Benchmark A/B (Làm tay vs App) | 16h00 13/11 | Video & bảng số liệu so sánh thời gian | **A** | I | I | S | R |
| 02.5 | Phát hành link Beta cho 40+ sinh viên dùng | 18h00 13/11 | 42 log người dùng (218 việc), feedback người thật | **A** | S | S | S | R |
| **WBS-03** | **Kỹ thuật & Phát triển Sản phẩm (Tiêu chí 1)** | | | | | | | |
| 03.1 | Dựng PWA Shell Standalone + Service Worker | 18h00 12/11 | PWA cài được ra màn hình chính, ẩn URL | I | **A/R** | I | S | I |
| 03.2 | Module IndexedDB lưu trữ bền vững (Zero Data Loss) | 21h00 12/11 | Thao tác lưu/khôi phục dữ liệu tức thì | I | **A/R** | I | S | I |
| 03.3 | Module nén ảnh Client (Canvas Resize max 1600px) | 22h00 12/11 | Giảm 95% dung lượng ảnh trước khi upload | I | S | I | **A/R** | I |
| 03.4 | Kết nối Vision LLM API (Gemini 1.5 Flash) | 12h00 13/11 | Endpoint API trích xuất JSON Structured | I | C | **A/R** | S | I |
| 03.5 | Thuật toán xếp lịch xác định (Code thuần EDF) | 15h00 13/11 | Thuật toán xếp khung rảnh chừa buffer | C | **A/R** | C | S | I |
| 03.6 | UI duyệt việc + Thẻ hỏi lại mốc mơ hồ 1-chạm | 17h00 13/11 | Màn hình tương tác mobile mượt mà | I | S | C | **A/R** | I |
| 03.7 | Module xuất lịch iCalendar (`.ics`) | 19h00 13/11 | Tệp `.ics` mở trực tiếp trong app Lịch | I | C | I | **A/R** | I |
| 03.8 | Bọc Capacitor tạo file `.apk` dự phòng | 21h00 13/11 | File cài đặt `.apk` sẵn sàng trong máy | I | **A/R** | I | S | I |
| **WBS-04** | **Kiểm thử & Đóng gói Pre-hackathon** | | | | | | | |
| 04.1 | Thử nghiệm Swipe-kill 20 lần trên 2 điện thoại demo | 22h00 12/11 | Video ghi hình 20 lần mở lại giữ nguyên trạng thái | **A** | R | I | R | I |
| 04.2 | Kiểm thử AI trên bộ test 40 ảnh (Đo độ chính xác) | 20h00 13/11 | Bảng đo độ chính xác trích việc, trích ngày | C | I | **A/R** | I | S |
| 04.3 | Đóng dấu Git Commit Tag `pre-hackathon` | 23h59 13/11 | Tag git sạch trên GitHub chứng minh quy chế | A | **A/R** | I | I | I |
| **WBS-05** | **Thuyết trình & Demo ngày 14/11 (Hackathon Day)** | | | | | | | |
| 05.1 | Hoàn thiện Slide Pitch Deck 8 trang | 10h00 14/11 | File slide hoàn chỉnh có đầy đủ số liệu thật | **A/R** | I | I | I | S |
| 05.2 | Tổng duyệt Kịch bản Demo 3 lần trên mạng 4G | 11h30 14/11 | Demo nhuần nhuyễn từng giây (dưới 3 phút) | **A** | R | R | R | S |
| 05.3 | Trình bày Pitching & Live Demo trước BGK | Chiều 14/11 | Màn biểu diễn đạt 100/100 điểm của BGK | **A/R** | R | S | S | S |

---

## 4. Lịch trình Theo dõi Trọng điểm (Critical Path)

```
[12/11 - Tối]: Chốt PWA Shell + Lưu IndexedDB + Test Swipe-kill 20 lần + Tổng hợp phỏng vấn SV
      │
      ▼
[13/11 - Trưa]: Hoàn thành kết nối Vision API + Thu thập đủ 40 screenshot dataset
      │
      ▼
[13/11 - Chiều]: Thuật toán Scheduler + Chạy Benchmark A/B + Phát hành Beta 10-20 SV
      │
      ▼
[13/11 - 22h00]: Chốt toàn bộ số liệu đo đạc thật vào Slide Deck
      │
      ▼
[13/11 - 23h59]: ĐÓNG DẤU GIT TAG `pre-hackathon` (Ranh giới quy chế)
      │
      ▼
[14/11 - Sáng]: Hoàn thiện tính năng tại chỗ + Test 3 lần kịch bản Demo trên 4G
      │
      ▼
[14/11 - Chiều]: THỰC CHIẾN PITCH & DEMO LIVE 100% TRÊN SÂN KHẤU!
```

