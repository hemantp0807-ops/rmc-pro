export interface BatchReportRow {
  batch_size: number;

  cement_set: number;
  cement_act: number;

  flyash_set: number;
  flyash_act: number;

  sand_set: number;
  sand_act: number;

  mm10_set: number;
  mm10_act: number;

  mm20_set: number;
  mm20_act: number;

  water_set: number;
  water_act: number;

  admix_set: number;
  admix_act: number;
}


export interface BatchReportData {
  customer: string;
  site: string;

  recipe_name: string;
  recipe_no: number;
  grade: string;

  vehicle_no: string;
  driver_name: string;

  order_no: number;
  delivery_no: number;
  ticket_no: number;

  order_qty: number;
  ticket_qty: number;
  order_qty_left: number;

  batch_date: string;
  batch_time: string;
  end_time: string;

  slump: number;
  strength: number;

  // Recipe values (RECP/M3)
  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;

  // Actual values recorded for this batch
  cement_act: number;
  flyash_act: number;
  sand_act: number;
  mm10_act: number;
  mm20_act: number;
  water_act: number;
  admix_act: number;

  // Generated batch rows
  rows: BatchReportRow[];
}