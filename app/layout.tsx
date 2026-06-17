import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/zh-CN.json";

export const metadata: Metadata = {
  title: "Korean Studio - 学习韩语",
  description: "零基础学习韩语的互动平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#f9f8f6" }}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
