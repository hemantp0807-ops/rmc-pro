import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import customerRecipeRoutes from "./routes/customerRecipe.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import customerRoutes from "./routes/customer.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import driverRoutes from "./routes/driver.routes";
import batchRoutes from "./routes/batch.routes";
import recipeRoutes from "./routes/recipe.routes";

console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("customerRoutes:", typeof customerRoutes);
console.log("vehicleRoutes:", typeof vehicleRoutes);
console.log("driverRoutes:", typeof driverRoutes);
console.log("batchRoutes:", typeof batchRoutes);
console.log("recipeRoutes:", typeof recipeRoutes);
console.log("customerRecipeRoutes:", typeof customerRecipeRoutes);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "RMC Pro API Running 🚀",
  });
});

// Authentication
app.use("/api/auth", authRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Masters
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/customer-recipes", customerRecipeRoutes);

// Batch Module
app.use("/api/batches", batchRoutes);

export default app;