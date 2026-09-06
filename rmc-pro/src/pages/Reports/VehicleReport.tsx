import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Truck,
  Search,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";

import { getVehicles } from "../../services/vehicle.service";
import { exportToExcel } from "../../utils/exportExcel";
import { exportToPdf } from "../../utils/exportPdf";

export default function VehicleReport() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load vehicle report.");
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vehicles.filter(
      (vehicle) =>
        vehicle.vehicle_no?.toLowerCase().includes(value) ||
        vehicle.status?.toLowerCase().includes(value)
    );
  }, [vehicles, search]);

  const totalCapacity = filtered.reduce(
    (sum, vehicle) => sum + Number(vehicle.capacity || 0),
    0
  );

  const availableVehicles = filtered.filter(
    (vehicle) => vehicle.status === "Available"
  ).length;

  function handleExportExcel() {
    exportToExcel(
      filtered.map((vehicle) => ({
        Vehicle: vehicle.vehicle_no,
        Capacity: vehicle.capacity,
        Status: vehicle.status,
      })),
      "Vehicle_Report"
    );
  }

  function handleExportPdf() {
    exportToPdf(
      ["Vehicle", "Capacity", "Status"],
      filtered.map((vehicle) => [
        vehicle.vehicle_no,
        `${vehicle.capacity} m³`,
        vehicle.status,
      ]),
      "Vehicle Report"
    );
  }

  function statusBadge(status: string) {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
            Available
          </span>
        );

      case "Busy":
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-100">
            Busy
          </span>
        );

      case "Maintenance":
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-700 ring-1 ring-red-100">
            Maintenance
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-700">
            {status || "-"}
          </span>
        );
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Report Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              <BarChart3 size={14} />
              Reports
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Truck size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Vehicle Report
                </h1>

                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  Vehicle master data and fleet availability
                </p>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportPdf}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98]"
            >
              <FileText size={16} />
              Export PDF
            </button>

            <button
              onClick={handleExportExcel}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <FileSpreadsheet size={16} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total Vehicles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Vehicles
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {filtered.length}
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Matching fleet records
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Truck size={20} />
              </div>
            </div>
          </div>

          {/* Total Capacity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Capacity
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {totalCapacity}
                  <span className="ml-1 text-lg font-bold text-slate-500">
                    m³
                  </span>
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Combined vehicle capacity
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Available
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {availableVehicles}
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Vehicles ready for dispatch
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Truck size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search / Report Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Vehicle Master Report
              </h2>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Search by vehicle number or current status
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <SearchInput
                placeholder="Search vehicle or status..."
                value={search}
                onChange={setSearch}
              />
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Vehicle Records
              </p>

              <p className="text-xs font-medium text-slate-500">
                {filtered.length} record
                {filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
              Report View
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              headers={[
                "Vehicle No",
                "Capacity",
                "Status",
              ]}
            >
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>

                      <p className="mt-3 text-sm font-extrabold text-slate-700">
                        No vehicle records found
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Try a different vehicle number or status.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-slate-100 transition-colors hover:bg-blue-50/40"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Truck size={17} />
                        </div>

                        <div>
                          <p className="font-extrabold text-slate-800">
                            {vehicle.vehicle_no}
                          </p>

                          <p className="text-[11px] font-semibold text-slate-400">
                            Vehicle #{vehicle.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-slate-700">
                      {vehicle.capacity} m³
                    </td>

                    <td>
                      {statusBadge(vehicle.status)}
                    </td>
                  </tr>
                ))
              )}
            </DataTable>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}