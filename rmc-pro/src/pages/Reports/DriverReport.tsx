import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Search,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";

import { getDrivers } from "../../services/driver.service";
import { exportToExcel } from "../../utils/exportExcel";
import { exportToPdf } from "../../utils/exportPdf";

export default function DriverReport() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load driver report.");
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase().trim();

    return drivers.filter(
      (driver) =>
        driver.driver_name?.toLowerCase().includes(value) ||
        driver.mobile?.toLowerCase().includes(value) ||
        driver.license_no?.toLowerCase().includes(value)
    );
  }, [drivers, search]);

  const availableDrivers = filtered.filter(
    (driver) => driver.status === "Available"
  ).length;

  const onDutyDrivers = filtered.filter(
    (driver) => driver.status === "On Duty"
  ).length;

  function handleExportExcel() {
    exportToExcel(
      filtered.map((driver) => ({
        Driver: driver.driver_name,
        Mobile: driver.mobile,
        License: driver.license_no,
        Status: driver.status,
      })),
      "Driver_Report"
    );
  }

  function handleExportPdf() {
    exportToPdf(
      ["Driver", "Mobile", "License", "Status"],
      filtered.map((driver) => [
        driver.driver_name,
        driver.mobile,
        driver.license_no,
        driver.status,
      ]),
      "Driver Report"
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

      case "On Duty":
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700 ring-1 ring-blue-100">
            On Duty
          </span>
        );

      case "Inactive":
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-700 ring-1 ring-red-100">
            Inactive
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
                <UserRound size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Driver Report
                </h1>

                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  Driver master data and availability
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
          {/* Total Drivers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Drivers
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {filtered.length}
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Matching driver records
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <UserRound size={20} />
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
                  {availableDrivers}
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Drivers ready for assignment
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UserRound size={20} />
              </div>
            </div>
          </div>

          {/* On Duty */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  On Duty
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {onDutyDrivers}
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Drivers currently assigned
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search / Report Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Driver Master Report
              </h2>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Search by driver name, mobile number, or license
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <SearchInput
                placeholder="Search driver, mobile or license..."
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
                Driver Records
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
                "Driver",
                "Mobile",
                "License",
                "Status",
              ]}
            >
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>

                      <p className="mt-3 text-sm font-extrabold text-slate-700">
                        No driver records found
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Try a different driver, mobile number, or license.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-b border-slate-100 transition-colors hover:bg-blue-50/40"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="font-extrabold text-slate-800">
                            {driver.driver_name}
                          </p>

                          <p className="text-[11px] font-semibold text-slate-400">
                            Driver #{driver.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-slate-700">
                      {driver.mobile}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {driver.license_no}
                    </td>

                    <td>
                      {statusBadge(driver.status)}
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