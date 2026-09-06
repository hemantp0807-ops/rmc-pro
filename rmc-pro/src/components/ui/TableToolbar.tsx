import type { ReactNode } from "react";

type Props = {
  left?: ReactNode;
  right?: ReactNode;
};

export default function TableToolbar({
  left,
  right,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex-1">
        {left}
      </div>

      <div className="flex gap-3 flex-wrap">
        {right}
      </div>
    </div>
  );
}