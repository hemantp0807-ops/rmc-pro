import { Inbox } from "lucide-react";

type Props = {
  title?: string;
  message?: string;
};

export default function EmptyState({
  title = "No Data Found",
  message = "There are no records to display.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Inbox
        size={60}
        className="text-slate-300"
      />

      <h2 className="text-2xl font-semibold text-slate-700 mt-4">
        {title}
      </h2>

      <p className="text-slate-500 mt-2">
        {message}
      </p>
    </div>
  );
}