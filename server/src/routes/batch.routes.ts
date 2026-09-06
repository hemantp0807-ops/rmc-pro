import { Router } from "express";

import {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  cancelBatch,
  startProduction,
  completeProduction,
  dispatchBatch,
} from "../controllers/batch.controller";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

/* ================================================= */
/* VIEW BATCHES                                      */
/* All authenticated roles                            */
/* ================================================= */

router.get(
  "/",
  authenticateToken,
  getBatches
);

router.get(
  "/:id",
  authenticateToken,
  getBatchById
);


/* ================================================= */
/* CREATE BATCH                                      */
/* Admin + Operator                                  */
/* ================================================= */

router.post(
  "/",
  authenticateToken,
  requireRole("admin", "operator"),
  createBatch
);


/* ================================================= */
/* EDIT BATCH                                        */
/* Admin + Operator                                  */
/* ================================================= */

router.patch(
  "/:id",
  authenticateToken,
  requireRole("admin", "operator"),
  updateBatch
);


/* ================================================= */
/* DELETE BATCH                                      */
/* Admin only                                        */
/* ================================================= */

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  deleteBatch
);


/* ================================================= */
/* CANCEL BATCH                                      */
/* Admin + Operator                                  */
/* ================================================= */

router.patch(
  "/:id/cancel",
  authenticateToken,
  requireRole("admin", "operator"),
  cancelBatch
);


/* ================================================= */
/* PRODUCTION ACTIONS                                */
/* Admin + Operator                                  */
/* ================================================= */

router.patch(
  "/:id/start",
  authenticateToken,
  requireRole("admin", "operator"),
  startProduction
);

router.patch(
  "/:id/complete",
  authenticateToken,
  requireRole("admin", "operator"),
  completeProduction
);

router.patch(
  "/:id/dispatch",
  authenticateToken,
  requireRole("admin", "operator"),
  dispatchBatch
);

export default router;