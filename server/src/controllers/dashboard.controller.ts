import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export async function getDashboard(
  req: Request,
  res: Response
) {
  try {
    const stats =
      await dashboardService.getDashboardStats();

    res.json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
}