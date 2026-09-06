import pool from "../config/database";


type BatchReportRow = {
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
};


type BatchData = {
  batchNo: string;

  customerId: number;
  recipeId: number;
  vehicleId: number;
  driverId: number;

  quantity: number;
  cumulativeQty?: number;

  // Recipe values
  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;
  slump: number;
  strength: number;

  // Batch-level actual values
  cementAct: number;
  flyashAct: number;
  sandAct: number;
  mm10Act: number;
  mm20Act: number;
  waterAct: number;
  admixAct: number;

  // Individual report rows
  reportRows?: BatchReportRow[];

  orderNo: number;
  deliveryNo: number;
  ticketNo: number;

  orderQty: number;
  ticketQty: number;
  orderQtyLeft: number;

  batchDate: string;
  batchTime: string;
  endTime: string;
  status: string;
  typeOfLoading: string;
};


/* ================================================= */
/* GET BATCH BY ID                                   */
/* ================================================= */

export async function getBatchById(id: number) {

  const result = await pool.query(
    `
    SELECT
      b.id,
      b.sr_no,  
      b.batch_no,
      b.customer_id,
      b.recipe_id,
      c.customer,
      c.site,

      r.recipe_name,
      r.recipe_no,
      r.grade,

      b.cement,
      b.flyash,
      b.sand,
      b.mm10,
      b.mm20,
      b.water,
      b.admix,
      b.slump,
      b.strength,

      b.cement_act,
      b.flyash_act,
      b.sand_act,
      b.mm10_act,
      b.mm20_act,
      b.water_act,
      b.admix_act,

      v.vehicle_no,

      d.driver_name,

      b.quantity,
      b.cumulative_qty,

      b.order_no,
      b.delivery_no,
      b.ticket_no,

      b.order_qty,
      b.ticket_qty,
      b.order_qty_left,

      b.batch_date,
      b.batch_time,
      b.end_time,
      b.type_of_loading,

      b.status,
      b.cancel_reason,
      b.production_start,
      b.production_end,
      b.dispatch_time,

      b.created_at

    FROM batches b

    JOIN customers c
      ON b.customer_id = c.id

    JOIN recipes r
      ON b.recipe_id = r.id

    JOIN vehicles v
      ON b.vehicle_id = v.id

    JOIN drivers d
      ON b.driver_id = d.id

    WHERE b.id = $1;
    `,
    [id]
  );


  const batch = result.rows[0];


  if (!batch) {
    return null;
  }


  /* ================================================= */
  /* GET SAVED REPORT ROWS                             */
  /* ================================================= */

  const rowsResult = await pool.query(
    `
    SELECT
      id,

      batch_size,

      cement_set,
      cement_act,

      flyash_set,
      flyash_act,

      sand_set,
      sand_act,

      mm10_set,
      mm10_act,

      mm20_set,
      mm20_act,

      water_set,
      water_act,

      admix_set,
      admix_act

    FROM batch_report_rows

    WHERE batch_id = $1

    ORDER BY id ASC;
    `,
    [id]
  );


  return {
    ...batch,
    rows: rowsResult.rows,
  };
}


/* ================================================= */
/* GET ALL BATCHES                                   */
/* ================================================= */

export async function getAllBatches() {

  const result = await pool.query(
    `
    SELECT
     b.id,
b.sr_no,
b.batch_no,

b.customer_id,
b.recipe_id,
b.vehicle_id,
b.driver_id,
      c.customer,
      c.site,

      r.recipe_name,
      r.recipe_no,
      r.grade,

      b.cement,
      b.flyash,
      b.sand,
      b.mm10,
      b.mm20,
      b.water,
      b.admix,
      b.slump,
      b.strength,

      b.cement_act,
      b.flyash_act,
      b.sand_act,
      b.mm10_act,
      b.mm20_act,
      b.water_act,
      b.admix_act,

      v.vehicle_no,

      d.driver_name,

      b.quantity,
      b.cumulative_qty,

      b.order_no,
      b.delivery_no,
      b.ticket_no,

      b.order_qty,
      b.ticket_qty,
      b.order_qty_left,

      b.batch_date,
      b.batch_time,
      b.end_time,
      b.type_of_loading,

      b.status,
      b.cancel_reason,
      b.production_start,
      b.production_end,
      b.dispatch_time,

      b.created_at

    FROM batches b

    JOIN customers c
      ON b.customer_id = c.id

    JOIN recipes r
      ON b.recipe_id = r.id

    JOIN vehicles v
      ON b.vehicle_id = v.id

    JOIN drivers d
      ON b.driver_id = d.id

    ORDER BY b.id DESC;
    `
  );


  const batches = result.rows;


  /* ================================================= */
  /* GET REPORT ROWS FOR EVERY BATCH                   */
  /* ================================================= */

  for (const batch of batches) {

    const rowsResult = await pool.query(
      `
      SELECT
        id,

        batch_size,

        cement_set,
        cement_act,

        flyash_set,
        flyash_act,

        sand_set,
        sand_act,

        mm10_set,
        mm10_act,

        mm20_set,
        mm20_act,

        water_set,
        water_act,

        admix_set,
        admix_act

      FROM batch_report_rows

      WHERE batch_id = $1

      ORDER BY id ASC;
      `,
      [batch.id]
    );


    batch.rows = rowsResult.rows;
  }


  return batches;
}


