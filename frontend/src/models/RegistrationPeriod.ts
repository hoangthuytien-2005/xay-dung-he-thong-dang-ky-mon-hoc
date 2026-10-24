import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistrationPeriod extends Document {
  periodId: string;       // e.g. 2024-2025-HK1
  name: string;           // e.g. Đợt 1 - Học kỳ 1 Năm học 2024-2025
  academicYear: string;   // e.g. 2024-2025
  semester: number;       // 1, 2, 3
  startDate: Date;
  endDate: Date;
  minCredits: number;     // 10
  maxCredits: number;     // 24
  targetBatches: string[]; // e.g. ["K21", "K22", "K23"]
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationPeriodSchema = new Schema<IRegistrationPeriod>(
  {
    periodId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    semester: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredits: { type: Number, required: true, default: 10 },
    maxCredits: { type: Number, required: true, default: 24 },
    targetBatches: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "RegistrationPeriods" }
);

export const RegistrationPeriod: Model<IRegistrationPeriod> =
  mongoose.models.RegistrationPeriod ||
  mongoose.model<IRegistrationPeriod>("RegistrationPeriod", RegistrationPeriodSchema);

export default RegistrationPeriod;
