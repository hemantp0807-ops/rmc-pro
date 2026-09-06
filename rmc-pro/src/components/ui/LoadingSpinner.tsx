type Props = {
  text?: string;
  size?: "sm" | "md" | "lg";
};

export default function LoadingSpinner({
  text = "Loading...",
  size = "md",
}: Props) {
  const spinnerSize =
    size === "sm"
      ? "w-5 h-5 border-2"
      : size === "lg"
      ? "w-12 h-12 border-4"
      : "w-8 h-8 border-4";

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`
          ${spinnerSize}
          border-blue-600
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />

      <p className="mt-4 text-slate-500 font-medium">
        {text}
      </p>
    </div>
  );
}