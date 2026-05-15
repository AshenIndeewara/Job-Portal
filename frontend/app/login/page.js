"use client";

import { useState } from "react";
import API from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Login() {
  const router = useRouter();
    const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await API.post("/api/auth/login", form);

    login(res.data.token);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow">
      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="bg-black text-white px-4 py-2">
        Login
      </button>
    </form>
  );
}