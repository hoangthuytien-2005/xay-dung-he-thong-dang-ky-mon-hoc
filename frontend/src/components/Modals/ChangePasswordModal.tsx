"use client";

import React, { useState } from "react";
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

    // Success simulation
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setErrorMsg("");
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-red-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-red-950 flex items-center justify-center text-white">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Đổi Mật Khẩu Truy Cập</h3>
              <p className="text-[11px] text-red-200">
                Cập nhật mật khẩu bảo vệ tài khoản học vụ
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-red-200 hover:text-white p-1 rounded hover:bg-red-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Đổi mật khẩu thành công!</span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại..."
              required
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              required
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              required
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-xs"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-800 hover:bg-red-900 text-white font-medium rounded transition shadow-xs"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
