
import type { Driver } from "../../types/driver";

interface Props {
  drivers: Driver[];
  value: number;
  onChange: (id: number) => void;
}

export default function DriverSelector({
  drivers,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5">
        Driver
      </label>

      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-[38px] border border-slate-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value={0}>Select Driver</option>

        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </select>
    </div>
  );
}
