export default function StatusBadge({ status }) {
  const colors = {
    Open: "bg-green-500",
    "In Progress": "bg-yellow-500",
    Closed: "bg-red-500",
  };

  return (
    <span
      className={`text-white text-sm px-2 py-1 rounded ${colors[status]}`}
    >
      {status}
    </span>
  );
}