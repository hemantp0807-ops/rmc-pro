import { Request, Response } from "express";

import {
  getRecipes as getRecipesService,
  addRecipe,
  deleteRecipe as deleteRecipeService,
} from "../services/recipe.service";


export async function getRecipes(
  req: Request,
  res: Response
) {
  try {
    const recipes = await getRecipesService();

    return res.status(200).json(recipes);

  } catch (error) {
    console.error(
      "GET /api/recipes Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recipes",
    });
  }
}


export async function createRecipe(
  req: Request,
  res: Response
) {
  try {
    const recipe = await addRecipe(req.body);

    return res.status(201).json(recipe);

  } catch (error: any) {
    console.error(
      "POST /api/recipes Error:",
      error
    );

    // Duplicate Customer + Grade
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: `This customer already has a recipe for grade ${req.body.grade}.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create recipe",
    });
  }
}


export async function deleteRecipe(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    await deleteRecipeService(id);

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE /api/recipes Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete recipe",
    });
  }
}