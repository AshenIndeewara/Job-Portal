"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between">
      <Link href="/" className="font-bold">
        Job Portal
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/">Jobs</Link>

        {token ? (
          <>
            <Link href="/create">Create</Link>

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}