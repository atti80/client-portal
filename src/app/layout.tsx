import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClientFlow",
  description: "Manage your clients, projects and invoices in one place",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
