# UniCredit Portal - Frontend Application

Ứng dụng giao diện người dùng (Frontend) và tầng API tích hợp cho **Hệ thống Đăng ký Tín chỉ và Quản lý Học vụ Trực tuyến (UniCredit Portal)**, được phát triển bằng **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS** và **Mongoose (MongoDB)**.

---

## 1. Cấu Trúc Mã Nguồn

- `src/app/`: Chứa layout gốc, trang chính (`page.tsx`) và các Route Handlers (`api/auth/login`, `api/student`, `api/courses`, `api/classes`, `api/periods`, `api/register`, `api/lecturers`, `api/seed`).
- `src/components/`:
  - `NavigationTabs.tsx`: Cột chức năng bên trái có khả năng thu gọn và mở rộng theo từng vai trò người dùng (`student`, `lecturer`, `admin`).
  - `Navbar.tsx`: Thanh điều hướng phía trên và menu thông tin người dùng.
  - `Registration/`: Các thành phần giao diện đăng ký môn học, bộ lọc theo học kỳ CTĐT, xem trước lịch học thu nhỏ và bảng quản lý/hủy học phần đã đăng ký.
  - `Timetable/`: Lưới thời khóa biểu tuần 12 tiết và chức năng xuất lịch `.ICS`.
  - `Curriculum/`: Khung chương trình đào tạo 9 học kỳ ngành Công nghệ Thông tin.
  - `Transcript/`: Bảng kết quả học tập được phân tách chi tiết theo từng học kỳ.
  - `Lecturer/`: Giao diện cổng Giảng viên hỗ trợ điểm danh cho từng sinh viên, điểm danh đồng loạt cho toàn bộ sinh viên trong lớp và quản lý lịch dạy cho từng lớp học phần.
  - `Admin/`: Giao diện Quản trị Đào tạo hỗ trợ mở/đóng cổng đăng ký tín chỉ, giám sát sĩ số lớp học phần và đánh dấu trạng thái học vụ sinh viên (*Đang theo học*, *Bảo lưu*, *Đã thôi học*).
- `src/models/`: Định nghĩa Mongoose Schemas ánh xạ tới các Collection trong cơ sở dữ liệu MongoDB (`unicredit_db`).
- `src/lib/`: Chứa cấu hình kết nối MongoDB (`mongodb.ts`), tầng truy xuất dữ liệu (`data-repository.ts`), bộ kiểm tra ràng buộc (`validation.ts`) và dữ liệu khởi tạo (`mock-data.ts`).

---

## 2. Các Lệnh Thực Thi (Scripts)

Thực thi các lệnh sau tại thư mục `frontend/`:

| Lệnh | Mô tả |
| :--- | :--- |
| `npm install` | Cài đặt các gói thư viện phụ thuộc |
| `npm run db:seed` | Khởi tạo và nạp bộ dữ liệu 55 môn học 9 kỳ, 61 lớp học phần và danh sách sinh viên vào MongoDB (`unicredit_db`) |
| `npm run dev` | Khởi chạy máy chủ phát triển tại địa chỉ `http://localhost:3000` |
| `npm run build` | Biên dịch ứng dụng cho môi trường Production |
| `npm run start` | Khởi chạy bản dựng Production |
| `npm test` | Thực thi bộ kiểm thử đơn vị cho các thuật toán kiểm tra ràng buộc học vụ |
