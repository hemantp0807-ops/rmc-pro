import api from "./api";

export type RecipePayload = {
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
  const response = await api.get("/recipes");

  return response.data;
}

export async function createRecipe(
  data: RecipePayload
) {
  const response = await api.post(
    "/recipes",
    data
  );

  return response.data;
}

export async function deleteRecipe(id: number) {
  const response = await api.delete(
    `/recipes/${id}`
  );

  return response.data;
}