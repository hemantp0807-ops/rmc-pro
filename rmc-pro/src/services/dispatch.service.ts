import api from "./api";

export async function dispatchBatch(id: number) {
  const response = await api.patch(`/batches/${id}/dispatch`);
  return response.data;
}