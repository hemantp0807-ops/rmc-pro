import * as driverRepository from "../repositories/driver.repository";

type DriverData = {
  driverName: string;
  mobile: string;
  licenseNo: string;
  status: string;
};

export async function getDrivers() {
  return await driverRepository.getAllDrivers();
}

export async function addDriver(data: DriverData) {
  return await driverRepository.createDriver(data);
}

export async function updateDriver(
  id: number,
  data: DriverData
) {
  return await driverRepository.updateDriver(id, data);
}

export async function deleteDriver(id: number) {
  return await driverRepository.deleteDriver(id);
}