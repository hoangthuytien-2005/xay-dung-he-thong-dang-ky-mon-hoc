import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniCredit Portal - Cổng Đăng Ký Tín Chỉ & Quản Lý Học Vụ",
  description: "Hệ thống đăng ký tín chỉ trực tuyến, tra cứu thời khóa biểu và kết quả học tập cho sinh viên đại học.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
