import type { ReactNode } from "react";

type Props = {
  headers: string[];
  children: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
};

export default function DataTable({
  headers,
  children,
  loading = false,
  emptyMessage = "No records found.",
}: Props) {
  const hasRows = Array.isArray(children)
    ? children.length > 0
    : !!children;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-10 text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : hasRows ? (
              children
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-10 text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}