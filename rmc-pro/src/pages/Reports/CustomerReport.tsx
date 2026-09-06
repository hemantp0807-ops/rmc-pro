import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Search,
  Users,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";

import { getCustomers } from "../../services/customer.service";
import { exportToExcel } from "../../utils/exportExcel";
import { exportToPdf } from "../../utils/exportPdf";

export default function CustomerReport() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load customer report.");
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase().trim();

    return customers.filter(
      (customer) =>
        customer.customer?.toLowerCase().includes(value) ||
        customer.site?.toLowerCase().includes(value) ||
        customer.grade?.toLowerCase().includes(value)
    );
  }, [customers, search]);

  const gradesAvailable = new Set(
    filtered.map((customer) => customer.grade).filter(Boolean)
  ).size;

  function handleExportExcel() {
    exportToExcel(
      filtered.map((customer) => ({
        Customer: customer.customer,
        Site: customer.site,
        Grade: customer.grade,
        Cement: customer.cement,
        FlyAsh: customer.flyash,
        Sand: customer.sand,
        "10mm": customer.mm10,
        "20mm": customer.mm20,
        Water: customer.water,
        Admix: customer.admix,
      })),
      "Customer_Report"
    );
  }

  function handleExportPdf() {
    exportToPdf(
      [
        "Customer",
        "Site",
        "Grade",
        "Cement",
        "FlyAsh",
        "Sand",
      ],
      filtered.map((customer) => [
        customer.customer,
        customer.site,
        customer.grade,
        customer.cement,
        customer.flyash,
        customer.sand,
      ]),
      "Customer Report"
    );
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
                <Users size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Customer Report
                </h1>
                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  Customer master data and recipe details
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Customers
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {filtered.length}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Matching customer records
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Grades Available
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {gradesAvailable}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Unique concrete grades
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
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
                Customer Master Report
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Search customer, project site, or concrete grade
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <SearchInput
                placeholder="Search customer, site or grade..."
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
                Customer Records
              </p>
              <p className="text-xs font-medium text-slate-500">
                {filtered.length} record{filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
              Report View
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              headers={[
                "Customer",
                "Site",
                "Grade",
                "Cement",
                "FlyAsh",
                "Sand",
                "10mm",
                "20mm",
                "Water",
                "Admix",
              ]}
            >
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>

                      <p className="mt-3 text-sm font-extrabold text-slate-700">
                        No customer records found
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Try a different customer, site, or grade.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 transition-colors hover:bg-blue-50/40"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-700">
                          {String(customer.customer || "")
                            .trim()
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-extrabold text-slate-800">
                            {customer.customer}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-400">
                            Customer #{customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.site}
                    </td>

                    <td>
                      <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                        {customer.grade || "-"}
                      </span>
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.cement}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.flyash}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.sand}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.mm10}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.mm20}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.water}
                    </td>

                    <td className="font-semibold text-slate-700">
                      {customer.admix}
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
