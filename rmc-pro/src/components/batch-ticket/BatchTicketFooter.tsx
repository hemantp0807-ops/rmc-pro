export default function BatchTicketFooter() {
  return (
    <div className="border-2 border-t-0 border-black p-5 mt-4">

      <div className="grid grid-cols-3 gap-8 text-center">

        <div>

          <div className="h-16"></div>

          <div className="border-t border-black pt-2 font-semibold">
            Plant Operator
          </div>

        </div>

        <div>

          <div className="h-16"></div>

          <div className="border-t border-black pt-2 font-semibold">
            Quality Engineer
          </div>

        </div>

        <div>

          <div className="h-16"></div>

          <div className="border-t border-black pt-2 font-semibold">
            Customer Signature
          </div>

        </div>

      </div>
            <div className="border-t border-black mt-8 pt-4 flex justify-between text-xs text-slate-600">

        <div>
          <p>
            Printed On : {new Date().toLocaleString()}
          </p>

          <p>
            Printed By : Administrator
          </p>
        </div>

        <div className="text-center">
          <p>
            This is a computer generated batch ticket.
          </p>

          <p>
            No signature required if digitally verified.
          </p>
        </div>

        <div className="text-right">
          <p>
            RMC PRO ERP
          </p>

          <p>
            Version 1.0.0
          </p>
        </div>

      </div>

    </div>
  );
}