/* ================================================= */
/* CREATE BATCH                                      */
/* ================================================= */

export async function createBatch(
  data: BatchData
) {
  /*
   * Find previous cumulative quantity
   * for the same customer and same grade.
   * Date does NOT affect cumulative quantity.
   */

  const previousResult = await pool.query(
    `
      SELECT b.cumulative_qty
      FROM batches b
      JOIN recipes r
        ON b.recipe_id = r.id
      WHERE b.customer_id = $1
        AND r.grade = (
          SELECT grade
          FROM recipes
          WHERE id = $2
        )
      ORDER BY b.id DESC
      LIMIT 1;
    `,
    [
      data.customerId,
      data.recipeId,
    ]
  );

  const previousCumulativeQty =
    previousResult.rows.length > 0
      ? Number(previousResult.rows[0].cumulative_qty) || 0
      : 0;

 const cumulativeQty =
  previousCumulativeQty +
  Number(data.orderQty);


  /* ================================================= */
  /* CREATE BATCH                                     */
  /* ================================================= */

  const result = await pool.query(
    `
    INSERT INTO batches
    (
      batch_no,

      customer_id,
      recipe_id,
      vehicle_id,
      driver_id,

      quantity,
      cumulative_qty,

      cement,
      flyash,
      sand,
      mm10,
      mm20,
      water,
      admix,
      slump,
      strength,

      cement_act,
      flyash_act,
      sand_act,
      mm10_act,
      mm20_act,
      water_act,
      admix_act,

      order_no,
      delivery_no,
      ticket_no,

      order_qty,
      ticket_qty,
      order_qty_left,

      batch_date,
      batch_time,
      end_time,

      status,
      type_of_loading
    )

    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,

      $6,
      $7,

      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14,
      $15,
      $16,

      $17,
      $18,
      $19,
      $20,
      $21,
      $22,
      $23,

      $24,
      $25,
      $26,

      $27,
      $28,
      $29,

      $30,
      $31,

      $32,
      $33,
      $34
    )

    RETURNING *;
    `,
    [

      /* 1 */
      data.batchNo,

      /* 2-5 */
      data.customerId,
      data.recipeId,
      data.vehicleId,
      data.driverId,

      /* 6-7 */
      data.quantity,
      cumulativeQty,

      /* 8-16 */
      data.cement,
      data.flyash,
      data.sand,
      data.mm10,
      data.mm20,
      data.water,
      data.admix,
      data.slump,
      data.strength,

      /* 17-23 */
      data.cementAct,
      data.flyashAct,
      data.sandAct,
      data.mm10Act,
      data.mm20Act,
      data.waterAct,
      data.admixAct,

      /* 24-26 */
      data.orderNo,
      data.deliveryNo,
      data.ticketNo,

      /* 27-29 */
      data.orderQty,
      data.ticketQty,
      data.orderQtyLeft,

      /* 30-32 */
      data.batchDate,
      data.batchTime,
      data.endTime,

      /* 33-34 */
      data.status,
      data.typeOfLoading,
    ]
  );


  const createdBatch = result.rows[0];


  /* ================================================= */
  /* SAVE INDIVIDUAL REPORT ROWS                       */
  /* ================================================= */

  if (
    data.reportRows &&
    data.reportRows.length > 0
  ) {

    for (
      const row of data.reportRows
    ) {

      await pool.query(
        `
        INSERT INTO batch_report_rows
        (
          batch_id,
          batch_size,

          cement_set,
          cement_act,

          flyash_set,
          flyash_act,

          sand_set,
          sand_act,

          mm10_set,
          mm10_act,

          mm20_set,
          mm20_act,

          water_set,
          water_act,

          admix_set,
          admix_act
        )

        VALUES
        (
          $1,
          $2,

          $3,
          $4,

          $5,
          $6,

          $7,
          $8,

          $9,
          $10,

          $11,
          $12,

          $13,
          $14,

          $15,
          $16
        );
        `,
        [

          createdBatch.id,
          row.batch_size,

          row.cement_set,
          row.cement_act,

          row.flyash_set,
          row.flyash_act,

          row.sand_set,
          row.sand_act,

          row.mm10_set,
          row.mm10_act,

          row.mm20_set,
          row.mm20_act,

          row.water_set,
          row.water_act,

          row.admix_set,
          row.admix_act,
        ]
      );
    }
  }


  return createdBatch;
}
/* ================================================= */
/* UPDATE BATCH                                      */
/* ================================================= */

