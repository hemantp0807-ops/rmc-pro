import api from "./api";

export type BatchPayload = {
  batchNo: string;

  customerId: number;

  recipeId: number;

  vehicleId: number;

  driverId: number;

  quantity: number;

  orderNo: number;

  deliveryNo: number;

  ticketNo: number;

  orderQty: number;

  ticketQty: number;

  orderQtyLeft: number;

  batchDate: string;

  batchTime: string;
  
  // Recipe values actually used for this batch
  cement: number;

  flyash: number;

  sand: number;

  mm10: number;

  mm20: number;

  water: number;

  admix: number;

  slump: number;

  strength: number;
  cementAct: number;
flyashAct: number;
sandAct: number;
mm10Act: number;
mm20Act: number;
waterAct: number;
admixAct: number;
reportRows?: {
  batch_size: number;

  cement_set: number;
  cement_act: number;

  flyash_set: number;
  flyash_act: number;

  sand_set: number;
  sand_act: number;

  mm10_set: number;
  mm10_act: number;

  mm20_set: number;
  mm20_act: number;

  water_set: number;
  water_act: number;

  admix_set: number;
  admix_act: number;
}[];
  status: string;
  cancel_reason?: string;
  typeOfLoading: string;
};

export async function getBatches() {
  const response = await api.get("/batches");

  return response.data;
}

export async function getBatchById(
  id: number
) {
  const response = await api.get(
    `/batches/${id}`
  );

  return response.data;
}

export async function createBatch(
  data: BatchPayload
) {
  const response = await api.post(
    "/batches",
    data
  );

  return response.data;
}

export async function deleteBatch(
  id: number
) {
  const response = await api.delete(
    `/batches/${id}`
  );

  return response.data;
}

export async function cancelBatch(
  id: number,
  reason: string
) {
  const response = await api.patch(
    `/batches/${id}/cancel`,
    { reason }
  );

  return response.data;
}
export async function updateBatch(
  id: number,
  data: any
) {
  const response = await api.patch(
    `/batches/${id}`,
    data
  );

  return response.data;
}