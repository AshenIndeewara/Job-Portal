import JobForm from "@/components/JobForm";

export default function CreatePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Post New Job
      </h1>

      <JobForm />
    </div>
  );
}