import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Navbar from "./components/Navbar";

import { Providers } from "@/app/Providers";

export const metadata: Metadata = {
  title: "Admin Panel | Kaziranga's Super Showdown",
  description:
    "Admin panel for core team members to manage Kaziranga’s Super Showdown events, registrations, and operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="pt-5">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
