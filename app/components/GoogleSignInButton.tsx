"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleSignInButton() {
  const { data: session } = useSession();

  if (session) {
    console.log("hello, world");
    return (
      <div className="flex items-center gap-4">
        <img
          src={session.user?.image ?? ""}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p>{session.user?.name}</p>
          <p className="text-sm text-gray-500">{session.user?.email}</p>
        </div>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 rounded bg-black text-white"
    >
      Sign in with Google
    </button>
  );
}
