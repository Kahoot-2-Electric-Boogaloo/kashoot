"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {AuthContextProvider} from "@/context/AuthContext";
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Kashoot",
//   description: "Kahoot 2: Electric Boogaloo",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>

      <body className={inter.className}>
      <AuthContextProvider>
          <Navbar />
              {children}
      </AuthContextProvider>
      </body>
    </html>
  );
}
