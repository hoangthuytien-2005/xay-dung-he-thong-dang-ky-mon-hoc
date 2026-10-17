# UniCredit Portal - Hệ thống Đăng ký Tín chỉ Trực tuyến

Hệ thống Đăng ký Tín chỉ & Quản lý Học vụ Trực tuyến được thiết kế tham khảo luồng nghiệp vụ thực tế của **Cổng đào tạo Học viện Bưu chính Viễn thông (qldt.ptit.edu.vn)**, kết hợp diện mạo nhận diện độc lập, hiện đại, tối giản và tối ưu trải nghiệm người dùng (UX).

---

## 🌟 Điểm nổi bật & Triết lý Thiết kế

1. **Bộ nhận diện & Tone màu dịu mắt (Academic Clean):**
   - **Màu chủ đạo:** Deep Navy & Slate (`#0F172A`, `#1E293B`, `#2563EB`) kết hợp nền Off-White dịu mắt (`#F8FAFC`).
   - **Không sử dụng gradient màu mè:** Tôn trọng thị giác của sinh viên khi phải tra cứu và đăng ký môn trong nhiều giờ.
   - **Bo góc chuẩn mực (`rounded-md` 6px - 8px):** Không bo tròn quá mức dạng viên thuốc, tạo sự chuyên nghiệp của một hệ thống quản lý học vụ đại học.

2. **Trải nghiệm Đột phá (Micro-UX & Animations):**
   - **Live Timetable Preview (Tính năng xem trước kíp học):** Khi sinh viên rê chuột (hover) vào bất kỳ lớp học phần nào ở danh sách, thời khóa biểu tuần thu nhỏ ở cạnh bên sẽ lập tức hiển thị khung nét đứt vị trí kíp học đó. Sinh viên biết ngay lớp có bị trùng lịch hay không trước khi bấm đăng ký.
   - **Chuyển tab mượt mà:** Ứng dụng `Framer Motion` với hiệu ứng trượt nhẹ (fade-in, slide-up 180ms) tinh tế.
   - **Cảnh báo xung đột trực quan:** Hộp thoại `ConflictModal` phân tích chi tiết lý do vi phạm (trùng thứ/tiết với lớp nào, phòng nào, hoặc thiếu môn tiên quyết gì) kèm hướng dẫn khắc phục.

---

## 🚀 Các Phân hệ Chức năng Kế thừa từ PTIT

### 1. Phân hệ Sinh viên
- **Đăng ký Tín chỉ:**
  - Lọc môn theo 4 nhóm: *Theo kế hoạch học kỳ (Kỳ 5)*, *Môn học lại (Điểm F)*, *Môn học cải thiện (Điểm D, D+)*, và *Tất cả môn mở*.
  - Tìm kiếm nhanh tức thì theo tên môn hoặc mã môn (VD: `INT1306`, `INT1434`...).
  - Thanh đo sĩ số trực quan (hiển thị % lấp đầy, cảnh báo sắp hết chỗ hoặc đã đầy slot).
- **Bộ máy Kiểm tra Ràng buộc Học vụ (Validation Engine):**
  - **Kiểm tra trùng lịch học:** Tự động phát hiện 2 lớp trùng nhau dù chỉ 1 tiết trong tuần.
  - **Kiểm tra điều kiện tiên quyết:** Bắt buộc sinh viên phải thi đạt (Điểm >= 1.0, không phải F) môn tiên quyết. Ví dụ: Môn *Học máy chuyên sâu* yêu cầu tiên quyết *Trí tuệ nhân tạo* (bị chặn do sinh viên có điểm F).
  - **Kiểm tra giới hạn tín chỉ:** Chặn nếu tổng số tín chỉ vượt quá giới hạn tối đa (mặc định 24 TC) hoặc cảnh báo nếu chưa đủ mức tối thiểu (10 TC).
  - **Kiểm tra sĩ số:** Chặn khi lớp đã đủ 100% sĩ số.
  - **Chặn đăng ký trùng môn:** Không cho phép đăng ký 2 lớp của cùng một học phần.
- **Giỏ Môn Đã Đăng Ký:**
  - Bảng tổng hợp các môn đã lưu, tổng tín chỉ, và tạm tính học phí chính xác theo đơn giá (450.000 VNĐ / tín chỉ).
  - Thao tác "Hủy môn" với popup xác nhận an toàn.
  - Nút "In phiếu đăng ký tín chỉ" chuẩn khổ in A4.
- **Thời Khóa Biểu Tuần:**
  - Xem dạng lưới 7 ngày (Thứ 2 - Chủ Nhật) x 12 tiết học (Sáng/Chiều/Tối).
  - Phân màu sắc riêng biệt cho từng môn học.
  - Xem dạng danh sách theo thứ.
  - Tính năng xuất lịch học ra định dạng **`.ICS`** (đồng bộ trực tiếp vào Google Calendar, Apple Calendar, Outlook).