export async function updateBatch(
  id: number,
  data: BatchData
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const oldBatchResult = await client.query(
  `
  SELECT
    b.customer_id,
    r.grade
  FROM batches b
  JOIN recipes r
    ON b.recipe_id = r.id
  WHERE b.id = $1;
  `,
  [id]
);

const oldCustomerId =
  oldBatchResult.rows[0]?.customer_id;

const oldGrade =
  oldBatchResult.rows[0]?.grade;
    const result = await client.query(
      `
      UPDATE batches
      SET
        batch_no = $1,

        customer_id = $2,
        recipe_id = $3,
        vehicle_id = $4,
        driver_id = $5,

        quantity = $6,

        cement = $7,
        flyash = $8,
        sand = $9,
        mm10 = $10,
        mm20 = $11,
        water = $12,
        admix = $13,
        slump = $14,
        strength = $15,

        cement_act = $16,
        flyash_act = $17,
        sand_act = $18,
        mm10_act = $19,
        mm20_act = $20,
        water_act = $21,
        admix_act = $22,

        delivery_no = $23,
        ticket_no = $24,

        order_qty = $25,
        ticket_qty = $26,
        order_qty_left = $27,

        batch_date = $28,
        batch_time = $29,
        end_time = $30,

        type_of_loading = $31

      WHERE id = $32
        AND status <> 'Cancelled'

      RETURNING *;
      `,
      [
        data.batchNo,

        data.customerId,
        data.recipeId,
        data.vehicleId,
        data.driverId,

        data.quantity,

        data.cement,
        data.flyash,
        data.sand,
        data.mm10,
        data.mm20,
        data.water,
        data.admix,
        data.slump,
        data.strength,

        data.cementAct,
        data.flyashAct,
        data.sandAct,
        data.mm10Act,
        data.mm20Act,
        data.waterAct,
        data.admixAct,

        data.deliveryNo,
        data.ticketNo,

        data.orderQty,
        data.ticketQty,
        data.orderQtyLeft,

        data.batchDate,
        data.batchTime,
        data.endTime,

        data.typeOfLoading,

        id,
      ]
    );
const updatedBatch = result.rows[0];

 if (!updatedBatch) {
      await client.query("ROLLBACK");
      return null;
    }


/*
 * ---------------------------------------------
 * RECALCULATE CUMULATIVE QTY
 * SAME CUSTOMER + SAME GRADE
 * DATE IS NOT CONSIDERED
 *
 * If customer or grade is changed while editing:
 * - Recalculate the OLD customer + OLD grade group
 * - Recalculate the NEW customer + NEW grade group
 * ---------------------------------------------
 */

// Get the original customer + grade of this batch



// Get the new grade
const newGradeResult = await client.query(
  `
  SELECT grade
  FROM recipes
  WHERE id = $1;
  `,
  [data.recipeId]
);

const newGrade =
  newGradeResult.rows[0]?.grade;


/*
 * ---------------------------------------------
 * RECALCULATE ONE CUSTOMER + GRADE GROUP
 * ---------------------------------------------
 */
async function recalculateCumulative(
  customerId: number,
  grade: string
) {
  const result = await client.query(
    `
    SELECT
      b.id,
      b.order_qty
    FROM batches b
    JOIN recipes r
      ON b.recipe_id = r.id
    WHERE b.customer_id = $1
      AND r.grade = $2
      AND b.status <> 'Cancelled'
    ORDER BY b.id ASC;
    `,
    [
      customerId,
      grade,
    ]
  );

  let runningCumulative = 0;

  for (const row of result.rows) {
    runningCumulative +=
      Number(row.order_qty) || 0;

    await client.query(
      `
      UPDATE batches
      SET cumulative_qty = $1
      WHERE id = $2;
      `,
      [
        runningCumulative,
        row.id,
      ]
    );

    if (Number(row.id) === Number(id)) {
      updatedBatch.cumulative_qty =
        runningCumulative;
    }
  }
}


/*
 * ---------------------------------------------
 * OLD GROUP
 * ---------------------------------------------
 */
if (
  oldCustomerId &&
  oldGrade
) {
  await recalculateCumulative(
    Number(oldCustomerId),
    oldGrade
  );
}


/*
 * ---------------------------------------------
 * NEW GROUP
 * ---------------------------------------------
 */
if (
  data.customerId &&
  newGrade
) {
  const sameGroup =
    Number(oldCustomerId) ===
      Number(data.customerId) &&
    oldGrade === newGrade;

  if (!sameGroup) {
    await recalculateCumulative(
      Number(data.customerId),
      newGrade
    );
  }
}
   

    /*
     * ---------------------------------------------
     * UPDATE SAVED BATCH REPORT ROWS
     * ---------------------------------------------
     */

    if (data.reportRows) {
      await client.query(
        `
        DELETE FROM batch_report_rows
        WHERE batch_id = $1;
        `,
        [id]
      );

      for (const row of data.reportRows) {
        await client.query(
          `
          INSERT INTO batch_report_rows (
            batch_id,
            batch_size,

            cement_set,
            cement_act,

            flyash_set,
            flyash_act,

            sand_set,
            sand_act,

            mm10_set,
            mm10_act,

            mm20_set,
            mm20_act,

            water_set,
            water_act,

            admix_set,
            admix_act
          )
          VALUES (
            $1,
            $2,

            $3,
            $4,

            $5,
            $6,

            $7,
            $8,

            $9,
            $10,

            $11,
            $12,

            $13,
            $14,

            $15,
            $16
          );
          `,
          [
            id,
            row.batch_size,

            row.cement_set,
            row.cement_act,

            row.flyash_set,
            row.flyash_act,

            row.sand_set,
            row.sand_act,

            row.mm10_set,
            row.mm10_act,

            row.mm20_set,
            row.mm20_act,

            row.water_set,
            row.water_act,

            row.admix_set,
            row.admix_act,
          ]
        );
      }
    }

    await client.query("COMMIT");

    return updatedBatch;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/* ================================================= */
/* DELETE BATCH                                      */
/* ================================================= */

export async function deleteBatch(
  id: number
) {

  await pool.query(
    `
    DELETE FROM batches

    WHERE id = $1;
    `,
    [id]
  );
}
export async function cancelBatch(
  id: number,
  reason: string
) {
  const result = await pool.query(
    `
    UPDATE batches
    SET
      status = 'Cancelled',
      cancel_reason = $2
    WHERE id = $1
    RETURNING *;
    `,
    [id, reason]
  );

  return result.rows[0] || null;
}

/* ================================================= */
/* START PRODUCTION                                  */
/* ================================================= */

export async function startProduction(
  id: number
) {

  const result = await pool.query(
    `
    UPDATE batches

    SET
      status = 'Producing',
      production_start = CURRENT_TIMESTAMP

    WHERE id = $1

    RETURNING *;
    `,
    [id]
  );


  return result.rows[0];
}


/* ================================================= */
/* COMPLETE PRODUCTION                               */
/* ================================================= */

export async function completeProduction(
  id: number
) {

  const result = await pool.query(
    `
    UPDATE batches

    SET
      status = 'Completed',
      production_end = CURRENT_TIMESTAMP

    WHERE id = $1

    RETURNING *;
    `,
    [id]
  );


  return result.rows[0];
}


/* ================================================= */
/* DISPATCH BATCH                                    */
/* ================================================= */

export async function dispatchBatch(
  id: number
) {

  const result = await pool.query(
    `
    UPDATE batches

    SET
      status = 'Dispatched',
      dispatch_time = CURRENT_TIMESTAMP

    WHERE id = $1

    RETURNING *;
    `,
    [id]
  );


  return result.rows[0];
}