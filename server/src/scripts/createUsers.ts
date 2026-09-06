import bcrypt from "bcrypt";
import pool from "../config/database";

async function createUsers() {
  try {
    const operatorPassword = await bcrypt.hash(
      "operator@123",
      10
    );

    const accountingPassword = await bcrypt.hash(
      "accounting@123",
      10
    );

    await pool.query(
      `
      INSERT INTO users (username, password_hash, role)
      VALUES
        ($1, $2, 'operator'),
        ($3, $4, 'accounting')
      ON CONFLICT (username) DO NOTHING;
      `,
      [
        "operator",
        operatorPassword,
        "accounting",
        accountingPassword,
      ]
    );

    console.log("Operator and Accounting users created successfully.");

    await pool.end();
  } catch (error) {
    console.error("Error creating users:", error);
    await pool.end();
    process.exit(1);
  }
}

createUsers();