- **Chương Trình Đào Tạo (CTĐT):**
  - Tra cứu cây môn học 8 kỳ, trạng thái Đã đạt / Chưa đạt / Đang học / Chưa học.
- **Kết Quả Học Tập & Bảng Điểm:**
  - Xem điểm CPA, số tín chỉ tích lũy, xếp loại học lực (Xuất sắc / Giỏi / Khá / Trung bình), chi tiết điểm hệ 10, hệ 4 và điểm chữ từng môn.

### 2. Phân hệ Quản trị (Admin / Phòng Đào Tạo)
- Mở / Đóng đợt đăng ký tín chỉ thời gian thực.
- Điều chỉnh số tín chỉ tối thiểu (Min) và tối đa (Max) được phép đăng ký.
- Giám sát sĩ số toàn bộ các lớp học phần mở trong kỳ, tự động gắn cờ cảnh báo các lớp có dưới 20 sinh viên để xem xét hủy hoặc gộp lớp.
- Nút "Đồng bộ / Seed dữ liệu MongoDB" 1-click.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

- **Frontend:** Next.js 14+ (App Router), React 19, TypeScript.
- **Styling & Icons:** Tailwind CSS v4, Lucide React Icons.
- **Animation:** Framer Motion, Canvas Confetti.
- **Backend:** Next.js Route Handlers (`/api/student`, `/api/courses`, `/api/classes`, `/api/periods`, `/api/register`, `/api/seed`).
- **Database:** MongoDB & Mongoose.
- **Cơ chế Fallback thông minh:** Tích hợp tầng `data-repository.ts` cho phép hệ thống tự động kết nối MongoDB khi có cấu hình, đồng thời dự phòng bộ nhớ đệm (In-memory store) giúp ứng dụng chạy mượt mà ngay lập tức trên mọi máy chấm bài kể cả khi chưa bật dịch vụ MongoDB!

---

## 💻 Hướng dẫn Cài đặt & Khởi chạy

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Cấu hình MongoDB (Tùy chọn)
Mở file `.env.local` và kiểm tra chuỗi kết nối:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/unicredit_db
# Hoặc dùng MongoDB Atlas URI:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/unicredit_db
```

### 3. Nạp dữ liệu mẫu vào MongoDB (Seeding)
Chạy lệnh seed dữ liệu độc lập:
```bash
npm run db:seed
```
*(Hoặc có thể bấm nút **"Đồng bộ MongoDB"** ngay trên thanh Navbar của giao diện web).*

### 4. Chạy chế độ Phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt tại: **http://localhost:3000**

### 5. Chạy kiểm thử tự động (Automated Unit Tests)
```bash
npm test
```
Kiểm thử 5 thuật toán học vụ: Phát hiện trùng lịch, kiểm tra tiên quyết, giới hạn tín chỉ, sĩ số và trùng môn.

---

## 🧪 Kịch bản Kiểm thử Nghiệp vụ (Demo Scenarios)

1. **Test Hover Preview:** Rê chuột vào lớp `INT1405-01` (Thứ 5, Tiết 1-3) -> Thời khóa biểu thu nhỏ góc trên bên phải sẽ hiển thị khung nét đứt màu xanh báo trước vị trí trống.
2. **Test Trùng lịch học:** 
   - Sinh viên đã có lớp `INT1434-01` (Thứ 2, Tiết 1-3).
   - Thử bấm "Đăng ký" lớp `INT1339-01` (Cũng học Thứ 2, Tiết 1-3).
   - **Kết quả:** Modal cảnh báo trùng thời khóa biểu màu đỏ sẽ hiện lên giải thích chi tiết hai lớp xung đột.
3. **Test Chặn môn tiên quyết:**
   - Tìm môn *Học máy chuyên sâu* (`INT14115`).
   - Môn này yêu cầu tiên quyết *Trí tuệ nhân tạo* (`INT1416`), trong khi sinh viên đang bị điểm F.
   - **Kết quả:** Nút đăng ký bị vô hiệu hóa kèm cảnh báo *Chưa đủ điều kiện tiên quyết*.
4. **Test Lớp đầy sĩ số:**
   - Lớp `INT1434-02` đã đầy sĩ số 55/55.
   - **Kết quả:** Nút đăng ký bị khóa với nhãn *Lớp đã hết chỗ*.
5. **Test Hủy môn:**
   - Trong bảng *Danh sách môn học đã đăng ký*, bấm nút **"Hủy"** lớp `INT1339-02`.
   - Xác nhận trong modal -> Lớp lập tức được gỡ bỏ, giải phóng slot và trừ học phí tạm tính.
