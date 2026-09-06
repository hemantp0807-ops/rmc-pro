import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  UserRound,
  Phone,
  CreditCard,
  Activity,
  Save,
} from "lucide-react";

export type DriverFormData = {
  name: string;
  mobile: string;
  licenseNo: string;
  status: "Available" | "On Trip" | "On Leave";
};

type Props = {
  onSave: (data: DriverFormData) => void;
  initialData?: DriverFormData;
};

export default function DriverForm({
  onSave,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<DriverFormData>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        mobile: "",
        licenseNo: "",
        status: "Available",
      });
    }
  }, [initialData, reset]);

  function onSubmit(data: DriverFormData) {
    onSave(data);

    if (!initialData) {
      reset({
        name: "",
        mobile: "",
        licenseNo: "",
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
      {/* DRIVER INFORMATION                                */}
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
            <UserRound size={17} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Driver Information
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Enter driver personal and license details
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DRIVER NAME */}
          <div>

            <label className={labelClass}>
              Driver Name
            </label>

            <div className="relative">

              <UserRound
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                {...register("name")}
                placeholder="Enter driver name"
                className={inputClass}
              />

            </div>

          </div>

          {/* MOBILE */}
          <div>

            <label className={labelClass}>
              Mobile Number
            </label>

            <div className="relative">

              <Phone
                size={17}
                className={iconClass}
              />

              <input
                type="tel"
                {...register("mobile")}
                placeholder="9876543210"
                className={inputClass}
              />

            </div>

          </div>

          {/* LICENSE */}
          <div>

            <label className={labelClass}>
              License Number
            </label>

            <div className="relative">

              <CreditCard
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                {...register("licenseNo")}
                placeholder="MH-DL-123456"
                className={inputClass}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* DRIVER STATUS                                     */}
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
              Driver Status
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Set the current driver status
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

                <option value="On Leave">
                  On Leave
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
            ? "Update Driver"
            : "Save Driver"}
        </button>

      </div>

    </form>
  );
}