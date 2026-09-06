import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import RecentBatchTable from "../../components/dashboard/RecentBatchTable";

import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
  ClipboardList,
  Truck,
  FileText,
  Cuboid,
  BarChart3,
} from "lucide-react";

import { getDashboardStats } from "../../services/dashboard.service";
import { getBatches } from "../../services/batch.service";
import { getCurrentUser } from "../../utils/auth";

/* ================================================= */
/* TYPES                                             */
/* ================================================= */

type ProductionRange =
  | "week"
  | "month"
  | "year";

type DailyProduction = {
  date: string;
  quantity: number;
};

type BatchData = {
  id: number;
  grade?: string;
  batch_date?: string;
  quantity?: number;
  status?: string;

  cement?: number;
  flyash?: number;
  sand?: number;
  mm10?: number;
  mm20?: number;
  water?: number;
  admix?: number;
};

type DashboardStats = {
  /* Today's Summary */
  todaysBatches: number;
  todaysQty: number;
  todaysChallan: number;

  /* Total Summary */
  totalBatches: number;
  totalQty: number;
  totalChallans: number;
  vehicles: number;

  dailyProduction: DailyProduction[];
};

/* ================================================= */
/* MATERIAL TYPE                                     */
/* ================================================= */

type Material = {
  key:
  | "cement"
  | "flyash"
  | "sand"
  | "mm10"
  | "mm20"
  | "water"
  | "admix";

  label: string;
};

/* ================================================= */
/* MATERIALS                                         */
/* ================================================= */

const MATERIALS: Material[] = [
  {
    key: "cement",
    label: "Cement",
  },
  {
    key: "flyash",
    label: "Fly Ash",
  },
  {
    key: "sand",
    label: "Sand",
  },
  {
    key: "mm10",
    label: "10 MM",
  },
  {
    key: "mm20",
    label: "20 MM",
  },
  {
    key: "water",
    label: "Water",
  },
  {
    key: "admix",
    label: "Admix",
  },
];

/* ================================================= */
/* DATE HELPERS                                      */
/* ================================================= */

