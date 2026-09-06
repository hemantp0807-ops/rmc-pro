import { Request, Response } from "express";
import * as vehicleService from "../services/vehicle.service";

export async function getVehicles(
  req: Request,
  res: Response
) {
  try {
    const vehicles = await vehicleService.getVehicles();

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("GET /api/vehicles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
}

export async function createVehicle(
  req: Request,
  res: Response
) {
  try {
    const vehicle = await vehicleService.addVehicle(req.body);

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("POST /api/vehicles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
    });
  }
}

export async function updateVehicle(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const vehicle = await vehicleService.updateVehicle(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("PUT /api/vehicles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
}

export async function deleteVehicle(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    await vehicleService.deleteVehicle(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/vehicles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
}