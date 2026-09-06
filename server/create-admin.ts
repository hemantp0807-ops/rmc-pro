import bcrypt from "bcrypt";
import pool from "./src/config/database";

async function createAdmin() {
  const username = "admin";
  const password = "admin123";

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `
    INSERT INTO users (username, password_hash, role)
    VALUES ($1, $2, $3)
    `,
    [username, passwordHash, "admin"]
  );

  console.log("✅ Admin user created");
  console.log("Username:", username);
  console.log("Password:", password);

  await pool.end();
}

createAdmin().catch((error) => {
  console.error("❌ Failed to create admin:", error);
  process.exit(1);
});