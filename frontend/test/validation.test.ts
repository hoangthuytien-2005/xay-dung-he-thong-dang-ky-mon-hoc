import assert from "node:assert";
import {
  checkScheduleOverlap,
  checkTimeConflict,
  checkPrerequisites,
  checkCreditLimit,
  checkSlotAvailability,
  checkDuplicateCourse,
} from "../src/lib/validation";

console.log("🚀 Bắt đầu kiểm thử thuật toán Ràng buộc Đăng ký Tín chỉ (Validation Engine)...");

// 1. Test checkScheduleOverlap
// Case A: Trùng lịch (Thứ 2, tiết 1-3 và Thứ 2, tiết 2-4)
const class1 = { dayOfWeek: 2, startPeriod: 1, periodCount: 3 }; // Tiết 1, 2, 3
const class2 = { dayOfWeek: 2, startPeriod: 3, periodCount: 3 }; // Tiết 3, 4, 5
assert.strictEqual(
  checkScheduleOverlap(class1, class2),
  true,
  "Phải phát hiện trùng lịch ở tiết 3"
);

// Case B: Liền kề nhưng không trùng (Thứ 2, tiết 1-3 và Thứ 2, tiết 4-6)
const class3 = { dayOfWeek: 2, startPeriod: 4, periodCount: 3 }; // Tiết 4, 5, 6
assert.strictEqual(
  checkScheduleOverlap(class1, class3),
  false,
  "Tiết 1-3 và Tiết 4-6 không được báo trùng lịch"
);

// Case C: Cùng tiết nhưng khác thứ (Thứ 2, tiết 1-3 và Thứ 3, tiết 1-3)
const class4 = { dayOfWeek: 3, startPeriod: 1, periodCount: 3 };
assert.strictEqual(
  checkScheduleOverlap(class1, class4),
  false,
  "Khác thứ trong tuần không được báo trùng lịch"
);
console.log("✓ Test 1: Thuật toán phát hiện trùng thời khóa biểu [PASSED]");

// 2. Test checkPrerequisites
const sampleCourse = {
  code: "INT14115",
  name: "Học máy chuyên sâu",
  credits: 3,
  theoryCredits: 2,
  practiceCredits: 1,
  department: "Khoa CNTT 1",
  semesterProposal: 7,
  prerequisites: ["INT1416"], // Yêu cầu qua Trí tuệ nhân tạo
  previousCourses: [],
  corequisites: [],
};

// Case A: Sinh viên chưa qua môn tiên quyết (điểm F)
const completedHistoryFail = [
  { courseCode: "INT1416", courseName: "Trí tuệ nhân tạo", credits: 3, grade: "F", gradePoint: 0, isPassed: false, semester: "2023-HK1" },
];
const prereqFail = checkPrerequisites(sampleCourse, completedHistoryFail);
assert.strictEqual(prereqFail.isValid, false, "Phải chặn sinh viên chưa đạt môn tiên quyết");

// Case B: Sinh viên đã qua môn tiên quyết (điểm B)
const completedHistoryPass = [
  { courseCode: "INT1416", courseName: "Trí tuệ nhân tạo", credits: 3, grade: "B", gradePoint: 3.0, isPassed: true, semester: "2023-HK1" },
];
const prereqPass = checkPrerequisites(sampleCourse, completedHistoryPass);
assert.strictEqual(prereqPass.isValid, true, "Phải cho phép khi sinh viên đã qua môn tiên quyết");
console.log("✓ Test 2: Kiểm tra điều kiện tiên quyết học phần [PASSED]");

// 3. Test checkCreditLimit
const currentCredits = 22;
const addingCourseCredits = 3;
const maxCredits = 24;
const creditCheck = checkCreditLimit(currentCredits, addingCourseCredits, maxCredits);
assert.strictEqual(creditCheck.isValid, false, "Phải chặn khi 22 + 3 = 25 > 24 TC");

const validCreditCheck = checkCreditLimit(15, 3, 24);
assert.strictEqual(validCreditCheck.isValid, true, "Phải hợp lệ khi 15 + 3 = 18 <= 24 TC");
console.log("✓ Test 3: Kiểm tra giới hạn tín chỉ tối đa [PASSED]");

// 4. Test checkSlotAvailability
const fullClass = {
  classCode: "INT1434-02",
  courseCode: "INT1434",
  courseName: "Lập trình Web",
  credits: 3,
  periodId: "2024-2025-HK1",
  dayOfWeek: 4,
  startPeriod: 7,
  periodCount: 3,
  room: "204-A3",
  lecturer: "ThS. Quynh",
  maxSlots: 50,
  currentSlots: 50,
  registeredStudents: [],
  tuitionPerCredit: 450000,
};
assert.strictEqual(checkSlotAvailability(fullClass).isAvailable, false, "Phải chặn khi lớp đã đầy slot 50/50");
console.log("✓ Test 4: Kiểm tra sĩ số lớp học phần [PASSED]");

// 5. Test checkDuplicateCourse
const registeredList = [
  { ...fullClass, classCode: "INT1434-01" },
];
assert.strictEqual(
  checkDuplicateCourse("INT1434", registeredList).isDuplicate,
  true,
  "Phải chặn đăng ký 2 lớp của cùng một môn"
);
console.log("✓ Test 5: Chặn đăng ký trùng môn học [PASSED]");

console.log("\n🎉 TẤT CẢ 5 BỘ KIỂM THỬ RÀNG BUỘC HỌC VỤ ĐÃ VƯỢT QUA 100%!");
