import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { BatchReportRow } from "../../types/batch";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";


import BatchReportPreview from "../../components/batch/BatchReportPreview";
import DeliveryChallanPreview from "../../components/batch/DeliveryChallanPreview";

import { getBatches } from "../../services/batch.service";

import {
  Copy,
  FileText,
  Search,
  Filter,
  ClipboardList,
  Truck,
  PackageCheck,
  Printer,
  X,
} from "lucide-react";

export default function BatchReports() {
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const [selectedBatch, setSelectedBatch] =
    useState<any | null>(null);

  /* ================================================= */
  /* DATE FORMAT                                       */
  /* ================================================= */

 function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "-";
  }

  const dateString = String(value);

  // If backend sends a timestamp, convert it to Indian date
  if (dateString.includes("T")) {
    const date = new Date(dateString);

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).formatToParts(date);

    const day =
      parts.find((p) => p.type === "day")?.value;

    const month =
      parts.find((p) => p.type === "month")?.value;

    const year =
      parts.find((p) => p.type === "year")?.value;

    return `${day}/${month}/${year}`;
  }

  // If backend sends plain YYYY-MM-DD
  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return "-";
  }

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
}

  /* ================================================= */
  /* LOAD BATCHES                                      */
  /* ================================================= */

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

      toast.error(
        "Failed to load batch reports."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================================================= */
  /* FILTER                                            */
  /* ================================================= */

  const filtered = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return batches.filter((batch) => {
      /*
       * Cancelled batches are not displayed
       * in Batch Reports.
       */


      const matchesSearch =
        String(batch.customer ?? "")
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        status === "All" ||
        batch.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    batches,
    search,
    status,
  ]);

  /* ================================================= */
  /* PREPARE BATCH FOR PRINT                           */
  /* ================================================= */

  function preparePrintBatch(batch: any) {
    const quantity =
      Number(batch.quantity) || 0;

    const cement =
      Number(batch.cement) || 0;

    const flyash =
      Number(batch.flyash) || 0;

    const sand =
      Number(batch.sand) || 0;

    const mm10 =
      Number(batch.mm10) || 0;

    const mm20 =
      Number(batch.mm20) || 0;

    const water =
      Number(batch.water) || 0;

    const admix =
      Number(batch.admix) || 0;

    /*
     * USE SAVED BATCH REPORT ROWS
     */
    const rows: BatchReportRow[] =
      Array.isArray(batch.rows)
        ? batch.rows.map(
          (row: any) => ({
            batch_size:
              Number(row.batch_size) || 0,

            cement_set:
              Number(row.cement_set) || 0,

            cement_act:
              Number(row.cement_act) || 0,

            flyash_set:
              Number(row.flyash_set) || 0,

            flyash_act:
              Number(row.flyash_act) || 0,

            sand_set:
              Number(row.sand_set) || 0,

            sand_act:
              Number(row.sand_act) || 0,

            mm10_set:
              Number(row.mm10_set) || 0,

            mm10_act:
              Number(row.mm10_act) || 0,

            mm20_set:
              Number(row.mm20_set) || 0,

            mm20_act:
              Number(row.mm20_act) || 0,

            water_set:
              Number(row.water_set) || 0,

            water_act:
              Number(row.water_act) || 0,

            admix_set:
              Number(row.admix_set) || 0,

            admix_act:
              Number(row.admix_act) || 0,
          })
        )
        : [];

    return {
      id: batch.id,

      batch_no:
        batch.batch_no,

      sr_no:
        batch.sr_no,

      customer:
        batch.customer,

      site:
        batch.site,

      recipe_name:
        batch.recipe_name,

      recipe_no:
        batch.recipe_no,

      grade:
        batch.grade,

      type_of_loading:
        batch.type_of_loading ??
        batch.typeofloading ??
        "",

      vehicle_no:
        batch.vehicle_no ?? "",

      driver_name:
        batch.driver_name ?? "",

      quantity,

      cumulative_qty:
        Number(batch.cumulative_qty) || 0,

      order_no:
        Number(batch.order_no) || 0,

      delivery_no:
        Number(batch.delivery_no) || 0,

      ticket_no:
        Number(batch.ticket_no) || 0,

      order_qty:
        Number(batch.order_qty) || 0,

      ticket_qty:
        Number(batch.ticket_qty) || 0,

      order_qty_left:
        Number(batch.order_qty_left) || 0,

      batch_date:
        batch.batch_date,

      batch_time:
        batch.batch_time,

      status:
        batch.status,

      cement,
      flyash,
      sand,
      mm10,
      mm20,
      water,
      admix,

      slump:
        Number(batch.slump) || 0,

      strength:
        Number(batch.strength) || 0,

      cement_act:
        Number(batch.cement_act) || 0,

      flyash_act:
        Number(batch.flyash_act) || 0,

      sand_act:
        Number(batch.sand_act) || 0,

      mm10_act:
        Number(batch.mm10_act) || 0,

      mm20_act:
        Number(batch.mm20_act) || 0,

      water_act:
        Number(batch.water_act) || 0,

      admix_act:
        Number(batch.admix_act) || 0,

      production_start:
        batch.production_start,

      end_time:
        batch.end_time ?? "",

      dispatch_time:
        batch.dispatch_time,

      created_at:
        batch.created_at,

      rows,
    };
  }

  /* ================================================= */
  /* PRINT                                             */
  /* ================================================= */

  function handlePrint(batch: any) {
    const printBatch =
      preparePrintBatch(batch);

    setSelectedBatch(
      printBatch
    );

    setTimeout(() => {
      window.print();
    }, 500);
  }

  /* ================================================= */
  /* COPY WHATSAPP MESSAGE                             */
  /* ================================================= */

 async function handleCopyMessage(batch: any) {
  try {
    const batchDate =
      String(batch.batch_date ?? "").split("T")[0];

    const sameDayBatches = batches
      .filter((item) => {
        const itemDate =
          String(item.batch_date ?? "").split("T")[0];

        return itemDate === batchDate;
      })
      .sort(
        (a, b) =>
          Number(a.id) - Number(b.id)
      );

    /*
     * DAILY SR NO.
     * Starts from 1 for each batch date.
     */
    const srNo =
      sameDayBatches.findIndex(
        (item) =>
          Number(item.id) === Number(batch.id)
      ) + 1;

    const partyBatches = sameDayBatches.filter(
      (item) =>
        item.status !== "Cancelled" &&
        String(item.customer ?? "")
          .trim()
          .toLowerCase() ===
          String(batch.customer ?? "")
            .trim()
            .toLowerCase() &&
        String(item.grade ?? "")
          .trim()
          .toLowerCase() ===
          String(batch.grade ?? "")
            .trim()
            .toLowerCase() &&
        Number(item.id) <= Number(batch.id)
    );

    const partyQty = partyBatches.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0),
      0
    );

    const runningQty = sameDayBatches
      .filter(
        (item) =>
          item.status !== "Cancelled" &&
          Number(item.id) <= Number(batch.id)
      )
      .reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0),
        0
      );

    const message = `\`\`\`
Date          :- ${formatDate(batch.batch_date)}
Site Name     :- ${batch.customer || ""}
Sr. No.       :- ${srNo}
Challan No.   :- ${batch.delivery_no || ""}
Vehicle No.   :- ${batch.vehicle_no || ""}
Grade.        :- ${batch.grade || ""}
Challan Qty.  :- ${Number(batch.quantity || 0).toFixed(2)} m³
Party Qty.    :- ${partyQty.toFixed(2)} m³
Running Qty.  :- ${runningQty.toFixed(2)} m³
Delivery Mode :- ${batch.type_of_loading || ""}
\`\`\``;

    try {
      await navigator.clipboard.writeText(message);

      toast.success(
        "Message copied successfully!"
      );
    } catch (clipboardError) {
      console.warn(
        "Clipboard API failed, using fallback:",
        clipboardError
      );

      const textarea =
        document.createElement("textarea");

      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(
        0,
        textarea.value.length
      );

      const copied =
        document.execCommand("copy");

      document.body.removeChild(textarea);

      if (!copied) {
        throw new Error(
          "Clipboard fallback failed"
        );
      }

      toast.success(
        "Message copied successfully!"
      );
    }
  } catch (error) {
    console.error(
      "Failed to copy message:",
      error
    );

    toast.error(
      "Failed to copy message."
    );
  }
}

  /* ================================================= */
  /* PRINT CSS                                         */
  /* ================================================= */

  const printStyles = `

    .print-page-3 {
      display: none !important;
    }

    .challan-left-copy {
      transform:
        translateX(-15px) !important;
    }

    .challan-right-copy {
      transform:
        translateX(15px) !important;
    }

    .print-page-2 {
      display: block !important;
      width: 100% !important;
      margin-top: 30px !important;
      box-sizing: border-box !important;
    }

    .print-page-2
    .challan-print-grid {
      display: grid !important;
      grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr) !important;
      column-gap: 16px !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      position: relative !important;
      box-sizing: border-box !important;
    }

    .print-page-2
    .challan-copy {
      width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
    }

    .print-page-2
    .challan-cut-line {
      position: absolute !important;
      top: 0 !important;
      bottom: 0 !important;
      left: 50% !important;
      width: 0 !important;
      border-left:
        1px dashed #000 !important;
      transform:
        translateX(-50%) !important;
      z-index: 10 !important;
      pointer-events: none !important;
    }

    @media print {

      @page {
        size: landscape;
        margin: 0;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        background: white !important;
        overflow: hidden !important;
      }

      body * {
        visibility: hidden !important;
      }

      .print-root,
      .print-root * {
        visibility: visible !important;
      }

      .print-root {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      .print-page-1 {
        position: relative !important;
        width: 100% !important;
        height: 210mm !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        break-after: page !important;
        page-break-after: always !important;
        overflow: hidden !important;
      }

      [data-print-report],
      [data-print-report] * {
        visibility: visible !important;
      }

      [data-print-report] {
        position: absolute !important;
        left: 50% !important;
        top: 120px !important;
        width: 100% !important;
        transform:
          translateX(-50%)
          scale(0.92) !important;
        transform-origin:
          top center !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      [data-print-report]
      > div:first-child {
        width: 100% !important;
        box-sizing: border-box !important;
      }

      .print-page-2 {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: 210mm !important;
        margin: 0 !important;
        padding:
          15mm 0 0 0 !important;
        box-sizing: border-box !important;
        break-after: page !important;
        page-break-after: always !important;
        overflow: hidden !important;
      }

      .print-page-2
      .challan-print-grid {
        position: relative !important;
        display: grid !important;
        grid-template-columns:
          1fr 1fr !important;
        column-gap: 16px !important;
        width: 94% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .print-page-2
      .challan-copy {
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .print-page-3 {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: 210mm !important;
        margin: 0 !important;
        padding:
          15mm 0 0 0 !important;
        box-sizing: border-box !important;
        break-after: auto !important;
        page-break-after: auto !important;
        overflow: hidden !important;
      }

      .print-page-3
      .challan-print-grid {
        position: relative !important;
        display: grid !important;
        grid-template-columns:
          1fr 1fr !important;
        column-gap: 16px !important;
        width: 94% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .print-page-3
      .challan-copy {
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .print-page-2
      .challan-cut-line,
      .print-page-3
      .challan-cut-line {
        visibility: visible !important;
        position: absolute !important;
        top: 0 !important;
        bottom: 0 !important;
        left: 50% !important;
        width: 0 !important;
        border-left:
          1px dashed #000 !important;
        transform:
          translateX(-50%) !important;
        z-index: 100 !important;
        pointer-events: none !important;
      }

      .print-page-2
      .challan-cut-line span,
      .print-page-3
      .challan-cut-line span {
        visibility: visible !important;
      }

      .print-buttons {
        display: none !important;
        visibility: hidden !important;
      }
    }
  `;

  /* ================================================= */
  /* UI                                                */
  /* ================================================= */

  return (
    <DashboardLayout>

      <style>
        {printStyles}
      </style>

      <PageHeader
        title="Batch Reports"
        subtitle="View, filter and print previous batch reports"
      />

      <div className="px-1 pb-8">

        {/* ============================================= */}
        {/* HERO                                          */}
        {/* ============================================= */}

        {/* <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-sm">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-blue-500/10" />

          <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-blue-600/5" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
                <ClipboardList size={28} />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <span className="text-[10px] font-extrabold tracking-[0.18em] text-blue-400">
                    RMC OPERATIONS
                  </span>

                  <span className="h-1 w-1 rounded-full bg-slate-600" />

                  <span className="text-[10px] font-bold text-slate-500">
                    BATCH HISTORY
                  </span>

                </div>

                <h2 className="mt-1 text-2xl font-extrabold text-white">
                  Batch Report Register
                </h2>

                <p className="mt-1 max-w-xl text-sm font-medium text-slate-400">
                  Review completed and cancelled batches, print reports and copy delivery messages.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                  Records
                </p>

                <p className="mt-1 text-xl font-extrabold text-white">
                  {filtered.length}
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                  Quantity
                </p>

                <p className="mt-1 text-xl font-extrabold text-white">
                  {filtered
                .reduce(
                  (sum, batch) =>
                    sum + Number(batch.quantity || 0),
                  0
                )
                .toFixed(2)}

                  <span className="ml-1 text-xs text-slate-400">
                    m³
                  </span>

                </p>

              </div>

            </div>

          </div>

        </div> */}

        {/* ============================================= */}
        {/* FILTER PANEL                                  */}
        {/* ============================================= */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Filter
                  size={16}
                  className="text-blue-600"
                />

                <h3 className="text-sm font-extrabold text-slate-900">
                  Report Filters
                </h3>

              </div>

              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Search batch records only by customer name and filter by status.
              </p>

            </div>

            {(search || status !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition hover:text-blue-700"
              >
                <X size={14} />
                Reset filters
              </button>
            )}

          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">

            <div className="lg:col-span-9">

              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Search Batch Records
              </label>

              <SearchInput
                placeholder="Search customer name..."
                value={search}
                onChange={setSearch}
              />

            </div>

            <div className="lg:col-span-3">

              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ============================================= */}
        {/* KPI STRIP                                     */}
        {/* ============================================= */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ClipboardList size={19} />
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Batches
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {filtered.length}
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Available batch reports
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Truck size={19} />
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Concrete
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {filtered.reduce(
                (sum, batch) =>
                  batch.status === "Cancelled"
                    ? sum
                    : sum + Number(batch.quantity || 0),
                0
              ).toFixed(2)}

              <span className="ml-1 text-sm">
                m³
              </span>

            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Total batch quantity
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <PackageCheck size={19} />
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                CANCELLED
              </span>
            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {
                filtered.filter(
                  (batch) => batch.status === "Cancelled"
                ).length
              }
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Cancelled batch records
            </p>

          </div>

        </div>

        {/* ============================================= */}
        {/* TABLE HEADER                                   */}
        {/* ============================================= */}

        <div className="mt-5 rounded-t-2xl border border-b-0 border-slate-200 bg-slate-50 px-4 py-3">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-extrabold text-slate-800">
                Batch Records
              </p>

              <p className="text-[11px] font-medium text-slate-500">
                {filtered.length === 0
                  ? "No records match the selected filters."
                  : `Showing ${filtered.length} batch record${filtered.length === 1 ? "" : "s"}.`}
              </p>

            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">

              <Search size={14} />

              {search
                ? `Searching: ${search}`
                : "All records"}

            </div>

          </div>

        </div>

        {/* ============================================= */}
        {/* TABLE                                          */}
        {/* ============================================= */}

        <DataTable
          headers={[
            "Sr. No.",
            "Date",
            "Delivery No.",
            "Customer",
            "Site",
            "Grade",
            "Quantity",
            "Status",
                "Action",
          ]}
          loading={loading}
          emptyMessage="No batch reports found."
        >

          {filtered.map(
            (batch) => (

              <tr
                key={batch.id}
                className="border-b border-slate-100 transition hover:bg-blue-50/40"
              >

                <td className="whitespace-nowrap px-4 py-3.5 text-sm font-extrabold text-blue-600">
                  {batch.sr_no}
                </td>

                <td className="whitespace-nowrap px-4 text-sm font-semibold text-slate-600">
                  {formatDate(
                    batch.batch_date
                  )}
                </td>

                <td className="whitespace-nowrap px-4 text-sm font-extrabold text-slate-900">
                  {batch.delivery_no ?? "-"}
                </td>

                <td className="whitespace-nowrap px-4 text-sm font-bold text-slate-800">
                  {batch.customer ?? "-"}
                </td>

                <td className="whitespace-nowrap px-4 text-sm font-medium text-slate-600">
                  {batch.site ?? "-"}
                </td>

                <td className="whitespace-nowrap px-4 text-sm font-semibold text-slate-700">
                  {batch.grade ?? "-"}
                </td>

                <td className="whitespace-nowrap px-4 text-sm font-extrabold text-slate-900">
                  {batch.quantity ?? 0} m³
                </td>

                                  <td className="whitespace-nowrap px-4">
                    {batch.status === "Completed" ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-700 ring-1 ring-red-100">
                        Cancelled
                      </span>
                    )}
                  </td>

<td className="px-4">
                  {batch.status === "Cancelled" ? (
                    <span className="inline-flex h-9 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-extrabold text-red-600">
                      Cancelled
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handlePrint(batch)
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                      >
                        <Printer size={14} />
                        Print
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyMessage(batch)
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
                      >
                        <Copy size={14} />
                        Copy Msg
                      </button>
                    </div>
                  )}
                </td>

              </tr>

            )
          )}

        </DataTable>

        {/* ============================================= */}
        {/* PRINT ROOT                                     */}
        {/* ============================================= */}

        {selectedBatch && (

          <div className="mt-8 print-root">

            {/* PAGE 1 */}

            <div className="print-page-1">

              <div data-print-report>

                <div className="print-batch-report">

                  <BatchReportPreview
                    batch={selectedBatch}
                  />

                </div>

              </div>

            </div>

            {/* PAGE 2 */}

            <div className="print-page-2">

              <div
                className="challan-print-grid"
                style={{
                  width: "95%",
                  margin: "0 auto",
                }}
              >

                <div
                  className="
                    challan-copy
                    challan-left-copy
                  "
                >

                  <DeliveryChallanPreview
                    batch={selectedBatch}
                    copyType="CUSTOMER COPY"
                  />

                </div>

                <div
                  className="
                    challan-copy
                    challan-right-copy
                  "
                >

                  <DeliveryChallanPreview
                    batch={selectedBatch}
                    copyType="INVOICE COPY"
                  />

                </div>

                <div className="challan-cut-line">

                  <span
                    style={{
                      position: "absolute",
                      left: "-8px",
                      top: "50%",
                      transform:
                        "translateY(-50%) rotate(90deg)",
                      background: "#f1f5f9",
                      fontSize: "14px",
                      lineHeight: "16px",
                    }}
                  >
                    ✂
                  </span>

                </div>

              </div>

            </div>

            {/* PAGE 3 */}

            <div className="print-page-3">

              <div
                className="challan-print-grid"
                style={{
                  width: "95%",
                  margin: "0 auto",
                }}
              >

                <div
                  className="
                    challan-copy
                    challan-left-copy
                  "
                >

                  <DeliveryChallanPreview
                    batch={selectedBatch}
                    copyType="FIX COPY"
                  />

                </div>

                <div
                  className="
                    challan-copy
                    challan-right-copy
                  "
                >

                  <DeliveryChallanPreview
                    batch={selectedBatch}
                    copyType="ACCOUNT COPY"
                  />

                </div>

                <div className="challan-cut-line">

                  <span
                    style={{
                      position: "absolute",
                      left: "-8px",
                      top: "50%",
                      transform:
                        "translateY(-50%) rotate(90deg)",
                      background: "#f1f5f9",
                      fontSize: "14px",
                      lineHeight: "16px",
                    }}
                  >
                    ✂
                  </span>

                </div>

              </div>

            </div>

            {/* PRINT BUTTONS */}

            <div
              className="
                flex
                gap-3
                mt-4
                print-buttons
              "
            >

              <button
                type="button"
                onClick={() =>
                  window.print()
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white transition hover:bg-blue-700"
              >
                <Printer size={16} />
                Print
              </button>

              <button
                type="button"
                onClick={() =>
                  window.print()
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700"
              >
                <FileText size={16} />
                Save PDF
              </button>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}