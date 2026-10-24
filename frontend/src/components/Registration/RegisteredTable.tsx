"use client";

import React, { useState } from "react";
import { CourseClassData } from "@/lib/mock-data";
import { DAY_NAMES, formatVND } from "@/lib/utils";
import { Trash2, Printer, CalendarCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

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
  const [confirmDropClassCode, setConfirmDropClassCode] = useState<string | null>(null);
  const [droppedSuccessMsg, setDroppedSuccessMsg] = useState<string | null>(null);

  const totalCredits = registeredClasses.reduce((sum, c) => sum + c.credits, 0);
  const totalTuition = registeredClasses.reduce(
    (sum, c) => sum + c.credits * (c.tuitionPerCredit || 655000),
    0
  );

  const handleConfirmDrop = async () => {
    if (confirmDropClassCode) {
      const codeToDrop = confirmDropClassCode;
      const targetCourse = registeredClasses.find((c) => c.classCode === codeToDrop);
      setConfirmDropClassCode(null);
      await onDropClass(codeToDrop);
      setDroppedSuccessMsg(
        `Đã hủy đăng ký môn "${targetCourse?.courseName || codeToDrop}" [${codeToDrop}] và loại bỏ khỏi danh sách.`
      );
      setTimeout(() => {
        setDroppedSuccessMsg(null);
      }, 4500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 mb-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Danh sách môn học đã đăng ký trong học kỳ</span>
          </h2>
          <p className="text-xs text-slate-500">
            Học phần đã lưu thành công vào cơ sở dữ liệu và giữ chỗ trên hệ thống.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md border border-slate-300 font-medium transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In phiếu đăng ký</span>
        </button>
      </div>

      {/* Drop Success Notification */}
      {droppedSuccessMsg && (
        <div className="mb-3 p-3 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{droppedSuccessMsg}</span>
          </div>
          <button
            onClick={() => setDroppedSuccessMsg(null)}
            className="text-[11px] text-emerald-700 hover:underline font-medium ml-2"
          >
            Đóng
          </button>
        </div>
      )}

      {registeredClasses.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          <p className="text-xs font-medium">Bạn chưa đăng ký môn học nào trong học kỳ này.</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Vui lòng chọn học phần từ danh sách mở đăng ký để bắt đầu đăng ký.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold w-10 text-center">STT</th>
                <th className="py-2.5 px-3 font-semibold">Mã LHP</th>
                <th className="py-2.5 px-3 font-semibold">Tên môn học</th>
                <th className="py-2.5 px-2 font-semibold text-center">Số TC</th>
                <th className="py-2.5 px-3 font-semibold">Thời gian học</th>
                <th className="py-2.5 px-3 font-semibold">Phòng</th>
                <th className="py-2.5 px-3 font-semibold">Giảng viên</th>
                <th className="py-2.5 px-3 font-semibold text-right">Học phí tạm tính</th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registeredClasses.map((item, idx) => {
                const tuition = item.credits * (item.tuitionPerCredit || 655000);
                const isCurrentDropping = isDropping === item.classCode;

                return (
                  <tr key={item.classCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                      {item.classCode}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {item.courseName}
                      <span className="text-[10px] text-slate-500 block">({item.courseCode})</span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                      {item.credits}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {DAY_NAMES[item.dayOfWeek]} (Tiết {item.startPeriod} -{" "}
                      {item.startPeriod + item.periodCount - 1})
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{item.room}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.lecturer}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                      {formatVND(tuition)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setConfirmDropClassCode(item.classCode)}
                        disabled={isCurrentDropping}
                        className="inline-flex items-center space-x-1 text-[11px] text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded transition disabled:opacity-50 cursor-pointer"
                        title="Hủy đăng ký môn học này"
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
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-slate-900">
                <td colSpan={3} className="py-2.5 px-3 text-right">
                  Tổng cộng:
                </td>
                <td className="py-2.5 px-2 text-center text-red-700 text-sm font-bold">
                  {totalCredits} TC
                </td>
                <td colSpan={3} className="py-2.5 px-3 text-slate-500 font-normal">
                  ({registeredClasses.length} lớp học phần)
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2 bg-rose-100 rounded-md">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Xác nhận hủy môn học</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy đăng ký lớp học phần{" "}
              <strong className="text-slate-900">[{confirmDropClassCode}]</strong> không? Sau khi
              hủy, môn học sẽ được loại bỏ khỏi danh sách đăng ký và giải phóng chỗ trống.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmDropClassCode(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-300 transition cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                onClick={handleConfirmDrop}
                className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition shadow-xs cursor-pointer"
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
