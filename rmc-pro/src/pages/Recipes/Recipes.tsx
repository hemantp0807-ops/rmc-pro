import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";

import {
  getRecipes,
  createRecipe,
  deleteRecipe,
} from "../../services/recipe.service";

import { getCustomers } from "../../services/customer.service";

import {
  BookOpen,
  Trash2,
  Save,
  Beaker,
} from "lucide-react";

import { hasRole } from "../../utils/auth";


export default function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [deleteRecipeId, setDeleteRecipeId] =
    useState<number | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    recipeName: "",
    grade: "",
    cement: "",
    flyash: "",
    sand: "",
    mm10: "",
    mm20: "",
    water: "",
    admix: "",
    slump: "",
    strength: "",
  });

  /* ================================================= */
  /* LOAD DATA                                         */
  /* ================================================= */

  useEffect(() => {
    loadRecipes();
    loadCustomers();
  }, []);

  async function loadRecipes() {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recipes.");
    }
  }

  async function loadCustomers() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers.");
    }
  }

  /* ================================================= */
  /* FORM                                              */
  /* ================================================= */

  function updateField(
    field: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function preventWheelChange(
    e: React.WheelEvent<HTMLInputElement>
  ) {
    e.currentTarget.blur();
  }

  /* ================================================= */
  /* SUBMIT                                            */
  /* ================================================= */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form.customerId) {
      toast.error("Please select a customer.");
      return;
    }

    if (!form.grade) {
      toast.error("Please select a concrete grade.");
      return;
    }

    try {
      await createRecipe({
        customerId: Number(form.customerId),

        recipeName: form.recipeName,
        grade: form.grade,

        cement: Number(form.cement) || 0,
        flyash: Number(form.flyash) || 0,
        sand: Number(form.sand) || 0,
        mm10: Number(form.mm10) || 0,
        mm20: Number(form.mm20) || 0,
        water: Number(form.water) || 0,
        admix: Number(form.admix) || 0,

        /* Empty Slump/Strength are stored as 0 */
        slump: Number(form.slump) || 0,
        strength: Number(form.strength) || 0,
      });

      setForm({
        customerId: "",
        recipeName: "",
        grade: "",
        cement: "",
        flyash: "",
        sand: "",
        mm10: "",
        mm20: "",
        water: "",
        admix: "",
        slump: "",
        strength: "",
      });

      await loadRecipes();

      toast.success("Recipe saved successfully.");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "Failed to create recipe.";

      toast.error(message);
    }
  }

  /* ================================================= */
  /* DELETE                                            */
  /* ================================================= */

  function handleDelete(id: number) {
    setDeleteRecipeId(id);
  }

  async function confirmDeleteRecipe() {
    if (deleteRecipeId === null) {
      return;
    }

    setDeleting(true);

    try {
      await deleteRecipe(deleteRecipeId);

      toast.success("Recipe deleted successfully.");

      setDeleteRecipeId(null);

      await loadRecipes();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete recipe.");
    } finally {
      setDeleting(false);
    }
  }

  /* ================================================= */
  /* RECIPE LIST                                       */
  /* ================================================= */

  const filtered = useMemo(() => {
    return recipes;
  }, [recipes]);

  /* ================================================= */
  /* COMMON STYLES                                     */
  /* ================================================= */

  const inputClass =
    "w-full h-10 border border-slate-300 rounded-lg px-3 text-sm " +
    "font-semibold text-slate-800 placeholder:text-slate-500 " +
    "bg-white outline-none transition " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "block text-sm font-bold text-slate-800 mb-1.5";

  /* ================================================= */
  /* RETURN                                            */
  /* ================================================= */

  return (
    <DashboardLayout>

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <PageHeader
        title="Create Recipe"
        subtitle="Manage concrete mix designs and recipes"
      />

      {hasRole("admin", "operator") && (
        <>
          {/* ================================================= */}
          {/* ADD RECIPE                                        */}
          {/* ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
          mb-8
        "
          >





            {/* ================================================= */}
            {/* FORM CONTENT                                      */}
            {/* ================================================= */}

            <div className="px-6 pt-3 pb-6">

              {/* ================================================= */}
              {/* RECIPE INFORMATION                               */}
              {/* ================================================= */}

              <div
                className="
              flex
              items-center
              gap-2
              mb-3
            "
              >

                <BookOpen
                  size={18}
                  className="text-blue-600"
                />

                <h3
                  className="
                text-base
                font-bold
                text-slate-900
              "
                >
                  Recipe Information
                </h3>

              </div>

              <div
                className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
            "
              >

                {/* CUSTOMER */}
                <div>

                  <label className={labelClass}>
                    Customer
                  </label>

                  <select
                    value={form.customerId}
                    onChange={(e) =>
                      updateField(
                        "customerId",
                        e.target.value
                      )
                    }
                    className={inputClass}
                    required
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

                </div>

                {/* GRADE */}
                <div>

                  <label className={labelClass}>
                    Concrete Grade
                  </label>

                  <select
                    value={form.grade}
                    onChange={(e) => {
                      const value = e.target.value;

                      setForm((prev) => ({
                        ...prev,
                        grade: value,
                        recipeName: value,
                      }));
                    }}
                    className={inputClass}
                    required
                  >

                    <option value="">
                      Select Grade
                    </option>

                    <option value="M7.5">M7.5</option>
                    <option value="M10">M10</option>
                    <option value="M15">M15</option>
                    <option value="M20">M20</option>
                    <option value="M25">M25</option>
                    <option value="M30">M30</option>
                    <option value="M35">M35</option>
                    <option value="M40">M40</option>
                    <option value="M45">M45</option>
                    <option value="M50">M50</option>
                    <option value="M55">M55</option>
                    <option value="M60">M60</option>
                    <option value="M65">M65</option>
                    <option value="M70">M70</option>

                  </select>

                </div>

                {/* RECIPE NAME */}
                <div>

                  <label className={labelClass}>
                    Recipe Name
                  </label>

                  <input
                    type="text"
                    value={form.recipeName}
                    readOnly
                    placeholder="Auto generated"
                    className="
                  w-full
                  h-10
                  border
                  border-slate-300
                  rounded-lg
                  px-3
                  text-sm
                  font-semibold
                  text-slate-700
                  bg-slate-100
                  outline-none
                "
                    required
                  />

                </div>

              </div>

              {/* ================================================= */}
              {/* DIVIDER                                           */}
              {/* ================================================= */}

              <div
                className="
              border-t
              border-slate-200
              my-5
            "
              />

              {/* ================================================= */}
              {/* MIX DESIGN                                        */}
              {/* ================================================= */}

              <div
                className="
              flex
              items-center
              justify-between
              mb-4
            "
              >

                <div className="flex items-center gap-2">

                  <Beaker
                    size={18}
                    className="text-emerald-600"
                  />

                  <div>

                    <h3
                      className="
                    text-base
                    font-bold
                    text-slate-900
                  "
                    >
                      Mix Design
                    </h3>

                    <p
                      className="
                    text-sm
                    font-medium
                    text-slate-600
                  "
                    >
                      Material quantities per m³
                    </p>

                  </div>

                </div>

                <span
                  className="
                text-sm
                font-bold
                text-slate-600
              "
                >
                  kg / m³
                </span>

              </div>

              {/* ================================================= */}
              {/* MATERIALS                                         */}
              {/* ================================================= */}

              <div
                className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
            "
              >

                {/* CEMENT */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    Cement
                  </label>

                  <input
                    type="number"
                    placeholder="Add Cement"
                    value={form.cement}
                    onChange={(e) =>
                      updateField(
                        "cement",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* FLY ASH */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    Fly Ash
                  </label>

                  <input
                    type="number"
                    placeholder="Add Fly Ash"
                    value={form.flyash}
                    onChange={(e) =>
                      updateField(
                        "flyash",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* SAND */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    Sand
                  </label>

                  <input
                    type="number"
                    placeholder="Add Sand"
                    value={form.sand}
                    onChange={(e) =>
                      updateField(
                        "sand",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* 10 MM */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    10 MM Aggregate
                  </label>

                  <input
                    type="number"
                    placeholder="Add 10 MM"
                    value={form.mm10}
                    onChange={(e) =>
                      updateField(
                        "mm10",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* 20 MM */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    20 MM Aggregate
                  </label>

                  <input
                    type="number"
                    placeholder="Add 20 MM"
                    value={form.mm20}
                    onChange={(e) =>
                      updateField(
                        "mm20",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* WATER */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    Water
                  </label>

                  <input
                    type="number"
                    placeholder="Add Water"
                    value={form.water}
                    onChange={(e) =>
                      updateField(
                        "water",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* ADMIX */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    Admix
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Add Admix"
                    value={form.admix}
                    onChange={(e) =>
                      updateField(
                        "admix",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

                {/* SLUMP */}
                <div
                  className="
                rounded-xl
                border
                border-slate-200
                p-3
                bg-slate-50/50
              "
                >

                  <label className={labelClass}>
                    Slump
                  </label>

                  <input
                    type="number"
                    placeholder="0"
                    value={form.slump}
                    onChange={(e) =>
                      updateField(
                        "slump",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

              </div>

              {/* ================================================= */}
              {/* STRENGTH                                          */}
              {/* ================================================= */}

              <div className="mt-4 max-w-xs">

                <div
                  className="
                rounded-xl
                border
                border-blue-200
                bg-blue-50/40
                p-3
              "
                >

                  <label className={labelClass}>
                    Strength
                  </label>

                  <input
                    type="number"
                    placeholder="0"
                    value={form.strength}
                    onChange={(e) =>
                      updateField(
                        "strength",
                        e.target.value
                      )
                    }
                    onWheel={preventWheelChange}
                    className={inputClass}
                  />

                </div>

              </div>

              {/* ================================================= */}
              {/* SAVE BUTTON                                       */}
              {/* ================================================= */}

              <div
                className="
              flex
              justify-end
              mt-5
              pt-4
              border-t
              border-slate-200
            "
              >

                <button
                  type="submit"
                  className="
                inline-flex
                items-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-7
                py-2.5
                rounded-xl
                font-bold
                text-sm
                shadow-sm
                hover:shadow-md
                transition
              "
                >

                  <Save size={17} />

                  Save Recipe

                </button>

              </div>

            </div>

          </form>
        </>
      )}

      {/* ================================================= */}
      {/* RECIPE TABLE                                      */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        {/* TABLE HEADER */}
        <div
          className="
            px-6
            py-4
            border-b
            border-slate-200
            flex
            items-center
            justify-between
            bg-slate-50/50
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Recipe List
            </h2>

            <p
              className="
                text-sm
                font-medium
                text-slate-600
                mt-1
              "
            >
              All configured concrete mix designs
            </p>

          </div>

          <div
            className="
              px-3
              py-1.5
              rounded-lg
              bg-blue-50
              text-blue-700
              text-sm
              font-bold
            "
          >
            {filtered.length} Recipes
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <DataTable
            headers={[
              "Recipe No",
              "Customer",
              "Recipe Name",
              "Grade",
              "Cement",
              "Fly Ash",
              "Sand",
              "10 mm",
              "20 mm",
              "Water",
              "Admix",
              "Slump",
              "Strength",
              ...(hasRole("admin", "operator")
                ? ["Action"]
                : []),
            ]}
          >

            {filtered.map((recipe) => (

              <tr
                key={recipe.id}
                className="
                  border-b
                  border-slate-100
                  hover:bg-slate-50
                  transition
                "
              >

                <td className="py-4 px-3">

                  <span
                    className="
                      font-bold
                      text-blue-600
                    "
                  >
                    {recipe.recipe_no}
                  </span>

                </td>

                <td
                  className="
                    font-semibold
                    text-slate-800
                  "
                >
                  {recipe.customer_name || "-"}
                </td>

                <td
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  {recipe.recipe_name}
                </td>

                <td>

                  <span
                    className="
                      inline-flex
                      px-2.5
                      py-1
                      rounded-lg
                      bg-blue-50
                      text-blue-700
                      text-xs
                      font-bold
                    "
                  >
                    {recipe.grade}
                  </span>

                </td>

                <td className="font-medium text-slate-700">
                  {recipe.cement}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.flyash}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.sand}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.mm10}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.mm20}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.water}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.admix}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.slump}
                </td>

                <td className="font-medium text-slate-700">
                  {recipe.strength}
                </td>

                {hasRole("admin", "operator") && (
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(recipe.id)
                      }
                      className="
        inline-flex
        items-center
        gap-1.5
        bg-red-50
        text-red-600
        hover:bg-red-600
        hover:text-white
        px-3
        py-2
        rounded-lg
        text-xs
        font-bold
        transition
      "
                    >
                      <Trash2 size={14} />

                      Delete
                    </button>
                  </td>
                )}

              </tr>

            ))}

          </DataTable>

        </div>

      </div>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION                              */}
      {/* ================================================= */}

      {deleteRecipeId !== null && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/50
            backdrop-blur-sm
            px-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            <div className="p-6">

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-red-50
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >

                <Trash2
                  size={22}
                  className="text-red-600"
                />

              </div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Delete Recipe?
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  font-medium
                  text-slate-600
                  leading-6
                "
              >
                Are you sure you want to delete this recipe?
                This action cannot be undone.
              </p>

            </div>

            <div
              className="
                px-6
                py-4
                bg-slate-50
                border-t
                border-slate-200
                flex
                justify-end
                gap-3
              "
            >

              <button
                type="button"
                onClick={() =>
                  setDeleteRecipeId(null)
                }
                disabled={deleting}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-700
                  hover:bg-white
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteRecipe}
                disabled={deleting}
                className="
                  rounded-xl
                  bg-red-600
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  hover:bg-red-700
                  disabled:opacity-50
                "
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Recipe"}
              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}