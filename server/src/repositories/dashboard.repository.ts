
import pool from "../config/database";

export async function getDashboardStats() {
  /* ================================================= */
  /* TODAY'S DASHBOARD SUMMARY                         */
  /* ================================================= */

  const todayResult = await pool.query(`
    SELECT
      COUNT(*) AS todays_batches,

      COALESCE(
        SUM(quantity),
        0
      ) AS todays_qty,

      COUNT(delivery_no) AS todays_challan

    FROM batches

    WHERE DATE(batch_date) = CURRENT_DATE
  `);


  /* ================================================= */
  /* TOTAL DASHBOARD SUMMARY                           */
  /* ================================================= */

  const totalResult = await pool.query(`
    SELECT
      COUNT(*) AS total_batches,

      COALESCE(
        SUM(quantity),
        0
      ) AS total_qty,

      COUNT(delivery_no) AS total_challans

    FROM batches
  `);


  /* ================================================= */
  /* TOTAL VEHICLES                                    */
  /* ================================================= */

  const vehiclesResult = await pool.query(`
    SELECT
      COUNT(*) AS count

    FROM vehicles
  `);


  /* ================================================= */
  /* DAILY PRODUCTION - LAST 7 DAYS                    */
  /* ================================================= */

  const productionResult = await pool.query(`
    SELECT
      days.production_date,

      COALESCE(
        SUM(b.quantity),
        0
      ) AS quantity

    FROM (
      SELECT
        generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS production_date
    ) days

    LEFT JOIN batches b
      ON DATE(b.batch_date) = days.production_date

    GROUP BY
      days.production_date

    ORDER BY
      days.production_date ASC
  `);


  /* ================================================= */
  /* FORMAT DAILY PRODUCTION                           */
  /* ================================================= */

  const dailyProduction =
    productionResult.rows.map((row) => ({
      date: row.production_date,
      quantity: Number(row.quantity) || 0,
    }));


  /* ================================================= */
  /* RETURN                                             */
  /* ================================================= */

  return {
    /* Today's Summary */

    todaysBatches:
      Number(
        todayResult.rows[0].todays_batches
      ) || 0,

    todaysQty:
      Number(
        todayResult.rows[0].todays_qty
      ) || 0,

    todaysChallan:
      Number(
        todayResult.rows[0].todays_challan
      ) || 0,


    /* Total Summary */

    totalBatches:
      Number(
        totalResult.rows[0].total_batches
      ) || 0,

    totalQty:
      Number(
        totalResult.rows[0].total_qty
      ) || 0,

    totalChallans:
      Number(
        totalResult.rows[0].total_challans
      ) || 0,


    /* Vehicles */

    vehicles:
      Number(
        vehiclesResult.rows[0].count
      ) || 0,


    /* Production Graph */

    dailyProduction,
  };
}
