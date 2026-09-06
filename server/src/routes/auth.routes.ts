import { Router } from "express";

import {
  login,
  changePassword,
  changeUserPassword,
} from "../controllers/auth.controller";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

/* ================================================= */
/* LOGIN                                             */
/* ================================================= */

router.post("/login", login);

/* ================================================= */
/* CHANGE OWN PASSWORD                              */
/* All logged-in users                               */
/* ================================================= */

router.patch(
  "/password",
  authenticateToken,
  changePassword
);

/* ================================================= */
/* ADMIN CHANGE USER PASSWORD                        */
/* Admin only                                        */
/* ================================================= */

router.patch(
  "/users/:id/password",
  authenticateToken,
  requireRole("admin"),
  changeUserPassword
);

export default router;