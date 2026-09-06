import { Request, Response } from "express";
import * as driverService from "../services/driver.service";

export async function getDrivers(
  req: Request,
  res: Response
) {
  try {
    const drivers = await driverService.getDrivers();

    return res.status(200).json(drivers);
  } catch (error) {
    console.error("GET /api/drivers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
    });
  }
}

export async function createDriver(
  req: Request,
  res: Response
) {
  try {
    const driver = await driverService.addDriver(req.body);

    return res.status(201).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    console.error("POST /api/drivers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create driver",
    });
  }
}

export async function updateDriver(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const driver = await driverService.updateDriver(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    console.error("PUT /api/drivers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update driver",
    });
  }
}

export async function deleteDriver(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    await driverService.deleteDriver(id);

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/drivers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete driver",
    });
  }
}