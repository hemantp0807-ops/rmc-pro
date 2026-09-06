import * as recipeRepository from "../repositories/recipe.repository";

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

export async function getRecipes() {
  return await recipeRepository.getAllRecipes();
}

export async function addRecipe(data: RecipeData) {
  return await recipeRepository.createRecipe(data);
}

export async function deleteRecipe(id: number) {
  return await recipeRepository.deleteRecipe(id);
}