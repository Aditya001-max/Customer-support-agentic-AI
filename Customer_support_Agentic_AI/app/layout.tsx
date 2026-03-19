import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "AI Support Agent — Intelligent Customer Support",
  description:
    "Get instant AI-powered answers to your support questions. Our intelligent agent handles billing, technical, and general inquiries 24/7.",
  keywords: ["AI support", "customer service", "chatbot", "help desk"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a1a] antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
