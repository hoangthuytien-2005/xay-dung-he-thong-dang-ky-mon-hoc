export interface CompletedCourseData {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoint: number;
  isPassed: boolean;
  semester: string;
}

export type AcademicStatusType = "ACTIVE" | "RESERVED" | "DROPPED_OUT";

export type AttendanceStatusType = "PRESENT" | "ABSENT" | "EXCUSED" | "LATE";

export interface AttendanceEntryData {
  studentCode: string;
  status: AttendanceStatusType;
  note?: string;
  updatedAt?: string;
}

export interface StudentData {
  studentCode: string;
  fullName: string;
  email: string;
  major: string;
  administrativeClass: string;
  academicYear: number;
  cpa: number;
  accumulatedCredits: number;
  advisorName: string;
  academicStatus?: AcademicStatusType;
  completedCourses: CompletedCourseData[];
  registeredClasses: string[];
}

export interface CourseData {
  code: string;
  name: string;
  credits: number;
  theoryCredits: number;
  practiceCredits: number;
  department: string;
  semesterProposal: number;
  prerequisites: string[];
  previousCourses: string[];
  corequisites: string[];
  description?: string;
}

export interface CourseClassData {
  classCode: string;
  courseCode: string;
  courseName: string;
  credits: number;
  periodId: string;
  dayOfWeek: number; // 2: Thứ 2 ... 7: Thứ 7
  startPeriod: number; // 1..12
  periodCount: number; // 2..4
  room: string;
  lecturer: string;
  maxSlots: number;
  currentSlots: number;
  registeredStudents: string[];
  attendanceRecords?: AttendanceEntryData[];
  tuitionPerCredit: number;
}

export interface LecturerData {
  lecturerCode: string;
  fullName: string;
  title: string; // TS, PGS.TS, ThS
  department: string;
  email: string;
  phone: string;
  teachingClassCodes: string[];
}

export interface AdminData {
  adminCode: string;
  fullName: string;
  title: string;
  department: string;
  email: string;
  phone: string;
}

export interface RegistrationPeriodData {
  periodId: string;
  name: string;
  academicYear: string;
  semester: number;
  startDate: string;
  endDate: string;
  minCredits: number;
  maxCredits: number;
  targetBatches: string[];
  isActive: boolean;
}

export const INITIAL_PERIOD: RegistrationPeriodData = {
  periodId: "2024-2025-HK1",
  name: "Đợt 1 - Học kỳ 1 Năm học 2024 - 2025 (Chính thức)",
  academicYear: "2024-2025",
  semester: 1,
  startDate: "2024-09-01T08:00:00Z",
  endDate: "2024-10-30T23:59:59Z",
  minCredits: 10,
  maxCredits: 24,
  targetBatches: ["K21", "K22", "K23"],
  isActive: true,
};

