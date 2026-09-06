import api from "./api";

export async function startProduction(id: number) {
  const response = await api.patch(`/batches/${id}/start`);
  return response.data;
}

export async function completeProduction(id: number) {
  const response = await api.patch(`/batches/${id}/complete`);
  return response.data;
}