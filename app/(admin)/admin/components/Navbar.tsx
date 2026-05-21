"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`fixed h-screen w-full md:w-[300px] lg:w-[350px] ${
        menuOpen ? "pointer-events-auto" : "pointer-events-none"
      } z-40`}
    >
      <button
        className="z-10 w-fit fixed"
        onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
      >
        <span
          className={`top-0 left-0 material-symbols-outlined absolute cursor-pointer transition-opacity duration-500 ${
            menuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ opacity: menuOpen ? 1 : 0 }}
        >
          close
        </span>
        <span
          className={`top-0 left-0 material-symbols-outlined absolute cursor-pointer transition-opacity duration-500 ${
            menuOpen ? "pointer-events-none" : "pointer-events-auto"
          }`}
          style={{ opacity: menuOpen ? 0 : 1 }}
        >
          menu
        </span>
      </button>

      <div
        className={`p-2 md:p-4 h-full w-full flex flex-col transition-transform duration-500 shadow-[10px_0_24px_-8px_rgba(0,0,0,0.14)] bg-white ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Image
          src="/images/kaziranga-logo.png"
          width={50}
          height={50}
          alt="Kaziranga Logo"
          className="mt-7 md:mt-5 md:w-[70px]"
        />
        <p className="mt-2 text-xl">Admin Panel</p>
        <ul className="mt-5 md:mt-7 list-style-none">
          <li className="mt-2 text-lg">
            <Link onClick={() => setMenuOpen(false)} href="/admin">
              Home
            </Link>
          </li>
          <li className="mt-4 text-lg">
            <Link onClick={() => setMenuOpen(false)} href="/admin/events">
              Events
            </Link>
          </li>
        </ul>

        <div className="mt-auto">
          <Link
            onClick={() => setMenuOpen(false)}
            href="/"
            className="flex items-center gap-x-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_outward</span>
            Go to Student Site
          </Link>
          <div
            onClick={() =>
              alert(
                "Admin Panel for Kaziranga's Super Showdown.\nFor authorised members only.\nFor queries, contact kaziranga-webad@study.iitm.ac.in"
              )
            }
            className="flex items-center gap-x-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">info</span>
            <p className="mt-2">Info</p>
          </div>
          <p className="mt-3 border-t border-t-slate-300 pt-2">
            &copy; 2026, Kaziranga - IIT Madras
          </p>
        </div>
      </div>
    </div>
  );
}
