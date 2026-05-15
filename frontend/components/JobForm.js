"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function JobForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Plumbing",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/api/jobs", form);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unauthorized or error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow">
      {error && <p className="text-red-500">{error}</p>}

      <input
        placeholder="Title"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mt-2"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button className="bg-black text-white px-4 py-2 mt-4">
        Submit
      </button>
    </form>
  );
}