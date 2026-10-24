"use client";

import React, { useState, useEffect } from "react";
import { X, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = React.useCallback(() => {
    setErrorMsg("");
    setIsSuccess(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!oldPassword.trim()) {
      setErrorMsg("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (!newPassword.trim() || newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp với mật khẩu mới.");
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-in fade-in duration-150"
    >
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] shadow-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#7F1D2D] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-[#651525] border border-white/15 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 id="change-password-title" className="font-bold text-sm">
                Đổi mật khẩu truy cập
              </h3>
              <p className="text-[11px] text-white/80">
                Cập nhật mật khẩu bảo vệ tài khoản học vụ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng hộp thoại"
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-[#651525] transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#DC2626] rounded-md flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#15803D] rounded-md flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Đổi mật khẩu thành công!</span>
            </div>
          )}

          <div>
            <label className="block text-[#1F2937] font-medium mb-1.5">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại..."
              required
              className="w-full h-9 px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 placeholder:text-[#6B7280] text-xs"
            />
          </div>

          <div>
            <label className="block text-[#1F2937] font-medium mb-1.5">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              required
              className="w-full h-9 px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 placeholder:text-[#6B7280] text-xs"
            />
          </div>

          <div>
            <label className="block text-[#1F2937] font-medium mb-1.5">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              required
              className="w-full h-9 px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 placeholder:text-[#6B7280] text-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-md text-[#4B5563] bg-[#FFFFFF] hover:bg-[#F8F9FB] border border-[#E5E7EB] font-medium transition-colors duration-150 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#7F1D2D] hover:bg-[#651525] text-white font-medium rounded-md transition-colors duration-150 cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
