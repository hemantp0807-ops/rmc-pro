import * as customerRepository from "../repositories/customer.repository";

type CustomerData = {
  customer: string;
  site: string;

  party_po_no?: string | null;
  party_gst_no?: string | null;
  contact_no?: string | null;
  contact_person?: string | null;
};

export async function getCustomers() {
  return await customerRepository.getAllCustomers();
}

export async function addCustomer(data: CustomerData) {
  return await customerRepository.createCustomer(data);
}

export async function updateCustomer(
  id: number,
  data: CustomerData
) {
  return await customerRepository.updateCustomer(id, data);
}

export async function deleteCustomer(id: number) {
  return await customerRepository.deleteCustomer(id);
}