export const INITIAL_STUDENT: StudentData = {
  studentCode: "B21DCCN001",
  fullName: "Nguyễn Hoàng Minh",
  email: "minhnh.b21cn001@unicredit.edu.vn",
  major: "Công nghệ Thông tin",
  administrativeClass: "D21CQCN01-B",
  academicYear: 2021,
  cpa: 3.38,
  accumulatedCredits: 74,
  advisorName: "PGS.TS Nguyễn Mạnh Hùng",
  academicStatus: "ACTIVE",
  completedCourses: [
    // Học kỳ 1
    { courseCode: "BAS1150", courseName: "Triết học Mác-Lênin", credits: 3, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2021-2022-HK1" },
    { courseCode: "INT1154", courseName: "Tin học cơ sở 1", credits: 2, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2021-2022-HK1" },
    { courseCode: "BAS1203", courseName: "Giải tích 1", credits: 3, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2021-2022-HK1" },
    { courseCode: "BAS1201", courseName: "Đại số", credits: 3, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2021-2022-HK1" },
    // Học kỳ 2
    { courseCode: "BAS1151", courseName: "Kinh tế chính trị Mác-Lênin", credits: 2, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "BAS1157", courseName: "Tiếng Anh (Course 1)", credits: 4, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "INT1155", courseName: "Tin học cơ sở 2", credits: 2, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "BAS1204", courseName: "Giải tích 2", credits: 3, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "BAS1224", courseName: "Vật lý ứng dụng", credits: 4, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "ELE1434", courseName: "Kỹ thuật số", credits: 2, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "BAS1106", courseName: "Pháp luật đại cương", credits: 2, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2021-2022-HK2" },
    // Học kỳ 3
    { courseCode: "BAS1152", courseName: "Chủ nghĩa xã hội khoa học", credits: 2, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "BAS1158", courseName: "Tiếng Anh (Course 2)", credits: 4, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "INT1330", courseName: "Ngôn ngữ lập trình C++", credits: 3, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "INT1358", courseName: "Toán rời rạc 1", credits: 3, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "ELE1330", courseName: "Xử lý tín hiệu số", credits: 2, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "BAS1226", courseName: "Xác suất thống kê", credits: 3, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2022-2023-HK1" },
    // Học kỳ 4
    { courseCode: "BAS1122", courseName: "Tư tưởng Hồ Chí Minh", credits: 2, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2022-2023-HK2" },
    { courseCode: "BAS1159", courseName: "Tiếng Anh (Course 3)", credits: 4, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2022-2023-HK2" },
    { courseCode: "INT1332", courseName: "Kiến trúc máy tính", credits: 3, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2022-2023-HK2" },
    { courseCode: "INT1359", courseName: "Toán rời rạc 2", credits: 3, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2022-2023-HK2" },
    { courseCode: "INT1306", courseName: "Cấu trúc dữ liệu và giải thuật", credits: 3, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2022-2023-HK2" },
    { courseCode: "INT1319", courseName: "Lý thuyết thông tin", credits: 3, grade: "D", gradePoint: 1.0, isPassed: true, semester: "2022-2023-HK2" }, // Có thể học cải thiện!
    // Một số môn kỳ 5-6 đã học trước (để test Học cải thiện & Học lại)
    { courseCode: "INT1340", courseName: "Cơ sở dữ liệu", credits: 3, grade: "D+", gradePoint: 1.5, isPassed: true, semester: "2023-2024-HK1" }, // Có thể học cải thiện!
    { courseCode: "INT1416", courseName: "Nhập môn trí tuệ nhân tạo", credits: 3, grade: "F", gradePoint: 0.0, isPassed: false, semester: "2023-2024-HK2" }, // Cần học lại!
  ],
  registeredClasses: ["INT1434-01", "INT1339-02"],
};

// Danh sách môn học chuẩn Chương trình Đào tạo ngành CNTT (Học kỳ 1 -> Học kỳ 9)
export const INITIAL_COURSES: CourseData[] = [
  // ================= HỌC KỲ 1 =================
  {
    code: "BAS1150",
    name: "Triết học Mác-Lênin",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 1,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Trang bị thế giới quan và phương pháp luận triết học Mác-Lênin.",
  },
  {
    code: "INT1154",
    name: "Tin học cơ sở 1",
    credits: 2,
    theoryCredits: 1,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 1,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Kiến thức nền tảng về máy tính, hệ đếm, thuật toán cơ bản và tin học văn phòng.",
  },
  {
    code: "BAS1203",
    name: "Giải tích 1",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 1,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Phép tính vi phân và tích phân hàm một biến, chuỗi số và chuỗi hàm.",
  },
  {
    code: "BAS1201",
    name: "Đại số",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 1,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Ma trận, định thức, hệ phương trình tuyến tính, không gian vector và ánh xạ tuyến tính.",
  },

  // ================= HỌC KỲ 2 =================
  {
    code: "BAS1151",
    name: "Kinh tế chính trị Mác-Lênin",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 2,
    prerequisites: ["BAS1150"],
    previousCourses: [],
    corequisites: [],
    description: "Học thuyết kinh tế của chủ nghĩa Mác-Lênin về phương thức sản xuất tư bản chủ nghĩa và thời kỳ quá độ.",
  },
  {
    code: "BAS1157",
    name: "Tiếng Anh (Course 1)",
    credits: 4,
    theoryCredits: 3,
    practiceCredits: 1,
    department: "Khoa Ngoại ngữ",
    semesterProposal: 2,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Rèn luyện 4 kỹ năng Nghe - Nói - Đọc - Viết tiếng Anh học thuật cấp độ 1.",
  },
  {
    code: "INT1155",
    name: "Tin học cơ sở 2",
    credits: 2,
    theoryCredits: 1,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 2,
    prerequisites: ["INT1154"],
    previousCourses: [],
    corequisites: [],
    description: "Lập trình cấu trúc với ngôn ngữ C: mảng, con trỏ, xâu ký tự, cấu trúc và tệp.",
  },
  {
    code: "BAS1204",
    name: "Giải tích 2",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 2,
    prerequisites: ["BAS1203"],
    previousCourses: [],
    corequisites: [],
    description: "Giải tích hàm nhiều biến, tích phân bội, tích phân đường, tích phân mặt và phương trình vi phân.",
  },
  {
    code: "BAS1106",
    name: "Pháp luật đại cương",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 2,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Những vấn đề cơ bản về nhà nước và pháp luật, các ngành luật chính trong hệ thống pháp luật Việt Nam.",
  },
  {
    code: "BAS1224",
    name: "Vật lý ứng dụng",
    credits: 4,
    theoryCredits: 3,
    practiceCredits: 1,
    department: "Khoa Cơ bản 1",
    semesterProposal: 2,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Điện từ học, quang học lượng tử, vật lý bán dẫn và ứng dụng trong công nghệ thông tin.",
  },
  {
    code: "ELE1434",
    name: "Kỹ thuật số",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Kỹ thuật Điện tử 1",
    semesterProposal: 2,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Đại số Boole, cổng logic, mạch tổ hợp và mạch tuần tự trong hệ thống số.",
  },

  // ================= HỌC KỲ 3 =================
  {
    code: "BAS1152",
    name: "Chủ nghĩa xã hội khoa học",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 3,
    prerequisites: ["BAS1151"],
    previousCourses: [],
    corequisites: [],
    description: "Những quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển CNXH.",
  },
  {
    code: "BAS1158",
    name: "Tiếng Anh (Course 2)",
    credits: 4,
    theoryCredits: 3,
    practiceCredits: 1,
    department: "Khoa Ngoại ngữ",
    semesterProposal: 3,
    prerequisites: ["BAS1157"],
    previousCourses: [],
    corequisites: [],
    description: "Tiếng Anh giao tiếp và học thuật cấp độ 2 theo chuẩn đầu ra Học viện.",
  },
  {
    code: "INT1330",
    name: "Ngôn ngữ lập trình C++",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 3,
    prerequisites: ["INT1155"],
    previousCourses: [],
    corequisites: [],
    description: "Lập trình C++ hiện đại, quản lý bộ nhớ, STL, lớp và đối tượng trong C++.",
  },
  {
    code: "INT1358",
    name: "Toán rời rạc 1",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa CNTT 1",
    semesterProposal: 3,
    prerequisites: ["BAS1201"],
    previousCourses: [],
    corequisites: [],
    description: "Logic mệnh đề, tổ hợp, các thuật toán liệt kê, đệ quy và nguyên lý đếm.",
  },
  {
    code: "ELE1330",
    name: "Xử lý tín hiệu số",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Kỹ thuật Điện tử 1",
    semesterProposal: 3,
    prerequisites: ["BAS1204"],
    previousCourses: [],
    corequisites: [],
    description: "Lấy mẫu tín hiệu, biến đổi Z, biến đổi Fourier rời rạc (DFT/FFT) và bộ lọc số.",
  },
  {
    code: "BAS1226",
    name: "Xác suất thống kê",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 3,
    prerequisites: ["BAS1203"],
    previousCourses: [],
    corequisites: [],
    description: "Biến cố ngẫu nhiên, phân phối xác suất, ước lượng tham số và kiểm định giả thuyết thống kê.",
  },

  // ================= HỌC KỲ 4 =================
  {
    code: "BAS1122",
    name: "Tư tưởng Hồ Chí Minh",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 4,
    prerequisites: ["BAS1152"],
    previousCourses: [],
    corequisites: [],
    description: "Cơ sở hình thành, quá trình phát triển và nội dung cốt lõi của Tư tưởng Hồ Chí Minh.",
  },
  {
    code: "BAS1159",
    name: "Tiếng Anh (Course 3)",
    credits: 4,
    theoryCredits: 3,
    practiceCredits: 1,
    department: "Khoa Ngoại ngữ",
    semesterProposal: 4,
    prerequisites: ["BAS1158"],
    previousCourses: [],
    corequisites: [],
    description: "Tiếng Anh học thuật và định hướng TOEIC/IELTS cấp độ 3.",
  },
  {
    code: "INT1332",
    name: "Kiến trúc máy tính",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 4,
    prerequisites: ["ELE1434"],
    previousCourses: [],
    corequisites: [],
    description: "Tổ chức CPU, tập lệnh Assembly, phân cấp bộ nhớ Cache/RAM và hệ thống vào/ra.",
  },
  {
    code: "INT1359",
    name: "Toán rời rạc 2",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa CNTT 1",
    semesterProposal: 4,
    prerequisites: ["INT1358"],
    previousCourses: [],
    corequisites: [],
    description: "Lý thuyết đồ thị: duyệt đồ thị BFS/DFS, cây khung nhỏ nhất, đường đi ngắn nhất, luồng cực đại.",
  },
  {
    code: "INT1306",
    name: "Cấu trúc dữ liệu và giải thuật",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 4,
    prerequisites: ["INT1330"],
    previousCourses: ["INT1358"],
    corequisites: [],
    description: "Danh sách liên kết, ngăn xếp, hàng đợi, cây nhị phân, bảng băm, thuật toán sắp xếp và tìm kiếm.",
  },
  {
    code: "INT1319",
    name: "Lý thuyết thông tin",
    credits: 3,
    theoryCredits: 3,
    practiceCredits: 0,
    department: "Khoa Viễn thông 1",
    semesterProposal: 4,
    prerequisites: ["BAS1226"],
    previousCourses: [],
    corequisites: [],
    description: "Độ đo lượng tin, entropy, mã hóa nguồn thống kê và mã hóa kênh chống nhiễu.",
  },

  // ================= HỌC KỲ 5 =================
  {
    code: "BAS1153",
    name: "Lịch sử Đảng cộng sản VN",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 5,
    prerequisites: ["BAS1122"],
    previousCourses: [],
    corequisites: [],
    description: "Quá trình ra đời và lãnh đạo cách mạng Việt Nam của Đảng Cộng sản Việt Nam.",
  },
  {
    code: "BAS1160",
    name: "Tiếng Anh (Course 3 Plus)",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Ngoại ngữ",
    semesterProposal: 5,
    prerequisites: ["BAS1159"],
    previousCourses: [],
    corequisites: [],
    description: "Tiếng Anh chuyên ngành CNTT và hoàn thiện chuẩn đầu ra ngoại ngữ.",
  },
  {
    code: "INT1313",
    name: "Hệ điều hành",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1332"],
    previousCourses: [],
    corequisites: [],
    description: "Quản lý tiến trình, luồng, lập lịch CPU, đồng bộ hóa, Deadlock, quản lý bộ nhớ ảo và hệ thống file.",
  },
  {
    code: "INT1331",
    name: "Lập trình hướng đối tượng",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Nguyên lý OOP (Đóng gói, Kế thừa, Đa hình, Trừu tượng) và lập trình với ngôn ngữ Java.",
  },
  {
    code: "INT1340",
    name: "Cơ sở dữ liệu",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Mô hình thực thể liên kết E-R, đại số quan hệ, chuẩn hóa dữ liệu và ngôn ngữ truy vấn SQL.",
  },
  {
    code: "INT1339",
    name: "Mạng máy tính",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa Mạng & Truyền thông",
    semesterProposal: 5,
    prerequisites: ["INT1332"],
    previousCourses: [],
    corequisites: [],
    description: "Mô hình OSI, kiến trúc TCP/IP, định tuyến IP, DNS, HTTP/HTTPS và cấu hình mạng.",
  },
  {
    code: "INT13162",
    name: "Lập trình Python",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Ngôn ngữ Python, lập trình hướng đối tượng và xử lý dữ liệu với NumPy, Pandas.",
  },
  {
    code: "INT1405",
    name: "Nhập môn công nghệ phần mềm",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1340"],
    previousCourses: ["INT1306"],
    corequisites: [],
    description: "Quy trình phát triển phần mềm, Agile/Scrum, phân tích yêu cầu, thiết kế UML và kiểm thử.",
  },
  {
    code: "INT1434",
    name: "Lập trình Web",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1340"],
    previousCourses: [],
    corequisites: [],
    description: "Phát triển ứng dụng Web Fullstack hiện đại, HTML5/CSS3/JS, RESTful APIs và cơ chế bảo mật.",
  },
  {
    code: "INT1416",
    name: "Nhập môn trí tuệ nhân tạo",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Các thuật toán tìm kiếm mù và tìm kiếm kinh nghiệm, biểu diễn tri thức và học máy cơ bản.",
  },
  {
    code: "SKI1014",
    name: "Kỹ năng làm việc nhóm & Thuyết trình",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Bộ môn Kỹ năng Mềm",
    semesterProposal: 5,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Kỹ năng giao tiếp chuyên nghiệp, đàm phán, quản lý xung đột nhóm.",
  },

  // ================= HỌC KỲ 6 =================
  {
    code: "INT1412",
    name: "An toàn và bảo mật hệ thống thông tin",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa An toàn Thông tin",
    semesterProposal: 6,
    prerequisites: ["INT1339"],
    previousCourses: [],
    corequisites: [],
    description: "Mật mã học đối xứng/bất đối xứng, xác thực, chữ ký số và phòng chống tấn công mạng.",
  },
  {
    code: "INT1418",
    name: "Cơ sở dữ liệu phân tán",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 6,
    prerequisites: ["INT1340", "INT1339"],
    previousCourses: [],
    corequisites: [],
    description: "Thiết kế CSDL phân tán, phân mảnh dữ liệu, tối ưu hóa truy vấn và quản lý giao dịch phân tán.",
  },
  {
    code: "INT1479",
    name: "Thực tập cơ sở",
    credits: 4,
    theoryCredits: 0,
    practiceCredits: 4,
    department: "Khoa CNTT 1",
    semesterProposal: 6,
    prerequisites: ["INT1340"],
    previousCourses: [],
    corequisites: [],
    description: "Thực hành xây dựng sản phẩm phần mềm cơ sở theo nhóm dưới sự hướng dẫn của giảng viên.",
  },
  {
    code: "ELE1433",
    name: "IoT và ứng dụng",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa Điện tử 1",
    semesterProposal: 6,
    prerequisites: ["INT1332"],
    previousCourses: [],
    corequisites: [],
    description: "Kiến trúc Internet vạn vật, lập trình vi điều khiển, mạng cảm biến và giao thức MQTT/CoAP.",
  },

  // ================= HỌC KỲ 7 =================
  {
    code: "INT1408",
    name: "Quản lý dự án phần mềm",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["INT1405"],
    previousCourses: [],
    corequisites: [],
    description: "Lập kế hoạch dự án, ước lượng chi phí, quản lý rủi ro, tiến độ và nhân sự phần mềm.",
  },
  {
    code: "INT1409",
    name: "Phân tích và thiết kế hệ thống thông tin",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["INT1405", "INT1340"],
    previousCourses: [],
    corequisites: [],
    description: "Khảo sát nghiệp vụ, mô hình hóa hệ thống với UML và thiết kế kiến trúc HTTT.",
  },
  {
    code: "INT1449",
    name: "Xử lý ảnh",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Biến đổi ảnh số, lọc nhiễu, phát hiện biên, phân vùng ảnh và nhận dạng đối tượng.",
  },
  {
    code: "INT14115",
    name: "Phát triển các hệ thống thông minh (Deep Learning)",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["INT1416"], // Sinh viên đang điểm F INT1416 -> dùng test chặn tiên quyết!
    previousCourses: [],
    corequisites: [],
    description: "Mạng nơ-ron sâu CNN, RNN, Transformer và xây dựng ứng dụng AI thông minh.",
  },
  {
    code: "INT1450",
    name: "Điện toán đám mây",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa Mạng & Truyền thông",
    semesterProposal: 7,
    prerequisites: ["INT1339"],
    previousCourses: [],
    corequisites: [],
    description: "Ảo hóa, kiến trúc Cloud IaaS/PaaS/SaaS, Docker, Kubernetes và dịch vụ AWS/GCP.",
  },
  {
    code: "INT1461",
    name: "Nhập môn khoa học dữ liệu",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["BAS1226", "INT1340"],
    previousCourses: [],
    corequisites: [],
    description: "Thu thập, tiền xử lý, trực quan hóa dữ liệu và các mô hình phân tích dữ liệu lớn.",
  },
  {
    code: "INT1433",
    name: "Lập trình mạng",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa Mạng & Truyền thông",
    semesterProposal: 7,
    prerequisites: ["INT1339"],
    previousCourses: [],
    corequisites: [],
    description: "Lập trình Socket TCP/UDP, đa luồng, giao thức mạng ứng dụng và hệ thống Client-Server.",
  },
  {
    code: "INT1427",
    name: "Phát triển phần mềm hướng dịch vụ",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["INT1434"],
    previousCourses: [],
    corequisites: [],
    description: "Kiến trúc hướng dịch vụ SOA, Microservices, REST/gRPC và tích hợp hệ thống doanh nghiệp.",
  },

  // ================= HỌC KỲ 8 =================
  {
    code: "INT1448",
    name: "Phát triển ứng dụng cho thiết bị di động",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 8,
    prerequisites: ["INT1331"],
    previousCourses: [],
    corequisites: [],
    description: "Thiết kế giao diện và lập trình ứng dụng di động đa nền tảng Android/iOS.",
  },
  {
    code: "INT1422",
    name: "Đảm bảo chất lượng phần mềm",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 8,
    prerequisites: ["INT1405"],
    previousCourses: [],
    corequisites: [],
    description: "Chiến lược kiểm thử phần mềm, kiểm thử tự động, quản lý lỗi và tiêu chuẩn chất lượng ISO/IEEE.",
  },
  {
    code: "INT1423",
    name: "Phát triển yêu cầu phần mềm",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 8,
    prerequisites: ["INT1405"],
    previousCourses: [],
    corequisites: [],
    description: "Thu thập, phân tích, đặc tả SRS và thẩm định yêu cầu phần mềm.",
  },
  {
    code: "INT1424",
    name: "Kiến trúc và thiết kế phần mềm",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 8,
    prerequisites: ["INT1405"],
    previousCourses: [],
    corequisites: [],
    description: "Các mẫu thiết kế (Design Patterns), kiến trúc Clean Architecture, Event-Driven và Microservices.",
  },
  {
    code: "INT1438",
    name: "Các hệ thống phân tán",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 8,
    prerequisites: ["INT1339"],
    previousCourses: [],
    corequisites: [],
    description: "Đồng hồ logic, đồng thuận phân tán (Raft/Paxos), nhân bản và chịu lỗi trong hệ phân tán.",
  },
  {
    code: "INT1442",
    name: "Kho dữ liệu và khai phá dữ liệu",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 8,
    prerequisites: ["INT1340"],
    previousCourses: [],
    corequisites: [],
    description: "Kiến trúc Data Warehouse, OLAP, luật kết hợp, phân cụm và phân lớp dữ liệu.",
  },
  {
    code: "INT1414",
    name: "An ninh mạng",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa An toàn Thông tin",
    semesterProposal: 8,
    prerequisites: ["INT1412"],
    previousCourses: [],
    corequisites: [],
    description: "Hệ thống phát hiện xâm nhập IDS/IPS, tường lửa, VPN và giám sát an ninh mạng.",
  },
  {
    code: "BAS1260",
    name: "Phương pháp luận nghiên cứu khoa học",
    credits: 2,
    theoryCredits: 2,
    practiceCredits: 0,
    department: "Khoa Cơ bản 1",
    semesterProposal: 8,
    prerequisites: [],
    previousCourses: [],
    corequisites: [],
    description: "Phương pháp thực hiện đề tài nghiên cứu khoa học, viết bài báo và báo cáo học thuật.",
  },

  // ================= HỌC KỲ 9 =================
  {
    code: "INT1499",
    name: "Thực tập và tốt nghiệp",
    credits: 12,
    theoryCredits: 0,
    practiceCredits: 12,
    department: "Khoa CNTT 1",
    semesterProposal: 9,
    prerequisites: ["INT1479"],
    previousCourses: [],
    corequisites: [],
    description: "Thực tập chuyên sâu tại doanh nghiệp và thực hiện Đồ án / Khóa luận tốt nghiệp kỹ sư CNTT.",
  },
];

export const INITIAL_COURSE_CLASSES: CourseClassData[] = [
  // --- Lập trình Web (INT1434) ---
  {
    classCode: "INT1434-01",
    courseCode: "INT1434",
    courseName: "Lập trình Web",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3
    room: "401-A2",
    lecturer: "TS. Hoàng Xuân Dậu",
    maxSlots: 60,
    currentSlots: 45,
    registeredStudents: ["B21DCCN001", "B21DCCN012"],
    tuitionPerCredit: 655000,
  },
  {
    classCode: "INT1434-02",
    courseCode: "INT1434",
    courseName: "Lập trình Web",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 4, // Thứ 4
    startPeriod: 7,
    periodCount: 3, // Tiết 7 - 9
    room: "204-A3",
    lecturer: "ThS. Phạm Thế Quynh",
    maxSlots: 55,
    currentSlots: 55, // ĐẦY SĨ SỐ để test!
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Mạng máy tính (INT1339) ---
  {
    classCode: "INT1339-01",
    courseCode: "INT1339",
    courseName: "Mạng máy tính",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2 (TRÙNG LỊCH với INT1434-01)
    startPeriod: 1,
    periodCount: 3,
    room: "305-A2",
    lecturer: "PGS.TS Vũ Hữu Tiến",
    maxSlots: 60,
    currentSlots: 40,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },
  {
    classCode: "INT1339-02",
    courseCode: "INT1339",
    courseName: "Mạng máy tính",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 3, // Thứ 3
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "102-A2",
    lecturer: "TS. Lê Quang Minh",
    maxSlots: 60,
    currentSlots: 38,
    registeredStudents: ["B21DCCN001"],
    tuitionPerCredit: 655000,
  },

  // --- Hệ điều hành (INT1313) ---
  {
    classCode: "INT1313-01",
    courseCode: "INT1313",
    courseName: "Hệ điều hành",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "304-A2",
    lecturer: "TS. Nguyễn Ngọc Điệp",
    maxSlots: 60,
    currentSlots: 34,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },
  {
    classCode: "INT1313-02",
    courseCode: "INT1313",
    courseName: "Hệ điều hành",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 5, // Thứ 5
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "202-A3",
    lecturer: "ThS. Trần Quang Hải",
    maxSlots: 60,
    currentSlots: 28,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Lập trình hướng đối tượng (INT1331) ---
  {
    classCode: "INT1331-01",
    courseCode: "INT1331",
    courseName: "Lập trình hướng đối tượng",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 3, // Thứ 3
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3
    room: "402-A2",
    lecturer: "TS. Nguyễn Mạnh Sơn",
    maxSlots: 65,
    currentSlots: 42,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },
  {
    classCode: "INT1331-02",
    courseCode: "INT1331",
    courseName: "Lập trình hướng đối tượng",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 6, // Thứ 6
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "308-A2",
    lecturer: "ThS. Kim Ngọc Bách",
    maxSlots: 60,
    currentSlots: 39,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Lập trình Python (INT13162) ---
  {
    classCode: "INT13162-01",
    courseCode: "INT13162",
    courseName: "Lập trình Python",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 4, // Thứ 4
    startPeriod: 10,
    periodCount: 3, // Tiết 10 - 12
    room: "501-A2",
    lecturer: "TS. Đỗ Bách Khoa",
    maxSlots: 60,
    currentSlots: 30,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Lịch sử Đảng cộng sản VN (BAS1153) ---
  {
    classCode: "BAS1153-01",
    courseCode: "BAS1153",
    courseName: "Lịch sử Đảng cộng sản VN",
    credits: 2,
    periodId: "2024-2025-HK1",
    dayOfWeek: 6, // Thứ 6
    startPeriod: 10,
    periodCount: 2, // Tiết 10 - 11
    room: "Hội trường A1",
    lecturer: "TS. Nguyễn Thị Mai",
    maxSlots: 90,
    currentSlots: 52,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Tiếng Anh (Course 3 Plus) (BAS1160) ---
  {
    classCode: "BAS1160-01",
    courseCode: "BAS1160",
    courseName: "Tiếng Anh (Course 3 Plus)",
    credits: 2,
    periodId: "2024-2025-HK1",
    dayOfWeek: 7, // Thứ 7
    startPeriod: 7,
    periodCount: 2, // Tiết 7 - 8
    room: "205-A1",
    lecturer: "ThS. Vũ Phương Thảo",
    maxSlots: 45,
    currentSlots: 26,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Nhập môn công nghệ phần mềm (INT1405) ---
  {
    classCode: "INT1405-01",
    courseCode: "INT1405",
    courseName: "Nhập môn công nghệ phần mềm",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 5, // Thứ 5
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3
    room: "301-A3",
    lecturer: "TS. Ngô Xuân Bách",
    maxSlots: 65,
    currentSlots: 32,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },
  {
    classCode: "INT1405-02",
    courseCode: "INT1405",
    courseName: "Nhập môn công nghệ phần mềm",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 6, // Thứ 6
    startPeriod: 7,
    periodCount: 3, // Tiết 7 - 9
    room: "502-A2",
    lecturer: "ThS. Trần Thị Kim Oanh",
    maxSlots: 60,
    currentSlots: 48,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- An toàn và bảo mật hệ thống thông tin (INT1412) ---
  {
    classCode: "INT1412-01",
    courseCode: "INT1412",
    courseName: "An toàn và bảo mật hệ thống thông tin",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 4, // Thứ 4
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3
    room: "302-A2",
    lecturer: "TS. Hoàng Đăng Hải",
    maxSlots: 50,
    currentSlots: 27,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },
  {
    classCode: "INT1412-02",
    courseCode: "INT1412",
    courseName: "An toàn và bảo mật hệ thống thông tin",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 7, // Thứ 7
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "201-A3",
    lecturer: "ThS. Đỗ Tuấn Anh",
    maxSlots: 50,
    currentSlots: 15,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Cơ sở dữ liệu phân tán (INT1418) ---
  {
    classCode: "INT1418-01",
    courseCode: "INT1418",
    courseName: "Cơ sở dữ liệu phân tán",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2
    startPeriod: 7,
    periodCount: 3, // Tiết 7 - 9
    room: "306-A2",
    lecturer: "PGS.TS Đặng Văn Đức",
    maxSlots: 55,
    currentSlots: 31,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Thực tập cơ sở (INT1479) ---
  {
    classCode: "INT1479-01",
    courseCode: "INT1479",
    courseName: "Thực tập cơ sở",
    credits: 4,
    periodId: "2024-2025-HK1",
    dayOfWeek: 7, // Thứ 7
    startPeriod: 9,
    periodCount: 3, // Tiết 9 - 11
    room: "Lab CNPM-A2",
    lecturer: "TS. Hoàng Xuân Dậu",
    maxSlots: 60,
    currentSlots: 22,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Nhập môn trí tuệ nhân tạo (INT1416) [Môn học lại của sinh viên] ---
  {
    classCode: "INT1416-01",
    courseCode: "INT1416",
    courseName: "Nhập môn trí tuệ nhân tạo",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 6, // Thứ 6
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3
    room: "405-A2",
    lecturer: "PGS.TS Từ Minh Phương",
    maxSlots: 60,
    currentSlots: 51,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Cơ sở dữ liệu (INT1340) [Môn học cải thiện] ---
  {
    classCode: "INT1340-01",
    courseCode: "INT1340",
    courseName: "Cơ sở dữ liệu",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 3, // Thứ 3
    startPeriod: 7,
    periodCount: 3, // Tiết 7 - 9
    room: "203-A2",
    lecturer: "TS. Nguyễn Kiều Linh",
    maxSlots: 60,
    currentSlots: 35,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Lý thuyết thông tin (INT1319) [Môn học cải thiện] ---
  {
    classCode: "INT1319-01",
    courseCode: "INT1319",
    courseName: "Lý thuyết thông tin",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 5, // Thứ 5
    startPeriod: 10,
    periodCount: 3, // Tiết 10 - 12
    room: "104-A2",
    lecturer: "PGS.TS Nguyễn Tiến Ban",
    maxSlots: 60,
    currentSlots: 25,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Phát triển các hệ thống thông minh (Deep Learning) (INT14115) [Chặn tiên quyết vì chưa qua INT1416] ---
  {
    classCode: "INT14115-01",
    courseCode: "INT14115",
    courseName: "Phát triển các hệ thống thông minh (Deep Learning)",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 5, // Thứ 5
    startPeriod: 7,
    periodCount: 3, // Tiết 7 - 9
    room: "Lab AI-A2",
    lecturer: "TS. Nguyễn Kim Anh",
    maxSlots: 40,
    currentSlots: 20,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Kỹ năng làm việc nhóm & Thuyết trình (SKI1014) ---
  {
    classCode: "SKI1014-01",
    courseCode: "SKI1014",
    courseName: "Kỹ năng làm việc nhóm & Thuyết trình",
    credits: 2,
    periodId: "2024-2025-HK1",
    dayOfWeek: 7, // Thứ 7
    startPeriod: 1,
    periodCount: 2, // Tiết 1 - 2
    room: "Hội trường A2",
    lecturer: "ThS. Lê Thị Thu Hằng",
    maxSlots: 80,
    currentSlots: 42,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- IoT và ứng dụng (ELE1433) ---
  {
    classCode: "ELE1433-01",
    courseCode: "ELE1433",
    courseName: "IoT và ứng dụng",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 4, // Thứ 4
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "Lab IoT-303",
    lecturer: "TS. Vũ Khánh Quý",
    maxSlots: 45,
    currentSlots: 29,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Xử lý ảnh (INT1449) ---
  {
    classCode: "INT1449-01",
    courseCode: "INT1449",
    courseName: "Xử lý ảnh",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 3, // Thứ 3
    startPeriod: 10,
    periodCount: 3, // Tiết 10 - 12
    room: "404-A2",
    lecturer: "PGS.TS Phạm Văn Cường",
    maxSlots: 50,
    currentSlots: 33,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Điện toán đám mây (INT1450) ---
  {
    classCode: "INT1450-01",
    courseCode: "INT1450",
    courseName: "Điện toán đám mây",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2
    startPeriod: 10,
    periodCount: 3, // Tiết 10 - 12
    room: "309-A2",
    lecturer: "TS. Trần Công Hùng",
    maxSlots: 55,
    currentSlots: 41,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Nhập môn khoa học dữ liệu (INT1461) ---
  {
    classCode: "INT1461-01",
    courseCode: "INT1461",
    courseName: "Nhập môn khoa học dữ liệu",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 6, // Thứ 6
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6
    room: "Lab DS-A3",
    lecturer: "TS. Ngô Xuân Bách",
    maxSlots: 50,
    currentSlots: 36,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },

  // --- Phát triển ứng dụng cho thiết bị di động (INT1448) ---
  {
    classCode: "INT1448-01",
    courseCode: "INT1448",
    courseName: "Phát triển ứng dụng cho thiết bị di động",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 4, // Thứ 4
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3
    room: "403-A2",
    lecturer: "ThS. Nguyễn Trọng Khánh",
    maxSlots: 55,
    currentSlots: 28,
    registeredStudents: [],
    tuitionPerCredit: 655000,
  },
];

// Tự động bổ sung lớp học phần mở cho tất cả các môn học trong CTĐT (Học kỳ 1 -> Học kỳ 9) chưa có lớp riêng
const SAMPLE_LECTURERS_POOL = [
  "PGS.TS Nguyễn Mạnh Hùng",
  "TS. Hoàng Xuân Dậu",
  "PGS.TS Vũ Hữu Tiến",
  "TS. Ngô Xuân Bách",
  "TS. Lê Quang Minh",
  "TS. Nguyễn Kiều Linh",
  "PGS.TS Từ Minh Phương",
  "TS. Đỗ Bách Khoa",
  "ThS. Phạm Thế Quynh",
  "TS. Hoàng Đăng Hải",
];

const SAMPLE_ROOMS_POOL = [
  "101-A2", "103-A2", "201-A2", "205-A2", "301-A2",
  "307-A2", "402-A3", "406-A3", "501-A3", "504-A3",
];

INITIAL_COURSES.forEach((course, index) => {
  const hasClass = INITIAL_COURSE_CLASSES.some((cls) => cls.courseCode === course.code);
  if (!hasClass) {
    const day = (index % 6) + 2; // Thứ 2 -> Thứ 7
    const startSlots = [1, 4, 7, 10];
    const startPeriod = startSlots[index % startSlots.length];
    const periodCount = course.credits >= 3 ? 3 : 2;

    INITIAL_COURSE_CLASSES.push({
      classCode: `${course.code}-01`,
      courseCode: course.code,
      courseName: course.name,
      credits: course.credits,
      periodId: "2024-2025-HK1",
      dayOfWeek: day,
      startPeriod,
      periodCount,
      room: SAMPLE_ROOMS_POOL[index % SAMPLE_ROOMS_POOL.length],
      lecturer: SAMPLE_LECTURERS_POOL[index % SAMPLE_LECTURERS_POOL.length],
      maxSlots: 60,
      currentSlots: 20 + ((index * 7) % 30),
      registeredStudents: [],
      tuitionPerCredit: 655000,
    });
  }
});

export const INITIAL_LECTURERS: LecturerData[] = [
  {
    lecturerCode: "GV01",
    fullName: "TS. Hoàng Xuân Dậu",
    title: "Tiến sĩ - Trưởng bộ môn CNPM",
    department: "Khoa Công nghệ Thông tin 1",
    email: "dauhx@unicredit.edu.vn",
    phone: "0912.345.678",
    teachingClassCodes: ["INT1434-01", "INT1479-01"],
  },
  {
    lecturerCode: "GV02",
    fullName: "PGS.TS Vũ Hữu Tiến",
    title: "Phó Giáo sư, Tiến sĩ",
    department: "Khoa Mạng & Truyền thông",
    email: "tienvh@unicredit.edu.vn",
    phone: "0988.765.432",
    teachingClassCodes: ["INT1339-01"],
  },
  {
    lecturerCode: "GV03",
    fullName: "TS. Ngô Xuân Bách",
    title: "Tiến sĩ",
    department: "Khoa Công nghệ Thông tin 1",
    email: "bachnx@unicredit.edu.vn",
    phone: "0904.112.233",
    teachingClassCodes: ["INT1405-01", "INT1461-01"],
  },
];

export const INITIAL_ADMIN: AdminData = {
  adminCode: "ADMIN01",
  fullName: "ThS. Nguyễn Văn Quản Trị",
  title: "Chuyên viên Quản lý Đào tạo",
  department: "Phòng Giáo vụ & Đào tạo Đại học PTIT",
  email: "giaovu@unicredit.edu.vn",
  phone: "024.3756.2186",
};

export interface StudentRosterItem {
  studentCode: string;
  fullName: string;
  administrativeClass: string;
  email: string;
  registeredDate: string;
  academicStatus?: AcademicStatusType;
}

export const SAMPLE_STUDENTS_LIST: StudentRosterItem[] = [
  { studentCode: "B21DCCN001", fullName: "Nguyễn Hoàng Minh", administrativeClass: "D21CQCN01-B", email: "minhnh.b21cn001@unicredit.edu.vn", registeredDate: "2024-09-02 08:15", academicStatus: "ACTIVE" },
  { studentCode: "B21DCCN012", fullName: "Trần Bảo Trâm", administrativeClass: "D21CQCN01-B", email: "tramtb.b21cn012@unicredit.edu.vn", registeredDate: "2024-09-02 08:20", academicStatus: "ACTIVE" },
  { studentCode: "B21DCCN045", fullName: "Lê Đức Anh", administrativeClass: "D21CQCN02-B", email: "anhld.b21cn045@unicredit.edu.vn", registeredDate: "2024-09-02 08:24", academicStatus: "ACTIVE" },
  { studentCode: "B21DCCN089", fullName: "Vũ Minh Quân", administrativeClass: "D21CQCN03-B", email: "quanvm.b21cn089@unicredit.edu.vn", registeredDate: "2024-09-02 08:31", academicStatus: "RESERVED" },
  { studentCode: "B21DCCN120", fullName: "Phạm Thu Hương", administrativeClass: "D21CQCN01-B", email: "huongpt.b21cn120@unicredit.edu.vn", registeredDate: "2024-09-02 09:05", academicStatus: "ACTIVE" },
  { studentCode: "B21DCCN144", fullName: "Đặng Quang Huy", administrativeClass: "D21CQCN02-B", email: "huydq.b21cn144@unicredit.edu.vn", registeredDate: "2024-09-02 09:18", academicStatus: "ACTIVE" },
  { studentCode: "B21DCCN203", fullName: "Ngô Quốc Khánh", administrativeClass: "D21CQCN04-B", email: "khanhnq.b21cn203@unicredit.edu.vn", registeredDate: "2024-09-02 10:02", academicStatus: "DROPPED_OUT" },
];

export const INITIAL_STUDENTS_COLLECTION: StudentData[] = [
  INITIAL_STUDENT,
  {
    studentCode: "B21DCCN012",
    fullName: "Trần Bảo Trâm",
    email: "tramtb.b21cn012@unicredit.edu.vn",
    major: "Công nghệ Thông tin",
    administrativeClass: "D21CQCN01-B",
    academicYear: 2021,
    cpa: 3.62,
    accumulatedCredits: 78,
    advisorName: "PGS.TS Nguyễn Mạnh Hùng",
    academicStatus: "ACTIVE",
    completedCourses: INITIAL_STUDENT.completedCourses,
    registeredClasses: ["INT1434-01", "INT1405-01"],
  },
  {
    studentCode: "B21DCCN045",
    fullName: "Lê Đức Anh",
    email: "anhld.b21cn045@unicredit.edu.vn",
    major: "Công nghệ Thông tin",
    administrativeClass: "D21CQCN02-B",
    academicYear: 2021,
    cpa: 3.15,
    accumulatedCredits: 72,
    advisorName: "TS. Hoàng Xuân Dậu",
    academicStatus: "ACTIVE",
    completedCourses: INITIAL_STUDENT.completedCourses,
    registeredClasses: ["INT1434-01", "INT1339-01"],
  },
  {
    studentCode: "B21DCCN089",
    fullName: "Vũ Minh Quân",
    email: "quanvm.b21cn089@unicredit.edu.vn",
    major: "Công nghệ Thông tin",
    administrativeClass: "D21CQCN03-B",
    academicYear: 2021,
    cpa: 2.65,
    accumulatedCredits: 64,
    advisorName: "TS. Ngô Xuân Bách",
    academicStatus: "RESERVED",
    completedCourses: INITIAL_STUDENT.completedCourses,
    registeredClasses: [],
  },
  {
    studentCode: "B21DCCN120",
    fullName: "Phạm Thu Hương",
    email: "huongpt.b21cn120@unicredit.edu.vn",
    major: "Công nghệ Thông tin",
    administrativeClass: "D21CQCN01-B",
    academicYear: 2021,
    cpa: 3.45,
    accumulatedCredits: 75,
    advisorName: "PGS.TS Nguyễn Mạnh Hùng",
    academicStatus: "ACTIVE",
    completedCourses: INITIAL_STUDENT.completedCourses,
    registeredClasses: ["INT1434-01", "INT1405-01"],
  },
  {
    studentCode: "B21DCCN144",
    fullName: "Đặng Quang Huy",
    email: "huydq.b21cn144@unicredit.edu.vn",
    major: "Công nghệ Thông tin",
    administrativeClass: "D21CQCN02-B",
    academicYear: 2021,
    cpa: 2.92,
    accumulatedCredits: 70,
    advisorName: "TS. Hoàng Xuân Dậu",
    academicStatus: "ACTIVE",
    completedCourses: INITIAL_STUDENT.completedCourses,
    registeredClasses: ["INT1339-01", "INT1405-01"],
  },
  {
    studentCode: "B21DCCN203",
    fullName: "Ngô Quốc Khánh",
    email: "khanhnq.b21cn203@unicredit.edu.vn",
    major: "Công nghệ Thông tin",
    administrativeClass: "D21CQCN04-B",
    academicYear: 2021,
    cpa: 1.75,
    accumulatedCredits: 42,
    advisorName: "PGS.TS Vũ Hữu Tiến",
    academicStatus: "DROPPED_OUT",
    completedCourses: INITIAL_STUDENT.completedCourses.slice(0, 6),
    registeredClasses: [],
  },
];
