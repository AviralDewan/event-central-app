"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { events } from "../events/dummyData";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

<<<<<<< Updated upstream
=======
  const userEmail = session?.user?.email || "";
  
  // Determine if the user is an Event Head
  // Event Head: if email is assigned to an event or starts with a roll number prefix
  const isEventHead =
    events.some((e) => e.eventHeadEmail === userEmail) ||
    /^[0-9]+[a-z]+/i.test(userEmail) ||
    userEmail.startsWith("24f");

  const navLinks = [];
  if (session) {
    if (!isEventHead) {
      navLinks.push({ name: "Home", href: "/admin" });
    }
    navLinks.push({ name: "Events", href: "/admin/events" });
  } else {
    // If not authenticated, default to Sign In
    navLinks.push({ name: "Sign In", href: "/admin/sign-in" });
  }

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
        {/* Logo + Title */}
        <div className="mt-10 md:mt-4">
          <Image
            src="/images/kaziranga-logo.png"
            width={70}
            height={70}
            alt="Kaziranga Logo"
            className="rounded-md animate-pulse"
          />

          <div className="mt-4">
            <h1 className="text-2xl font-semibold tracking-tight text-[#003c34]">
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
                  className="flex items-center rounded-xl px-4 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#003c34]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-200 pt-5">
>>>>>>> Stashed changes
          <Link
            onClick={() => setMenuOpen(false)}
<<<<<<< Updated upstream
            href="/"
            className="flex items-center gap-x-1 cursor-pointer"
=======
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-[#003c34]"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            className="flex items-center gap-x-1 cursor-pointer"
=======
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-slate-700 transition hover:bg-slate-100 hover:text-[#003c34]"
>>>>>>> Stashed changes
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
