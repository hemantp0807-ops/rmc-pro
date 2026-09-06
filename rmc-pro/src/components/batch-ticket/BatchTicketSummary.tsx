type Props = {
  batch?: any;
};

export default function BatchTicketSummary({
  batch,
}: Props) {
  return (
    <div className="mt-4">

      <table className="w-full border border-black border-collapse text-[11px]">

        <thead>

          <tr className="bg-slate-100">

            <th className="border border-black p-2">
              Summary
            </th>

            <th className="border border-black">
              Aggregate
            </th>

            <th className="border border-black">
              Cement
            </th>

            <th className="border border-black">
              Fly Ash
            </th>

            <th className="border border-black">
              Water
            </th>

            <th className="border border-black">
              Admix
            </th>

          </tr>

        </thead>

        <tbody>

  <tr>
    <td className="border p-2 font-medium">
      Total Set
    </td>

    <td className="border text-center">
      {(
        Number(batch?.mm10 || 0) +
        Number(batch?.sand || 0) +
        Number(batch?.mm20 || 0)
      ).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.cement || 0).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.flyash || 0).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.water || 0).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.admix || 0).toFixed(2)}
    </td>
  </tr>

  <tr>
    <td className="border p-2 font-medium">
      Total Actual
    </td>

    <td className="border text-center">
      {(
        Number(batch?.mm10 || 0) +
        Number(batch?.sand || 0) +
        Number(batch?.mm20 || 0)
      ).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.cement || 0).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.flyash || 0).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.water || 0).toFixed(2)}
    </td>

    <td className="border text-center">
      {Number(batch?.admix || 0).toFixed(2)}
    </td>
  </tr>

  <tr>
    <td className="border p-2 font-medium">
      Average Set
    </td>

    <td colSpan={5} className="border text-center">
      --
    </td>
  </tr>

  <tr>
    <td className="border p-2 font-medium">
      Average Actual
    </td>

    <td colSpan={5} className="border text-center">
      --
    </td>
  </tr>

  <tr>
    <td className="border p-2 font-medium">
      Variance
    </td>

    <td colSpan={5} className="border text-center">
      0.00
    </td>
  </tr>

  <tr>
    <td className="border p-2 font-medium">
      Variance %
    </td>

    <td colSpan={5} className="border text-center">
      0%
    </td>
  </tr>

</tbody>

      </table>

    </div>
  );
}