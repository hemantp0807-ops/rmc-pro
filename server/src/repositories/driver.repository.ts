import pool from "../config/database";

type DriverData = {
  driverName: string;
  mobile: string;
  licenseNo: string;
  status: string;
};

export async function getAllDrivers() {
  const result = await pool.query(
    "SELECT * FROM drivers ORDER BY id ASC"
  );

  return result.rows;
}

export async function createDriver(data: DriverData) {
  const result = await pool.query(
    `
    INSERT INTO drivers
    (driver_name, mobile, license_no, status)

    VALUES

    ($1, $2, $3, $4)

    RETURNING *;
    `,
    [
      data.driverName,
      data.mobile,
      data.licenseNo,
      data.status,
    ]
  );

  return result.rows[0];
}

export async function updateDriver(
  id: number,
  data: DriverData
) {
  const result = await pool.query(
    `
    UPDATE drivers

    SET
      driver_name = $1,
      mobile = $2,
      license_no = $3,
      status = $4

    WHERE id = $5

    RETURNING *;
    `,
    [
      data.driverName,
      data.mobile,
      data.licenseNo,
      data.status,
      id,
    ]
  );

  return result.rows[0];
}

export async function deleteDriver(id: number) {
  await pool.query(
    `
    DELETE FROM drivers
    WHERE id = $1;
    `,
    [id]
  );
}