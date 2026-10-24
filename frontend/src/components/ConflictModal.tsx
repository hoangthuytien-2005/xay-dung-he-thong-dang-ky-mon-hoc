"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Clock, BookX, Users, X } from "lucide-react";

export interface ModalErrorData {
  title: string;
  message: string;
  errorType?:
    | "TIME_CONFLICT"
    | "PREREQUISITE_FAILED"
    | "MAX_CREDITS_EXCEEDED"
    | "SLOT_FULL"
    | "STUDENT_INACTIVE"
    | "GENERAL";
}

interface ConflictModalProps {
  errorData: ModalErrorData | null;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  errorData,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && errorData) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [errorData, onClose]);

  if (!errorData) return null;

  const getIcon = () => {
    switch (errorData.errorType) {
      case "TIME_CONFLICT":
        return <Clock className="w-5 h-5 text-[#DC2626]" />;
      case "PREREQUISITE_FAILED":
        return <BookX className="w-5 h-5 text-[#D97706]" />;
      case "SLOT_FULL":
        return <Users className="w-5 h-5 text-[#DC2626]" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-[#DC2626]" />;
    }
  };

  const getHeaderStyle = () => {
    switch (errorData.errorType) {
      case "PREREQUISITE_FAILED":
        return "bg-amber-50 text-[#1F2937] border-amber-200";
      default:
        return "bg-[#FFF5F5] text-[#1F2937] border-[#E5E7EB]";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-in fade-in duration-150"
    >
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] shadow-lg max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${getHeaderStyle()}`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#FFFFFF] rounded-md border border-[#E5E7EB]">
              {getIcon()}
            </div>
            <h3
              id="conflict-modal-title"
              className="font-bold text-sm text-[#1F2937]"
            >
              {errorData.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng thông báo"
            className="text-[#6B7280] hover:text-[#1F2937] p-1 rounded-md hover:bg-black/5 transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5">
          <p className="text-xs text-[#1F2937] leading-relaxed">
            {errorData.message}
          </p>

          <div className="bg-[#F8F9FB] p-3.5 rounded-md border border-[#E5E7EB] text-xs text-[#4B5563]">
            <strong className="text-[#1F2937] font-semibold block mb-1">
              Hướng dẫn xử lý:
            </strong>
            <ul className="list-disc pl-4 space-y-1 text-[#4B5563]">
              {errorData.errorType === "TIME_CONFLICT" && (
                <>
                  <li>
                    Kiểm tra lại thời khóa biểu tuần và chọn lớp học phần khác
                    có khung giờ không trùng lặp.
                  </li>
                  <li>
                    Nếu bắt buộc học lớp này, vui lòng rút học phần đang bị
                    trùng lịch trước.
                  </li>
                </>
              )}
              {errorData.errorType === "PREREQUISITE_FAILED" && (
                <li>
                  Sinh viên cần hoàn thành và đạt điểm qua môn đối với học phần
                  tiên quyết trước khi đăng ký học phần này.
                </li>
              )}
              {errorData.errorType === "SLOT_FULL" && (
                <li>
                  Vui lòng chọn lớp học phần khác của cùng môn học hoặc theo dõi
                  khi có sinh viên điều chỉnh đăng ký.
                </li>
              )}
              {errorData.errorType === "MAX_CREDITS_EXCEEDED" && (
                <li>
                  Vui lòng rút bớt học phần tự chọn để tổng số tín chỉ nằm trong
                  định mức cho phép của học kỳ.
                </li>
              )}
              {(!errorData.errorType ||
                errorData.errorType === "GENERAL" ||
                errorData.errorType === "STUDENT_INACTIVE") && (
                <li>
                  Vui lòng kiểm tra lại trạng thái học vụ hoặc liên hệ Phòng Đào
                  tạo để được hỗ trợ.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#F8F9FB] border-t border-[#E5E7EB] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-[#7F1D2D] hover:bg-[#651525] text-white rounded-md transition-colors duration-150 cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
