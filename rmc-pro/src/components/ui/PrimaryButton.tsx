import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-3 rounded-xl font-medium shadow text-white transition
        ${
          disabled
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
      `}
    >
      {children}
    </button>
  );
}