import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusBadge from "../../components/ui/StatusBadge";

import { getBatches } from "../../services/batch.service";
import { dispatchBatch } from "../../services/dispatch.service";

export default function Dispatch() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    setLoading(true);

    try {
      const data = await getBatches();

      setBatches(
        data.filter(
          (batch: any) =>
            batch.status === "Completed" ||
            batch.status === "Dispatched"
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batches.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDispatch(id: number) {
    try {
      await dispatchBatch(id);

      toast.success("Batch dispatched successfully.");

      await loadBatches();
    } catch (error) {
      console.error(error);
      toast.error("Failed to dispatch batch.");
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dispatch"
        subtitle="Dispatch completed batches"
      />

      {loading && (
        <LoadingSpinner text="Loading dispatch..." />
      )}

      <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((batch) => (
              <tr
                key={batch.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-3">
                  {batch.batch_no}
                </td>

                <td className="p-3">
                  {batch.customer}
                </td>

                <td className="p-3">
                  {batch.vehicle_no}
                </td>

                <td className="p-3">
                  {batch.driver_name}
                </td>

                <td className="p-3">
                  {batch.quantity} m³
                </td>

                <td className="p-3">
                  <StatusBadge
                    status={batch.status}
                  />
                </td>

                <td className="text-center p-3">
                  {batch.status ===
                  "Completed" ? (
                    <button
                      onClick={() =>
                        handleDispatch(batch.id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Dispatch
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      ✓ Dispatched
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}