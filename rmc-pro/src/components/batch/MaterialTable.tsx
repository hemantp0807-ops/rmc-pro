import MaterialRow from "./MaterialRow";

type Recipe = {
  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;
};

type Props = {
  customer: Recipe;
  quantity: number;
};

export default function MaterialTable({
  customer,
  quantity,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md mt-8 overflow-hidden">
      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-bold">
          Material Consumption
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left px-4 py-3">
              Material
            </th>

            <th className="text-center">
              Per m³
            </th>

            <th className="text-center">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          <MaterialRow
            material="Cement"
            perCum={Number(customer.cement)}
            quantity={quantity}
          />

          <MaterialRow
            material="Fly Ash"
            perCum={Number(customer.flyash)}
            quantity={quantity}
          />

          <MaterialRow
            material="Sand"
            perCum={Number(customer.sand)}
            quantity={quantity}
          />

          <MaterialRow
            material="10 MM"
            perCum={Number(customer.mm10)}
            quantity={quantity}
          />

          <MaterialRow
            material="20 MM"
            perCum={Number(customer.mm20)}
            quantity={quantity}
          />

          <MaterialRow
            material="Water"
            perCum={Number(customer.water)}
            quantity={quantity}
          />

          <MaterialRow
            material="Admix"
            perCum={Number(customer.admix)}
            quantity={quantity}
          />
        </tbody>
      </table>
    </div>
  );
}