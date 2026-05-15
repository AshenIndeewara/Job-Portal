"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <StatusBadge status={job.status} />
      </div>

      <p className="text-gray-600 mt-2 line-clamp-2">
        {job.description}
      </p>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>{job.category}</span>
        <span>{job.location}</span>
      </div>

      <Link
        href={`/jobs/${job._id}`}
        className="inline-block mt-4 text-blue-600 font-medium"
      >
        View Details
      </Link>
    </div>
  );
}