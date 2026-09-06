import api from "./api";

export type DriverPayload = {
  driverName: string;
  mobile: string;
  licenseNo: string;
  status: string;
};

export async function getDrivers() {
  const response = await api.get("/drivers");
  return response.data;
}

export async function createDriver(data: DriverPayload) {
  const response = await api.post("/drivers", data);
  return response.data;
}

export async function updateDriver(
  id: number,
  data: DriverPayload
) {
  const response = await api.put(`/drivers/${id}`, data);
  return response.data;
}

export async function deleteDriver(id: number) {
  await api.delete(`/drivers/${id}`);
}