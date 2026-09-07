

  import { useEffect, useMemo, useState } from "react";
  import {
  Factory,
  BarChart3,
  ClipboardList,
  Boxes,
  CalendarDays,
} from "lucide-react";

import toast from "react-hot-toast";

  import DashboardLayout from "../../layouts/DashboardLayout";
  import PageHeader from "../../components/ui/PageHeader";
  import SearchInput from "../../components/ui/SearchInput";
  import DataTable from "../../components/ui/DataTable";

  import { getBatches } from "../../services/batch.service";
  import { exportToExcel } from "../../utils/exportExcel";
  import { exportProductionReportPdf } from "../../utils/exportProductionReportPdf";

  export default function ProductionReport() {
    const [batches, setBatches] = useState<any[]>([]);

    const [search, setSearch] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    /* ================================================= */
    /* LOAD BATCHES                                      */
    /* ================================================= */

    useEffect(() => {
      loadBatches();
    }, []);

    async function loadBatches() {
      try {
        const data = await getBatches();

        setBatches(
          data.filter(
            (batch: any) =>
              batch.status === "Producing" ||
              batch.status === "Completed" ||
              batch.status === "Dispatched"
          )
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load production report."
        );
      }
    }

    /* ================================================= */
    /* DATE ONLY                                         */
    /* ================================================= */

    function getDateOnly(
      date: string | null | undefined
    ) {
      if (!date) return "";

      const d = new Date(date);

      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
      );
    }

    /* ================================================= */
    /* FORMAT DATE                                       */
    /* ================================================= */

    function formatDate(
      date: string | null | undefined
    ) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString(
        "en-IN"
      );
    }

    /* ================================================= */
    /* FILTER BATCHES                                    */
    /* ================================================= */

    const filteredBatches = useMemo(() => {
      const value = search
        .toLowerCase()
        .trim();

      return batches.filter((batch) => {
        /* --------------------------------------------- */
        /* SEARCH                                         */
        /* --------------------------------------------- */

        const matchesSearch =
          String(batch.customer ?? "")
            .toLowerCase()
            .includes(value);

        /* --------------------------------------------- */
        /* DATE                                           */
        /* --------------------------------------------- */

        let matchesDate = true;

        const batchDate = getDateOnly(
          batch.batch_date
        );

        if (fromDate) {
          if (!batchDate || batchDate < fromDate) {
            matchesDate = false;
          }
        }

        if (toDate) {
          if (!batchDate || batchDate > toDate) {
            matchesDate = false;
          }
        }

        return (
          matchesSearch &&
          matchesDate
        );
      });
    }, [
      batches,
      search,
      fromDate,
      toDate,
    ]);

   /* ================================================= */
/* GROUP PRODUCTION REPORT                           */
/*                                                   */
/* Same Date + Customer + Grade = ONE ROW            */
/* Total Qty = ONLY quantity for that date           */
/* ================================================= */

const reportRows = useMemo(() => {
  const groups = new Map<string, any>();

  filteredBatches.forEach((batch) => {
    const date = getDateOnly(batch.batch_date);

    const customer = batch.customer || "";
    const grade = batch.grade || "";

    const key = `${date}|${customer}|${grade}`;

    const quantity = Number(batch.quantity) || 0;

    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        date,
        customer,
        grade,
        totalQty: quantity,
      });
    } else {
      existing.totalQty += quantity;
    }
  });

  return Array.from(groups.values()).sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }

    if (a.customer !== b.customer) {
      return a.customer.localeCompare(b.customer);
    }

    return a.grade.localeCompare(b.grade);
  });
}, [filteredBatches]);

    /* ================================================= */
    /* TOTAL CUMULATIVE QUANTITY                         */
    /* ================================================= */

   /* ================================================= */
/* TOTAL QUANTITY                                    */
/* ================================================= */

