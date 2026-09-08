import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import type { Customer } from "../../types/customer";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";

import CustomerModal from "../../components/customers/CustomerModal";
import CustomerForm, {
  type CustomerFormData,
} from "../../components/customers/CustomerForm";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customer.service";
import { hasRole } from "../../utils/auth";



export default function Customers() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [customerList, setCustomerList] =
    useState<Customer[]>([]);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [deleteCustomerId, setDeleteCustomerId] =
    useState<number | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);

    try {
      const data = await getCustomers();

      setCustomerList(
        data.map((customer: any) => ({
          id: customer.id,
          customer: customer.customer,
          site: customer.site,

          party_po_no: customer.party_po_no ?? null,
          party_gst_no: customer.party_gst_no ?? null,
          contact_no: customer.contact_no ?? null,
          contact_person: customer.contact_person ?? null,

          grade: customer.grade,
          cement: customer.cement,
          flyAsh: customer.flyAsh,
          sand: customer.sand,
          mm10: customer.mm10,
          mm20: customer.mm20,
          water: customer.water,
          admix: customer.admix,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingCustomer(null);
    setOpen(true);
  }

  async function handleSave(data: CustomerFormData) {
    setLoading(true);

    try {
      if (editingCustomer) {
        await updateCustomer(
          editingCustomer.id,
          data
        );

        toast.success(
          "Customer updated successfully."
        );
      } else {
        await createCustomer(data);

        toast.success(
          "Customer added successfully."
        );
      }

      await loadCustomers();

      setEditingCustomer(null);
      setOpen(false);
    } catch (error: any) {
  console.error(error);

  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to save customer.";

  toast.error(message);
} finally {
      setLoading(false);
    }
  }

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer);
    setOpen(true);
  }

  function handleDelete(id: number) {
    setDeleteCustomerId(id);
  }

  async function confirmDelete() {
    if (deleteCustomerId === null) {
      return;
    }

    setLoading(true);

    try {
      await deleteCustomer(deleteCustomerId);

      toast.success(
        "Customer deleted successfully."
      );

      setDeleteCustomerId(null);

      await loadCustomers();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete customer."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return customerList;
    }

    return customerList.filter(
      (customer) =>
        customer.customer
          .toLowerCase()
          .includes(value) ||
        customer.site
          .toLowerCase()
          .includes(value)
    );
  }, [search, customerList]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <PageHeader
        title="Customers"
        subtitle="Manage customer records"
        action={
          hasRole("admin", "operator") ? (
            <PrimaryButton
              onClick={handleAdd}
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Add Customer
              </div>
            </PrimaryButton>
          ) : undefined
        }
      />

      {/* Search */}
      <div className="mb-5">
        <SearchInput
          placeholder="Search customer..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mb-4 text-center text-sm font-semibold text-blue-600">
          Loading...
        </div>
      )}

      {/* Customer Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DataTable
          headers={[
            "Customer",
            "Site",
            "PO No.",
            "GSTIN",
            "Contact No.",
            "Contact Person",
            ...(hasRole("admin", "operator")
              ? ["Actions"]
              : []),
          ]}
        >
          {filteredCustomers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-slate-100 transition hover:bg-slate-50"
            >
              <td className="py-4 font-semibold text-slate-800">
                {customer.customer}
              </td>

              <td className="font-medium text-slate-700">
                {customer.site}
              </td>

              <td className="font-medium text-slate-600">
                {customer.party_po_no ?? "-"}
              </td>

              <td className="font-medium text-slate-600">
                {customer.party_gst_no ?? "-"}
              </td>

              <td className="font-medium text-slate-600">
                {customer.contact_no ?? "-"}
              </td>

              <td className="font-medium text-slate-600">
                {customer.contact_person ?? "-"}
              </td>
              {hasRole("admin", "operator") && (
                <td>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={loading}
                      onClick={() =>
                        handleEdit(customer)
                      }
                      className="rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      disabled={loading}
                      onClick={() =>
                        handleDelete(customer.id)
                      }
                      className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </DataTable>
      </div>

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        open={open}
        title={
          editingCustomer
            ? "Edit Customer"
            : "Add Customer"
        }
        onClose={() => {
          setEditingCustomer(null);
          setOpen(false);
        }}
      >
        <CustomerForm
          onSave={handleSave}
          initialData={
            editingCustomer
              ? {
                customer:
                  editingCustomer.customer,
                site:
                  editingCustomer.site,
                party_po_no:
                  editingCustomer.party_po_no,
                party_gst_no:
                  editingCustomer.party_gst_no,
                contact_no:
                  editingCustomer.contact_no,
                contact_person:
                  editingCustomer.contact_person,
              }
              : undefined
          }
        />
      </CustomerModal>

      {/* Delete Confirmation */}
      {deleteCustomerId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">

            <h2 className="text-xl font-bold text-slate-900">
              Delete Customer?
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              Are you sure you want to delete this
              customer? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteCustomerId(null)
                }
                disabled={loading}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}