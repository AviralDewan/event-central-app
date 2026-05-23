"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/events");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#003c34] border-t-transparent" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5f7f4]">
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Panel</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/admin/events" })}
          className="bg-black hover:bg-gray-800 transition text-white font-medium px-6 py-3 rounded-xl w-full flex items-center justify-center gap-2"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}