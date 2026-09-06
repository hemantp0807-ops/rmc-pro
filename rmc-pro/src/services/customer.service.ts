import api from "./api";

export type CustomerPayload = {
  customer: string;
  site: string;

  party_po_no?: string | null;
  party_gst_no?: string | null;
  contact_no?: string | null;
  contact_person?: string | null;
};

export async function getCustomers() {
  const response = await api.get("/customers");
  return response.data;
}

export async function createCustomer(
  data: CustomerPayload
) {
  const response = await api.post(
    "/customers",
    data
  );

  return response.data;
}

export async function updateCustomer(
  id: number,
  data: CustomerPayload
) {
  const response = await api.put(
    `/customers/${id}`,
    data
  );

  return response.data;
}

export async function deleteCustomer(
  id: number
) {
  await api.delete(
    `/customers/${id}`
  );
}