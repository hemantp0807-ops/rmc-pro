import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusBadge from "../../components/ui/StatusBadge";

import { getBatches } from "../../services/batch.service";
import {
  startProduction,
  completeProduction,
} from "../../services/production.service";

export default function Production() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    setLoading(true);

    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batches.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStart(id: number) {
    try {
      await startProduction(id);

      toast.success("Production started.");

      await loadBatches();
    } catch (error) {
      console.error(error);
      toast.error("Failed to start production.");
    }
  }

  async function handleComplete(id: number) {
    try {
      await completeProduction(id);

      toast.success("Production completed.");

      await loadBatches();
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete production.");
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Production"
        subtitle="Manage concrete production"
      />

      {loading && (
        <LoadingSpinner text="Loading production..." />
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

                <td className="p-3 text-center">
                  {batch.status ===
                    "Pending" && (
                    <button
                      onClick={() =>
                        handleStart(batch.id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Start
                    </button>
                  )}

                  {batch.status ===
                    "Producing" && (
                    <button
                      onClick={() =>
                        handleComplete(batch.id)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Complete
                    </button>
                  )}

                  {(batch.status ===
                    "Completed" ||
                    batch.status ===
                      "Dispatched") && (
                    <span className="text-green-600 font-semibold">
                      ✓ Done
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