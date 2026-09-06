//Delivery Challan Report


import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";
import { FileText, Truck, BarChart3 } from "lucide-react";

import type { Batch } from "../../types/batch";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusBadge from "../../components/ui/StatusBadge";

import { getBatches } from "../../services/batch.service";
import { exportToExcel } from "../../utils/exportExcel";

export default function DeliveryChallanReport() {

  /* ================================================= */
  /* STATE                                             */
  /* ================================================= */

  const [batches, setBatches] =
    useState<Batch[]>([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [loading, setLoading] =
    useState(false);


  /* ================================================= */
  /* DATE FILTER                                       */
  /* ================================================= */

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");


  /* ================================================= */
  /* SCROLL REFS                                      */
  /* ================================================= */

  const tableWrapperRef =
    useRef<HTMLDivElement>(null);

  const topScrollRef =
    useRef<HTMLDivElement>(null);

  const tableScrollRef =
    useRef<HTMLElement | null>(null);


  const [tableScrollWidth, setTableScrollWidth] =
    useState(2000);


  /* ================================================= */
  /* LOAD BATCHES                                     */
  /* ================================================= */

  useEffect(() => {
    loadBatches();
  }, []);


  async function loadBatches() {

    setLoading(true);

    try {

      const data =
        await getBatches();
      console.log("FIRST BATCH:", data[0]);
      console.log("FIRST DATE:", data[0].batch_date);
      console.log("TYPE:", typeof data[0].batch_date);

      const mapped =
        data.map(
          (batch: any) => ({
            ...batch,

            cement:
              Number(batch.cement),

            flyash:
              Number(batch.flyash),

            sand:
              Number(batch.sand),

            mm10:
              Number(batch.mm10),

            mm20:
              Number(batch.mm20),

            water:
              Number(batch.water),

            admix:
              Number(batch.admix),
          })
        );


      setBatches(mapped);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load delivery challan report."
      );

    } finally {

      setLoading(false);

    }
  }


  /* ================================================= */
  /* DATABASE DATE FORMAT                              */
  /* YYYY-MM-DD                                       */
  /* ================================================= */

  function getDateOnly(
    date: string | null | undefined
  ): string {
    if (!date) {
      return "";
    }

    const value = String(date).trim();

    /*
     * PostgreSQL timestamp coming from backend:
     *
     * 2026-08-26T18:30:00.000Z
     *
     * In India this is:
     *
     * 27/08/2026
     */

    if (value.includes("T")) {
      const d = new Date(value);

      if (isNaN(d.getTime())) {
        return "";
      }

      /*
       * Convert to Indian date (IST)
       */

      const parts = new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ).formatToParts(d);

      const year =
        parts.find(
          (p) => p.type === "year"
        )?.value;

      const month =
        parts.find(
          (p) => p.type === "month"
        )?.value;

      const day =
        parts.find(
          (p) => p.type === "day"
        )?.value;

      return `${year}-${month}-${day}`;
    }


    /*
     * Already YYYY-MM-DD
     */

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return value;
    }


    /*
     * DD/MM/YYYY
     */

    if (
      /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {

      const [
        day,
        month,
        year,
      ] = value.split("/");

      return `${year}-${month}-${day}`;
    }


    return "";
  }

  /* ================================================= */
  /* DISPLAY DATE                                     */
  /* DD/MM/YYYY                                       */
  /* ================================================= */

  function formatDisplayDate(
    date: string | null | undefined
  ) {

    const dateOnly =
      getDateOnly(date);


    if (!dateOnly) {
      return "";
    }


    const [
      year,
      month,
      day,
    ] =
      dateOnly.split("-");


    return `${day}/${month}/${year}`;

  }


  /* ================================================= */
  /* FILTERED DATA                                    */
  /* ================================================= */

  /* ================================================= */
  /* FILTERED DATA                                    */
  /* Latest batch first                                */
  /* ================================================= */

  const filtered = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return batches
      .filter((batch) => {

        const matchesSearch =
          batch.customer
            ?.toLowerCase()
            .includes(value);

        const matchesStatus =
          status === "All" ||
          batch.status === status;

        const batchDate =
          getDateOnly(batch.batch_date);

        let matchesDate = true;

        // From date only
        if (fromDate && !toDate) {
          matchesDate =
            batchDate === fromDate;
        }

        // To date only
        if (!fromDate && toDate) {
          matchesDate =
            batchDate === toDate;
        }

        // Both dates
        if (fromDate && toDate) {
          matchesDate =
            batchDate >= fromDate &&
            batchDate <= toDate;
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );
      })
      .sort((a, b) => {

        /*
         * Latest batch first.
         *
         * Using database ID means:
         * 1 = oldest batch
         * 2 = next batch
         * 3 = next batch
         * ...
         * Latest ID = latest batch
         */

        return Number(b.id) - Number(a.id);
      });

  }, [
    batches,
    search,
    status,
    fromDate,
    toDate,
  ]);


  /* ================================================= */
  /* CLEAR DATE FILTER                                */
  /* ================================================= */

  function clearDateFilter() {

    setFromDate("");

    setToDate("");

  }


  /* ================================================= */
  /* TOP HORIZONTAL SCROLLBAR                         */
  /* ================================================= */

  useEffect(() => {

    const wrapper =
      tableWrapperRef.current;

    const topScroll =
      topScrollRef.current;


    if (
      !wrapper ||
      !topScroll
    ) {

      return;

    }


    const timer =
      window.setTimeout(() => {

        /*
         * Find the actual horizontal
         * scrolling element inside DataTable.
         */

        const elements =
          Array.from(
            wrapper.querySelectorAll<HTMLElement>(
              "*"
            )
          );


        const scrollElement =
          elements
            .filter(
              (element) =>
                element !== topScroll &&
                !topScroll.contains(element) &&
                element.scrollWidth >
                element.clientWidth
            )
            .sort(
              (a, b) =>
                b.scrollWidth -
                a.scrollWidth
            )[0] || null;


        if (!scrollElement) {
          return;
        }


        tableScrollRef.current =
          scrollElement;


        /*
         * Set top scrollbar width
         * equal to actual table width.
         */

        setTableScrollWidth(
          scrollElement.scrollWidth
        );


        /*
         * Hide native bottom
         * scrollbar.
         */

        scrollElement.style.scrollbarWidth =
          "none";




        scrollElement.classList.add(
          "hide-delivery-scrollbar"
        );


        /*
         * TOP → TABLE
         */

        const handleTopScroll =
          () => {

            if (
              tableScrollRef.current
            ) {

              tableScrollRef.current.scrollLeft =
                topScroll.scrollLeft;

            }

          };


        /*
         * TABLE → TOP
         */

        const handleTableScroll =
          () => {

            if (
              tableScrollRef.current
            ) {

              topScroll.scrollLeft =
                tableScrollRef.current.scrollLeft;

            }

          };


        topScroll.addEventListener(
          "scroll",
          handleTopScroll
        );


        scrollElement.addEventListener(
          "scroll",
          handleTableScroll
        );


        /*
         * Cleanup
         */

        return () => {

          topScroll.removeEventListener(
            "scroll",
            handleTopScroll
          );

          scrollElement.removeEventListener(
            "scroll",
            handleTableScroll
          );

        };

      }, 300);


    return () => {

      window.clearTimeout(timer);

    };

  }, [
    filtered,
    loading,
  ]);


  /* ================================================= */
  /* EXPORT EXCEL                                     */
  /* ================================================= */

  function handleExportExcel() {
    if (filtered.length === 0) {
      toast.error(
        "No delivery challan available for the selected filters."
      );
      return;
    }

    /*
     * Sort by Challan Number / Delivery Number
     * Latest first.
     *
     * delivery_no is coming from Batch Entry.
     *
     * Example:
     * 105
     * 104
     * 103
     * 102
     */

    const sortedBatches = [...filtered].sort(
      (a, b) => {
        const challanA = Number(a.delivery_no) || 0;
        const challanB = Number(b.delivery_no) || 0;

        // Challan Number → Ascending
        return challanA - challanB;
      }
    );


    const reportData = sortedBatches.map(
      (batch, index) => {

        /*
         * Serial number is generated AFTER sorting.
         */

        const srNo = index + 1;


        return {

          /*
           * Sr No.
           */

          "Sr.no":
            srNo,


          /*
           * Party Name
           */

          "PARTY NAME":
            batch.customer || "",


          /*
           * Site Address
           */

          "SITE ADD":
            batch.site || "",


          /*
           * Challan Number
           *
           * IMPORTANT:
           * This is now the Delivery No.
           * from Batch Entry.
           */

          "Challan Number":
            batch.delivery_no ?? "",


          /*
           * PO Number
           *
           * Always blank.
           */

          "P.O Number":
            "",


          /*
           * Date
           *
           * DD/MM/YYYY
           */

          "Date":
            formatDisplayDate(
              batch.batch_date
            ),


          /*
           * HSN Code
           */

          "HSN CODE":
            "38245010",


          /*
           * Vehicle Number
           */

          "Vehicle Number":
            batch.vehicle_no || "",


          /*
           * Driver Name
           */

          "Driver Name":
            batch.driver_name || "",


          /*
           * Grade / Material Description
           */

          "Material Description":
            batch.grade || "",


          /*
           * Quantity
           */

          "Quantity":
            Number(
              batch.quantity || 0
            ),
          "Status":
            batch.status === "Cancelled"
              ? "Cancelled"
              : "Completed",

          "Cancel Reason":
            batch.cancel_reason || "",
        };
      }
    );


    exportToExcel(
      reportData,
      "Delivery_Challan_Report"
    );


    toast.success(
      "Delivery Challan Excel exported successfully."
    );
  }


  /* ================================================= */
  /* PRINT                                             */
  /* ================================================= */

  function handlePrint() {

    window.print();

  }


  /* ================================================= */
  /* UI                                                */
  /* ================================================= */

  return (
    <DashboardLayout>
      <PageHeader
        title="Delivery Challan Report"
        subtitle="Monitor dispatches, challans and concrete deliveries"
      />

      <div className="px-1 pb-8">

        REPORT HERO
        {/* <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-sm"> */}
          {/* <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-blue-500/10" />
          <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-blue-600/5" /> */}

          {/* <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
                <FileText size={28} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-[0.18em] text-blue-400">
                    RMC DISPATCH
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span className="text-[10px] font-bold text-slate-500">
                    LIVE REPORT
                  </span>
                </div>

                <h2 className="mt-1 text-2xl font-extrabold text-white">
                  Delivery Challan Register
                </h2>

                <p className="mt-1 max-w-xl text-sm font-medium text-slate-400">
                  Search, filter, export and print your delivery records from one place.
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
                  {filtered.reduce(
                    (sum, batch) =>
                      batch.status === "Cancelled"
                        ? sum
                        : sum + Number(batch.quantity || 0),
                    0
                  )}{" "}
                  <span className="text-xs text-slate-400">m³</span>
                </p>
              </div>
            </div>
          </div> */}
        {/* </div> */}

        {loading && (
          <div className="mt-5">
            <LoadingSpinner text="Loading delivery challan report..." />
          </div>
        )}

        {/* FILTER PANEL */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Report Filters
              </h3>
              <p className="text-[11px] font-medium text-slate-400">
                Narrow down delivery records before exporting
              </p>
            </div>

            {(search || status !== "All" || fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                  clearDateFilter();
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Search
              </label>
              <SearchInput
                placeholder="Search customer..."
                value={search}
                onChange={setSearch}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>


                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
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

            <div className="flex items-end lg:col-span-1">
              {(fromDate || toDate) ? (
                <button
                  type="button"
                  onClick={clearDateFilter}
                  className="h-10 w-full rounded-lg border border-slate-300 px-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Clear
                </button>
              ) : (
                <div className="h-10 w-full" />
              )}
            </div>
          </div>
        </div>

        {/* KPI STRIP */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={19} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Records
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">
              {filtered.length}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Delivery challans
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
              )}{" "}
              <span className="text-sm">m³</span>
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Total delivered quantity
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BarChart3 size={19} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Filter
              </span>
            </div>
            <p className="mt-3 text-lg font-black text-slate-900">
              {status === "All" ? "All Status" : status}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Current report view
            </p>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              Delivery Records
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              {filtered.length === 0
                ? "No records match the selected filters."
                : `Showing ${filtered.length} delivery record${filtered.length === 1 ? "" : "s"}.`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <FileText size={16} />
              Export Excel
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
            >
              <FileText size={16} />
              Print Report
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div
          ref={tableWrapperRef}
          className="mt-4 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div
            ref={topScrollRef}
            className="w-full overflow-x-auto overflow-y-hidden border-b border-slate-100 bg-slate-50"
            style={{ height: "15px" }}
          >
            <div
              style={{
                width: `${tableScrollWidth}px`,
                height: "1px",
              }}
            />
          </div>

          <div className="px-1">
            <DataTable
              headers={[
                "Sr. No.",
                "Customer",
                "Site",
                "Grade",
                "Vehicle",
                "Driver",
                "Delivery No",
                "Quantity",
                "Date",
                "Time",
                "Status",
                "Cancel Reason",
              ]}
              loading={loading}
              emptyMessage="No delivery challan records found."
            >
              {filtered.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm font-extrabold text-blue-600">
                    {batch.sr_no}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-bold text-slate-800">
                    {batch.customer}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-medium text-slate-600">
                    {batch.site}
                  </td>



                  <td className="whitespace-nowrap px-4 text-sm font-semibold text-slate-700">
                    {batch.grade}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-bold text-slate-700">
                    {batch.vehicle_no}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-medium text-slate-600">
                    {batch.driver_name}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-extrabold text-slate-900">
                    {batch.delivery_no}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-extrabold text-slate-900">
                    {batch.quantity} m³
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-semibold text-slate-600">
                    {formatDisplayDate(batch.batch_date)}
                  </td>

                  <td className="whitespace-nowrap px-4 text-sm font-semibold text-slate-600">
                    {batch.batch_time}
                  </td>

                  <td className="whitespace-nowrap px-4">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="max-w-[250px] px-4 text-sm font-medium text-red-600">
                    {batch.cancel_reason || "-"}
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