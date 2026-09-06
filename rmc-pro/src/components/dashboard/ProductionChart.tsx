import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { motion } from "framer-motion";

import { getDashboardStats } from "../../services/dashboard.service";


type ProductionData = {
  date: string;
  quantity: number;
};


export default function ProductionChart() {

  const [data, setData] = useState<ProductionData[]>([]);


  /* ================================================= */
  /* LOAD PRODUCTION DATA                              */
  /* ================================================= */

  useEffect(() => {
    loadChart();
  }, []);


  async function loadChart() {

    try {

      const stats =
        await getDashboardStats();


      const formatted =
        (stats.dailyProduction || []).map(
          (item: any) => {

            const date =
              new Date(item.date);


            return {
              date:
                date.toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                ),

              quantity:
                Number(item.quantity) || 0,
            };
          }
        );


      setData(formatted);

    } catch (error) {

      console.error(
        "Failed to load production chart:",
        error
      );

    }
  }


  /* ================================================= */
  /* FORMAT QUANTITY                                   */
  /* ================================================= */

  function formatQuantity(
    value: number
  ) {

    return Number(value).toFixed(2);

  }


  /* ================================================= */
  /* CUSTOM TOOLTIP                                   */
  /* ================================================= */

  function CustomTooltip({
    active,
    payload,
    label,
  }: any) {

    if (
      !active ||
      !payload ||
      !payload.length
    ) {
      return null;
    }


    return (
      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-lg
          px-3
          py-2
          shadow-md
        "
      >

        <p className="text-sm font-semibold text-slate-700">
          {label}
        </p>

        <p className="text-sm text-slate-500">
          {formatQuantity(
            Number(payload[0].value)
          )}{" "}
          m³
        </p>

      </div>
    );

  }


  return (

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
        duration: 0.4,
      }}

      className="
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        transition
        p-6
      "
    >

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div
        className="
          flex
          justify-between
          items-start
          mb-2
        "
      >

        <div>

          <h2
            className="
              font-bold
              text-xl
              text-slate-800
            "
          >
            Production Overview
          </h2>


          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            Batch production summary
          </p>

        </div>


        {/* LIVE */}

        <span
          className="
            bg-green-100
            text-green-600
            text-xs
            font-bold
            px-4
            py-2
            rounded-full
          "
        >
          LIVE
        </span>

      </div>


      {/* ================================================= */}
      {/* CHART HEADER                                      */}
      {/* ================================================= */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-1
        "
      >

        <div>

          <h3
            className="
              font-semibold
              text-slate-800
            "
          >
            Daily Production
          </h3>


          <p
            className="
              text-xs
              text-slate-400
              mt-1
            "
          >
            Last 7 Days
          </p>

        </div>


        <span
          className="
            bg-slate-100
            text-blue-600
            font-semibold
            text-sm
            px-3
            py-2
            rounded-xl
          "
        >
          m³
        </span>

      </div>


      {/* ================================================= */}
      {/* BAR CHART                                        */}
      {/* ================================================= */}

      <div className="h-72">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart

            data={data}

            margin={{
              top: 20,
              right: 10,
              left: 5,
              bottom: 5,
            }}

            barCategoryGap="35%"
          >

            <CartesianGrid
              vertical={false}
              strokeDasharray="0"
            />


            <XAxis
              dataKey="date"

              axisLine={{
                stroke: "#CBD5E1",
              }}

              tickLine={false}

              tick={{
                fontSize: 13,
                fill: "#2563EB",
              }}

              dy={5}
            />


            <YAxis

              axisLine={false}

              tickLine={false}

              tick={{
                fontSize: 10,
                fill: "#64748B",
              }}

              tickFormatter={(value) =>
                Number(value).toFixed(0)
              }

              width={30}

              domain={[
                0,
                "auto",
              ]}
            />


            <Tooltip
              cursor={{
                fill: "rgba(37,99,235,0.05)",
              }}
              content={
                <CustomTooltip />
              }
            />


            <Bar

              dataKey="quantity"

              radius={[
                8,
                8,
                0,
                0,
              ]}

              animationDuration={800}

              label={{
                position: "top",
                fontSize: 10,
                fontWeight: 600,
                fill: "#0F172A",

                formatter: (
                  value: any
                ) =>
                  Number(value).toFixed(2),
              }}
            >

             {data.map(
  (_, index) => (

    <Cell
      key={`cell-${index}`}
      fill="#169FDB"
    />

  )
)}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </motion.div>
  );
}