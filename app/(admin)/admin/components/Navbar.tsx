"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/admin" },
    { name: "Events", href: "/admin/events" },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-[1001] flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
      >
        <span className="material-symbols-outlined text-2xl">
          {menuOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[1000] flex h-screen w-[85%] max-w-[340px] flex-col bg-white px-5 py-6 shadow-2xl transition-transform duration-300 ease-out md:w-[320px] ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + Title */}
        <div className="mt-10 md:mt-4">
          <Image
            src="/images/kaziranga-logo.png"
            width={70}
            height={70}
            alt="Kaziranga Logo"
            className="rounded-md"
          />

          <div className="mt-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin Panel
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Kaziranga Super Showdown
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-10">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-xl px-4 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-100 hover:text-black"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-200 pt-5">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-700 transition hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_outward
            </span>

            <span>Go to Student Site</span>
          </Link>

          <button
            onClick={() =>
              alert(
                "Admin Panel for Kaziranga's Super Showdown.\nFor authorised members only.\nFor queries, contact kaziranga-webad@study.iitm.ac.in"
              )
            }
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-slate-700 transition hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">info</span>

            <span>Info</span>
          </button>

          <p className="mt-5 text-sm text-slate-500">
            © 2026 Kaziranga — IIT Madras
          </p>
        </div>
      </aside>
    </>
  );
}
