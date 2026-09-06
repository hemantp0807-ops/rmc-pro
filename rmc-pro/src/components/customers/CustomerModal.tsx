import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function CustomerModal({
  open,
  title,
  children,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-w-[95vw] max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-8 py-5">
          <h2 className="text-3xl font-bold text-slate-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500 transition hover:bg-red-100 hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}