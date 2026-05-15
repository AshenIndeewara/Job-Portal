"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import JobCard from "@/components/JobCard";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [category]);

  async function fetchJobs() {
    try {
      const query = category ? `?category=${category}` : "";
      console.log(`Fetching jobs with query: ${query}`);
      const res = await API.get(`/api/jobs${query}`);
      console.log(res.data);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Service Requests
        </h1>

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Painting">Painting</option>
          <option value="Joinery">Joinery</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}