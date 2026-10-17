import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  code: string;
  name: string;
  credits: number;
  theoryCredits: number;
  practiceCredits: number;
  department: string;
  semesterProposal: number; // Đề xuất kỳ 1..8
  prerequisites: string[]; // Môn tiên quyết (bắt buộc phải qua >= 1.0)
  previousCourses: string[]; // Môn học trước (chỉ cần từng học qua)
  corequisites: string[]; // Môn song hành
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    theoryCredits: { type: Number, default: 2 },
    practiceCredits: { type: Number, default: 1 },
    department: { type: String, required: true },
    semesterProposal: { type: Number, required: true, default: 1 },
    prerequisites: [{ type: String }],
    previousCourses: [{ type: String }],
    corequisites: [{ type: String }],
    description: { type: String },
  },
  { timestamps: true }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
