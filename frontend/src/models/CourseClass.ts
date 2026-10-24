import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseClass extends Document {
  classCode: string;          // e.g. INT1306-01
  courseCode: string;         // e.g. INT1306
  courseName: string;         // e.g. Cấu trúc dữ liệu và giải thuật
  credits: number;
  periodId: string;           // e.g. 2024-2025-HK1
  dayOfWeek: number;          // 2 to 8 (2 = Thứ Hai, 8 = Chủ Nhật)
  startPeriod: number;        // 1 to 12
  periodCount: number;        // 2, 3, 4
  room: string;               // e.g. 302-A2
  lecturer: string;           // e.g. PGS.TS Trần Văn Nam
  maxSlots: number;           // e.g. 60
  currentSlots: number;       // e.g. 42
  registeredStudents: string[]; // List of studentCodes
  tuitionPerCredit: number;   // e.g. 450000
  createdAt: Date;
  updatedAt: Date;
}

const CourseClassSchema = new Schema<ICourseClass>(
  {
    classCode: { type: String, required: true, unique: true, index: true },
    courseCode: { type: String, required: true, index: true },
    courseName: { type: String, required: true },
    credits: { type: Number, required: true },
    periodId: { type: String, required: true, index: true },
    dayOfWeek: { type: Number, required: true, min: 2, max: 8 },
    startPeriod: { type: Number, required: true, min: 1, max: 12 },
    periodCount: { type: Number, required: true, min: 1, max: 6 },
    room: { type: String, required: true },
    lecturer: { type: String, required: true },
    maxSlots: { type: Number, required: true, default: 60 },
    currentSlots: { type: Number, required: true, default: 0 },
    registeredStudents: [{ type: String }],
    tuitionPerCredit: { type: Number, default: 450000 },
  },
  { timestamps: true, collection: "CourseClasses" }
);

export const CourseClass: Model<ICourseClass> =
  mongoose.models.CourseClass || mongoose.model<ICourseClass>("CourseClass", CourseClassSchema);

export default CourseClass;
