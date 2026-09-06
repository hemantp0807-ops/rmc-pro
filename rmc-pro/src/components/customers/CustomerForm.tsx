import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  FileText,
  ReceiptText,
  Phone,
  UserRound,
  Save,
} from "lucide-react";

export type CustomerFormData = {
  customer: string;
  site: string;
  party_po_no?: string | null;
  party_gst_no?: string | null;
  contact_no?: string | null;
  contact_person?: string | null;
};

type CustomerFormProps = {
  onSave: (data: CustomerFormData) => void;
  initialData?: CustomerFormData;
};

export default function CustomerForm({
  onSave,
  initialData,
}: CustomerFormProps) {
  const [form, setForm] = useState<CustomerFormData>({
    customer: "",
    site: "",
    party_po_no: "",
    party_gst_no: "",
    contact_no: "",
    contact_person: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        customer: initialData.customer ?? "",
        site: initialData.site ?? "",
        party_po_no:
          initialData.party_po_no ?? "",
        party_gst_no:
          initialData.party_gst_no ?? "",
        contact_no:
          initialData.contact_no ?? "",
        contact_person:
          initialData.contact_person ?? "",
      });
    } else {
      setForm({
        customer: "",
        site: "",
        party_po_no: "",
        party_gst_no: "",
        contact_no: "",
        contact_person: "",
      });
    }
  }, [initialData]);

  function updateField(
    field: keyof CustomerFormData,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.customer.trim()) {
      return;
    }

    if (!form.site.trim()) {
      return;
    }

    onSave({
      customer: form.customer.trim(),
      site: form.site.trim(),
      party_po_no:
        form.party_po_no?.trim() || null,
      party_gst_no:
        form.party_gst_no?.trim() || null,
      contact_no:
        form.contact_no?.trim() || null,
      contact_person:
        form.contact_person?.trim() || null,
    });
  }

  /* ================================================= */
  /* INPUT STYLE                                       */
  /* ================================================= */

  const inputClass =
    "w-full h-10 rounded-lg border border-slate-300 " +
    "bg-white pl-10 pr-3 text-sm font-semibold " +
    "text-slate-800 placeholder:text-slate-400 " +
    "outline-none transition-all duration-200 " +
    "hover:border-slate-400 " +
    "focus:border-blue-500 focus:ring-2 " +
    "focus:ring-blue-100";

  const labelClass =
    "block text-sm font-bold text-slate-800 mb-1.5";

  const iconClass =
    "pointer-events-none absolute left-3 top-1/2 " +
    "-translate-y-1/2 text-slate-400";

  return (
    <form
      onSubmit={handleSubmit}
      className="px-6 pt-3 pb-6"
    >
      {/* ================================================= */}
      {/* CUSTOMER INFORMATION                              */}
      {/* ================================================= */}

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Building2 size={17} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Customer Information
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Enter the basic customer details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* CUSTOMER */}
          <div>
            <label className={labelClass}>
              Customer Name
            </label>

            <div className="relative">
              <Building2
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                value={form.customer}
                onChange={(e) =>
                  updateField(
                    "customer",
                    e.target.value
                  )
                }
                placeholder="Enter customer name"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* SITE */}
          <div>
            <label className={labelClass}>
              Site
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                value={form.site}
                onChange={(e) =>
                  updateField(
                    "site",
                    e.target.value
                  )
                }
                placeholder="Enter site location"
                className={inputClass}
                required
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* DOCUMENT INFORMATION                              */}
      {/* ================================================= */}

      <div className="border-t border-slate-100 pt-5 mb-5">

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText size={17} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Business Information
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Add PO and GST details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* PO NUMBER */}
          <div>
            <label className={labelClass}>
              Party PO No.
            </label>

            <div className="relative">
              <FileText
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                value={
                  form.party_po_no ?? ""
                }
                onChange={(e) =>
                  updateField(
                    "party_po_no",
                    e.target.value
                  )
                }
                placeholder="Enter PO number"
                className={inputClass}
              />
            </div>
          </div>

          {/* GSTIN */}
          <div>
            <label className={labelClass}>
              GSTIN
            </label>

            <div className="relative">
              <ReceiptText
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                value={
                  form.party_gst_no ?? ""
                }
                onChange={(e) =>
                  updateField(
                    "party_gst_no",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="Enter GSTIN"
                className={inputClass}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* CONTACT INFORMATION                               */}
      {/* ================================================= */}

      <div className="border-t border-slate-100 pt-5">

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Phone size={17} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Contact Information
            </h3>

            <p className="text-xs font-medium text-slate-500">
              Add the primary contact details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* CONTACT PERSON */}
          <div>
            <label className={labelClass}>
              Contact Person
            </label>

            <div className="relative">
              <UserRound
                size={17}
                className={iconClass}
              />

              <input
                type="text"
                value={
                  form.contact_person ?? ""
                }
                onChange={(e) =>
                  updateField(
                    "contact_person",
                    e.target.value
                  )
                }
                placeholder="Enter contact person"
                className={inputClass}
              />
            </div>
          </div>

          {/* CONTACT NUMBER */}
          <div>
            <label className={labelClass}>
              Contact No.
            </label>

            <div className="relative">
              <Phone
                size={17}
                className={iconClass}
              />

              <input
                type="tel"
                value={
                  form.contact_no ?? ""
                }
                onChange={(e) =>
                  updateField(
                    "contact_no",
                    e.target.value
                  )
                }
                placeholder="Enter contact number"
                className={inputClass}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* SAVE BUTTON                                       */}
      {/* ================================================= */}

      <div className="flex justify-end mt-6 pt-5 border-t border-slate-100">

        <button
          type="submit"
          className="
            inline-flex items-center justify-center
            gap-2 rounded-lg
            bg-blue-600 px-5 py-2.5
            text-sm font-bold text-white
            shadow-sm
            transition-all duration-200
            hover:bg-blue-700
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          <Save size={17} />

          {initialData
            ? "Update Customer"
            : "Save Customer"}
        </button>

      </div>
    </form>
  );
}