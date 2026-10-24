import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniCredit Portal - Hệ Thống Đăng Ký Tín Chỉ & Quản Lý Học Vụ",
  description:
    "Hệ thống đăng ký tín chỉ trực tuyến, tra cứu thời khóa biểu và kết quả học tập dành cho sinh viên đại học.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full font-sans">
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-[#7F1D2D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
