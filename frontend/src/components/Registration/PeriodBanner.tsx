"use client";

import React from "react";
import { RegistrationPeriodData } from "@/lib/mock-data";
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodBannerProps {
  period: RegistrationPeriodData | null;
  currentCredits: number;
}

export const PeriodBanner: React.FC<PeriodBannerProps> = ({
  period,
  currentCredits,
}) => {
  if (!period) return null;

  const minCredits = period.minCredits || 10;
  const maxCredits = period.maxCredits || 24;

  let creditStatusMessage = "";
  let creditStatusColor = "text-slate-600 bg-slate-100 border-slate-300";

  if (currentCredits === 0) {
    creditStatusMessage = `Chưa đăng ký môn nào (Tối thiểu: ${minCredits} TC)`;
    creditStatusColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (currentCredits < minCredits) {
    creditStatusMessage = `Cần đăng ký thêm ít nhất ${minCredits - currentCredits} TC để đạt mức tối thiểu (${minCredits} TC)`;
    creditStatusColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (currentCredits <= maxCredits) {
    creditStatusMessage = `Hợp lệ: Đã đạt ${currentCredits}/${maxCredits} TC`;
    creditStatusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else {
    creditStatusMessage = `Vượt quá giới hạn (${currentCredits}/${maxCredits} TC)`;
    creditStatusColor = "text-rose-700 bg-rose-50 border-rose-200";
  }

  const creditPercentage = Math.min(100, Math.round((currentCredits / maxCredits) * 100));

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 mb-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Period Details */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 text-base">
              {period.name}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded font-semibold",
                period.isActive
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-rose-100 text-rose-800 border border-rose-300"
              )}
            >
              {period.isActive ? "Hệ thống đang mở" : "Hệ thống đang đóng"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Thời hạn: Từ 08:00 01/09/2024 đến 23:59 30/10/2024
              </span>
            </div>
            <div>
              Đối tượng: <strong className="text-slate-800">{period.targetBatches.join(", ")}</strong>
            </div>
            <div>
              Quy định tín chỉ: <strong className="text-slate-800">{minCredits} - {maxCredits} TC</strong>
            </div>
          </div>
        </div>

        {/* Right: Credit Counter & Progress */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 min-w-[280px]">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-medium text-slate-700">Tiến độ số tín chỉ:</span>
            <span className="font-bold text-slate-900">
              {currentCredits} / {maxCredits} TC
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className={cn(
                "h-full transition-all duration-300",
                currentCredits < minCredits
                  ? "bg-amber-500"
                  : currentCredits <= maxCredits
                  ? "bg-emerald-600"
                  : "bg-rose-600"
              )}
              style={{ width: `${creditPercentage}%` }}
            />
          </div>

          <div className={cn("text-[11px] px-2 py-0.5 rounded border flex items-center space-x-1", creditStatusColor)}>
            {currentCredits < minCredits ? (
              <AlertTriangle className="w-3 h-3 shrink-0" />
            ) : currentCredits <= maxCredits ? (
              <CheckCircle2 className="w-3 h-3 shrink-0" />
            ) : (
              <ShieldAlert className="w-3 h-3 shrink-0" />
            )}
            <span>{creditStatusMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
