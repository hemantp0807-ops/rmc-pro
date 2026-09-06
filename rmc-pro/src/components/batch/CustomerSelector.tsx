import type { Customer } from "../../types/customer";

interface Props {
  customers: Customer[];
  value: number;
  onChange: (id: number) => void;
}

export default function CustomerSelector({
  customers,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5">
        Customer
      </label>

      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-[38px] border-2 border-slate-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value={0}>Select Customer</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.customer}
          </option>
        ))}
      </select>
    </div>
  );
}