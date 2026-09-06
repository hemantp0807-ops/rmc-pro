type Props = {
  batch?: any;
};

export default function BatchTicketInfo({
  batch,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-6 border-x-2 border-b-2 border-black p-4 text-sm">

      {/* Customer Information */}

      <div className="space-y-2">

        <h3 className="font-bold border-b pb-1">
          Customer Information
        </h3>

        <p>
          <b>Customer :</b> {batch?.customer}
        </p>

        <p>
          <b>Site :</b> {batch?.site}
        </p>

        <p>
          <b>Vehicle :</b> {batch?.vehicle_no}
        </p>

        <p>
          <b>Driver :</b> {batch?.driver_name}
        </p>

        <p>
          <b>Start Time :</b>{" "}
          {batch?.production_start
            ? new Date(
                batch.production_start
              ).toLocaleTimeString()
            : "-"}
        </p>

        <p>
          <b>End Time :</b>{" "}
          {batch?.production_end
            ? new Date(
                batch.production_end
              ).toLocaleTimeString()
            : "-"}
        </p>

      </div>
            {/* Recipe Information */}

      <div className="space-y-2">

        <h3 className="font-bold border-b pb-1">
          Recipe Information
        </h3>

        <p>
          <b>Recipe :</b> {batch?.grade}
        </p>

        <p>
          <b>Recipe No :</b> {batch?.batch_no}
        </p>

        <p>
          <b>Grade :</b> {batch?.grade}
        </p>

        <p>
          <b>Slump :</b> 100 mm
        </p>

        <p>
          <b>Strength :</b> {batch?.grade}
        </p>

        <p>
          <b>Date :</b>{" "}
          {batch?.batch_date?.split("T")[0]}
        </p>

      </div>

      {/* Order Information */}

      <div className="space-y-2">

        <h3 className="font-bold border-b pb-1">
          Order Information
        </h3>

        <p>
          <b>Order No :</b> ORD-{batch?.id}
        </p>

        <p>
          <b>Order Qty :</b> {batch?.quantity} m³
        </p>

        <p>
          <b>Ticket Qty :</b> {batch?.quantity} m³
        </p>

        <p>
          <b>Delivery No :</b> DEL-{batch?.id}
        </p>

        <p>
          <b>Ticket No :</b> TKT-{batch?.batch_no}
        </p>

        <p>
          <b>Status :</b> {batch?.status}
        </p>

      </div>

    </div>
  );
}