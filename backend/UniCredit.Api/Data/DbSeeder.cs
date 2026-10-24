using MongoDB.Driver;
using UniCredit.Api.Models;

namespace UniCredit.Api.Data;

public static class DbSeeder
{
    public static readonly RegistrationPeriod DefaultPeriod = new()
    {
        PeriodId = "2024-2025-HK1",
        Name = "Đợt 1 - Học kỳ 1 Năm học 2024 - 2025 (Chính thức)",
        AcademicYear = "2024-2025",
        Semester = 1,
        StartDate = DateTime.UtcNow.AddMonths(-1),
        EndDate = DateTime.UtcNow.AddMonths(2),
        MinCredits = 10,
        MaxCredits = 24,
        TargetBatches = new List<string> { "K21", "K22", "K23" },
        IsActive = true
    };

    public static Student GetDefaultStudent() => new()
    {
        StudentCode = "B21DCCN001",
        FullName = "Nguyễn Hoàng Minh",
        Email = "minhnh.b21cn001@unicredit.edu.vn",
        Major = "Công nghệ Thông tin",
        AdministrativeClass = "D21CQCN01-B",
        AcademicYear = 2021,
        Cpa = 3.38,
        AccumulatedCredits = 74,
        AdvisorName = "PGS.TS Nguyễn Mạnh Hùng",
        CompletedCourses = new List<CompletedCourse>
        {
            // Học kỳ 1
            new() { CourseCode = "BAS1150", CourseName = "Triết học Mác-Lênin", Credits = 3, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2021-2022-HK1" },
            new() { CourseCode = "INT1154", CourseName = "Tin học cơ sở 1", Credits = 2, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2021-2022-HK1" },
            new() { CourseCode = "BAS1203", CourseName = "Giải tích 1", Credits = 3, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2021-2022-HK1" },
            new() { CourseCode = "BAS1201", CourseName = "Đại số", Credits = 3, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2021-2022-HK1" },
            // Học kỳ 2
            new() { CourseCode = "BAS1151", CourseName = "Kinh tế chính trị Mác-Lênin", Credits = 2, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "BAS1157", CourseName = "Tiếng Anh (Course 1)", Credits = 4, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "INT1155", CourseName = "Tin học cơ sở 2", Credits = 2, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "BAS1204", CourseName = "Giải tích 2", Credits = 3, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "BAS1224", CourseName = "Vật lý ứng dụng", Credits = 4, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "ELE1434", CourseName = "Kỹ thuật số", Credits = 2, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "BAS1106", CourseName = "Pháp luật đại cương", Credits = 2, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2021-2022-HK2" },
            // Học kỳ 3
            new() { CourseCode = "BAS1152", CourseName = "Chủ nghĩa xã hội khoa học", Credits = 2, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "BAS1158", CourseName = "Tiếng Anh (Course 2)", Credits = 4, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "INT1330", CourseName = "Ngôn ngữ lập trình C++", Credits = 3, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "INT1358", CourseName = "Toán rời rạc 1", Credits = 3, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "ELE1330", CourseName = "Xử lý tín hiệu số", Credits = 2, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "BAS1226", CourseName = "Xác suất thống kê", Credits = 3, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2022-2023-HK1" },
            // Học kỳ 4
            new() { CourseCode = "BAS1122", CourseName = "Tư tưởng Hồ Chí Minh", Credits = 2, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2022-2023-HK2" },
            new() { CourseCode = "BAS1159", CourseName = "Tiếng Anh (Course 3)", Credits = 4, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2022-2023-HK2" },
            new() { CourseCode = "INT1332", CourseName = "Kiến trúc máy tính", Credits = 3, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2022-2023-HK2" },
            new() { CourseCode = "INT1359", CourseName = "Toán rời rạc 2", Credits = 3, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2022-2023-HK2" },
            new() { CourseCode = "INT1306", CourseName = "Cấu trúc dữ liệu và giải thuật", Credits = 3, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2022-2023-HK2" },
            new() { CourseCode = "INT1319", CourseName = "Lý thuyết thông tin", Credits = 3, Grade = "D", GradePoint = 1.0, IsPassed = true, Semester = "2022-2023-HK2" },
            // Học cải thiện & Học lại
            new() { CourseCode = "INT1340", CourseName = "Cơ sở dữ liệu", Credits = 3, Grade = "D+", GradePoint = 1.5, IsPassed = true, Semester = "2023-2024-HK1" },
            new() { CourseCode = "INT1416", CourseName = "Nhập môn trí tuệ nhân tạo", Credits = 3, Grade = "F", GradePoint = 0.0, IsPassed = false, Semester = "2023-2024-HK2" }
        },
        RegisteredClasses = new List<string> { "INT1434-01", "INT1339-02" }
    };

    public static List<Course> GetDefaultCourses() => new()
    {
        // Học kỳ 1
        new() { Code = "BAS1150", Name = "Triết học Mác-Lênin", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 1 },
        new() { Code = "INT1154", Name = "Tin học cơ sở 1", Credits = 2, TheoryCredits = 1, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 1 },
        new() { Code = "BAS1203", Name = "Giải tích 1", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 1 },
        new() { Code = "BAS1201", Name = "Đại số", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 1 },

        // Học kỳ 2
        new() { Code = "BAS1151", Name = "Kinh tế chính trị Mác-Lênin", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 2, Prerequisites = new() { "BAS1150" } },
        new() { Code = "BAS1157", Name = "Tiếng Anh (Course 1)", Credits = 4, TheoryCredits = 3, PracticeCredits = 1, Department = "Khoa Ngoại ngữ", SemesterProposal = 2 },
        new() { Code = "INT1155", Name = "Tin học cơ sở 2", Credits = 2, TheoryCredits = 1, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 2, Prerequisites = new() { "INT1154" } },
        new() { Code = "BAS1204", Name = "Giải tích 2", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 2, Prerequisites = new() { "BAS1203" } },
        new() { Code = "BAS1106", Name = "Pháp luật đại cương", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 2 },
        new() { Code = "BAS1224", Name = "Vật lý ứng dụng", Credits = 4, TheoryCredits = 3, PracticeCredits = 1, Department = "Khoa Cơ bản 1", SemesterProposal = 2 },
        new() { Code = "ELE1434", Name = "Kỹ thuật số", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Kỹ thuật Điện tử 1", SemesterProposal = 2 },

        // Học kỳ 3
        new() { Code = "BAS1152", Name = "Chủ nghĩa xã hội khoa học", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 3, Prerequisites = new() { "BAS1151" } },
        new() { Code = "BAS1158", Name = "Tiếng Anh (Course 2)", Credits = 4, TheoryCredits = 3, PracticeCredits = 1, Department = "Khoa Ngoại ngữ", SemesterProposal = 3, Prerequisites = new() { "BAS1157" } },
        new() { Code = "INT1330", Name = "Ngôn ngữ lập trình C++", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 3, Prerequisites = new() { "INT1155" } },
        new() { Code = "INT1358", Name = "Toán rời rạc 1", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa CNTT 1", SemesterProposal = 3, Prerequisites = new() { "BAS1201" } },
        new() { Code = "ELE1330", Name = "Xử lý tín hiệu số", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Kỹ thuật Điện tử 1", SemesterProposal = 3, Prerequisites = new() { "BAS1204" } },
        new() { Code = "BAS1226", Name = "Xác suất thống kê", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 3, Prerequisites = new() { "BAS1203" } },

        // Học kỳ 4
        new() { Code = "BAS1122", Name = "Tư tưởng Hồ Chí Minh", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 4, Prerequisites = new() { "BAS1152" } },
        new() { Code = "BAS1159", Name = "Tiếng Anh (Course 3)", Credits = 4, TheoryCredits = 3, PracticeCredits = 1, Department = "Khoa Ngoại ngữ", SemesterProposal = 4, Prerequisites = new() { "BAS1158" } },
        new() { Code = "INT1332", Name = "Kiến trúc máy tính", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 4, Prerequisites = new() { "ELE1434" } },
        new() { Code = "INT1359", Name = "Toán rời rạc 2", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa CNTT 1", SemesterProposal = 4, Prerequisites = new() { "INT1358" } },
        new() { Code = "INT1306", Name = "Cấu trúc dữ liệu và giải thuật", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 4, Prerequisites = new() { "INT1330" }, PreviousCourses = new() { "INT1358" } },
        new() { Code = "INT1319", Name = "Lý thuyết thông tin", Credits = 3, TheoryCredits = 3, PracticeCredits = 0, Department = "Khoa Viễn thông 1", SemesterProposal = 4, Prerequisites = new() { "BAS1226" } },

        // Học kỳ 5
        new() { Code = "BAS1153", Name = "Lịch sử Đảng cộng sản VN", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 5, Prerequisites = new() { "BAS1122" } },
        new() { Code = "BAS1160", Name = "Tiếng Anh (Course 3 Plus)", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Ngoại ngữ", SemesterProposal = 5, Prerequisites = new() { "BAS1159" } },
        new() { Code = "INT1313", Name = "Hệ điều hành", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1332" } },
        new() { Code = "INT1331", Name = "Lập trình hướng đối tượng", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1306" } },
        new() { Code = "INT1340", Name = "Cơ sở dữ liệu", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1306" } },
        new() { Code = "INT1339", Name = "Mạng máy tính", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa Mạng & Truyền thông", SemesterProposal = 5, Prerequisites = new() { "INT1332" } },
        new() { Code = "INT13162", Name = "Lập trình Python", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1306" } },
        new() { Code = "INT1405", Name = "Nhập môn công nghệ phần mềm", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1340" }, PreviousCourses = new() { "INT1306" } },
        new() { Code = "INT1434", Name = "Lập trình Web", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1340" } },
        new() { Code = "INT1416", Name = "Nhập môn trí tuệ nhân tạo", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1306" } },
        new() { Code = "SKI1014", Name = "Kỹ năng làm việc nhóm & Thuyết trình", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Bộ môn Kỹ năng Mềm", SemesterProposal = 5 },

        // Học kỳ 6
        new() { Code = "INT1412", Name = "An toàn và bảo mật hệ thống thông tin", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa An toàn Thông tin", SemesterProposal = 6, Prerequisites = new() { "INT1339" } },
        new() { Code = "INT1418", Name = "Cơ sở dữ liệu phân tán", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 6, Prerequisites = new() { "INT1340", "INT1339" } },
        new() { Code = "INT1479", Name = "Thực tập cơ sở", Credits = 4, TheoryCredits = 0, PracticeCredits = 4, Department = "Khoa CNTT 1", SemesterProposal = 6, Prerequisites = new() { "INT1340" } },
        new() { Code = "ELE1433", Name = "IoT và ứng dụng", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa Điện tử 1", SemesterProposal = 6, Prerequisites = new() { "INT1332" } },

        // Học kỳ 7
        new() { Code = "INT1408", Name = "Quản lý dự án phần mềm", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "INT1405" } },
        new() { Code = "INT1409", Name = "Phân tích và thiết kế hệ thống thông tin", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "INT1405", "INT1340" } },
        new() { Code = "INT1449", Name = "Xử lý ảnh", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "INT1306" } },
        new() { Code = "INT14115", Name = "Phát triển các hệ thống thông minh (Deep Learning)", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "INT1416" } },
        new() { Code = "INT1450", Name = "Điện toán đám mây", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa Mạng & Truyền thông", SemesterProposal = 7, Prerequisites = new() { "INT1339" } },
        new() { Code = "INT1461", Name = "Nhập môn khoa học dữ liệu", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "BAS1226", "INT1340" } },
        new() { Code = "INT1433", Name = "Lập trình mạng", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa Mạng & Truyền thông", SemesterProposal = 7, Prerequisites = new() { "INT1339" } },
        new() { Code = "INT1427", Name = "Phát triển phần mềm hướng dịch vụ", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "INT1434" } },

        // Học kỳ 8
        new() { Code = "INT1448", Name = "Phát triển ứng dụng cho thiết bị di động", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 8, Prerequisites = new() { "INT1331" } },
        new() { Code = "INT1422", Name = "Đảm bảo chất lượng phần mềm", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 8, Prerequisites = new() { "INT1405" } },
        new() { Code = "INT1423", Name = "Phát triển yêu cầu phần mềm", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 8, Prerequisites = new() { "INT1405" } },
        new() { Code = "INT1424", Name = "Kiến trúc và thiết kế phần mềm", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 8, Prerequisites = new() { "INT1405" } },
        new() { Code = "INT1438", Name = "Các hệ thống phân tán", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 8, Prerequisites = new() { "INT1339" } },
        new() { Code = "INT1442", Name = "Kho dữ liệu và khai phá dữ liệu", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 8, Prerequisites = new() { "INT1340" } },
        new() { Code = "INT1414", Name = "An ninh mạng", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa An toàn Thông tin", SemesterProposal = 8, Prerequisites = new() { "INT1412" } },
        new() { Code = "BAS1260", Name = "Phương pháp luận nghiên cứu khoa học", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Khoa Cơ bản 1", SemesterProposal = 8 },

        // Học kỳ 9
        new() { Code = "INT1499", Name = "Thực tập và tốt nghiệp", Credits = 12, TheoryCredits = 0, PracticeCredits = 12, Department = "Khoa CNTT 1", SemesterProposal = 9, Prerequisites = new() { "INT1479" } }
    };

    public static List<CourseClass> GetDefaultClasses() => new()
    {
        // INT1434 - Lập trình Web
        new() { ClassCode = "INT1434-01", CourseCode = "INT1434", CourseName = "Lập trình Web", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 1, PeriodCount = 3, Room = "401-A2", Lecturer = "TS. Hoàng Xuân Dậu", MaxSlots = 60, CurrentSlots = 45, RegisteredStudents = new() { "B21DCCN001", "B21DCCN012" }, TuitionPerCredit = 655000 },
        new() { ClassCode = "INT1434-02", CourseCode = "INT1434", CourseName = "Lập trình Web", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 7, PeriodCount = 3, Room = "204-A3", Lecturer = "ThS. Phạm Thế Quynh", MaxSlots = 55, CurrentSlots = 55, TuitionPerCredit = 655000 }, // ĐẦY SĨ SỐ

        // INT1339 - Mạng máy tính
        new() { ClassCode = "INT1339-01", CourseCode = "INT1339", CourseName = "Mạng máy tính", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 1, PeriodCount = 3, Room = "305-A2", Lecturer = "PGS.TS Vũ Hữu Tiến", MaxSlots = 60, CurrentSlots = 40, TuitionPerCredit = 655000 }, // Trùng lịch INT1434-01
        new() { ClassCode = "INT1339-02", CourseCode = "INT1339", CourseName = "Mạng máy tính", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 3, StartPeriod = 4, PeriodCount = 3, Room = "102-A2", Lecturer = "TS. Lê Quang Minh", MaxSlots = 60, CurrentSlots = 38, RegisteredStudents = new() { "B21DCCN001" }, TuitionPerCredit = 655000 },

        // INT1313 - Hệ điều hành
        new() { ClassCode = "INT1313-01", CourseCode = "INT1313", CourseName = "Hệ điều hành", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 4, PeriodCount = 3, Room = "304-A2", Lecturer = "TS. Nguyễn Ngọc Điệp", MaxSlots = 60, CurrentSlots = 34, TuitionPerCredit = 655000 },
        new() { ClassCode = "INT1313-02", CourseCode = "INT1313", CourseName = "Hệ điều hành", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 5, StartPeriod = 4, PeriodCount = 3, Room = "202-A3", Lecturer = "ThS. Trần Quang Hải", MaxSlots = 60, CurrentSlots = 28, TuitionPerCredit = 655000 },

        // INT1331 - Lập trình hướng đối tượng
        new() { ClassCode = "INT1331-01", CourseCode = "INT1331", CourseName = "Lập trình hướng đối tượng", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 3, StartPeriod = 1, PeriodCount = 3, Room = "402-A2", Lecturer = "TS. Nguyễn Mạnh Sơn", MaxSlots = 65, CurrentSlots = 42, TuitionPerCredit = 655000 },
        new() { ClassCode = "INT1331-02", CourseCode = "INT1331", CourseName = "Lập trình hướng đối tượng", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 4, PeriodCount = 3, Room = "308-A2", Lecturer = "ThS. Kim Ngọc Bách", MaxSlots = 60, CurrentSlots = 39, TuitionPerCredit = 655000 },

        // INT13162 - Lập trình Python
        new() { ClassCode = "INT13162-01", CourseCode = "INT13162", CourseName = "Lập trình Python", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 10, PeriodCount = 3, Room = "501-A2", Lecturer = "TS. Đỗ Bách Khoa", MaxSlots = 60, CurrentSlots = 30, TuitionPerCredit = 655000 },

        // BAS1153 - Lịch sử Đảng cộng sản VN
        new() { ClassCode = "BAS1153-01", CourseCode = "BAS1153", CourseName = "Lịch sử Đảng cộng sản VN", Credits = 2, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 10, PeriodCount = 2, Room = "Hội trường A1", Lecturer = "TS. Nguyễn Thị Mai", MaxSlots = 90, CurrentSlots = 52, TuitionPerCredit = 655000 },

        // BAS1160 - Tiếng Anh (Course 3 Plus)
        new() { ClassCode = "BAS1160-01", CourseCode = "BAS1160", CourseName = "Tiếng Anh (Course 3 Plus)", Credits = 2, PeriodId = "2024-2025-HK1", DayOfWeek = 7, StartPeriod = 7, PeriodCount = 2, Room = "205-A1", Lecturer = "ThS. Vũ Phương Thảo", MaxSlots = 45, CurrentSlots = 26, TuitionPerCredit = 655000 },

        // INT1405 - Nhập môn công nghệ phần mềm
        new() { ClassCode = "INT1405-01", CourseCode = "INT1405", CourseName = "Nhập môn công nghệ phần mềm", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 5, StartPeriod = 1, PeriodCount = 3, Room = "301-A3", Lecturer = "TS. Ngô Xuân Bách", MaxSlots = 65, CurrentSlots = 32, TuitionPerCredit = 655000 },
        new() { ClassCode = "INT1405-02", CourseCode = "INT1405", CourseName = "Nhập môn công nghệ phần mềm", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 7, PeriodCount = 3, Room = "502-A2", Lecturer = "ThS. Trần Thị Kim Oanh", MaxSlots = 60, CurrentSlots = 48, TuitionPerCredit = 655000 },

        // INT1412 - An toàn thông tin
        new() { ClassCode = "INT1412-01", CourseCode = "INT1412", CourseName = "An toàn và bảo mật hệ thống thông tin", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 1, PeriodCount = 3, Room = "302-A2", Lecturer = "TS. Hoàng Đăng Hải", MaxSlots = 50, CurrentSlots = 27, TuitionPerCredit = 655000 },
        new() { ClassCode = "INT1412-02", CourseCode = "INT1412", CourseName = "An toàn và bảo mật hệ thống thông tin", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 7, StartPeriod = 4, PeriodCount = 3, Room = "201-A3", Lecturer = "ThS. Đỗ Tuấn Anh", MaxSlots = 50, CurrentSlots = 15, TuitionPerCredit = 655000 },

        // INT1418 - Cơ sở dữ liệu phân tán
        new() { ClassCode = "INT1418-01", CourseCode = "INT1418", CourseName = "Cơ sở dữ liệu phân tán", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 7, PeriodCount = 3, Room = "306-A2", Lecturer = "PGS.TS Đặng Văn Đức", MaxSlots = 55, CurrentSlots = 31, TuitionPerCredit = 655000 },

        // INT1479 - Thực tập cơ sở
        new() { ClassCode = "INT1479-01", CourseCode = "INT1479", CourseName = "Thực tập cơ sở", Credits = 4, PeriodId = "2024-2025-HK1", DayOfWeek = 7, StartPeriod = 9, PeriodCount = 3, Room = "Lab CNPM-A2", Lecturer = "TS. Hoàng Xuân Dậu", MaxSlots = 60, CurrentSlots = 22, TuitionPerCredit = 655000 },

        // INT1416 - AI (Học lại)
        new() { ClassCode = "INT1416-01", CourseCode = "INT1416", CourseName = "Nhập môn trí tuệ nhân tạo", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 1, PeriodCount = 3, Room = "405-A2", Lecturer = "PGS.TS Từ Minh Phương", MaxSlots = 60, CurrentSlots = 51, TuitionPerCredit = 655000 },

        // INT1340 - Cơ sở dữ liệu (Cải thiện)
        new() { ClassCode = "INT1340-01", CourseCode = "INT1340", CourseName = "Cơ sở dữ liệu", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 3, StartPeriod = 7, PeriodCount = 3, Room = "203-A2", Lecturer = "TS. Nguyễn Kiều Linh", MaxSlots = 60, CurrentSlots = 35, TuitionPerCredit = 655000 },

        // INT1319 - Lý thuyết thông tin (Cải thiện)
        new() { ClassCode = "INT1319-01", CourseCode = "INT1319", CourseName = "Lý thuyết thông tin", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 5, StartPeriod = 10, PeriodCount = 3, Room = "104-A2", Lecturer = "PGS.TS Nguyễn Tiến Ban", MaxSlots = 60, CurrentSlots = 25, TuitionPerCredit = 655000 },

        // INT14115 - Deep Learning (Chặn tiên quyết)
        new() { ClassCode = "INT14115-01", CourseCode = "INT14115", CourseName = "Phát triển các hệ thống thông minh (Deep Learning)", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 5, StartPeriod = 7, PeriodCount = 3, Room = "Lab AI-A2", Lecturer = "TS. Nguyễn Kim Anh", MaxSlots = 40, CurrentSlots = 20, TuitionPerCredit = 655000 },

        // SKI1014 - Kỹ năng mềm
        new() { ClassCode = "SKI1014-01", CourseCode = "SKI1014", CourseName = "Kỹ năng làm việc nhóm & Thuyết trình", Credits = 2, PeriodId = "2024-2025-HK1", DayOfWeek = 7, StartPeriod = 1, PeriodCount = 2, Room = "Hội trường A2", Lecturer = "ThS. Lê Thị Thu Hằng", MaxSlots = 80, CurrentSlots = 42, TuitionPerCredit = 655000 },

        // ELE1433 - IoT
        new() { ClassCode = "ELE1433-01", CourseCode = "ELE1433", CourseName = "IoT và ứng dụng", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 4, PeriodCount = 3, Room = "Lab IoT-303", Lecturer = "TS. Vũ Khánh Quý", MaxSlots = 45, CurrentSlots = 29, TuitionPerCredit = 655000 },

        // INT1449 - Xử lý ảnh
        new() { ClassCode = "INT1449-01", CourseCode = "INT1449", CourseName = "Xử lý ảnh", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 3, StartPeriod = 10, PeriodCount = 3, Room = "404-A2", Lecturer = "PGS.TS Phạm Văn Cường", MaxSlots = 50, CurrentSlots = 33, TuitionPerCredit = 655000 },

        // INT1450 - Điện toán đám mây
        new() { ClassCode = "INT1450-01", CourseCode = "INT1450", CourseName = "Điện toán đám mây", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 10, PeriodCount = 3, Room = "309-A2", Lecturer = "TS. Trần Công Hùng", MaxSlots = 55, CurrentSlots = 41, TuitionPerCredit = 655000 },

        // INT1461 - Nhập môn khoa học dữ liệu
        new() { ClassCode = "INT1461-01", CourseCode = "INT1461", CourseName = "Nhập môn khoa học dữ liệu", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 4, PeriodCount = 3, Room = "Lab DS-A3", Lecturer = "TS. Ngô Xuân Bách", MaxSlots = 50, CurrentSlots = 36, TuitionPerCredit = 655000 },

        // INT1448 - Phát triển ứng dụng cho thiết bị di động
        new() { ClassCode = "INT1448-01", CourseCode = "INT1448", CourseName = "Phát triển ứng dụng cho thiết bị di động", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 1, PeriodCount = 3, Room = "403-A2", Lecturer = "ThS. Nguyễn Trọng Khánh", MaxSlots = 55, CurrentSlots = 28, TuitionPerCredit = 655000 }
    };

    public static List<CourseClass> GetAllDefaultClassesWithCurriculum()
    {
        var list = GetDefaultClasses();
        var courses = GetDefaultCourses();
        string[] lecturers =
        {
            "PGS.TS Nguyễn Mạnh Hùng", "TS. Hoàng Xuân Dậu", "PGS.TS Vũ Hữu Tiến",
            "TS. Ngô Xuân Bách", "TS. Lê Quang Minh", "TS. Nguyễn Kiều Linh",
            "PGS.TS Từ Minh Phương", "TS. Đỗ Bách Khoa", "ThS. Phạm Thế Quynh", "TS. Hoàng Đăng Hải"
        };
        string[] rooms =
        {
            "101-A2", "103-A2", "201-A2", "205-A2", "301-A2",
            "307-A2", "402-A3", "406-A3", "501-A3", "504-A3"
        };
        int[] startSlots = { 1, 4, 7, 10 };

        for (int i = 0; i < courses.Count; i++)
        {
            var course = courses[i];
            if (!list.Any(c => c.CourseCode == course.Code))
            {
                list.Add(new CourseClass
                {
                    ClassCode = $"{course.Code}-01",
                    CourseCode = course.Code,
                    CourseName = course.Name,
                    Credits = course.Credits,
                    PeriodId = "2024-2025-HK1",
                    DayOfWeek = (i % 6) + 2,
                    StartPeriod = startSlots[i % startSlots.Length],
                    PeriodCount = course.Credits >= 3 ? 3 : 2,
                    Room = rooms[i % rooms.Length],
                    Lecturer = lecturers[i % lecturers.Length],
                    MaxSlots = 60,
                    CurrentSlots = 20 + ((i * 7) % 30),
                    TuitionPerCredit = 655000
                });
            }
        }
        return list;
    }

    public static List<Lecturer> GetDefaultLecturers() => new()
    {
        new() { LecturerCode = "GV01", FullName = "TS. Hoàng Xuân Dậu", Title = "Tiến sĩ - Trưởng bộ môn CNPM", Department = "Khoa Công nghệ Thông tin 1", Email = "dauhx@unicredit.edu.vn", Phone = "0912.345.678", TeachingClassCodes = new() { "INT1434-01", "INT1479-01" } },
        new() { LecturerCode = "GV02", FullName = "PGS.TS Vũ Hữu Tiến", Title = "Phó Giáo sư, Tiến sĩ", Department = "Khoa Mạng & Truyền thông", Email = "tienvh@unicredit.edu.vn", Phone = "0988.765.432", TeachingClassCodes = new() { "INT1339-01" } },
        new() { LecturerCode = "GV03", FullName = "TS. Ngô Xuân Bách", Title = "Tiến sĩ", Department = "Khoa Công nghệ Thông tin 1", Email = "bachnx@unicredit.edu.vn", Phone = "0904.112.233", TeachingClassCodes = new() { "INT1405-01", "INT1461-01" } }
    };

    public static async Task SeedAsync(IMongoDbContext context, bool forceReset = false)
    {
        // 1. Populate In-Memory fallback store with fresh copies
        context.MemoryPeriod = DefaultPeriod;
        context.MemoryStudents.Clear();
        context.MemoryStudents.Add(GetDefaultStudent());

        context.MemoryCourses.Clear();
        context.MemoryCourses.AddRange(GetDefaultCourses());

        context.MemoryClasses.Clear();
        context.MemoryClasses.AddRange(GetAllDefaultClassesWithCurriculum());

        context.MemoryLecturers.Clear();
        context.MemoryLecturers.AddRange(GetDefaultLecturers());

        // 2. If MongoDB is online, seed into MongoDB collections
        if (context.IsConnected && context.Students != null)
        {
            try
            {
                var defaultCourses = GetDefaultCourses();
                var existingCourseCount = await context.Courses!.CountDocumentsAsync(FilterDefinition<Course>.Empty);

                if (forceReset || existingCourseCount < defaultCourses.Count)
                {
                    await context.Courses.DeleteManyAsync(FilterDefinition<Course>.Empty);
                    await context.Courses.InsertManyAsync(defaultCourses);

                    await context.CourseClasses!.DeleteManyAsync(FilterDefinition<CourseClass>.Empty);
                    await context.CourseClasses.InsertManyAsync(GetAllDefaultClassesWithCurriculum());
                }

                var existingPeriods = await context.RegistrationPeriods!.CountDocumentsAsync(FilterDefinition<RegistrationPeriod>.Empty);
                if (forceReset || existingPeriods == 0)
                {
                    await context.RegistrationPeriods.DeleteManyAsync(FilterDefinition<RegistrationPeriod>.Empty);
                    await context.RegistrationPeriods.InsertOneAsync(DefaultPeriod);
                }

                var existingStudents = await context.Students.CountDocumentsAsync(FilterDefinition<Student>.Empty);
                if (forceReset || existingStudents == 0)
                {
                    await context.Students.DeleteManyAsync(FilterDefinition<Student>.Empty);
                    await context.Students.InsertOneAsync(GetDefaultStudent());
                }

                var existingLecturers = await context.Lecturers!.CountDocumentsAsync(FilterDefinition<Lecturer>.Empty);
                if (forceReset || existingLecturers == 0)
                {
                    await context.Lecturers.DeleteManyAsync(FilterDefinition<Lecturer>.Empty);
                    await context.Lecturers.InsertManyAsync(GetDefaultLecturers());
                }
            }
            catch
            {
                // Fallback gracefully
            }
        }
    }
}
