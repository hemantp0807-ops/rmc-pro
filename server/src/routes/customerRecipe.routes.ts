import { Router } from "express";

import {
  getMappings,
  getRecipesByCustomer,
  createMapping,
  deleteMapping,
} from "../controllers/customerRecipe.controller";

const router = Router();

router.get("/", getMappings);

router.get(
  "/customer/:id",
  getRecipesByCustomer
);

router.post("/", createMapping);

router.delete("/:id", deleteMapping);

export default router;