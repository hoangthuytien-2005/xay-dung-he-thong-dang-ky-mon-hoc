import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILecturer extends Document {
  lecturerCode: string;
  fullName: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  teachingClassCodes: string[];
}

const LecturerSchema = new Schema<ILecturer>(
  {
    lecturerCode: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    teachingClassCodes: [{ type: String }],
  },
  {
    timestamps: true,
    collection: "Lecturers",
  }
);

const Lecturer: Model<ILecturer> =
  mongoose.models.Lecturer || mongoose.model<ILecturer>("Lecturer", LecturerSchema);

export default Lecturer;
