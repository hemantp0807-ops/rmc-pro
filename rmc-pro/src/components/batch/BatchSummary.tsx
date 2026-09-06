type Props = {
  quantity: number;
};

export default function BatchSummary({
  quantity,
}: Props) {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-6 mt-8">

      <h2 className="text-xl font-bold">
        Batch Summary
      </h2>

      <div className="mt-4 space-y-2">

        <div className="flex justify-between">
          <span>Quantity</span>

          <span>{quantity} m³</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>

          <span>Ready</span>
        </div>

      </div>

    </div>
  );
}