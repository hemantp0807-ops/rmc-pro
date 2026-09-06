import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

type Props = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: Props) {
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
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        transition
        p-5
        border
        border-slate-100
      "
    >

      <div className="flex justify-between items-center">

        {/* ================================================= */}
        {/* LEFT CONTENT                                      */}
        {/* ================================================= */}

        <div className="min-w-0 flex-1">

          <p
            className="
              text-sm
              text-slate-500
              font-medium
              whitespace-nowrap
            "
          >
            {title}
          </p>


          <h2
            className="
              text-3xl
              font-bold
              text-slate-800
              mt-2
              whitespace-nowrap
              leading-tight
            "
          >
            {value}
          </h2>


          <div
            className="
              flex
              items-center
              gap-1
              mt-2
              text-green-600
              text-sm
            "
          >

            <TrendingUp size={15} />

            <span>
              Active
            </span>

          </div>

        </div>


        {/* ================================================= */}
        {/* ICON                                               */}
        {/* ================================================= */}

        <div
          className="
            w-14
            h-14
            shrink-0
            rounded-2xl
            flex
            items-center
            justify-center
            shadow-lg
            ml-3
          "
          style={{
            background: color,
          }}
        >

          <Icon
            color="white"
            size={27}
          />

        </div>

      </div>

    </motion.div>
  );
}