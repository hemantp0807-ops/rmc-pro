import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="mt-2 text-slate-500 text-base">
          {subtitle}
        </p>
      </div>

      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </div>
  );
}