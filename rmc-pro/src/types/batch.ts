export interface Batch {
  id: number;

  sr_no: number;

  batch_no: string;

  customer_id: number;
  recipe_id: number;
  vehicle_id: number;
  driver_id: number;

  customer: string;
  site: string;

  recipe_name: string;
  recipe_no?: string | number;

  grade: string;

  vehicle_no: string;
  driver_name: string;

  quantity: number;
  cumulative_qty?: number;

  order_no: number;
  delivery_no: number;
  ticket_no: number;

  order_qty: number;
  ticket_qty: number;
  order_qty_left: number;

  batch_date: string;
  batch_time: string;

  status: string;
  cancel_reason?: string;
  type_of_loading?: string;

  /* ============================================= */
  /* COMPATIBILITY ALIASES                         */
  /* ============================================= */

  recipe?: string;

  vehicleNo?: string;
  driverName?: string;

  vehicleId?: number;
  driverId?: number;

  orderNo?: number;
  deliveryNo?: number;
  ticketNo?: number;

  orderQty?: number;
  ticketQty?: number;
  orderQtyLeft?: number;

  batchDate?: string;
  batchTime?: string;

  end_time?: string;

  typeOfLoading?: string;

  /* ============================================= */
  /* RECIPE VALUES                                 */
  /* ============================================= */

  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;

  slump?: number;
  strength?: number;

  /* ============================================= */
  /* ACTUAL VALUES                                 */
  /* ============================================= */

  cement_act?: number;
  flyash_act?: number;
  sand_act?: number;
  mm10_act?: number;
  mm20_act?: number;
  water_act?: number;
  admix_act?: number;

  /* ============================================= */
  /* GENERATED BATCH REPORT ROWS                   */
  /* ============================================= */

  report_rows?: BatchReportRow[];

  rows?: BatchReportRow[];

  production_start?: string;
  production_end?: string;

  dispatch_time?: string;
  created_at?: string;
}


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