import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life 2.0 - AI-Powered Personal Knowledge Management",
  description:
    "The AI-powered second brain that automatically organizes your knowledge, projects, and learning across every area of your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          />
        </head>
        <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-gray-300`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
