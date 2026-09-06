import { Request, Response } from "express";
import * as customerService from "../services/customer.service";

export async function getCustomers(
  req: Request,
  res: Response
) {
  try {
    const customers = await customerService.getCustomers();

    return res.status(200).json(customers);
  } catch (error) {
    console.error("GET /api/customers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
}

export async function createCustomer(
  req: Request,
  res: Response
) {
  try {
    console.log("CREATE CUSTOMER BODY:", req.body);

    const customer = await customerService.addCustomer(req.body);

    return res.status(201).json({
      success: true,
      data: customer,
    });

  } catch (error: any) {
    console.error("POST /api/customers Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      detail: error.detail,
      code: error.code,
    });
  }
}

export async function updateCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const customer = await customerService.updateCustomer(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("PUT /api/customers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
}

export async function deleteCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    await customerService.deleteCustomer(id);

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/customers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
}