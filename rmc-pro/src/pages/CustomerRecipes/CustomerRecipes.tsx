import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";

import { getCustomers } from "../../services/customer.service";
import { getRecipes } from "../../services/recipe.service";

import {
  getCustomerRecipes,
  createCustomerRecipe,
  deleteCustomerRecipe,
} from "../../services/customerRecipe.service";

export default function CustomerRecipes() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);

  const [customerId, setCustomerId] = useState("");

  const [recipeId, setRecipeId] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        customerData,
        recipeData,
        mappingData,
      ] = await Promise.all([
        getCustomers(),
        getRecipes(),
        getCustomerRecipes(),
      ]);

      setCustomers(customerData);
      setRecipes(recipeData);
      setMappings(mappingData);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave() {
    if (!customerId || !recipeId) {
      alert("Select customer and recipe.");
      return;
    }

    try {
      await createCustomerRecipe(
        Number(customerId),
        Number(recipeId)
      );

      setCustomerId("");
      setRecipeId("");

      loadData();
    } catch (error) {
      console.error(error);
    }
  }
    async function handleDelete(id: number) {
    if (!confirm("Delete this mapping?")) {
      return;
    }

    try {
      await deleteCustomerRecipe(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  }

  const filtered = useMemo(() => {
    return mappings.filter((mapping) => {
      const value = search.toLowerCase();

      return (
        mapping.customer
          .toLowerCase()
          .includes(value) ||
        mapping.recipe_name
          .toLowerCase()
          .includes(value) ||
        mapping.grade
          .toLowerCase()
          .includes(value)
      );
    });
  }, [mappings, search]);

  return (
    <DashboardLayout>

      <PageHeader
        title="Customer Recipe Mapping"
        subtitle="Assign Recipes to Customers"
      />

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={customerId}
            onChange={(e) =>
              setCustomerId(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.customer}
              </option>
            ))}

          </select>

          <select
            value={recipeId}
            onChange={(e) =>
              setRecipeId(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="">
              Select Recipe
            </option>

            {recipes.map((recipe) => (
              <option
                key={recipe.id}
                value={recipe.id}
              >
                {recipe.recipe_name} ({recipe.grade})
              </option>
            ))}

          </select>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
          >
            Save Mapping
          </button>

        </div>

      </div>

      <div className="mb-6">

        <SearchInput
          placeholder="Search Mapping..."
          value={search}
          onChange={setSearch}
        />

      </div>

      <DataTable
        headers={[
          "Customer",
          "Recipe",
          "Grade",
          "Action",
        ]}
      >
        {filtered.map((mapping) => (

          <tr key={mapping.id}>

            <td className="py-3">
              {mapping.customer}
            </td>

            <td>
              {mapping.recipe_name}
            </td>

            <td>
              {mapping.grade}
            </td>

            <td>

              <button
                onClick={() =>
                  handleDelete(mapping.id)
                }
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </td>

          </tr>

        ))}

      </DataTable>

    </DashboardLayout>
  );
}