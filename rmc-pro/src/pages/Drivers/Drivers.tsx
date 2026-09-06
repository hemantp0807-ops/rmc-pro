import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  UserRound,
  Phone,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Driver } from "../../types/driver";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";

import DriverModal from "../../components/drivers/DriverModal";
import DriverForm, {
  type DriverFormData,
} from "../../components/drivers/DriverForm";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../../services/driver.service";

import { hasRole } from "../../utils/auth";

export default function Drivers() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [driverList, setDriverList] = useState<Driver[]>([]);

  const [editingDriver, setEditingDriver] =
    useState<Driver | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    setLoading(true);

    try {
      const data = await getDrivers();

      setDriverList(
        data.map((driver: any) => ({
          id: driver.id,
          name: driver.driver_name,
          mobile: driver.mobile,
          licenseNo: driver.license_no,
          status: driver.status,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingDriver(null);
    setOpen(true);
  }

  async function handleSave(data: DriverFormData) {
    try {
      const payload = {
        driverName: data.name,
        mobile: data.mobile,
        licenseNo: data.licenseNo,
        status: data.status,
      };

      if (editingDriver) {
        await updateDriver(editingDriver.id, payload);
        toast.success("Driver updated successfully.");
      } else {
        await createDriver(payload);
        toast.success("Driver added successfully.");
      }

      await loadDrivers();

      setEditingDriver(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save driver.");
    }
  }

  function handleEdit(driver: Driver) {
    setEditingDriver(driver);
    setOpen(true);
  }

  function handleDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (deleteId === null) return;

    try {
      await deleteDriver(deleteId);

      toast.success("Driver deleted successfully.");

      await loadDrivers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete driver.");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  }

  const filteredDrivers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return driverList;

    return driverList.filter(
      (driver) =>
        driver.name.toLowerCase().includes(value) ||
        driver.mobile.includes(value) ||
        driver.licenseNo
          .toLowerCase()
          .includes(value) ||
        driver.status
          .toLowerCase()
          .includes(value)
    );
  }, [search, driverList]);

  return (
    <DashboardLayout>

      {/* ================================================= */}
      {/* PAGE HEADER                                      */}
      {/* ================================================= */}

      <PageHeader
        title="Drivers"
        subtitle="Manage driver records"
        action={
          hasRole("admin", "operator") ? (
            <PrimaryButton
              onClick={handleAdd}
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Add Driver
              </div>
            </PrimaryButton>
          ) : undefined
        }
      />

      {/* ================================================= */}
      {/* LOADING                                           */}
      {/* ================================================= */}

      {loading && (
        <LoadingSpinner text="Loading drivers..." />
      )}

      {/* ================================================= */}
      {/* SEARCH                                            */}
      {/* ================================================= */}

      <div className="mb-6">
        <SearchInput
          placeholder="Search driver..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* ================================================= */}
      {/* DRIVER TABLE                                      */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <DataTable
          headers={[
            "Driver",
            "Mobile",
            "License",
            "Status",
            ...(hasRole("admin", "operator")
              ? ["Actions"]
              : []),
          ]}
        >

          {filteredDrivers.map((driver) => (
            <tr
              key={driver.id}
              className="
                border-b border-slate-100
                last:border-b-0
                hover:bg-slate-50
                transition-colors
                duration-150
              "
            >

              {/* DRIVER */}

              <td className="py-4">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800">
                      {driver.name}
                    </p>

                    <p className="text-xs font-medium text-slate-400">
                      Driver
                    </p>
                  </div>

                </div>

              </td>

              {/* MOBILE */}

              <td>

                <div className="flex items-center gap-2">

                  <Phone
                    size={15}
                    className="text-slate-400"
                  />

                  <span className="font-semibold text-slate-700">
                    {driver.mobile}
                  </span>

                </div>

              </td>

              {/* LICENSE */}

              <td>

                <div className="flex items-center gap-2">

                  <CreditCard
                    size={15}
                    className="text-slate-400"
                  />

                  <span className="font-semibold text-slate-700">
                    {driver.licenseNo}
                  </span>

                </div>

              </td>

              {/* STATUS */}

              <td>
                <StatusBadge
                  status={driver.status}
                />
              </td>

              {/* ACTIONS */}

              {hasRole("admin", "operator") && (
                <td>

                  <div className="flex items-center gap-2">

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        handleEdit(driver)
                      }
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-lg
                        text-blue-600
                        transition-all
                        hover:bg-blue-50
                        hover:text-blue-700
                      "
                      title="Edit"
                    >
                      <Pencil size={17} />
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(driver.id)
                      }
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-lg
                        text-red-600
                        transition-all
                        hover:bg-red-50
                        hover:text-red-700
                      "
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </td>
              )}

            </tr>
          ))}

        </DataTable>

      </div>

      {/* ================================================= */}
      {/* DRIVER MODAL                                     */}
      {/* ================================================= */}

      <DriverModal
        open={open}
        title={
          editingDriver
            ? "Edit Driver"
            : "Add Driver"
        }
        onClose={() => {
          setEditingDriver(null);
          setOpen(false);
        }}
      >

        <DriverForm
          onSave={handleSave}
          initialData={
            editingDriver
              ? {
                  name: editingDriver.name,
                  mobile: editingDriver.mobile,
                  licenseNo:
                    editingDriver.licenseNo,
                  status:
                    editingDriver.status,
                }
              : undefined
          }
        />

      </DriverModal>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION                              */}
      {/* ================================================= */}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Driver"
        message="Are you sure you want to delete this driver?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />

    </DashboardLayout>
  );
}