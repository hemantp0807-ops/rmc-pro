import * as customerRecipeRepository from "../repositories/customerRecipe.repository";

export async function getMappings() {
  return await customerRecipeRepository.getMappings();
}

export async function getRecipesByCustomer(
  customerId: number
) {
  return await customerRecipeRepository.getRecipesByCustomer(
    customerId
  );
}

export async function createMapping(
  customerId: number,
  recipeId: number
) {
  return await customerRecipeRepository.createMapping(
    customerId,
    recipeId
  );
}

export async function deleteMapping(
  id: number
) {
  return await customerRecipeRepository.deleteMapping(
    id
  );
}