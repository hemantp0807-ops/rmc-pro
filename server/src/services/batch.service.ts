import * as batchRepository from "../repositories/batch.repository";

type BatchReportRow = {
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
};

type BatchData = {
  batchNo: string;

  customerId: number;
  recipeId: number;
  vehicleId: number;
  driverId: number;

  quantity: number;
  cumulativeQty?: number;

  // Editable recipe values
  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;
  slump: number;
  strength: number;

  // Actual values used for this batch
  cementAct: number;
  flyashAct: number;
  sandAct: number;
  mm10Act: number;
  mm20Act: number;
  waterAct: number;
  admixAct: number;

  // Generated Batch Report rows
  reportRows?: BatchReportRow[];

  orderNo: number;
  deliveryNo: number;
  ticketNo: number;

  orderQty: number;
  ticketQty: number;
  orderQtyLeft: number;

  batchDate: string;
  batchTime: string;
  endTime: string;
  status: string;
  typeOfLoading: string;
};


/* ================================================= */
/* GET ALL BATCHES                                   */
/* ================================================= */

export async function getBatches() {
  return await batchRepository.getAllBatches();
}


/* ================================================= */
/* CREATE BATCH                                      */
/* ================================================= */

export async function addBatch(
  data: BatchData
) {
  return await batchRepository.createBatch(
    data
  );
}


/* ================================================= */
/* UPDATE BATCH                                      */
/* ================================================= */

export async function updateBatchById(
  id: number,
  data: BatchData
) {
  return await batchRepository.updateBatch(
    id,
    data
  );
}


/* ================================================= */
/* CANCEL BATCH                                      */
/* ================================================= */

export async function cancelBatch(
  id: number,
  reason: string
) {
  return await batchRepository.cancelBatch(
    id,
    reason
  );
}


/* ================================================= */
/* DELETE BATCH                                      */
/* ================================================= */

export async function deleteBatch(
  id: number
) {
  return await batchRepository.deleteBatch(
    id
  );
}


/* ================================================= */
/* START PRODUCTION                                  */
/* ================================================= */

export async function startProduction(
  id: number
) {
  return await batchRepository.startProduction(
    id
  );
}


/* ================================================= */
/* COMPLETE PRODUCTION                               */
/* ================================================= */

export async function completeProduction(
  id: number
) {
  return await batchRepository.completeProduction(
    id
  );
}


/* ================================================= */
/* DISPATCH BATCH                                    */
/* ================================================= */

export async function dispatchBatch(
  id: number
) {
  return await batchRepository.dispatchBatch(
    id
  );
}


/* ================================================= */
/* GET BATCH BY ID                                   */
/* ================================================= */

export async function getBatchById(
  id: number
) {
  return await batchRepository.getBatchById(
    id
  );
}