const totalQuantity = useMemo(() => {
  return reportRows.reduce(
    (sum, row) =>
      sum + Number(row.totalQty || 0),
    0
  );
}, [reportRows]);

    /* ================================================= */
    /* CLEAR DATE FILTER                                 */
    /* ================================================= */

    function clearDateFilter() {
      setFromDate("");
      setToDate("");
    }


    function handleCopyWhatsAppMessage() {
  if (!fromDate || !toDate) {
    toast.error("Please select From Date and To Date.");
    return;
  }

  if (reportRows.length === 0) {
    toast.error("No production data found.");
    return;
  }

  // Group by Customer + Grade
  const groups = new Map<string, number>();

  filteredBatches.forEach((batch) => {
    const customer = (batch.customer || "").trim();
    const grade = (batch.grade || "").trim();

    if (!customer || !grade) return;

    const key = `${customer}|${grade}`;

    groups.set(
      key,
      (groups.get(key) || 0) +
        Number(batch.quantity || 0)
    );
  });

  // Convert groups into customer-wise data
  const customerGroups = new Map<
    string,
    { grade: string; quantity: number }[]
  >();

  groups.forEach((quantity, key) => {
    const [customer, grade] = key.split("|");

    if (!customerGroups.has(customer)) {
      customerGroups.set(customer, []);
    }

    customerGroups.get(customer)!.push({
      grade,
      quantity,
    });
  });

  let message = "Customer Wise Production\n";

  // Date heading
  if (fromDate === toDate) {
    const date = new Date(
      `${fromDate}T00:00:00`
    );

    const formattedDate =
      date.toLocaleDateString("en-IN");

    const day = date.toLocaleDateString(
      "en-IN",
      { weekday: "long" }
    );

    message += `Date:- ${formattedDate}\n`;
    message += `(${day})\n\n`;
  } else {
    const from = new Date(
      `${fromDate}T00:00:00`
    ).toLocaleDateString("en-IN");

    const to = new Date(
      `${toDate}T00:00:00`
    ).toLocaleDateString("en-IN");

    message += `Date:- ${from} to ${to}\n\n`;
  }

  let srNo = 1;

  customerGroups.forEach((grades, customer) => {
    message += `${srNo}) ${customer}\n`;

    grades.forEach((item) => {
      message += `${item.grade}=${item.quantity}m3\n`;
    });

    message += "\n";
    srNo++;
  });

 // Total quantity for selected date range
const totalQty = filteredBatches.reduce(
  (sum, batch) =>
    sum + Number(batch.quantity || 0),
  0
);

// Total quantity for the current month
const now = new Date();

const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const thisMonthQty = batches
  .filter((batch) => {
    if (!batch.batch_date) return false;

    const batchDate = new Date(batch.batch_date);

    return (
      batchDate.getMonth() === currentMonth &&
      batchDate.getFullYear() === currentYear
    );
  })
  .reduce(
    (sum, batch) =>
      sum + Number(batch.quantity || 0),
    0
  );

message += `Total Qty=${totalQty}m3\n`;
message += `This Month Qty=${thisMonthQty}m3`;

  navigator.clipboard
    .writeText(message)
    .then(() => {
      toast.success(
        "Production message copied."
      );
    })
    .catch(() => {
      toast.error(
        "Failed to copy production message."
      );
    });
}


    /* ================================================= */
    /* EXPORT EXCEL                                      */
    /*                                                 */
    /* DATE IS INTENTIONALLY NOT INCLUDED                */
    /* ================================================= */

    function handleExportExcel() {
      if (reportRows.length === 0) {
        toast.error(
          "No production data found."
        );

        return;
      }

      exportToExcel(
        reportRows.map((row, index) => ({
          "Sr No.": index + 1,

          "Party Name":
            row.customer,

          "Grade Of Concrete":
            row.grade,

          "Total Qty":
  Number(
    row.totalQty || 0
  ),

          Remark: "",
        })),

        "Production_Report"
      );

      toast.success(
        "Production report exported to Excel."
      );
    }

    /* ================================================= */
    /* EXPORT PDF                                        */
    /*                                                 */
    /* DATE IS INTENTIONALLY NOT INCLUDED                */
    /* ================================================= */

    function handleExportPdf() {
      if (reportRows.length === 0) {
        toast.error(
          "No production data found."
        );

        return;
      }

    exportProductionReportPdf(
    reportRows.map((row, index) => ({
      srNo: index + 1,
      partyName: row.customer,
      grade: row.grade,
      totalQty: Number(row.totalQty || 0),
      remark: "",
    })),
    fromDate,
    toDate
  );

      toast.success(
        "Production report exported to PDF."
      );
    }

    /* ================================================= */
    /* RETURN                                            */
    /* ================================================= */

    return (
      <DashboardLayout>

        <PageHeader
          title="Production Report"
          subtitle="Production history and customer-wise output"
        />

        <div className="px-1 pb-8">

          {/* ================================================= */}
          {/* PRODUCTION HERO                                  */}
          {/* ================================================= */}

          {/* <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-7 shadow-sm">

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[34px] border-blue-500/10" />
            <div className="absolute -bottom-24 right-32 h-52 w-52 rounded-full border-[24px] border-white/5" />

            <div className="absolute right-8 bottom-3 opacity-[0.04]">
              <Factory size={190} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
                  <Factory size={28} strokeWidth={2.2} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold tracking-[0.2em] text-blue-400">
                      RMC OPERATIONS
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-600" />
                    <span className="text-[10px] font-bold text-slate-500">
                      PRODUCTION
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Production Control
                  </h2>

                  <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-400">
                    Monitor customer-wise concrete production, grades and
                    cumulative quantities from one place.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                    Records
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {reportRows.length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                    Total Output
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {totalQuantity}{" "}
                    <span className="text-xs text-slate-500">m³</span>
                  </p>
                </div>

              </div>

            </div>
          </div> */}


          {/* ================================================= */}
          {/* FILTER WORKSPACE                                 */}
          {/* ================================================= */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Report Filters
                </h3>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Search customer records and filter by date before exporting
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Live Data
                </span>
              </div>
            </div>

            <div className="p-5">

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

                <div className="lg:col-span-8">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Customer Name
                  </label>

                  <SearchInput
                    placeholder="Search customer name..."
                    value={search}
                    onChange={setSearch}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    From Date
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    To Date
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <BarChart3 size={15} className="text-blue-600" />
                  Showing{" "}
                  <span className="font-extrabold text-slate-800">
                    {reportRows.length}
                  </span>{" "}
                  production records
                </div>

                <div className="flex flex-wrap gap-2">

                  {(fromDate || toDate) && (
                    <button
                      type="button"
                      onClick={clearDateFilter}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Clear Dates
                    </button>
                  )}

                  {fromDate && toDate && (
                    <button
                      type="button"
                      onClick={handleCopyWhatsAppMessage}
                      disabled={reportRows.length === 0}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Copy Msg
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    Export PDF
                  </button>

                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700"
                  >
                    Export Excel
                  </button>

                </div>
              </div>

            </div>
          </div>


          {/* ================================================= */}
          {/* KPI STRIP                                        */}
          {/* ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="absolute right-3 top-3 opacity-10">
                <ClipboardList size={45} />
              </div>

              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                Production Records
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {reportRows.length}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="absolute right-3 top-3 opacity-10">
                <Boxes size={45} />
              </div>

              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                Concrete Output
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {totalQuantity}
                <span className="ml-1 text-sm font-bold text-slate-500">
                  m³
                </span>
              </p>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-violet-100 bg-violet-50 p-4">
              <div className="absolute right-3 top-3 opacity-10">
                <CalendarDays size={45} />
              </div>

              <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600">
                Reporting Period
              </p>

              <p className="mt-2 truncate text-sm font-black text-slate-900">
                {fromDate || toDate
                  ? `${fromDate || "..."} → ${toDate || "..."}`
                  : "All available dates"}
              </p>
            </div>

          </div>


          {/* ================================================= */}
          {/* PRODUCTION TABLE                                 */}
          {/* ================================================= */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Factory size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Production Register
                  </h3>

                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    Customer and grade-wise cumulative production
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Total
                </span>
                <span className="text-sm font-black text-slate-800">
                  {totalQuantity} m³
                </span>
              </div>

            </div>

            <div className="w-full overflow-x-auto">

              <DataTable
                headers={[
                  "Date",
                  "Sr No.",
                  "Party Name",
                  "Grade Of Concrete",
                  "Total Qty",
                  "Remark",
                ]}
              >
                {reportRows.map((row, index) => (
                  <tr
                    key={`${row.date}-${row.customer}-${row.grade}`}
                    className="group border-b border-slate-100 transition hover:bg-blue-50/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-slate-600">
                      {row.date ? formatDate(row.date) : "-"}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-slate-100 px-2 text-[10px] font-extrabold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-sm font-extrabold text-slate-900">
                      {row.customer}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                        {row.grade}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-sm font-black text-blue-700">
                       {Number(row.totalQty || 0)}
                      </span>
                      <span className="ml-1 text-[10px] font-bold text-slate-400">
                        m³
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      —
                    </td>
                  </tr>
                ))}
              </DataTable>

            </div>

          </div>

        </div>

      </DashboardLayout>
    );
  }
