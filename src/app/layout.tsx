import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <title>ARK 基金追踪器</title>
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}