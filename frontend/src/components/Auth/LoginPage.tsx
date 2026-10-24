"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  User,
  Lock,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { UserRole } from "@/components/Navbar";
import {
  StudentData,
  LecturerData,
  AdminData,
  INITIAL_STUDENT,
  INITIAL_LECTURERS,
  INITIAL_ADMIN,
} from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface LoginPageProps {
  onLoginSuccess: (user: {
    role: UserRole;
    student?: StudentData;
    lecturer?: LecturerData;
    admin?: AdminData;
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
    } else if (newRole === "lecturer") {
      setUsername("GV01");
    } else {
      setUsername("ADMIN01");
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
          admin: res.data.admin,
        });
        return;
      } else if (res.message) {
        setErrorMsg(res.message);
        return;
      }
    } catch {
      // Fallback below
    }

    if (role === "student") {
      onLoginSuccess({
        role: "student",
        student: INITIAL_STUDENT,
      });
    } else if (role === "admin") {
      onLoginSuccess({
        role: "admin",
        admin: INITIAL_ADMIN,
      });
    } else {
      const found =
        INITIAL_LECTURERS.find(
          (l) => l.lecturerCode.toLowerCase() === username.toLowerCase()
        ) || INITIAL_LECTURERS[0];
      onLoginSuccess({
        role: "lecturer",
        lecturer: found,
      });
    }
  };

  const handleQuickLoginStudent = async () => {
    setRole("student");
    setUsername("B21DCCN001");
    setPassword("123456");
    setCaptchaInput(captchaCode);
    const res = await api.login("B21DCCN001", "123456", "student");
    if (res.success && res.data) {
      onLoginSuccess({
        role: "student",
        student: res.data.student,
      });
    }
  };

  const handleQuickLoginLecturer = async (code: string) => {
    setRole("lecturer");
    setUsername(code);
    setPassword("123456");
    setCaptchaInput(captchaCode);
    const res = await api.login(code, "123456", "lecturer");
    if (res.success && res.data) {
      onLoginSuccess({
        role: "lecturer",
        lecturer: res.data.lecturer,
      });
    }
  };

  const handleQuickLoginAdmin = async () => {
    setRole("admin");
    setUsername("ADMIN01");
    setPassword("123456");
    setCaptchaInput(captchaCode);
    const res = await api.login("ADMIN01", "123456", "admin");
    if (res.success && res.data) {
      onLoginSuccess({
        role: "admin",
        admin: res.data.admin || INITIAL_ADMIN,
      });
    } else {
      onLoginSuccess({
        role: "admin",
        admin: INITIAL_ADMIN,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center p-4">
      {/* Top Academic Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#7F1D2D] text-white rounded-lg mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]">
          UniCredit Portal
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Cổng Thông Tin Học Vụ & Đăng Ký Tín Chỉ Trực Tuyến
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <button
            type="button"
            onClick={() => handleRoleChange("student")}
            className={cn(
              "py-3 text-xs font-semibold flex items-center justify-center transition-colors duration-150 border-b-2 cursor-pointer",
              role === "student"
                ? "border-[#7F1D2D] text-[#7F1D2D] bg-[#FFFFFF]"
                : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
            )}
          >
            <span>Sinh viên</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("lecturer")}
            className={cn(
              "py-3 text-xs font-semibold flex items-center justify-center transition-colors duration-150 border-b-2 cursor-pointer",
              role === "lecturer"
                ? "border-[#7F1D2D] text-[#7F1D2D] bg-[#FFFFFF]"
                : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
            )}
          >
            <span>Giảng viên</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={cn(
              "py-3 text-xs font-semibold flex items-center justify-center transition-colors duration-150 border-b-2 cursor-pointer",
              role === "admin"
                ? "border-[#7F1D2D] text-[#7F1D2D] bg-[#FFFFFF]"
                : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
            )}
          >
            <span>Quản trị ĐT</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#DC2626] text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Username / Code input */}
          <div>
            <label className="block text-xs font-medium text-[#1F2937] mb-1.5">
              {role === "student"
                ? "Mã số sinh viên"
                : role === "lecturer"
                ? "Mã số giảng viên"
                : "Mã cán bộ quản trị đào tạo"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  role === "student"
                    ? "Ví dụ: B21DCCN001"
                    : role === "lecturer"
                    ? "Ví dụ: GV01"
                    : "Ví dụ: ADMIN01"
                }
                required
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 uppercase font-mono placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-medium text-[#1F2937] mb-1.5">
              Mật khẩu truy cập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          {/* Captcha security check */}
          <div>
            <label className="block text-xs font-medium text-[#1F2937] mb-1.5">
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
                className="flex-1 h-9 px-3 text-xs bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 text-center font-mono font-semibold tracking-widest"
              />
              <div className="h-9 flex items-center bg-[#F8F9FB] border border-[#E5E7EB] px-4 rounded-md text-[#1F2937] font-mono font-bold tracking-widest text-sm select-none">
                {captchaCode}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-10 px-4 bg-[#7F1D2D] hover:bg-[#651525] text-white font-semibold text-xs rounded-md transition-colors duration-150 flex items-center justify-center space-x-2 mt-2 cursor-pointer"
          >
            <span>Đăng nhập hệ thống</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="bg-[#F8F9FB] p-4 border-t border-[#E5E7EB] text-xs">
          <p className="font-semibold text-[#4B5563] mb-2.5 flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#7F1D2D]" />
            <span>Tài khoản dùng thử nhanh:</span>
          </p>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleQuickLoginStudent}
              className="w-full text-left p-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#FFF5F5] border border-[#E5E7EB] hover:border-[#7F1D2D]/40 transition-colors duration-150 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">
                  Sinh viên: B21DCCN001
                </span>
                <span className="text-[#6B7280] text-[11px] block">
                  Nguyễn Hoàng Minh • K21 Công nghệ Thông tin
                </span>
              </div>
              <span className="text-[11px] text-[#7F1D2D] font-medium">
                Chọn &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLoginLecturer("GV01")}
              className="w-full text-left p-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#FFF5F5] border border-[#E5E7EB] hover:border-[#7F1D2D]/40 transition-colors duration-150 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">
                  Giảng viên: GV01
                </span>
                <span className="text-[#6B7280] text-[11px] block">
                  TS. Hoàng Xuân Dậu • Điểm danh & Quản lý lịch dạy
                </span>
              </div>
              <span className="text-[11px] text-[#7F1D2D] font-medium">
                Chọn &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={handleQuickLoginAdmin}
              className="w-full text-left p-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#FFF5F5] border border-[#E5E7EB] hover:border-[#7F1D2D]/40 transition-colors duration-150 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">
                  Quản trị Đào tạo: ADMIN01
                </span>
                <span className="text-[#6B7280] text-[11px] block">
                  ThS. Nguyễn Văn Quản Trị • Mở/Đóng cổng & Hồ sơ SV
                </span>
              </div>
              <span className="text-[11px] text-[#7F1D2D] font-medium">
                Chọn &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-[#6B7280] mt-6">
        UniCredit Portal • Hệ thống Quản lý Đào tạo Tín chỉ Đại học
      </div>
    </div>
  );
};
