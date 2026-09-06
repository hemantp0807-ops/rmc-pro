import pool from "../config/database";

type VehicleData = {
  vehicleNo: string;
  capacity: number;
  status: string;
};

export async function getAllVehicles() {
  const result = await pool.query(
    "SELECT * FROM vehicles ORDER BY id ASC"
  );

  return result.rows;
}

export async function createVehicle(data: VehicleData) {
  const result = await pool.query(
    `
    INSERT INTO vehicles
    (vehicle_no, capacity, status)

    VALUES

    ($1, $2, $3)

    RETURNING *;
    `,
    [
      data.vehicleNo,
      data.capacity,
      data.status,
    ]
  );

  return result.rows[0];
}

export async function updateVehicle(
  id: number,
  data: VehicleData
) {
  const result = await pool.query(
    `
    UPDATE vehicles

    SET
      vehicle_no = $1,
      capacity = $2,
      status = $3

    WHERE id = $4

    RETURNING *;
    `,
    [
      data.vehicleNo,
      data.capacity,
      data.status,
      id,
    ]
  );

  return result.rows[0];
}

export async function deleteVehicle(id: number) {
  await pool.query(
    `
    DELETE FROM vehicles
    WHERE id = $1;
    `,
    [id]
  );
}