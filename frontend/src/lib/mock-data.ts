export interface CompletedCourseData {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoint: number;
  isPassed: boolean;
  semester: string;
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
  completedCourses: [
    { courseCode: "BAS1201", courseName: "Đại số tuyến tính", credits: 3, grade: "B+", gradePoint: 3.5, isPassed: true, semester: "2021-2022-HK1" },
    { courseCode: "BAS1203", courseName: "Giải tích 1", credits: 3, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2021-2022-HK1" },
    { courseCode: "INT1155", courseName: "Tin học cơ sở 2 (C/C++)", credits: 3, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "BAS1105", courseName: "Triết học Mác - Lênin", credits: 3, grade: "C+", gradePoint: 2.5, isPassed: true, semester: "2021-2022-HK2" },
    { courseCode: "INT1306", courseName: "Cấu trúc dữ liệu và giải thuật", credits: 3, grade: "A", gradePoint: 4.0, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "INT1332", courseName: "Kiến trúc máy tính", credits: 3, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2022-2023-HK1" },
    { courseCode: "INT1340", courseName: "Cơ sở dữ liệu", credits: 3, grade: "D+", gradePoint: 1.5, isPassed: true, semester: "2022-2023-HK2" }, // Có thể học cải thiện!
    { courseCode: "INT1416", courseName: "Trí tuệ nhân tạo cơ bản", credits: 3, grade: "F", gradePoint: 0.0, isPassed: false, semester: "2023-2024-HK1" }, // Cần học lại!
  ],
  registeredClasses: ["INT1434-01", "INT1339-02"], // Đã có 2 môn đăng ký mẫu ban đầu
};

export const INITIAL_COURSES: CourseData[] = [
  {
    code: "INT1405",
    name: "Công nghệ phần mềm",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1340"], // Đã qua CSDL
    previousCourses: ["INT1306"],
    corequisites: [],
    description: "Các mô hình phát triển phần mềm, Agile/Scrum, thiết kế hướng đối tượng UML.",
  },
  {
    code: "INT1434",
    name: "Lập trình Web và ứng dụng",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1340"],
    previousCourses: [],
    corequisites: [],
    description: "Phát triển ứng dụng Web Fullstack hiện đại, RESTful APIs và cơ chế bảo mật.",
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
    description: "Mô hình OSI, giao thức TCP/IP, định tuyến mạng, DNS, HTTP/HTTPS.",
  },
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
    description: "Mật mã học cơ bản, kiểm thử lỗ hổng bảo mật, phòng chống tấn công mạng.",
  },
  {
    code: "INT1416",
    name: "Trí tuệ nhân tạo cơ bản",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 5,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Các thuật toán tìm kiếm, Machine Learning cơ bản, mạng nơ-ron nhân tạo.",
  },
  {
    code: "INT1340",
    name: "Cơ sở dữ liệu",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 4,
    prerequisites: ["INT1306"],
    previousCourses: [],
    corequisites: [],
    description: "Mô hình quan hệ E-R, chuẩn hóa dữ liệu, ngôn ngữ SQL nâng cao.",
  },
  {
    code: "INT14115",
    name: "Học máy chuyên sâu (Deep Learning)",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa CNTT 1",
    semesterProposal: 7,
    prerequisites: ["INT1416"], // Môn này SV chưa đạt INT1416 (bị điểm F) -> Dùng để test chặn môn tiên quyết!
    previousCourses: [],
    corequisites: [],
    description: "Mô hình CNN, RNN, Transformer, thị giác máy tính và xử lý ngôn ngữ tự nhiên.",
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
  {
    code: "ELE1433",
    name: "Thiết kế hệ thống nhúng và IoT",
    credits: 3,
    theoryCredits: 2,
    practiceCredits: 1,
    department: "Khoa Điện tử 1",
    semesterProposal: 6,
    prerequisites: ["INT1332"],
    previousCourses: [],
    corequisites: [],
    description: "Lập trình vi điều khiển ARM, ESP32, kết nối cảm biến và giao thức MQTT.",
  },
];

export const INITIAL_COURSE_CLASSES: CourseClassData[] = [
  // --- Lập trình Web và ứng dụng (INT1434) ---
  {
    classCode: "INT1434-01",
    courseCode: "INT1434",
    courseName: "Lập trình Web và ứng dụng",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2
    startPeriod: 1,
    periodCount: 3, // Tiết 1 - 3 (07:00 - 09:50)
    room: "401-A2",
    lecturer: "TS. Hoàng Xuân Dậu",
    maxSlots: 60,
    currentSlots: 45,
    registeredStudents: ["B21DCCN001", "B21DCCN012"],
    tuitionPerCredit: 450000,
  },
  {
    classCode: "INT1434-02",
    courseCode: "INT1434",
    courseName: "Lập trình Web và ứng dụng",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 4, // Thứ 4
    startPeriod: 7,
    periodCount: 3, // Tiết 7 - 9 (13:30 - 16:20)
    room: "204-A3",
    lecturer: "ThS. Phạm Thế Quynh",
    maxSlots: 55,
    currentSlots: 55, // ĐẦY SĨ SỐ để test!
    registeredStudents: [],
    tuitionPerCredit: 450000,
  },

  // --- Mạng máy tính (INT1339) ---
  {
    classCode: "INT1339-01",
    courseCode: "INT1339",
    courseName: "Mạng máy tính",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 2, // Thứ 2 (TRÙNG LỊCH với INT1434-01 nếu đăng ký: Tiết 1-3)
    startPeriod: 1,
    periodCount: 3,
    room: "305-A2",
    lecturer: "PGS.TS Vũ Hữu Tiến",
    maxSlots: 60,
    currentSlots: 40,
    registeredStudents: [],
    tuitionPerCredit: 450000,
  },
  {
    classCode: "INT1339-02",
    courseCode: "INT1339",
    courseName: "Mạng máy tính",
    credits: 3,
    periodId: "2024-2025-HK1",
    dayOfWeek: 3, // Thứ 3
    startPeriod: 4,
    periodCount: 3, // Tiết 4 - 6 (10:00 - 12:40)
    room: "102-A2",
    lecturer: "TS. Lê Quang Minh",
    maxSlots: 60,
    currentSlots: 38,
    registeredStudents: ["B21DCCN001"],
    tuitionPerCredit: 450000,
  },

  // --- Công nghệ phần mềm (INT1405) ---
  {
    classCode: "INT1405-01",
    courseCode: "INT1405",
    courseName: "Công nghệ phần mềm",
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
    tuitionPerCredit: 450000,
  },
  {
    classCode: "INT1405-02",
    courseCode: "INT1405",
    courseName: "Công nghệ phần mềm",
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
    tuitionPerCredit: 450000,
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
    tuitionPerCredit: 450000,
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
    tuitionPerCredit: 450000,
  },

  // --- Trí tuệ nhân tạo cơ bản (INT1416) [Môn học lại của sinh viên] ---
  {
    classCode: "INT1416-01",
    courseCode: "INT1416",
    courseName: "Trí tuệ nhân tạo cơ bản",
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
    tuitionPerCredit: 450000,
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
    tuitionPerCredit: 450000,
  },

  // --- Học máy chuyên sâu (Deep Learning) (INT14115) [Chặn tiên quyết vì chưa qua INT1416] ---
  {
    classCode: "INT14115-01",
    courseCode: "INT14115",
    courseName: "Học máy chuyên sâu (Deep Learning)",
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
    tuitionPerCredit: 450000,
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
    tuitionPerCredit: 450000,
  },

  // --- Thiết kế hệ thống nhúng và IoT (ELE1433) ---
  {
    classCode: "ELE1433-01",
    courseCode: "ELE1433",
    courseName: "Thiết kế hệ thống nhúng và IoT",
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
    tuitionPerCredit: 450000,
  },
];

export const INITIAL_LECTURERS: LecturerData[] = [
  {
    lecturerCode: "GV01",
    fullName: "TS. Hoàng Xuân Dậu",
    title: "Tiến sĩ - Trưởng bộ môn CNPM",
    department: "Khoa Công nghệ Thông tin 1",
    email: "dauhx@unicredit.edu.vn",
    phone: "0912.345.678",
    teachingClassCodes: ["INT1434-01"],
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
    teachingClassCodes: ["INT1405-01"],
  },
];

export interface StudentRosterItem {
  studentCode: string;
  fullName: string;
  administrativeClass: string;
  email: string;
  registeredDate: string;
}

export const SAMPLE_STUDENTS_LIST: StudentRosterItem[] = [
  { studentCode: "B21DCCN001", fullName: "Nguyễn Hoàng Minh", administrativeClass: "D21CQCN01-B", email: "minhnh.b21cn001@unicredit.edu.vn", registeredDate: "2024-09-02 08:15" },
  { studentCode: "B21DCCN012", fullName: "Trần Bảo Trâm", administrativeClass: "D21CQCN01-B", email: "tramtb.b21cn012@unicredit.edu.vn", registeredDate: "2024-09-02 08:20" },
  { studentCode: "B21DCCN045", fullName: "Lê Đức Anh", administrativeClass: "D21CQCN02-B", email: "anhld.b21cn045@unicredit.edu.vn", registeredDate: "2024-09-02 08:24" },
  { studentCode: "B21DCCN089", fullName: "Vũ Minh Quân", administrativeClass: "D21CQCN03-B", email: "quanvm.b21cn089@unicredit.edu.vn", registeredDate: "2024-09-02 08:31" },
  { studentCode: "B21DCCN120", fullName: "Phạm Thu Hương", administrativeClass: "D21CQCN01-B", email: "huongpt.b21cn120@unicredit.edu.vn", registeredDate: "2024-09-02 09:05" },
  { studentCode: "B21DCCN144", fullName: "Đặng Quang Huy", administrativeClass: "D21CQCN02-B", email: "huydq.b21cn144@unicredit.edu.vn", registeredDate: "2024-09-02 09:18" },
  { studentCode: "B21DCCN203", fullName: "Ngô Quốc Khánh", administrativeClass: "D21CQCN04-B", email: "khanhnq.b21cn203@unicredit.edu.vn", registeredDate: "2024-09-02 10:02" },
];

