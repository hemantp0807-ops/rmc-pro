
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Factory,
  Users,
  Truck,
  UserRound,
  ClipboardList,
  ArrowUpRight,
  Boxes,
  
} from "lucide-react";

export default function Reports() {
  const navigate = useNavigate();

  const reports = [
    {
      id: "01",
      title: "Batch Reports",
      description: "Access and print previously generated batch reports.",
      icon: ClipboardList,
      path: "/reports/batch-reports",
      tag: "BATCH",
    },
    {
      id: "02",
      title: "Delivery Challan",
      description: "View delivery challans, quantities and dispatch details.",
      icon: FileText,
      path: "/reports/batch",
      tag: "DELIVERY",
    },
    {
      id: "03",
      title: "Production",
      description: "Track production history and batch-wise quantities.",
      icon: Factory,
      path: "/reports/production",
      tag: "PRODUCTION",
    },
    {
      id: "04",
      title: "Customer",
      description: "Analyze customer-wise production and deliveries.",
      icon: Users,
      path: "/reports/customers",
      tag: "CUSTOMER",
    },
    {
      id: "05",
      title: "Vehicle",
      description: "View vehicle utilization and transportation activity.",
      icon: Truck,
      path: "/reports/vehicles",
      tag: "TRANSPORT",
    },
    {
      id: "06",
      title: "Driver",
      description: "Review driver activity and assigned batch records.",
      icon: UserRound,
      path: "/reports/drivers",
      tag: "DRIVER",
    },
  ];

  const openReport = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Reports and Analytics"
        subtitle="Generate and access your RMC reports"
      />

      <div className="px-1 pb-8">

       


        {/* ================================================= */}
        {/* SECTION HEADER                                    */}
        {/* ================================================= */}

        <div className="mt-7 mb-4 flex items-center justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Boxes size={18} className="text-blue-600" />

              <h2 className="text-lg font-extrabold text-slate-900">
                Report Modules
              </h2>
            </div>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Select a module to view detailed records
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[11px] font-bold text-slate-600">
              System Ready
            </span>
          </div>

        </div>


        {/* ================================================= */}
        {/* REPORT GRID                                       */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {reports.map((report, index) => {
            const Icon = report.icon;

            return (
              <button
                key={report.title}
                type="button"
                onClick={() => openReport(report.path)}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  p-5
                  text-left
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-lg
                "
              >

                {/* Top line */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-slate-100 transition-all duration-200 group-hover:bg-blue-600" />


                {/* Header */}
                <div className="flex items-start justify-between">

                  {/* Logo / Icon */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200">
                    <Icon size={27} strokeWidth={2} />

                    {/* Small badge */}
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-md border-2 border-white bg-slate-800 text-[8px] font-extrabold text-white group-hover:bg-blue-700">
                      {index + 1}
                    </span>
                  </div>


                  {/* Module number */}
                  <span className="text-3xl font-black text-slate-100 transition-colors group-hover:text-blue-50">
                    {report.id}
                  </span>

                </div>


                {/* Content */}
                <div className="mt-5">

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold tracking-[0.16em] text-blue-600">
                      {report.tag}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                    <span className="text-[9px] font-bold text-slate-400">
                      REPORT
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                    {report.title}
                  </h3>

                  <p className="mt-2 min-h-[42px] text-xs font-medium leading-5 text-slate-500">
                    {report.description}
                  </p>

                </div>


                {/* Bottom action */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                  <span className="text-xs font-bold text-slate-500 transition-colors group-hover:text-blue-600">
                    Open Report
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>

                </div>

              </button>
            );
          })}

        </div>

          

        

      </div>
    </DashboardLayout>
  );
}