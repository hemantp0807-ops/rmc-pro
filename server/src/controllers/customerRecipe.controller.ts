import { Request, Response } from "express";
import * as customerRecipeService from "../services/customerRecipe.service";

export async function getMappings(
  req: Request,
  res: Response
) {
  try {
    const mappings =
      await customerRecipeService.getMappings();

    res.json(mappings);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer recipes",
    });
  }
}

export async function getRecipesByCustomer(
  req: Request,
  res: Response
) {
  try {
    const customerId = Number(req.params.id);

    const recipes =
      await customerRecipeService.getRecipesByCustomer(
        customerId
      );

    res.json(recipes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer recipes",
    });
  }
}

export async function createMapping(
  req: Request,
  res: Response
) {
  try {
    const { customerId, recipeId } = req.body;

    const mapping =
      await customerRecipeService.createMapping(
        customerId,
        recipeId
      );

    res.status(201).json(mapping);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create mapping",
    });
  }
}

export async function deleteMapping(
  req: Request,
  res: Response
) {
  try {
    await customerRecipeService.deleteMapping(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: "Mapping deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete mapping",
    });
  }
}