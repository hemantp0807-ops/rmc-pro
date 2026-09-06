import pool from "../config/database";

export async function getAllCustomers() {
  const result = await pool.query(`
    SELECT *
    FROM customers
    ORDER BY id ASC;
  `);

  return result.rows;
}

export async function createCustomer(data: {
  customer: string;
  site: string;
  party_po_no?: string | null;
  party_gst_no?: string | null;
  contact_no?: string | null;
  contact_person?: string | null;
}) {
  const result = await pool.query(
    `
    INSERT INTO customers
    (
      customer,
      site,
      party_po_no,
      party_gst_no,
      contact_no,
      contact_person
    )

    VALUES
    ($1, $2, $3, $4, $5, $6)

    RETURNING *;
    `,
    [
      data.customer,
      data.site,
      data.party_po_no ?? null,
      data.party_gst_no ?? null,
      data.contact_no ?? null,
      data.contact_person ?? null,
    ]
  );

  return result.rows[0];
}

export async function updateCustomer(
  id: number,
  data: {
    customer: string;
    site: string;
    party_po_no?: string | null;
    party_gst_no?: string | null;
    contact_no?: string | null;
    contact_person?: string | null;
  }
) {
  const result = await pool.query(
    `
    UPDATE customers

    SET
      customer = $1,
      site = $2,
      party_po_no = $3,
      party_gst_no = $4,
      contact_no = $5,
      contact_person = $6

    WHERE id = $7

    RETURNING *;
    `,
    [
      data.customer,
      data.site,
      data.party_po_no ?? null,
      data.party_gst_no ?? null,
      data.contact_no ?? null,
      data.contact_person ?? null,
      id,
    ]
  );

  return result.rows[0];
}

export async function deleteCustomer(id: number) {
  await pool.query(
    `
    DELETE FROM customers
    WHERE id = $1;
    `,
    [id]
  );
}