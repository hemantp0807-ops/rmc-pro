import bcrypt from "bcrypt";
import pool from "../config/database";

export async function loginUser(
  username: string,
  password: string
) {
  const result = await pool.query(
    `
    SELECT id, username, password_hash, role
    FROM users
    WHERE username = $1
    `,
    [username]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid username or password");
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid username or password");
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}   