import pool from "../config/database";

export async function getMappings() {
    const result = await pool.query(`
    SELECT
      cr.id,
      c.id AS customer_id,
      c.customer,
      r.id AS recipe_id,
      r.recipe_name,
      r.grade

    FROM customer_recipes cr

    JOIN customers c
      ON cr.customer_id = c.id

    JOIN recipes r
      ON cr.recipe_id = r.id

    ORDER BY c.customer;
  `);

    return result.rows;
}
export async function getRecipesByCustomer(
    customerId: number
) {
    const result = await pool.query(
        `
        SELECT
          r.id,
          r.recipe_name,
          r.recipe_no,
          r.grade,

          r.cement,
          r.flyash,
          r.sand,
          r.mm10,
          r.mm20,
          r.water,
          r.admix,

          r.slump,
          r.strength

        FROM recipes r

        WHERE r.customer_id = $1

        ORDER BY r.recipe_name;
        `,
        [customerId]
    );

    return result.rows;
}
export async function createMapping(
    customerId: number,
    recipeId: number
) {
    const result = await pool.query(
        `
    INSERT INTO customer_recipes
    (
      customer_id,
      recipe_id
    )

    VALUES
    ($1,$2)

    RETURNING *;
    `,
        [customerId, recipeId]
    );

    return result.rows[0];
}

export async function deleteMapping(
    id: number
) {
    await pool.query(
        `
    DELETE
    FROM customer_recipes
    WHERE id=$1;
    `,
        [id]
    );
}