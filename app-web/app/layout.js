import "./globals.css";

export const metadata = {
  title: "MyLife",
  description: "一个带真实登录和多用户隔离的个人空间网站。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
