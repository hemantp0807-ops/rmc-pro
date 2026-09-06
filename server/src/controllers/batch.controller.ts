import { Request, Response } from "express";
import * as batchService from "../services/batch.service";

export async function getBatches(
  req: Request,
  res: Response
) {
  try {
    const batches = await batchService.getBatches();

    res.json(batches);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
}


export async function getBatchById(
  req: Request,
  res: Response
) {
  try {
    const batch = await batchService.getBatchById(
      Number(req.params.id)
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json(batch);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch batch",
    });
  }
}


export async function createBatch(
  req: Request,
  res: Response
) {
  try {
    const batch = await batchService.addBatch(
      req.body
    );

    res.status(201).json(batch);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create batch",
    });
  }
}


/* ================================================= */
/* UPDATE BATCH                                      */
/* ================================================= */

export async function updateBatch(
  req: Request,
  res: Response
) {
  try {
    const batchId = Number(req.params.id);

    if (Number.isNaN(batchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await batchService.updateBatchById(
      batchId,
      req.body
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message:
          "Batch not found or cancelled batches cannot be edited",
      });
    }

    res.json({
      success: true,
      message: "Batch updated successfully",
      batch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update batch",
    });
  }
}


export async function deleteBatch(
  req: Request,
  res: Response
) {
  try {
    await batchService.deleteBatch(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete batch",
    });
  }
}


/* Cancel Batch */

export async function cancelBatch(
  req: Request,
  res: Response
) {
  try {
    const batchId = Number(req.params.id);
    const { reason } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const batch = await batchService.cancelBatch(
      batchId,
      reason.trim()
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      message: "Batch cancelled successfully",
      batch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel batch",
    });
  }
}


export async function startProduction(
  req: Request,
  res: Response
) {
  try {
    const batch = await batchService.startProduction(
      Number(req.params.id)
    );

    res.json(batch);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to start production",
    });
  }
}


export async function completeProduction(
  req: Request,
  res: Response
) {
  try {
    const batch = await batchService.completeProduction(
      Number(req.params.id)
    );

    res.json(batch);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to complete production",
    });
  }
}


export async function dispatchBatch(
  req: Request,
  res: Response
) {
  try {
    const batch = await batchService.dispatchBatch(
      Number(req.params.id)
    );

    res.json(batch);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to dispatch batch",
    });
  }
}