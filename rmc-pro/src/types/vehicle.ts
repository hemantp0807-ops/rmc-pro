export interface Vehicle {
  id: number;
  vehicleNo: string;
  capacity: number;
  status: "Available" | "On Trip" | "Maintenance";
} 