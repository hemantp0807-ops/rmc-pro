type Props = {
  material: string;
  perCum: number;
  quantity: number;
};

export default function MaterialRow({
  material,
  perCum,
  quantity,
}: Props) {
  return (
    <tr className="border-b hover:bg-slate-50 transition">
      <td className="py-3 px-4 font-medium">{material}</td>

      <td className="text-center">{perCum}</td>

      <td className="text-center font-semibold text-blue-600">
        {(perCum * quantity).toFixed(2)}
      </td>
    </tr>
  );
}