type Props = {
  batch?: any;
};

export default function BatchTicketHeader({
  batch,
}: Props) {
  return (
    <div className="border-2 border-black">

      {/* Company Header */}

      <div className="flex justify-between items-center border-b border-black p-4">

        <div>

          <h1 className="text-3xl font-bold tracking-wide">
            RMC PRO ERP
          </h1>

          <p className="text-sm">
            Ready Mix Concrete Plant
          </p>

          <p className="text-xs text-slate-600">
            Pune, Maharashtra
          </p>

        </div>

        <div className="text-center">

          <h2 className="text-2xl font-bold">
            BATCH REPORT
          </h2>

          <p className="text-lg font-semibold">
            DELIVERY TICKET
          </p>

        </div>

        <div className="text-right text-sm">

          <p>
            <b>Batch No:</b>
          </p>

          <p className="font-bold text-lg">
            {batch?.batch_no}
          </p>

          <p className="mt-2">
            <b>Status:</b> {batch?.status}
          </p>

        </div>

      </div>

      {/* Batch Information */}

      <div className="grid grid-cols-4 border-t">

        <div className="border-r border-black p-3">
          <p className="text-xs text-slate-500">
            Date
          </p>

          <p className="font-semibold">
            {batch?.batch_date?.split("T")[0]}
          </p>
        </div>

        <div className="border-r border-black p-3">
          <p className="text-xs text-slate-500">
            Time
          </p>

          <p className="font-semibold">
            {batch?.batch_time}
          </p>
        </div>

        <div className="border-r border-black p-3">
          <p className="text-xs text-slate-500">
            Grade
          </p>

          <p className="font-semibold">
            {batch?.grade}
          </p>
        </div>

        <div className="p-3">
          <p className="text-xs text-slate-500">
            Quantity
          </p>

          <p className="font-semibold">
            {batch?.quantity} m³
          </p>
        </div>

      </div>

    </div>
  );
}