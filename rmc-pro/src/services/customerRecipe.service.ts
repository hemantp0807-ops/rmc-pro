import api from "./api";

export async function getCustomerRecipes() {
  const response = await api.get(
    "/customer-recipes"
  );

  return response.data;
}

export async function getRecipesByCustomer(
  customerId: number
) {
  const response = await api.get(
    `/customer-recipes/customer/${customerId}`
  );

  return response.data;
}

export async function createCustomerRecipe(
  customerId: number,
  recipeId: number
) {
  const response = await api.post(
    "/customer-recipes",
    {
      customerId,
      recipeId,
    }
  );

  return response.data;
}

export async function deleteCustomerRecipe(
  id: number
) {
  const response = await api.delete(
    `/customer-recipes/${id}`
  );

  return response.data;
}