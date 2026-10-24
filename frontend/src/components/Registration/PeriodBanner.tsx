"use client";

import React from "react";
import { RegistrationPeriodData } from "@/lib/mock-data";
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodBannerProps {
  period: RegistrationPeriodData | null;
  currentCredits: number;
  registeredCount?: number;
}

export const PeriodBanner: React.FC<PeriodBannerProps> = ({
  period,
  currentCredits,
  registeredCount,
}) => {
  if (!period) return null;

  const minCredits = period.minCredits || 10;
  const maxCredits = period.maxCredits || 24;

  let creditStatusMessage = "";
  let creditStatusStyle =
    "text-[#4B5563] bg-[#F8F9FB] border-[#E5E7EB]";

  if (currentCredits === 0) {
    creditStatusMessage = `Chưa đăng ký học phần (Tối thiểu ${minCredits} TC)`;
    creditStatusStyle =
      "text-[#D97706] bg-amber-50/80 border-amber-200";
  } else if (currentCredits < minCredits) {
    creditStatusMessage = `Cần thêm tối thiểu ${
      minCredits - currentCredits
    } TC (Định mức ${minCredits}–${maxCredits} TC)`;
    creditStatusStyle =
      "text-[#D97706] bg-amber-50/80 border-amber-200";
  } else if (currentCredits <= maxCredits) {
    creditStatusMessage = `Đạt định mức học kỳ (${currentCredits}/${maxCredits} TC)`;
    creditStatusStyle =
      "text-[#15803D] bg-emerald-50/80 border-emerald-200";
  } else {
    creditStatusMessage = `Vượt quá giới hạn (${currentCredits}/${maxCredits} TC)`;
    creditStatusStyle =
      "text-[#DC2626] bg-red-50/80 border-red-200";
  }

  const creditPercentage = Math.min(
    100,
    Math.round((currentCredits / maxCredits) * 100)
  );

  return (
    <section className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 mb-6">
      {/* Top Row: Period Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-bold text-[#1F2937] text-base sm:text-lg">
              {period.name}
            </h1>
            <span
              className={cn(
                "text-xs px-2.5 py-0.5 rounded-md font-medium border",
                period.isActive
                  ? "bg-emerald-50 text-[#15803D] border-emerald-200"
                  : "bg-red-50 text-[#DC2626] border-red-200"
              )}
            >
              {period.isActive ? "Cổng đăng ký đang mở" : "Cổng đăng ký đã đóng"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#6B7280] mt-1.5">
            <span className="inline-flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Thời gian mở cổng: Học kỳ {period.semester} • Năm học {period.academicYear}</span>
            </span>
            <span>•</span>
            <span>
              Khóa áp dụng:{" "}
              <strong className="text-[#1F2937] font-semibold">
                {period.targetBatches.join(", ")}
              </strong>
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={cn(
            "text-xs px-3 py-1.5 rounded-md border inline-flex items-center space-x-1.5 font-medium self-start md:self-auto shrink-0",
            creditStatusStyle
          )}
        >
          {currentCredits < minCredits ? (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          ) : currentCredits <= maxCredits ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{creditStatusMessage}</span>
        </div>
      </div>

      {/* Bottom Row: Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-4 py-3">
          <span className="text-xs text-[#6B7280] block">
            Tín chỉ đã đăng ký
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-lg font-bold text-[#7F1D2D]">
              {currentCredits}
            </span>
            <span className="text-xs text-[#6B7280]">
              / {maxCredits} tín chỉ tối đa
            </span>
          </div>
        </div>

        <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-4 py-3">
          <span className="text-xs text-[#6B7280] block">
            Định mức quy định học kỳ
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-lg font-bold text-[#1F2937]">
              {minCredits} – {maxCredits} TC
            </span>
            {registeredCount !== undefined && (
              <span className="text-xs text-[#6B7280]">
                ({registeredCount} học phần đã chọn)
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-4 py-3 flex flex-col justify-center">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#4B5563] font-medium">
              Mức tích lũy kỳ hiện tại
            </span>
            <span className="font-semibold text-[#1F2937]">
              {creditPercentage}%
            </span>
          </div>
          <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-200",
                currentCredits < minCredits
                  ? "bg-[#D97706]"
                  : currentCredits <= maxCredits
                  ? "bg-[#15803D]"
                  : "bg-[#DC2626]"
              )}
              style={{ width: `${creditPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
