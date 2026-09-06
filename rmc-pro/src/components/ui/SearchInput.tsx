import { Search, X } from "lucide-react";

type Props = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}