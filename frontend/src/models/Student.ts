import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompletedCourse {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;       // A, B+, B, C+, C, D+, D, F
  gradePoint: number;  // 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0
  isPassed: boolean;
  semester: string;
}

export interface IStudent extends Document {
  studentCode: string;
  fullName: string;
  email: string;
  major: string;
  administrativeClass: string;
  academicYear: number;
  cpa: number;
  accumulatedCredits: number;
  advisorName: string;
  completedCourses: ICompletedCourse[];
  registeredClasses: string[]; // List of classCodes registered in current period
  createdAt: Date;
  updatedAt: Date;
}

const CompletedCourseSchema = new Schema<ICompletedCourse>({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  credits: { type: Number, required: true },
  grade: { type: String, required: true },
  gradePoint: { type: Number, required: true },
  isPassed: { type: Boolean, required: true },
  semester: { type: String, required: true },
});

const StudentSchema = new Schema<IStudent>(
  {
    studentCode: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    major: { type: String, required: true },
    administrativeClass: { type: String, required: true },
    academicYear: { type: Number, required: true, default: 2021 },
    cpa: { type: Number, required: true, default: 0.0 },
    accumulatedCredits: { type: Number, required: true, default: 0 },
    advisorName: { type: String, default: "PGS.TS Nguyễn Mạnh Hùng" },
    completedCourses: [CompletedCourseSchema],
    registeredClasses: [{ type: String }],
  },
  { timestamps: true }
);

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
