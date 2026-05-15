"use client";

import { useState } from "react";
import API from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await API.post("/api/auth/register", form);

    login(res.data.token);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow">
      <input
        placeholder="Name"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

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
        Register
      </button>
    </form>
  );
}