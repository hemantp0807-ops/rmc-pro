type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  let className =
    "px-3 py-1 rounded-full text-sm font-medium";

  switch (status) {
    case "Pending":
      className +=
        " bg-yellow-100 text-yellow-700";
      break;

    case "Producing":
      className +=
        " bg-blue-100 text-blue-700";
      break;

    case "Completed":
      className +=
        " bg-green-100 text-green-700";
      break;

    case "Dispatched":
      className +=
        " bg-purple-100 text-purple-700";
      break;

    case "Available":
      className +=
        " bg-green-100 text-green-700";
      break;

    case "Busy":
      className +=
        " bg-orange-100 text-orange-700";
      break;

    case "Maintenance":
      className +=
        " bg-red-100 text-red-700";
      break;

    case "On Duty":
      className +=
        " bg-blue-100 text-blue-700";
      break;

    case "Inactive":
      className +=
        " bg-gray-200 text-gray-700";
      break;

    default:
      className +=
        " bg-slate-100 text-slate-700";
  }

  return (
    <span className={className}>
      {status}
    </span>
  );
}