function getDateOnly(
  date: string | undefined
): string {
  if (!date) return "";

  const value = String(date).trim();

  if (!value) return "";

  if (value.includes("T")) {
    const parsed = new Date(value);

    if (!isNaN(parsed.getTime())) {
      const parts =
        new Intl.DateTimeFormat(
          "en-CA",
          {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        ).formatToParts(parsed);

      const year =
        parts.find(
          (part) =>
            part.type === "year"
        )?.value;

      const month =
        parts.find(
          (part) =>
            part.type === "month"
        )?.value;

      const day =
        parts.find(
          (part) =>
            part.type === "day"
        )?.value;

      if (
        year &&
        month &&
        day
      ) {
        return `${year}-${month}-${day}`;
      }
    }
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return value;
  }

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

function isCancelledBatch(batch: BatchData): boolean {
  const status = String(batch.status || "").trim().toLowerCase();
  return status === "cancelled" || status === "canceled";
}

function formatCompactQuantity(value: number): string {
  const quantity = Number(value) || 0;

  if (quantity >= 1000) {
    return `${(quantity / 1000).toFixed(2)}K`;
  }

  return quantity.toFixed(2);
}

function getTodayDate() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(new Date());
}

function getDateFromParts(
  year: number,
  month: number,
  day: number
) {
  return `${year}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

/* ================================================= */
/* PRODUCTION TREND CHART                            */
/* ================================================= */

function ProductionTrendChart({
  data,
}: {
  data: DailyProduction[];
}) {
  const [range, setRange] =
    useState<ProductionRange>("week");

  const chartData = useMemo(() => {
    const todayString =
      getTodayDate();

    const [
      currentYear,
      currentMonth,
      currentDay,
    ] = todayString
      .split("-")
      .map(Number);

    const today = new Date(
      currentYear,
      currentMonth - 1,
      currentDay
    );

    /* ============================================= */
    /* THIS WEEK                                      */
    /* ============================================= */

    if (range === "week") {
      const day =
        today.getDay();

      const mondayOffset =
        day === 0
          ? -6
          : 1 - day;

      const monday =
        new Date(today);

      monday.setDate(
        today.getDate() +
        mondayOffset
      );

      return Array.from(
        {
          length: 7,
        },
        (_, index) => {
          const date =
            new Date(monday);

          date.setDate(
            monday.getDate() +
            index
          );

          const key =
            getDateFromParts(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate()
            );

          const quantity =
            data
              .filter(
                (item) =>
                  getDateOnly(
                    item.date
                  ) === key
              )
              .reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.quantity
                  ),
                0
              );

          return {
            label:
              date.toLocaleDateString(
                "en-IN",
                {
                  weekday: "short",
                }
              ),
            fullDate: key,
            quantity,
          };
        }
      );
    }

    /* ============================================= */
    /* THIS MONTH                                     */
    /* ============================================= */

    if (range === "month") {
      const daysInMonth =
        new Date(
          currentYear,
          currentMonth,
          0
        ).getDate();

      return Array.from(
        {
          length:
            daysInMonth,
        },
        (_, index) => {
          const day =
            index + 1;

          const key =
            getDateFromParts(
              currentYear,
              currentMonth,
              day
            );

          const quantity =
            data
              .filter(
                (item) =>
                  getDateOnly(
                    item.date
                  ) === key
              )
              .reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.quantity
                  ),
                0
              );

          return {
            label: String(day),
            fullDate: key,
            quantity,
          };
        }
      );
    }

    /* ============================================= */
    /* THIS YEAR                                      */
    /* ============================================= */

    return Array.from(
      {
        length: 12,
      },
      (_, index) => {
        const month =
          index + 1;

        const prefix =
          `${currentYear}-${String(
            month
          ).padStart(2, "0")}`;

        const quantity =
          data
            .filter((item) =>
              getDateOnly(
                item.date
              ).startsWith(prefix)
            )
            .reduce(
              (sum, item) =>
                sum +
                Number(
                  item.quantity
                ),
              0
            );

        return {
          label:
            new Date(
              currentYear,
              index,
              1
            ).toLocaleDateString(
              "en-IN",
              {
                month: "short",
              }
            ),

          fullDate: prefix,

          quantity,
        };
      }
    );
  }, [data, range]);

  const maxValue =
    Math.max(
      ...chartData.map(
        (item) =>
          item.quantity
      ),
      0
    );

  const graphMax =
    maxValue > 0
      ? Math.ceil(
        maxValue / 50
      ) * 50
      : 100;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-4">

        <div className="flex items-center gap-3">

          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 3,
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
          >
            <BarChart3
              size={18}
              strokeWidth={2.4}
            />
          </motion.div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Production Trend
            </h3>

            <p className="text-[10px] font-medium text-slate-400">
              Production quantity
            </p>
          </div>

        </div>

        {/* FILTER */}

        <select
          value={range}
          onChange={(event) =>
            setRange(
              event.target.value as ProductionRange
            )
          }
          className="
            h-9
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            text-[11px]
            font-bold
            text-slate-600
            outline-none
            transition
            hover:border-slate-300
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="week">
            This Week
          </option>

          <option value="month">
            This Month
          </option>

          <option value="year">
            This Year
          </option>
        </select>

      </div>

      {/* GRAPH */}

      <div className="p-5">

        <div className="relative h-[190px]">

          {/* GRID LINES */}

          {[0, 25, 50, 75, 100].map(
            (percentage) => (
              <div
                key={percentage}
                className="absolute left-0 right-0 border-t border-dashed border-slate-100"
                style={{
                  bottom: `${percentage}%`,
                }}
              >
                <span className="absolute -top-2.5 left-0 text-[9px] font-semibold text-slate-400">
                  {Math.round(
                    (graphMax *
                      percentage) /
                    100
                  )}
                </span>
              </div>
            )
          )}

          {/* BARS */}

          <div className="absolute inset-0 flex items-end justify-between gap-1 pl-8">

            {chartData.map(
              (
                item,
                index
              ) => {

                const height =
                  graphMax > 0
                    ? (item.quantity /
                      graphMax) *
                    100
                    : 0;

                return (
                  <motion.div
                    key={`${item.fullDate}-${index}`}
                    initial={{
                      opacity: 0,
                      scaleY: 0,
                    }}
                    animate={{
                      opacity: 1,
                      scaleY: 1,
                    }}
                    transition={{
                      delay:
                        0.15 +
                        index * 0.04,
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                    style={{
                      transformOrigin:
                        "bottom",
                    }}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >

                    <div className="relative flex h-full items-end justify-center">

                      {/* VALUE */}

                      {item.quantity >
                        0 && (
                          <div className="pointer-events-none absolute bottom-[calc(var(--bar-height)+8px)] left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[9px] font-bold text-white shadow-lg group-hover:block">
                            {item.quantity.toFixed(
                              2
                            )}{" "}
                            m³
                          </div>
                        )}

                      {/* BAR */}

                      <motion.div
                        whileHover={{
                          scaleX: 1.12,
                        }}
                        className="
                          w-[55%]
                          min-w-[5px]
                          rounded-t-md
                          bg-blue-500
                          transition-all
                          duration-200
                          group-hover:bg-blue-600
                        "
                        style={
                          {
                            height: `${height}%`,
                            "--bar-height": `${height}%`,
                          } as React.CSSProperties
                        }
                      />

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        </div>

        {/* X AXIS */}

        <div className="mt-2 flex items-center justify-between gap-1 pl-8">

          {chartData.map(
            (
              item,
              index
            ) => (
              <div
                key={`${item.fullDate}-label-${index}`}
                className="flex-1 text-center text-[9px] font-bold text-slate-400"
              >
                {item.label}
              </div>
            )
          )}

        </div>

      </div>

    </motion.div>
  );
}

/* ================================================= */
/* PRODUCTION PIE CHART                              */
/* ================================================= */

function ProductionPieChart({
  batches,
}: {
  batches: BatchData[];
}) {
  const pieData = useMemo(() => {

    const gradeMap =
      new Map<
        string,
        Record<string, number>
      >();

    batches
      .filter((batch) => !isCancelledBatch(batch))
      .forEach((batch) => {

        const grade =
          String(
            batch.grade || ""
          ).trim();

        if (!grade) {
          return;
        }

        if (
          !gradeMap.has(
            grade
          )
        ) {
          gradeMap.set(
            grade,
            {}
          );
        }

        const materialTotals =
          gradeMap.get(
            grade
          )!;

        MATERIALS.forEach(
          (material) => {

            const value =
              Number(
                batch[
                material.key
                ]
              ) || 0;

            materialTotals[
              material.key
            ] =
              (
                materialTotals[
                material.key
                ] || 0
              ) + value;
          }
        );
      }
      );

    return Array.from(
      gradeMap.entries()
    )
      .map(
        ([
          grade,
          materials,
        ]) => {

          let highestMaterial: Material =
            MATERIALS[0];

          MATERIALS.forEach(
            (
              material: Material
            ) => {

              const currentValue =
                Number(
                  materials[
                  material.key
                  ]
                ) || 0;

              const highestValue =
                Number(
                  materials[
                  highestMaterial
                    .key
                  ]
                ) || 0;

              if (
                currentValue >
                highestValue
              ) {
                highestMaterial =
                  material;
              }
            }
          );

          const quantity =
            Number(
              materials[
              highestMaterial.key
              ]
            ) || 0;

          return {
            grade,
            material:
              highestMaterial.label,
            quantity,
          };
        }
      )
      .filter(
        (item) =>
          item.quantity > 0
      )
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      );

  }, [batches]);

  const total =
    pieData.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const colors = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#F97316",
  ];

  let current = 0;

  const gradientParts =
    pieData.map(
      (
        item,
        index
      ) => {

        const start =
          current;

        const percentage =
          total > 0
            ? (item.quantity /
              total) *
            100
            : 0;

        current +=
          percentage;

        return `${colors[
          index %
          colors.length
        ]
          } ${start}% ${current}%`;
      }
    );

  const gradient =
    pieData.length > 0
      ? `conic-gradient(${gradientParts.join(
        ", "
      )})`
      : "#E2E8F0";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: 0.15,
        duration: 0.55,
        ease: "easeOut",
      }}
      className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-4">

        <div className="flex items-center gap-3">

          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: -3,
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500"
          >
            <Cuboid
              size={18}
              strokeWidth={2.4}
            />
          </motion.div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Production by Grade
            </h3>

            <p className="text-[10px] font-medium text-slate-400">
              Highest material for each grade
            </p>
          </div>

        </div>

        <span className="rounded-lg bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-500 shadow-sm">
          m³
        </span>

      </div>

      {/* CONTENT */}

      <div className="flex min-h-[270px] items-center gap-5 p-5">

        {/* DONUT */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
            rotate: -90,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto h-44 w-44 shrink-0"
        >

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                gradient,
            }}
          />

          <div className="absolute inset-[25%] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">

            <span className="text-xl font-black text-slate-900">
              {formatCompactQuantity(total)}
            </span>

            <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-400">
              Total m³
            </span>

          </div>

        </motion.div>

        {/* LEGEND */}

        <div className="min-w-0 flex-1 space-y-3">

          {pieData.length ===
            0 ? (
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-semibold text-slate-400">
                No grade data available.
              </p>
            </div>
          ) : (
            pieData.map(
              (
                item,
                index
              ) => {

                const percentage =
                  total > 0
                    ? (item.quantity /
                      total) *
                    100
                    : 0;

                return (
                  <motion.div
                    key={`${item.grade}-${item.material}`}
                    initial={{
                      opacity: 0,
                      x: 15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        0.45 +
                        index * 0.08,
                      duration: 0.35,
                    }}
                    className="flex items-center justify-between gap-3"
                  >

                    <div className="flex min-w-0 items-center gap-2">

                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            colors[
                            index %
                            colors.length
                            ],
                        }}
                      />

                      <div className="min-w-0">

                        <p className="truncate text-[11px] font-extrabold text-slate-800">
                          {item.grade}
                        </p>

                        <p className="truncate text-[9px] font-semibold text-slate-400">
                          {item.material}
                        </p>

                      </div>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="text-[11px] font-extrabold text-slate-800">
                        {formatCompactQuantity(
                          item.quantity
                        )}
                      </p>

                      <p className="text-[9px] font-bold text-slate-400">
                        {percentage.toFixed(
                          0
                        )}
                        %
                      </p>

                    </div>

                  </motion.div>
                );
              }
            )
          )}

        </div>

      </div>

    </motion.div>
  );
}

/* ================================================= */
/* DASHBOARD                                         */
/* ================================================= */

export default function Dashboard() {

  const [loading, setLoading] =
    useState(false);

  const [stats, setStats] =
    useState<DashboardStats>({
      /* Today's Summary */
      todaysBatches: 0,
      todaysQty: 0,
      todaysChallan: 0,

      /* Total Summary */
      totalBatches: 0,
      totalQty: 0,
      totalChallans: 0,
      vehicles: 0,

      dailyProduction: [],
    });

  const [batches, setBatches] =
    useState<BatchData[]>([]);

  /* ================================================= */
  /* LOAD DASHBOARD                                    */
  /* ================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    setLoading(true);

    try {

      const [
        dashboardData,
        batchData,
      ] = await Promise.all([
        getDashboardStats(),
        getBatches(),
      ]);

      /* ============================================= */
      /* NORMALIZE BATCH DATA                           */
      /* ============================================= */

      const normalizedBatches: BatchData[] =
        Array.isArray(batchData)
          ? batchData.map(
            (batch: any) => ({
              id:
                Number(
                  batch.id
                ) || 0,

              grade:
                batch.grade ||
                "",

              batch_date:
                batch.batch_date ||
                "",

              quantity:
                Number(
                  batch.quantity
                ) || 0,

              status:
                batch.status ||
                "",

              cement:
                Number(
                  batch.cement
                ) || 0,

              flyash:
                Number(
                  batch.flyash
                ) || 0,

              sand:
                Number(
                  batch.sand
                ) || 0,

              mm10:
                Number(
                  batch.mm10
                ) || 0,

              mm20:
                Number(
                  batch.mm20
                ) || 0,

              water:
                Number(
                  batch.water
                ) || 0,

              admix:
                Number(
                  batch.admix
                ) || 0,
            })
          )
          : [];

      /* ============================================= */
      /* EXCLUDE CANCELLED BATCHES                     */
      /* ============================================= */

      const activeBatches =
        normalizedBatches.filter(
          (batch) => !isCancelledBatch(batch)
        );

      const today = getTodayDate();

      const todaysBatchList =
        activeBatches.filter(
          (batch) =>
            getDateOnly(batch.batch_date) ===
            today
        );

      const todaysQty =
        todaysBatchList.reduce(
          (sum, batch) =>
            sum + Number(batch.quantity || 0),
          0
        );

      const totalQty =
        activeBatches.reduce(
          (sum, batch) =>
            sum + Number(batch.quantity || 0),
          0
        );

      /* ============================================= */
      /* DAILY PRODUCTION WITHOUT CANCELLED BATCHES    */
      /* ============================================= */

      const productionMap =
        new Map<string, number>();

      activeBatches.forEach((batch) => {
        const date = getDateOnly(
          batch.batch_date
        );

        if (!date) return;

        productionMap.set(
          date,
          (productionMap.get(date) || 0) +
          Number(batch.quantity || 0)
        );
      });

      const dailyProduction: DailyProduction[] =
        Array.from(productionMap.entries())
          .sort(([a], [b]) =>
            a.localeCompare(b)
          )
          .map(([date, quantity]) => ({
            date,
            quantity,
          }));

      /* ============================================= */
      /* DASHBOARD STATS                               */
      /* ============================================= */

      setStats({
        todaysBatches:
          todaysBatchList.length,

        todaysQty,

        todaysChallan:
          todaysBatchList.length,

        totalBatches:
          activeBatches.length,

        totalQty,

        totalChallans:
          activeBatches.length,

        vehicles:
          Number(
            dashboardData.vehicles
          ) || 0,

        dailyProduction,
      });

      /* ============================================= */
      /* BATCH DATA FOR PIE CHART                      */
      /* ============================================= */

      setBatches(normalizedBatches);

    } catch (error) {

      console.error(
        "Failed to load dashboard:",
        error
      );

      toast.error(
        "Failed to load dashboard."
      );

    } finally {

      setLoading(false);

    }
  }

  /* ================================================= */
  /* ANIMATION VARIANTS                                */
  /* ================================================= */

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.55,
        ease: "easeOut" as const,
      },
    },
  };

  const cardContainer = {
    hidden: {},

    visible: {
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.12,
      },
    },
  };

  const cardItem = {
    hidden: {
      opacity: 0,
      y: 22,
      scale: 0.97,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,

      transition: {
        duration: 0.45,
        ease: "easeOut" as const,
      },
    },
  };

  /* ================================================= */
  /* UI                                                */
  /* ================================================= */

  return (
    <DashboardLayout>

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.35,
        }}
        className="min-h-full bg-slate-50/70 pb-8"
      >

        {/* ================================================= */}
        {/* HERO                                              */}
        {/* ================================================= */}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          {/* Background */}

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-blue-50/50" />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-100/40"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.5,
              duration: 0.8,
            }}
            className="absolute -bottom-32 right-[35%] h-64 w-64 rounded-full bg-amber-100/30"
          />

          <div className="relative grid min-h-[230px] grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">

            {/* LEFT CONTENT */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="relative z-30 flex flex-col justify-center px-6 py-8 lg:px-8"
            >

              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
  Welcome back, {getCurrentUser()?.username || "User"} 👋
</p>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.45,
                  duration: 0.45,
                }}
                className="mt-2 text-3xl font-black tracking-tight text-slate-900 lg:text-[34px]"
              >
                Manage Your RMC Plant
              </motion.h1>

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                  duration: 0.45,
                }}
                className="mt-1 text-xl font-black text-amber-500"
              >
                Smartly & Efficiently
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.65,
                  duration: 0.45,
                }}
                className="mt-2 max-w-md text-xs font-medium leading-5 text-slate-500"
              >
                Real-time overview of your plant
                operations, deliveries, production,
                inventory and more.
              </motion.p>

            </motion.div>

            {/* RMC PLANT IMAGE */}

            <motion.div
              initial={{
                opacity: 0,
                x: 35,
                scale: 1.04,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.35,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative min-h-[230px] overflow-hidden"
            >

              <img
                src="/rmc-plant-hero.png"
                alt="RMC Plant"
                className="
                absolute
                bottom-[-25px]
                right-[-5px]
                z-10
                h-[300px]
                max-w-none
                object-right-bottom
              "
              />

              {/* IMAGE FADE */}

              <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-48 bg-gradient-to-r from-white via-white/80 to-transparent" />

            </motion.div>

          </div>

        </motion.section>


        {/* ================================================= */}
        {/* LOADING                                           */}
        {/* ================================================= */}

        {loading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-4"
          >
            <LoadingSpinner
              text="Loading dashboard..."
            />
          </motion.div>
        )}


        {/* ================================================= */}
        {/* TODAY'S SUMMARY                                   */}
        {/* ================================================= */}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.25,
          }}
          className="mt-5"
        >

          <div className="mb-3 flex items-end justify-between">

            <div>
              <h2 className="text-sm font-black text-slate-900">
                Today's Summary
              </h2>

              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Current plant activity
              </p>
            </div>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-extrabold uppercase tracking-wide text-slate-500">
              Today
            </span>

          </div>


          <motion.div
            variants={cardContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >

            {/* Today's Batch */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Today's Batch"
                value={String(
                  stats.todaysBatches
                )}
                icon={ClipboardList}
                color="#3B82F6"
              />
            </motion.div>


            {/* Today's Qty */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Today's Qty"
                value={`${stats.todaysQty.toFixed(
                  2
                )} m³`}
                icon={Cuboid}
                color="#10B981"
              />
            </motion.div>


            {/* Today's Challan */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-violet-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Today's Challan"
                value={String(
                  stats.todaysChallan
                )}
                icon={FileText}
                color="#8B5CF6"
              />
            </motion.div>

          </motion.div>

        </motion.section>


        {/* ================================================= */}
        {/* OVERALL SUMMARY                                   */}
        {/* ================================================= */}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.4,
          }}
          className="mt-5"
        >

          <div className="mb-3">

            <h2 className="text-sm font-black text-slate-900">
              Overall Summary
            </h2>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Complete plant production information
            </p>

          </div>


          <motion.div
            variants={cardContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 xl:grid-cols-4"
          >

            {/* Total Batches */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-indigo-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Total Batches"
                value={String(
                  stats.totalBatches
                )}
                icon={ClipboardList}
                color="#6366F1"
              />
            </motion.div>


            {/* Total Qty */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-teal-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Total Qty"
                value={
                  stats.totalQty >= 1000
                    ? `${(
                      stats.totalQty /
                      1000
                    ).toFixed(
                      2
                    )}K m³`
                    : `${stats.totalQty.toFixed(
                      2
                    )} m³`
                }
                icon={Cuboid}
                color="#14B8A6"
              />
            </motion.div>


            {/* Total Challans */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Total Challans"
                value={String(
                  stats.totalChallans
                )}
                icon={FileText}
                color="#A855F7"
              />
            </motion.div>


            {/* Vehicles */}

            <motion.div
              variants={cardItem}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <StatCard
                title="Vehicles"
                value={String(
                  stats.vehicles
                )}
                icon={Truck}
                color="#F59E0B"
              />
            </motion.div>

          </motion.div>

        </motion.section>


        {/* ================================================= */}
        {/* PRODUCTION                                        */}
        {/* ================================================= */}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.55,
          }}
          className="mt-6"
        >

          <div className="mb-3">

            <h2 className="text-sm font-black text-slate-900">
              Production
            </h2>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Production trend and grade-wise material distribution
            </p>

          </div>


          {/* GRAPH + PIE SIDE BY SIDE */}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">

            {/* PRODUCTION GRAPH */}

            <ProductionTrendChart
              data={
                stats.dailyProduction
              }
            />


            {/* PRODUCTION PIE */}

            <ProductionPieChart
              batches={batches}
            />

          </div>

        </motion.section>


        {/* ================================================= */}
        {/* RECENT BATCHES                                    */}
        {/* ================================================= */}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.7,
          }}
          className="mt-6"
        >

          <div className="mb-3">

            <h2 className="text-sm font-black text-slate-900">
              Recent Batches
            </h2>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Latest production records
            </p>

          </div>


          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.85,
              duration: 0.5,
            }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
            </div>

            <div className="p-1">
              <RecentBatchTable />
            </div>

          </motion.div>

        </motion.section>

      </motion.div>

    </DashboardLayout>
  );
}