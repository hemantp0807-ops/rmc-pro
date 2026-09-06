import * as vehicleRepository from "../repositories/vehicle.repository";

type VehicleData = {
  vehicleNo: string;
  capacity: number;
  status: string;
};

export async function getVehicles() {
  return await vehicleRepository.getAllVehicles();
}

export async function addVehicle(data: VehicleData) {
  return await vehicleRepository.createVehicle(data);
}

export async function updateVehicle(
  id: number,
  data: VehicleData
) {
  return await vehicleRepository.updateVehicle(id, data);
}

export async function deleteVehicle(id: number) {
  return await vehicleRepository.deleteVehicle(id);
}