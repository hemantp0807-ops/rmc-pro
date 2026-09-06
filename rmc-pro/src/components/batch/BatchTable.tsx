import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Trash2,
  History,
  Hash,
  UserRound,
  BookOpen,
  Truck,
  User,
  Package,
  ClipboardList,
  ReceiptText,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { hasRole } from "../../utils/auth";
import type { Batch } from "../../types/batch";

type Props = {
  batches: Batch[];
  onEdit: (batch: Batch) => void;
  onDelete: (id: number) => void;
  onCancel: (id: number, reason: string) => void;
};

export default function BatchTable({
  batches,
  onEdit,
  onDelete,
  onCancel,
}: Props) {
  const topScrollRef =
    useRef<HTMLDivElement>(null);

  const tableScrollRef =
    useRef<HTMLDivElement>(null);

  const [scrollWidth, setScrollWidth] =
    useState(0);

  const [cancelBatchId, setCancelBatchId] =
    useState<number | null>(null);

  const [cancelReason, setCancelReason] =
    useState("");

  /* ================================================= */
  /* UPDATE SCROLL WIDTH                               */
  /* ================================================= */

  useEffect(() => {
    const updateScrollWidth = () => {
      if (tableScrollRef.current) {
        const table =
          tableScrollRef.current.querySelector("table");

        if (table) {
          setScrollWidth(table.scrollWidth);
        }
      }
    };

    updateScrollWidth();

    const resizeObserver =
      new ResizeObserver(updateScrollWidth);

    if (tableScrollRef.current) {
      resizeObserver.observe(
        tableScrollRef.current
      );

      const table =
        tableScrollRef.current.querySelector("table");

      if (table) {
        resizeObserver.observe(table);
      }
    }

    window.addEventListener(
      "resize",
      updateScrollWidth
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateScrollWidth
      );
    };
  }, [batches]);

  /* ================================================= */
  /* TOP SCROLL                                       */
  /* ================================================= */

  const handleTopScroll = () => {
    if (
      topScrollRef.current &&
      tableScrollRef.current
    ) {
      tableScrollRef.current.scrollLeft =
        topScrollRef.current.scrollLeft;
    }
  };

  /* ================================================= */
  /* TABLE SCROLL                                     */
  /* ================================================= */

  const handleTableScroll = () => {
    if (
      topScrollRef.current &&
      tableScrollRef.current
    ) {
      topScrollRef.current.scrollLeft =
        tableScrollRef.current.scrollLeft;
    }
  };

  /* ================================================= */
  /* STATUS STYLE                                     */
  /* ================================================= */

  const getStatusStyle = (status: string) => {
    const value =
      status?.toLowerCase();

    if (value === "completed") {
      return {
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: (
          <CheckCircle2
            size={13}
            strokeWidth={2.5}
          />
        ),
      };
    }

    if (value === "producing") {
      return {
        className:
          "bg-blue-50 text-blue-700 border-blue-200",
        icon: (
          <Clock3
            size={13}
            strokeWidth={2.5}
          />
        ),
      };
    }

    if (value === "dispatched") {
      return {
        className:
          "bg-violet-50 text-violet-700 border-violet-200",
        icon: (
          <Truck
            size={13}
            strokeWidth={2.5}
          />
        ),
      };
    }

    if (value === "cancelled") {
      return {
        className:
          "bg-red-50 text-red-700 border-red-200",
        icon: (
          <AlertCircle
            size={13}
            strokeWidth={2.5}
          />
        ),
      };
    }

    return {
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
      icon: (
        <Clock3
          size={13}
          strokeWidth={2.5}
        />
      ),
    };
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <History
              size={20}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Batch History
            </h2>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              View and manage all batch records
            </p>
          </div>

        </div>

        {/* TOTAL BATCHES */}

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

          <Package
            size={16}
            className="text-blue-600"
          />

          <div className="leading-tight">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Total Batches
            </p>

            <p className="text-sm font-bold text-slate-800">
              {batches.length}
            </p>
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TOP HORIZONTAL SCROLLBAR                          */}
      {/* ================================================= */}

      <div className="border-b border-slate-100 bg-slate-50">

        <div
          ref={topScrollRef}
          onScroll={handleTopScroll}
          className="h-[16px] w-full overflow-x-auto overflow-y-hidden"
        >
          <div
            style={{
              width: `${scrollWidth}px`,
              height: "1px",
            }}
          />
        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE                                             */}
      {/* ================================================= */}

      <div
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="w-full overflow-x-auto"
      >

        <table
          className="w-full min-w-[1200px] border-collapse"
        >

          {/* ================================================= */}
          {/* HEADER                                            */}
          {/* ================================================= */}

          <thead>

            <tr className="border-b border-slate-200 bg-slate-50">

              {/* SR NO */}

              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Hash size={13} />
                  Sr. No.
                </div>
              </th>

              {/* CUSTOMER */}

              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center gap-1.5">
                  <UserRound size={13} />
                  Customer
                </div>
              </th>

              {/* RECIPE */}

              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={13} />
                  Recipe
                </div>
              </th>

              {/* VEHICLE */}

              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck size={13} />
                  Vehicle
                </div>
              </th>

              {/* DRIVER */}

              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center gap-1.5">
                  <User size={13} />
                  Driver
                </div>
              </th>

              {/* QTY */}

              <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Qty
              </th>

              {/* ORDER */}

              <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center justify-end gap-1.5">
                  <ClipboardList size={13} />
                  Order
                </div>
              </th>

              {/* DELIVERY */}

              <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <div className="flex items-center justify-end gap-1.5">
                  <ReceiptText size={13} />
                  Delivery
                </div>
              </th>

              {/* ORDER QTY */}

              <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Order Qty
              </th>

              {/* STATUS */}

              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Status
              </th>

              {/* ACTION */}

              <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Action
              </th>

            </tr>

          </thead>

          {/* ================================================= */}
          {/* BODY                                              */}
          {/* ================================================= */}

          <tbody>

            {batches.length === 0 ? (

              <tr>

                <td
                  colSpan={11}
                  className="py-14 text-center"
                >

                  <div className="flex flex-col items-center justify-center">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Package size={22} />
                    </div>

                    <p className="text-sm font-bold text-slate-700">
                      No batches found
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Batch records will appear here
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              batches.map((batch) => {

                const status =
                  getStatusStyle(
                    batch.status
                  );

                return (
                  <tr
                    key={batch.id}
                    className="group border-b border-slate-100 transition-colors hover:bg-blue-50/30"
                  >

                    {/* SERIAL */}

                    <td className="sticky left-0 z-[1] border-r border-slate-100 bg-white px-4 py-3 group-hover:bg-blue-50/30">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-blue-50 px-2 text-xs font-bold text-blue-700">
                          {batch.sr_no}
                        </div>

                      </div>

                    </td>

                    {/* CUSTOMER */}

                    <td className="max-w-[190px] px-4 py-3">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <UserRound size={15} />
                        </div>

                        <span className="truncate text-sm font-semibold text-slate-800">
                          {batch.customer || "-"}
                        </span>

                      </div>

                    </td>

                    {/* RECIPE */}

                    <td className="px-4 py-3">

                      <span className="whitespace-nowrap text-sm font-semibold text-slate-700">
                        {batch.recipe || "-"}
                      </span>

                    </td>

                    {/* VEHICLE */}

                    <td className="px-4 py-3">

                      <div className="flex items-center gap-2">

                        <Truck
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="whitespace-nowrap text-sm font-semibold text-slate-700">
                          {batch.vehicleNo || "-"}
                        </span>

                      </div>

                    </td>

                    {/* DRIVER */}

                    <td className="px-4 py-3">

                      <div className="flex items-center gap-2">

                        <User
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                          {batch.driverName || "-"}
                        </span>

                      </div>

                    </td>

                    {/* QTY */}

                    <td className="px-4 py-3 text-right">

                      <span className="font-bold text-slate-800">
                        {batch.quantity}
                      </span>

                    </td>

                    {/* ORDER */}

                    <td className="px-4 py-3 text-right">

                      <span className="font-semibold text-slate-700">
                        {batch.orderNo || "-"}
                      </span>

                    </td>

                    {/* DELIVERY */}

                    <td className="px-4 py-3 text-right">

                      <span className="font-semibold text-slate-700">
                        {batch.deliveryNo || "-"}
                      </span>

                    </td>

                    {/* ORDER QTY */}

                    <td className="px-4 py-3 text-right">

                      <span className="font-semibold text-slate-700">
                        {batch.orderQty || "-"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-3">

                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.icon}
                        {batch.status || "Pending"}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-4 py-3 text-center">


                      <div className="flex items-center justify-center gap-2">
                        {/* EDIT */}
                        {batch.status?.toLowerCase() !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => onEdit(batch)}
                            title="Edit Batch"
                            className="
      inline-flex h-8 items-center justify-center rounded-lg
      border border-blue-200 bg-blue-50 px-3
      text-xs font-bold text-blue-700
      transition-all hover:bg-blue-100
    "
                          >
                            Edit
                          </button>
                        )}

                        {/* CANCEL */}

                        {batch.status?.toLowerCase() !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelBatchId(batch.id);
                              setCancelReason("");
                            }}
                            title="Cancel Batch"
                            className="inline-flex h-8 items-center justify-center rounded-lg
                    border border-amber-200 bg-amber-50 px-3
                    text-xs font-bold text-amber-700
                    transition-all hover:bg-amber-100"
                          >
                            Cancel
                          </button>
                        )}

                        {/* DELETE — ADMIN ONLY */}

                        {hasRole("admin") && (
                          <button
                            type="button"
                            onClick={() => onDelete(batch.id)}
                            title="Delete Batch"
                            className="inline-flex h-8 w-8 items-center justify-center
      rounded-lg text-slate-400
      transition-all duration-200
      hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={16}
                              strokeWidth={2}
                            />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

        {/* ================================================= */}
        {/* CANCEL MODAL                                      */}
        {/* ================================================= */}

        {cancelBatchId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

              <h3 className="text-lg font-bold text-slate-900">
                Cancel Batch
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Please provide a reason for cancelling this batch.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) =>
                  setCancelReason(e.target.value)
                }
                placeholder="Enter cancellation reason..."
                rows={4}
                className="mt-4 w-full rounded-lg border border-slate-300
                   px-3 py-2 text-sm outline-none
                   focus:border-blue-500 focus:ring-2
                   focus:ring-blue-500"
              />

              <div className="mt-5 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setCancelBatchId(null);
                    setCancelReason("");
                  }}
                  className="rounded-lg border border-slate-300
                     px-4 py-2 text-sm font-semibold
                     text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!cancelReason.trim()}
                  onClick={() => {
                    if (!cancelReason.trim()) return;

                    onCancel(
                      cancelBatchId,
                      cancelReason.trim()
                    );

                    setCancelBatchId(null);
                    setCancelReason("");
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2
                     text-sm font-semibold text-white
                     hover:bg-red-700
                     disabled:cursor-not-allowed
                     disabled:opacity-50"
                >
                  Confirm Cancellation
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* FOOTER                                            */}
      {/* ================================================= */}

      {batches.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

            <History size={14} />

            Showing

            <span className="font-bold text-slate-700">
              {batches.length}
            </span>

            batch{batches.length !== 1 ? "es" : ""}

          </div>

          <div className="text-[11px] font-semibold text-slate-400">
            Permanent Serial Numbers
          </div>

        </div>
      )}

    </div>
  );
}