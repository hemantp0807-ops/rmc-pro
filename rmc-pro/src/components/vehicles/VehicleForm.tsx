import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Truck,
  Gauge,
  Activity,
  Save,
} from "lucide-react";

export type VehicleFormData = {
  vehicleNo: string;
  capacity: number;
  status: "Available" | "On Trip" | "Maintenance";
};

type Props = {
  onSave: (data: VehicleFormData) => void;
  initialData?: VehicleFormData;
};

export default function VehicleForm({
  onSave,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<VehicleFormData>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        vehicleNo: "",
        capacity: 6,
        status: "Available",
      });
    }
  }, [initialData, reset]);

  function onSubmit(data: VehicleFormData) {
    onSave(data);

    if (!initialData) {
      reset({
        vehicleNo: "",
        capacity: 6,
        status: "Available",
      });
    }
  }

  /* ================================================= */
  /* COMMON STYLES                                     */
  /* ================================================= */

  const inputClass =
    "w-full h-10 rounded-lg " +
    "border border-slate-300 " +
    "bg-white pl-10 pr-3 " +
    "text-sm font-semibold text-slate-800 " +
    "placeholder:text-slate-400 " +
    "outline-none transition-all duration-200 " +
    "hover:border-slate-400 " +
    "focus:border-blue-500 " +
    "focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "block text-sm font-bold text-slate-800 mb-1.5";

  const iconClass =
    "pointer-events-none absolute " +
    "left-3 top-1/2 -translate-y-1/2 " +
    "text-slate-400";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 pt-3 pb-6"
    >

      {/* ================================================= */}
      {/* VEHICLE INFORMATION                               */}
      {/* ================================================= */}

      <div className="mb-5">

        <div className="flex items-center gap-2 mb-4">

          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              bg-blue-50
              text-blue-600
            "
          >
            <Truck size={17} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Vehicle Information
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Enter vehicle details
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* VEHICLE NUMBER */}
          <div>

            <label className={labelClass}>
              Vehicle Number
            </label>

            <div className="relative">

              <Truck
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                {...register("vehicleNo")}
                placeholder="MH15AB1234"
                className={inputClass}
              />

            </div>

          </div>

          {/* CAPACITY */}
          <div>

            <label className={labelClass}>
              Capacity (m³)
            </label>

            <div className="relative">

              <Gauge
                size={17}
                className={iconClass}
              />

              <input
                type="number"
                step="0.1"
                min="0"
                {...register("capacity", {
                  valueAsNumber: true,
                })}
                placeholder="Enter capacity"
                className={inputClass}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* STATUS                                            */}
      {/* ================================================= */}

      <div className="border-t border-slate-100 pt-5">

        <div className="flex items-center gap-2 mb-4">

          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              bg-blue-50
              text-blue-600
            "
          >
            <Activity size={17} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Vehicle Status
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Set the current vehicle status
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* STATUS */}
          <div>

            <label className={labelClass}>
              Status
            </label>

            <div className="relative">

              <Activity
                size={17}
                className={iconClass}
              />

              <select
                {...register("status")}
                className={inputClass}
              >
                <option value="Available">
                  Available
                </option>

                <option value="On Trip">
                  On Trip
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>
              </select>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SAVE BUTTON                                       */}
      {/* ================================================= */}

      <div
        className="
          flex justify-end
          mt-6 pt-5
          border-t border-slate-100
        "
      >

        <button
          type="submit"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-5 py-2.5
            text-sm font-bold
            text-white
            shadow-sm
            transition-all duration-200
            hover:bg-blue-700
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          <Save size={17} />

          {initialData
            ? "Update Vehicle"
            : "Save Vehicle"}
        </button>

      </div>

    </form>
  );
}