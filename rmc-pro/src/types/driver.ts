export interface Driver {
  id: number;
  name: string;
  mobile: string;
  licenseNo: string;
  status: "Available" | "On Trip" | "On Leave";
}