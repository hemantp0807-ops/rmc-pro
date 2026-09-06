type Props = {
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
};

export default function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          From
        </label>

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            onFromDateChange(e.target.value)
          }
          className="border rounded-xl px-4 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          To
        </label>

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            onToDateChange(e.target.value)
          }
          className="border rounded-xl px-4 py-2 w-full"
        />
      </div>
    </div>
  );
}