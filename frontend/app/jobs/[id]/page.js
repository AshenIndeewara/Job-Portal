"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  async function fetchJob() {
    try {
      const res = await API.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStatus(status) {
    try {
      const res = await API.patch(`/api/jobs/${id}`, {
        status,
      });

      setJob(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteJob() {
    try {
      await API.delete(`/api/jobs/${id}`);
      router.push("/");
    } catch (err) {
      alert("Unauthorized or failed");
    }
  }

  if (!job) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">
          {job.title}
        </h1>

        <StatusBadge status={job.status} />
      </div>

      <p className="mt-6 text-gray-700">
        {job.description}
      </p>

      <div className="mt-6 space-y-2">
        <p>
          <strong>Category:</strong> {job.category}
        </p>

        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <p>
          <strong>Contact:</strong> {job.contactName}
        </p>

        <p>
          <strong>Email:</strong> {job.contactEmail}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <select
          value={job.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="border p-3 rounded"
        >
          <option value="Open">Open</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Closed">Closed</option>
        </select>

        <button
          onClick={deleteJob}
          className="bg-red-600 text-white px-5 py-3 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}