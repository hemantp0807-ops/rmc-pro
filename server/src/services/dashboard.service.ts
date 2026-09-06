import * as dashboardRepository from "../repositories/dashboard.repository";

export async function getDashboardStats() {
  return await dashboardRepository.getDashboardStats();
}