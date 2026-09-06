
import type { Vehicle } from "../../types/vehicle";

interface Props {
  vehicles: Vehicle[];
  value: number;
  onChange: (id: number) => void;
}

export default function VehicleSelector({
  vehicles,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5">
        Vehicle
      </label>

      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-[38px] border border-slate-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value={0}>Select Vehicle</option>

        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.vehicleNo}
          </option>
        ))}
      </select>
    </div>
  );
}
