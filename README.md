# Hệ Thống Đăng Ký Tín Chỉ & Quản Lý Học Vụ (UniCredit Portal)

Dự án Bài tập lớn (BTL) mô phỏng quy trình đăng ký tín chỉ và nghiệp vụ đào tạo đại học tham khảo từ Cổng Đào tạo Học viện Bưu chính Viễn thông (qldt.ptit.edu.vn), với phong cách thiết kế độc lập, màu sắc phẳng dịu mắt, bo góc chuẩn mực và hiệu ứng mượt mà.

---

## 📁 Cấu Trúc Thư Mục Dự Án (Client - Server Architecture)

```
G:\BTL\Hệ thống đăng kí tín chỉ\
├── frontend/                 # Ứng dụng Frontend (Next.js 14+, Tailwind CSS, Framer Motion)
│   ├── src/
│   │   ├── app/              # App Router, Layout, CSS (Helvetica & Arial font)
│   │   ├── components/
│   │   │   ├── Auth/         # Trang Đăng nhập (Sinh viên & Giảng viên)
│   │   │   ├── Lecturer/     # Cổng Giảng viên (Lịch dạy, Danh sách lớp & Roster SV)
│   │   │   ├── Registration/ # Đăng ký tín chỉ, Giỏ môn, Live Timetable Preview
│   │   │   ├── Timetable/    # Thời khóa biểu tuần lưới 7 ngày x 12 tiết, xuất .ICS
│   │   │   ├── Curriculum/   # Cây Chương trình đào tạo 8 kỳ & Tiên quyết
│   │   │   ├── Transcript/   # Bảng điểm, CPA, GPA, Xếp loại học lực
│   │   │   └── Admin/        # Cổng Quản trị đào tạo (Đóng/mở đợt, Sĩ số)
│   │   └── lib/              # Thuật toán Ràng buộc học vụ, Dữ liệu mẫu, MongoDB Driver
│   └── test/                 # Kiểm thử tự động 5 thuật toán học vụ
│
└── backend/                  # Mã nguồn Backend C# ASP.NET Core Web API (.NET 10)
    └── UniCredit.Api/        # Dự án Web API C# kết nối MongoDB
```

---

## 🎨 Điểm Nổi Bật Về Giao Diện & Trải Nghiệm (UI/UX)
1. **Phần trên của web (Header):** Sử dụng **Màu đỏ trầm học thuật** (`#991B1B` / `#B91C1C`) phẳng, sang trọng, không dùng gradient màu mè.
2. **Font chữ:** Toàn bộ hệ thống sử dụng font **`Helvetica, Arial, sans-serif`**.
3. **Bo góc vừa phải:** Định hình góc bo chuẩn mực (`rounded-md` 6px - 8px), trang nhã, tin cậy.
4. **Animation mượt mà:** Chuyển đổi tab êm ái bằng `Framer Motion` (180ms), hiệu ứng pháo hoa khi lưu môn thành công.
5. **Live Timetable Preview:** Rê chuột vào bất kỳ lớp học phần nào, lịch tuần thu nhỏ sẽ hiển thị khung nét đứt kíp học dự kiến để nhận biết ngay khả năng trùng lịch trước khi bấm đăng ký.

---

## 🔐 Tài Khoản Đăng Nhập Mẫu Để Demo Nhanh

Hệ thống có sẵn các nút **1-Click Login** trên giao diện đăng nhập:

| Vai trò | Mã đăng nhập | Mật khẩu | Thông tin chi tiết |
| :--- | :--- | :--- | :--- |
| **Sinh viên** | `B21DCCN001` | `123456` | Nguyễn Hoàng Minh • Khóa K21 CNTT • Lớp D21CQCN01-B |
| **Giảng viên 1** | `GV01` | `123456` | TS. Hoàng Xuân Dậu • Dạy môn Lập trình Web và ứng dụng |
| **Giảng viên 2** | `GV02` | `123456` | PGS.TS Vũ Hữu Tiến • Dạy môn Mạng máy tính |

---

## 🚀 Hướng Dẫn Khởi Chạy Frontend Để Demo

```powershell
# 1. Di chuyển vào thư mục frontend:
cd frontend

# 2. Chạy chế độ phát triển:
npm run dev

# 3. Mở trình duyệt tại địa chỉ:
# http://localhost:3000
```

### Chạy kiểm thử tự động thuật toán ràng buộc học vụ:
```powershell
npm test
```
(Kiểm tra 5 ràng buộc: Trùng thời khóa biểu, Điều kiện môn tiên quyết, Giới hạn 24 tín chỉ, Sĩ số lớp đầy, Chặn đăng ký 2 lớp của cùng một môn).
