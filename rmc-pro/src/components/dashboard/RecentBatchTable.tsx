import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  ClipboardList,
  UserRound,
  Cuboid,
} from "lucide-react";

import { getBatches } from "../../services/batch.service";

import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function RecentBatchTable() {
  const [batches, setBatches] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

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

      setBatches(
        [...data]
          .sort(
            (a, b) =>
              Number(b.id) -
              Number(a.id)
          )
          .slice(0, 10)
      );
    } catch (error) {
      console.error(
        "Failed to load recent batches:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          bg-slate-50/70
          px-5
          py-4
        "
      >

        <div className="flex items-center gap-3">

          {/* ICON */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <ClipboardList
              size={18}
              strokeWidth={2.4}
            />
          </div>

          {/* TITLE */}
          <div>
            <h2
              className="
                text-sm
                font-extrabold
                text-slate-900
              "
            >
              Recent Batches
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                font-medium
                text-slate-400
              "
            >
              Latest production activity
            </p>
          </div>

        </div>

        {/* COUNT */}
        {!loading &&
          batches.length > 0 && (
            <div
              className="
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-1
                text-[9px]
                font-extrabold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Latest 10
            </div>
          )}

      </div>

      {/* ================================================= */}
      {/* LOADING                                           */}
      {/* ================================================= */}

      {loading ? (
        <div className="px-5 py-8">
          <LoadingSpinner
            text="Loading batches..."
          />
        </div>
      ) : batches.length === 0 ? (
        <div className="px-5 py-8">
          <EmptyState
            title="No Batches"
            message="No production batches available."
          />
        </div>
      ) : (

        /* ================================================= */
        /* TABLE                                             */
        /* ================================================= */

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              min-w-[800px]
              border-collapse
            "
          >

            {/* ================================================= */}
            {/* TABLE HEADER                                      */}
            {/* ================================================= */}

            <thead>

              <tr
                className="
                  border-b
                  border-slate-200
                  bg-white
                "
              >

                <th
                  className="
    whitespace-nowrap
    px-5
    py-3
    text-left
    text-[10px]
    font-extrabold
    uppercase
    tracking-[0.08em]
    text-slate-500
  "
                >
                  Sr No
                </th>

                {/* CUSTOMER */}
                <th
                  className="
                    whitespace-nowrap
                    px-5
                    py-3
                    text-left
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <UserRound size={13} />
                    Customer
                  </div>
                </th>

                {/* GRADE */}
                <th
                  className="
                    whitespace-nowrap
                    px-5
                    py-3
                    text-left
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                  "
                >
                  Grade
                </th>

                {/* QUANTITY */}
                <th
                  className="
                    whitespace-nowrap
                    px-5
                    py-3
                    text-left
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <Cuboid size={13} />
                    Quantity
                  </div>
                </th>

                {/* STATUS */}
                <th
                  className="
                    whitespace-nowrap
                    px-5
                    py-3
                    text-left
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                  "
                >
                  Status
                </th>

              </tr>

            </thead>

            {/* ================================================= */}
            {/* TABLE BODY                                        */}
            {/* ================================================= */}

            <tbody>

              {batches.map(
                (
                  batch,
                  index
                ) => (

                  <motion.tr
                    key={batch.id}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay:
                        index * 0.03,
                    }}
                    className="
                      group
                      border-b
                      border-slate-100
                      last:border-b-0
                      transition-colors
                      duration-150
                      hover:bg-blue-50/30
                    "
                  >

                    <td className="px-5 py-3.5">
  <span
    className="
      text-xs
      font-extrabold
      text-slate-800
    "
  >
    {batch.sr_no ?? "—"}
  </span>
</td>
                    {/* CUSTOMER */}
                    <td
                      className="
                        px-5
                        py-3.5
                      "
                    >
                      <span
                        className="
                          block
                          max-w-[230px]
                          truncate
                          text-xs
                          font-bold
                          text-slate-700
                        "
                        title={
                          batch.customer ||
                          ""
                        }
                      >
                        {batch.customer ||
                          "—"}
                      </span>
                    </td>

                    {/* GRADE */}
                    <td
                      className="
                        px-5
                        py-3.5
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-lg
                          bg-slate-100
                          px-2.5
                          py-1
                          text-[10px]
                          font-extrabold
                          text-slate-600
                        "
                      >
                        {batch.grade ||
                          "—"}
                      </span>
                    </td>

                    {/* QUANTITY */}
                    <td
                      className="
                        px-5
                        py-3.5
                      "
                    >

                      <div className="flex items-center gap-1.5">

                        <span
                          className="
                            text-xs
                            font-extrabold
                            text-slate-800
                          "
                        >
                          {Number(
                            batch.quantity ||
                            0
                          ).toFixed(2)}
                        </span>

                        <span
                          className="
                            text-[10px]
                            font-bold
                            text-slate-400
                          "
                        >
                          m³
                        </span>

                      </div>

                    </td>

                    {/* STATUS */}
                    <td
                      className="
                        px-5
                        py-3.5
                      "
                    >
                      <StatusBadge
                        status={
                          batch.status
                        }
                      />
                    </td>

                  </motion.tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* ================================================= */}
      {/* FOOTER                                            */}
      {/* ================================================= */}

      {!loading &&
        batches.length > 0 && (
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-100
              bg-slate-50/50
              px-5
              py-2.5
            "
          >

            <p
              className="
                text-[10px]
                font-semibold
                text-slate-400
              "
            >
              Showing latest production records
            </p>

            <span
              className="
                text-[10px]
                font-extrabold
                text-slate-500
              "
            >
              {batches.length}{" "}
              {batches.length === 1
                ? "Batch"
                : "Batches"}
            </span>

          </div>
        )}

    </motion.div>
  );
}