import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Vehicle } from "../../types/vehicle";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";

import VehicleModal from "../../components/vehicles/VehicleModal";
import VehicleForm, {
  type VehicleFormData,
} from "../../components/vehicles/VehicleForm";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicle.service";

import { hasRole } from "../../utils/auth";

export default function Vehicles() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [vehicleList, setVehicleList] =
    useState<Vehicle[]>([]);

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    setLoading(true);

    try {
      const data = await getVehicles();

      setVehicleList(
        data.map((vehicle: any) => ({
          id: vehicle.id,
          vehicleNo: vehicle.vehicle_no,
          capacity: Number(vehicle.capacity),
          status: vehicle.status,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingVehicle(null);
    setOpen(true);
  }

  async function handleSave(
    data: VehicleFormData
  ) {
    try {
      if (editingVehicle) {
        await updateVehicle(
          editingVehicle.id,
          data
        );

        toast.success(
          "Vehicle updated successfully."
        );
      } else {
        await createVehicle(data);

        toast.success(
          "Vehicle added successfully."
        );
      }

      await loadVehicles();

      setEditingVehicle(null);
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save vehicle."
      );
    }
  }

  function handleEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setOpen(true);
  }

  function handleDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (deleteId === null) return;

    try {
      await deleteVehicle(deleteId);

      toast.success(
        "Vehicle deleted successfully."
      );

      await loadVehicles();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete vehicle."
      );
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  }

  const filteredVehicles = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return vehicleList;
    }

    return vehicleList.filter(
      (vehicle) =>
        vehicle.vehicleNo
          .toLowerCase()
          .includes(value) ||
        vehicle.status
          .toLowerCase()
          .includes(value)
    );
  }, [search, vehicleList]);

  return (
    <DashboardLayout>

      {/* ================================================= */}
      {/* PAGE HEADER                                       */}
      {/* ================================================= */}

      <PageHeader
        title="Vehicles"
        subtitle="Manage vehicle records"
        action={
          hasRole("admin", "operator") ? (
            <PrimaryButton
              onClick={handleAdd}
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Add Vehicle
              </div>
            </PrimaryButton>
          ) : undefined
        }
      />

      {/* ================================================= */}
      {/* LOADING                                           */}
      {/* ================================================= */}

      {loading && (
        <LoadingSpinner
          text="Loading vehicles..."
        />
      )}

      {/* ================================================= */}
      {/* SEARCH                                            */}
      {/* ================================================= */}

      <div className="mb-5">
        <SearchInput
          placeholder="Search vehicle..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* ================================================= */}
      {/* VEHICLE TABLE                                     */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <DataTable
          headers={[
            "Vehicle No",
            "Capacity",
            "Status",
            ...(hasRole("admin", "operator")
              ? ["Actions"]
              : []),
          ]}
        >

          {filteredVehicles.map(
            (vehicle) => (
              <tr
                key={vehicle.id}
                className="
                  border-b border-slate-100
                  transition-colors
                  hover:bg-slate-50
                "
              >

                {/* VEHICLE NUMBER */}

                <td className="py-4">
                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                      "
                    >
                      <Truck size={18} />
                    </div>

                    <span className="font-bold text-slate-800">
                      {vehicle.vehicleNo}
                    </span>

                  </div>
                </td>

                {/* CAPACITY */}

                <td>
                  <span className="font-semibold text-slate-700">
                    {vehicle.capacity} m³
                  </span>
                </td>

                {/* STATUS */}

                <td>
                  <StatusBadge
                    status={vehicle.status}
                  />
                </td>

                {/* ACTIONS */}

                {hasRole("admin", "operator") && (
                  <td>
                    <div className="flex items-center gap-2">

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          handleEdit(vehicle)
                        }
                        disabled={loading}
                        className="
                          rounded-lg
                          p-2
                          text-blue-600
                          transition-all
                          hover:bg-blue-50
                          hover:text-blue-800
                          disabled:opacity-50
                        "
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(vehicle.id)
                        }
                        disabled={loading}
                        className="
                          rounded-lg
                          p-2
                          text-red-600
                          transition-all
                          hover:bg-red-50
                          hover:text-red-800
                          disabled:opacity-50
                        "
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>
                )}

              </tr>
            )
          )}

        </DataTable>

      </div>

      {/* ================================================= */}
      {/* ADD / EDIT VEHICLE                                */}
      {/* ================================================= */}

      <VehicleModal
        open={open}
        title={
          editingVehicle
            ? "Edit Vehicle"
            : "Add Vehicle"
        }
        onClose={() => {
          setEditingVehicle(null);
          setOpen(false);
        }}
      >
        <VehicleForm
          onSave={handleSave}
          initialData={
            editingVehicle
              ? {
                  vehicleNo:
                    editingVehicle.vehicleNo,
                  capacity:
                    editingVehicle.capacity,
                  status:
                    editingVehicle.status,
                }
              : undefined
          }
        />
      </VehicleModal>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION                               */}
      {/* ================================================= */}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle?"
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