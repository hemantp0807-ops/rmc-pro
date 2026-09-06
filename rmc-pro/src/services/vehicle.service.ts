import api from "./api";

export type VehiclePayload = {
  vehicleNo: string;
  capacity: number;
  status: string;
};

export async function getVehicles() {
  const response = await api.get("/vehicles");
  return response.data;
}

export async function createVehicle(data: VehiclePayload) {
  const response = await api.post("/vehicles", data);
  return response.data;
}

export async function updateVehicle(
  id: number,
  data: VehiclePayload
) {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data;
}

export async function deleteVehicle(id: number) {
  await api.delete(`/vehicles/${id}`);
}