"use client";

import React from "react";
import { AlertTriangle, Clock, BookX, Users, X } from "lucide-react";

export interface ModalErrorData {
  title: string;
  message: string;
  errorType?: "TIME_CONFLICT" | "PREREQUISITE_FAILED" | "MAX_CREDITS_EXCEEDED" | "SLOT_FULL" | "GENERAL";
}

interface ConflictModalProps {
  errorData: ModalErrorData | null;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  errorData,
  onClose,
}) => {
  if (!errorData) return null;

  const getIcon = () => {
    switch (errorData.errorType) {
      case "TIME_CONFLICT":
        return <Clock className="w-6 h-6 text-rose-600" />;
      case "PREREQUISITE_FAILED":
        return <BookX className="w-6 h-6 text-amber-600" />;
      case "SLOT_FULL":
        return <Users className="w-6 h-6 text-rose-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-rose-600" />;
    }
  };

  const getHeaderBg = () => {
    switch (errorData.errorType) {
      case "PREREQUISITE_FAILED":
        return "bg-amber-100 text-amber-900";
      default:
        return "bg-rose-100 text-rose-900";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-md border border-slate-300 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className={`px-5 py-4 flex items-center justify-between border-b border-slate-200 ${getHeaderBg()}`}>
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-md shadow-xs">{getIcon()}</div>
            <h3 className="font-bold text-sm">{errorData.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-black/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed">
            {errorData.message}
          </p>

          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-[11px] text-slate-600">
            <strong className="text-slate-800">💡 Hướng dẫn xử lý:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-600">
              {errorData.errorType === "TIME_CONFLICT" && (
                <>
                  <li>Kiểm tra thời khóa biểu tuần và chọn lớp học phần ở khung giờ hoặc thứ khác.</li>
                  <li>Nếu bắt buộc học lớp này, vui lòng hủy lớp đang bị trùng trước.</li>
                </>
              )}
              {errorData.errorType === "PREREQUISITE_FAILED" && (
                <>
                  <li>Bạn cần đăng ký và thi đạt học phần tiên quyết ở các kỳ trước hoặc kỳ này trước khi học học phần chuyên sâu.</li>
                </>
              )}
              {errorData.errorType === "SLOT_FULL" && (
                <>
                  <li>Vui lòng chọn lớp học phần khác của cùng môn học hoặc theo dõi hệ thống khi có sinh viên khác hủy lớp.</li>
                </>
              )}
              {errorData.errorType === "MAX_CREDITS_EXCEEDED" && (
                <>
                  <li>Vui lòng cân nhắc hủy bớt các môn tự chọn để tổng số tín chỉ nằm trong hạn mức 10 - 24 TC theo quy chế đào tạo.</li>
                </>
              )}
              {!errorData.errorType && (
                <li>Vui lòng kiểm tra lại thông tin học vụ hoặc liên hệ Phòng Đào tạo để được hỗ trợ.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition shadow-xs"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
