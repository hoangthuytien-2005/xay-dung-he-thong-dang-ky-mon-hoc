"use client";

import React, { useState } from "react";
import { GraduationCap, User, Lock, KeyRound, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { UserRole } from "@/components/Navbar";
import { StudentData, LecturerData, INITIAL_STUDENT, INITIAL_LECTURERS } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface LoginPageProps {
  onLoginSuccess: (user: {
    role: UserRole;
    student?: StudentData;
    lecturer?: LecturerData;
  }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<UserRole>("student");
  const [username, setUsername] = useState<string>("B21DCCN001");
  const [password, setPassword] = useState<string>("123456");
  const [captchaInput, setCaptchaInput] = useState<string>("7842");
  const [captchaCode] = useState<string>("7842");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMsg("");
    if (newRole === "student") {
      setUsername("B21DCCN001");
    } else {
      setUsername("GV01");
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ mã định danh và mật khẩu.");
      return;
    }

    if (captchaInput !== captchaCode) {
      setErrorMsg("Mã xác thực bảo mật (Captcha) không chính xác.");
      return;
    }

    try {
      const res = await api.login(username, password, role);
      if (res.success && res.data) {
        onLoginSuccess({
          role: res.data.role,
          student: res.data.student,
          lecturer: res.data.lecturer,
        });
        return;
      } else if (res.message) {
        setErrorMsg(res.message);
        return;
      }
    } catch {
      // Fallback below
    }

    // Fallback if backend is not reachable
    if (role === "student") {
      onLoginSuccess({
        role: "student",
        student: INITIAL_STUDENT,
      });
    } else {
      const found = INITIAL_LECTURERS.find(
        (l) => l.lecturerCode.toLowerCase() === username.toLowerCase()
      ) || INITIAL_LECTURERS[0];
      onLoginSuccess({
        role: "lecturer",
        lecturer: found,
      });
    }
  };

  // Quick 1-click login presets
  const handleQuickLoginStudent = () => {
    setRole("student");
    setUsername("B21DCCN001");
    setPassword("123456");
    setCaptchaInput(captchaCode);
    onLoginSuccess({
      role: "student",
      student: INITIAL_STUDENT,
    });
  };

  const handleQuickLoginLecturer = (code: string) => {
    setRole("lecturer");
    const l = INITIAL_LECTURERS.find((x) => x.lecturerCode === code) || INITIAL_LECTURERS[0];
    setUsername(l.lecturerCode);
    setPassword("123456");
    setCaptchaInput(captchaCode);
    onLoginSuccess({
      role: "lecturer",
      lecturer: l,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Top Academic Brand Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-800 text-white rounded-md shadow-sm mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          UniCredit Portal
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Cổng Thông Tin Học Vụ & Đăng Ký Tín Chỉ Trực Tuyến
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        {/* Header Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => handleRoleChange("student")}
            className={cn(
              "py-3 text-xs font-bold flex items-center justify-center space-x-2 transition border-b-2",
              role === "student"
                ? "border-red-800 text-red-800 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            <User className="w-4 h-4" />
            <span>SINH VIÊN</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("lecturer")}
            className={cn(
              "py-3 text-xs font-bold flex items-center justify-center space-x-2 transition border-b-2",
              role === "lecturer"
                ? "border-red-800 text-red-800 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            <UserCheck className="w-4 h-4" />
            <span>GIẢNG VIÊN</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Username / Code input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {role === "student" ? "Mã số sinh viên" : "Mã số cán bộ / Giảng viên"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === "student" ? "Ví dụ: B21DCCN001" : "Ví dụ: GV01"}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 uppercase font-mono"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mật khẩu truy cập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800"
              />
            </div>
          </div>

          {/* Captcha security check */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã bảo mật (Captcha)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Nhập mã..."
                maxLength={4}
                required
                className="flex-1 py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-center font-mono font-bold tracking-widest"
              />
              <div className="bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-md text-slate-800 font-mono font-bold tracking-widest text-sm select-none line-through">
                {captchaCode}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-md shadow-xs transition flex items-center justify-center space-x-2 mt-2"
          >
            <span>ĐĂNG NHẬP VÀO HỆ THỐNG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs">
          <p className="font-semibold text-slate-700 mb-2 flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Tài khoản mẫu để Demo nhanh:</span>
          </p>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleQuickLoginStudent}
              className="w-full text-left p-2 rounded bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900">Sinh viên: B21DCCN001</span>
                <span className="text-slate-500 text-[11px] block">Nguyễn Hoàng Minh • K21 CNTT</span>
              </div>
              <span className="text-[11px] text-red-800 font-semibold">1-Click &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLoginLecturer("GV01")}
              className="w-full text-left p-2 rounded bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900">Giảng viên: GV01</span>
                <span className="text-slate-500 text-[11px] block">TS. Hoàng Xuân Dậu • Dạy Lập trình Web</span>
              </div>
              <span className="text-[11px] text-red-800 font-semibold">1-Click &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLoginLecturer("GV02")}
              className="w-full text-left p-2 rounded bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900">Giảng viên: GV02</span>
                <span className="text-slate-500 text-[11px] block">PGS.TS Vũ Hữu Tiến • Dạy Mạng máy tính</span>
              </div>
              <span className="text-[11px] text-red-800 font-semibold">1-Click &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-500 mt-6">
        UniCredit Portal • Cổng Thông Tin Học Vụ Chuẩn Đại Học
      </div>
    </div>
  );
};
