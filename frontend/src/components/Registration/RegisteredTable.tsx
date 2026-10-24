"use client";

import React, { useState, useEffect } from "react";
import { CourseClassData } from "@/lib/mock-data";
import { DAY_NAMES, formatVND } from "@/lib/utils";
import {
  Trash2,
  Printer,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface RegisteredTableProps {
  registeredClasses: CourseClassData[];
  onDropClass: (classCode: string) => Promise<void>;
  isDropping: string | null;
}

export const RegisteredTable: React.FC<RegisteredTableProps> = ({
  registeredClasses,
  onDropClass,
  isDropping,
}) => {
  const [confirmDropClassCode, setConfirmDropClassCode] = useState<
    string | null
  >(null);
  const [droppedSuccessMsg, setDroppedSuccessMsg] = useState<string | null>(
    null
  );

  const totalCredits = registeredClasses.reduce((sum, c) => sum + c.credits, 0);
  const totalTuition = registeredClasses.reduce(
    (sum, c) => sum + c.credits * (c.tuitionPerCredit || 655000),
    0
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && confirmDropClassCode) {
        setConfirmDropClassCode(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmDropClassCode]);

  const handleConfirmDrop = async () => {
    if (confirmDropClassCode) {
      const codeToDrop = confirmDropClassCode;
      const targetCourse = registeredClasses.find(
        (c) => c.classCode === codeToDrop
      );
      setConfirmDropClassCode(null);
      await onDropClass(codeToDrop);
      setDroppedSuccessMsg(
        `Đã hủy đăng ký học phần "${
          targetCourse?.courseName || codeToDrop
        }" [${codeToDrop}].`
      );
      setTimeout(() => {
        setDroppedSuccessMsg(null);
      }, 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#1F2937]">
            Học phần đã đăng ký trong học kỳ
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Danh sách các lớp học phần đã được ghi nhận vào hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 text-xs bg-[#FFFFFF] hover:bg-[#F8F9FB] text-[#1F2937] px-3 py-1.5 rounded-md border border-[#E5E7EB] font-medium transition-colors duration-150 cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5 text-[#4B5563]" />
          <span>In phiếu đăng ký</span>
        </button>
      </div>

      {/* Drop Success Notification */}
      {droppedSuccessMsg && (
        <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-[#15803D] text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            <span className="font-medium">{droppedSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setDroppedSuccessMsg(null)}
            className="text-xs text-[#15803D] hover:underline font-medium ml-2 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {registeredClasses.length === 0 ? (
        <div className="text-center py-8 text-[#6B7280] bg-[#F8F9FB] rounded-lg border border-dashed border-[#E5E7EB]">
          <p className="text-xs font-medium text-[#4B5563]">
            Chưa có học phần nào được đăng ký trong học kỳ này.
          </p>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Vui lòng chọn lớp học phần từ danh sách mở đăng ký để lưu vào thời khóa biểu.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] text-[#4B5563] border-b border-[#E5E7EB]">
                <th className="py-2.5 px-3 font-semibold w-10 text-center">
                  STT
                </th>
                <th className="py-2.5 px-3 font-semibold">Mã LHP</th>
                <th className="py-2.5 px-3 font-semibold">Tên học phần</th>
                <th className="py-2.5 px-2 font-semibold text-center">Số TC</th>
                <th className="py-2.5 px-3 font-semibold">Lịch học</th>
                <th className="py-2.5 px-3 font-semibold">Phòng</th>
                <th className="py-2.5 px-3 font-semibold">Giảng viên</th>
                <th className="py-2.5 px-3 font-semibold text-right">
                  Học phí tạm tính
                </th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {registeredClasses.map((item, idx) => {
                const tuition =
                  item.credits * (item.tuitionPerCredit || 655000);
                const isCurrentDropping = isDropping === item.classCode;

                return (
                  <tr
                    key={item.classCode}
                    className="hover:bg-[#F8F9FB] transition-colors duration-150"
                  >
                    <td className="py-3 px-3 text-center text-[#6B7280]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#1F2937]">
                      {item.classCode}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1F2937]">
                      {item.courseName}
                      <span className="text-[11px] text-[#6B7280] block">
                        Mã môn: {item.courseCode}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-[#1F2937]">
                      {item.credits}
                    </td>
                    <td className="py-3 px-3 text-[#4B5563]">
                      {DAY_NAMES[item.dayOfWeek]} (Tiết {item.startPeriod} –{" "}
                      {item.startPeriod + item.periodCount - 1})
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1F2937]">
                      {item.room}
                    </td>
                    <td className="py-3 px-3 text-[#4B5563]">
                      {item.lecturer}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-[#1F2937]">
                      {formatVND(tuition)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setConfirmDropClassCode(item.classCode)}
                        disabled={isCurrentDropping}
                        className="inline-flex items-center space-x-1 text-[11px] text-[#DC2626] bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-md font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                        title="Hủy đăng ký học phần này"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isCurrentDropping ? "Đang hủy..." : "Hủy"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#F8F9FB] border-t border-[#E5E7EB] font-semibold text-[#1F2937]">
                <td colSpan={3} className="py-3 px-3 text-right">
                  Tổng cộng:
                </td>
                <td className="py-3 px-2 text-center text-[#7F1D2D] text-sm font-bold">
                  {totalCredits} TC
                </td>
                <td
                  colSpan={3}
                  className="py-3 px-3 text-[#6B7280] font-normal"
                >
                  ({registeredClasses.length} lớp học phần)
                </td>
                <td className="py-3 px-3 text-right text-[#15803D] font-bold">
                  {formatVND(totalTuition)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDropClassCode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drop-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-in fade-in duration-150"
        >
          <div className="bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] shadow-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
              </div>
              <h3
                id="drop-confirm-title"
                className="font-bold text-sm text-[#1F2937]"
              >
                Xác nhận hủy lớp học phần
              </h3>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Bạn có chắc chắn muốn hủy đăng ký lớp học phần{" "}
              <strong className="text-[#1F2937]">
                [{confirmDropClassCode}]
              </strong>{" "}
              không? Sau khi xác nhận, học phần sẽ được rút khỏi danh sách đăng ký.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setConfirmDropClassCode(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-[#4B5563] bg-[#FFFFFF] hover:bg-[#F8F9FB] rounded-md border border-[#E5E7EB] transition-colors duration-150 cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                type="button"
                onClick={handleConfirmDrop}
                className="px-3.5 py-1.5 text-xs font-medium bg-[#DC2626] hover:bg-red-700 text-white rounded-md transition-colors duration-150 cursor-pointer"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
