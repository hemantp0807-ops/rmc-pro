import pool from "../config/database";

export type RecipeData = {
  customerId: number;

  recipeName: string;
  grade: string;

  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;

  slump: number;
  strength: number;
};

export async function getAllRecipes() {
  const result = await pool.query(`
    SELECT
      r.*,
      c.customer AS customer_name
    FROM recipes r
    LEFT JOIN customers c
      ON r.customer_id = c.id
    ORDER BY r.recipe_no;
  `);

  return result.rows;
}

export async function createRecipe(data: RecipeData) {
  const result = await pool.query(
    `
    INSERT INTO recipes
    (
      customer_id,
      recipe_name,
      grade,
      cement,
      flyash,
      sand,
      mm10,
      mm20,
      water,
      admix,
      slump,
      strength
    )

    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)

    RETURNING *;
    `,
    [
      data.customerId,

      data.recipeName,
      data.grade,

      data.cement,
      data.flyash,
      data.sand,
      data.mm10,
      data.mm20,
      data.water,
      data.admix,

      data.slump,
      data.strength,
    ]
  );

  return result.rows[0];
}

export async function deleteRecipe(id: number) {
  await pool.query(
    `
    DELETE FROM recipes
    WHERE id = $1;
    `,
    [id]
  );
}