import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";


import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DeliveryChallanPreview from "../../components/batch/DeliveryChallanPreview";
import BatchReportPreview from "../../components/batch/BatchReportPreview";

import VehicleSelector from "../../components/batch/VehicleSelector";
import DriverSelector from "../../components/batch/DriverSelector";
import BatchTable from "../../components/batch/BatchTable";



import { getCustomers } from "../../services/customer.service";
import { getRecipesByCustomer } from "../../services/customerRecipe.service";
import { getVehicles } from "../../services/vehicle.service";
import { getDrivers } from "../../services/driver.service";

import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  cancelBatch,
} from "../../services/batch.service";

import type { Recipe } from "../../types/recipe";
import type { Customer } from "../../types/customer";
import type { Vehicle } from "../../types/vehicle";
import type { Driver } from "../../types/driver";
import type { Batch } from "../../types/batch";
import type { BatchReportRow } from "../../types/batch";
import {
  Plus,
  Save,
  Copy,
  Printer,
} from "lucide-react";

export default function BatchEntry() {

  const reportRef = useRef<HTMLDivElement>(null);
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [customerId, setCustomerId] = useState(0);

  const [selectedCustomerName, setSelectedCustomerName] =
    useState("");


  const [recipes, setRecipes] =
    useState<Recipe[]>([]);

  const [recipeId, setRecipeId] =
    useState(0);

  const [cement, setCement] = useState(0);
  const [flyash, setFlyash] = useState(0);
  const [sand, setSand] = useState(0);
  const [mm10, setMm10] = useState(0);
  const [mm20, setMm20] = useState(0);
  const [water, setWater] = useState(0);
  const [admix, setAdmix] = useState(0);

  const [recipeSlump, setRecipeSlump] = useState(0);
  const [recipeStrength, setRecipeStrength] = useState(0);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [vehicleId, setVehicleId] =
    useState(0);


  const [drivers, setDrivers] =
    useState<Driver[]>([]);

  const [driverId, setDriverId] =
    useState(0);


  const [batches, setBatches] =
    useState<Batch[]>([]);


  const [savedBatch, setSavedBatch] =
    useState<any | null>(null);

  const [previewBatch, setPreviewBatch] =
    useState<any | null>(null);

  const [editingBatchId, setEditingBatchId] = useState<number | null>(null);

  const [quantity, setQuantity] =
    useState(0);


  const [orderQty, setOrderQty] =
    useState(0);


  const [ticketQty, setTicketQty] =
    useState(0);


  const [orderQtyLeft, setOrderQtyLeft] =
    useState(0);



  const [orderNo, setOrderNo] =
    useState(0);

  const [deliveryNo, setDeliveryNo] =
    useState(0);

  const [ticketNo, setTicketNo] =
    useState(0);



  const [typeOfLoading, setTypeOfLoading] =
    useState("");


  const currentDate = new Date();

  const localToday =
    currentDate.getFullYear() +
    "-" +
    String(currentDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(currentDate.getDate()).padStart(2, "0");

  const [batchDate, setBatchDate] =
    useState(localToday);



  const [batchTime, setBatchTime] = useState(
    currentDate.toTimeString().split(" ")[0]
  );

  const [isLiveTime, setIsLiveTime] = useState(true);



  const [loading, setLoading] =
    useState(false);


  const [confirmOpen, setConfirmOpen] =
    useState(false);


  const [deleteId, setDeleteId] =
    useState<number | null>(null);


  useEffect(() => {
    if (!isLiveTime) return;

    const updateTime = () => {
      const now = new Date();

      const time =
        now.toTimeString().split(" ")[0];

      setBatchTime(time);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isLiveTime]);
  useEffect(() => {

    loadCustomers();
    loadVehicles();
    loadDrivers();
    loadBatches();

  }, []);



  useEffect(() => {
    if (!customerId) {
      setRecipes([]);
      setRecipeId(0);
      return;
    }

    loadRecipes(customerId);
  }, [customerId]);
  async function loadCustomers() {

    try {

      const data = await getCustomers();


      const mapped = data.map((c: any) => ({

        id: c.id,

        customer: c.customer,

        site: c.site,

      }));


      setCustomers(mapped);







    } catch {

      toast.error(
        "Failed to load customers."
      );

    }

  }

  async function handleCancelBatch(
    id: number,
    reason: string
  ) {
    try {
      setLoading(true);

      await cancelBatch(id, reason);

      await loadBatches();

      toast.success("Batch cancelled successfully.");
    } catch (error) {
      console.error(
        "Failed to cancel batch:",
        error
      );

      toast.error("Failed to cancel batch.");
    } finally {
      setLoading(false);
    }
  }



  async function loadRecipes(customerId: number) {

    try {

      const data =
        await getRecipesByCustomer(customerId);


      setRecipes(data);

      if (!editingBatchId) {
        setRecipeId(0);
      }



    } catch {

      toast.error(
        "Failed to load recipes."
      );

    }

  }





  async function loadVehicles() {
    try {
      const data = await getVehicles();

      const mapped = data.map((v: any) => ({
        id: Number(v.id),
        vehicleNo: v.vehicle_no || v.vehicleNo || "",
        type: v.type || "",
        status: v.status || "",
      }));

      setVehicles(mapped);
    } catch {
      toast.error("Failed to load vehicles.");
    }
  }





  async function loadDrivers() {

    try {


      const data = await getDrivers();


      const mapped = data.map((d: any) => ({

        id: d.id,

        name: d.driver_name,

        mobile: d.mobile,

        licenseNo: d.license_no,

        status: d.status,

      }));


      setDrivers(mapped);











    } catch {

      toast.error(
        "Failed to load drivers."
      );

    }

  }





  async function loadBatches() {
    setLoading(true);

    try {
      const data = await getBatches();
      console.log(
        "ALL BATCH DATES:",
        data.map((b: any) => ({
          id: b.id,
          batch_date: b.batch_date,
        }))
      );
      // Today's date
      const now = new Date();

      const today =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");

      // Map ALL batches
      const mapped = data.map((b: any) => ({
        id: b.id,
        sr_no: Number(b.sr_no),
        batch_no: b.batch_no,

        customer_id: Number(b.customer_id),
        recipe_id: Number(b.recipe_id),
        vehicle_id: Number(b.vehicle_id),
        driver_id: Number(b.driver_id),

        customer: b.customer,
        site: b.site,
        recipe: b.recipe_name,
        grade: b.grade,
        vehicleNo: b.vehicle_no,
        driverName: b.driver_name,

        quantity: Number(b.quantity),
        cumulativeQty: Number(b.cumulative_qty) || 0,

        orderNo: Number(b.order_no),
        deliveryNo: Number(b.delivery_no),
        ticketNo: Number(b.ticket_no),
        orderQty: Number(b.order_qty),
        ticketQty: Number(b.ticket_qty),
        orderQtyLeft: Number(b.order_qty_left),

        batchDate: b.batch_date,
        batchTime: b.batch_time,
        type_of_loading: b.type_of_loading,
        typeOfLoading: b.type_of_loading,

        status: b.status,
        end_time: b.end_time,

        // Set values
        cement: Number(b.cement) || 0,
        flyash: Number(b.flyash) || 0,
        sand: Number(b.sand) || 0,
        mm10: Number(b.mm10) || 0,
        mm20: Number(b.mm20) || 0,
        water: Number(b.water) || 0,
        admix: Number(b.admix) || 0,

        // Recipe details
        slump: Number(b.slump) || 0,
        strength: Number(b.strength) || 0,

        // Actual values
        cement_act: Number(b.cement_act) || 0,
        flyash_act: Number(b.flyash_act) || 0,
        sand_act: Number(b.sand_act) || 0,
        mm10_act: Number(b.mm10_act) || 0,
        mm20_act: Number(b.mm20_act) || 0,
        water_act: Number(b.water_act) || 0,
        admix_act: Number(b.admix_act) || 0,

        // Original batch report rows
        rows: b.rows || [],
      }));

      // --------------------------------
      // SHOW ONLY TODAY'S HISTORY
      // --------------------------------

      console.log("TODAY:", today);

      console.log(
        "MAPPED BATCH DATES:",
        mapped.map((b: any) => ({
          id: b.id,
          batchDate: b.batchDate,
        }))
      );

      const todayBatches = mapped
        .filter((batch: any) => {
          if (!batch.batchDate) return false;

          const date = new Date(batch.batchDate);

          if (isNaN(date.getTime())) return false;

          const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).formatToParts(date);

          const year = parts.find((p) => p.type === "year")?.value;
          const month = parts.find((p) => p.type === "month")?.value;
          const day = parts.find((p) => p.type === "day")?.value;

          const batchDate = `${year}-${month}-${day}`;

          return batchDate === today;
        })
        .sort(
          (a: any, b: any) =>
            Number(b.id) - Number(a.id)
        );

      setBatches(todayBatches);

      // --------------------------------
      // FIND THE LAST NUMBERS FROM ALL
      // BATCHES, INCLUDING PREVIOUS DATES
      // --------------------------------
      if (mapped.length > 0) {
        const lastOrderNo = Math.max(
          ...mapped.map(
            (b: any) => Number(b.orderNo) || 0
          )
        );

        const lastDeliveryNo = Math.max(
          ...mapped.map(
            (b: any) => Number(b.deliveryNo) || 0
          )
        );

        const lastTicketNo = Math.max(
          ...mapped.map(
            (b: any) => Number(b.ticketNo) || 0
          )
        );

        setOrderNo(lastOrderNo + 1);
        setDeliveryNo(lastDeliveryNo + 1);
        setTicketNo(lastTicketNo + 1);
      } else {
        // No batches exist anywhere in database
        setOrderNo(1);
        setDeliveryNo(1);
        setTicketNo(1);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load batches."
      );
    } finally {
      setLoading(false);
    }
  }



  const uniqueCustomers = useMemo(() => {
    const names = new Set<string>();

    return customers.filter((c) => {
      const normalizedName = c.customer.trim().toLowerCase();

      if (names.has(normalizedName)) {
        return false;
      }

      names.add(normalizedName);
      return true;
    });
  }, [customers]);

  const selectedCustomerSites = useMemo(() => {
    if (!selectedCustomerName) {
      return [];
    }

    const normalizedSelectedName =
      selectedCustomerName.trim().toLowerCase();

    return customers.filter(
      (c) =>
        c.customer.trim().toLowerCase() ===
        normalizedSelectedName
    );
  }, [customers, selectedCustomerName]);

  const customer = useMemo(
    () => customers.find((c) => c.id === customerId),
    [customers, customerId]
  );



  const recipe = useMemo(

    () => recipes.find(
      (r) => r.id === recipeId
    ),

    [recipes, recipeId]

  );

  useEffect(() => {
    if (!recipe) {
      if (editingBatchId === null) {
        setCement(0);
        setFlyash(0);
        setSand(0);
        setMm10(0);
        setMm20(0);
        setWater(0);
        setAdmix(0);
        setRecipeSlump(0);
        setRecipeStrength(0);
      }

      return;
    }

    // If a recipe is selected, always load
// its current recipe details.
// This also allows changing recipe while editing.

    // New batch: load values from selected recipe.
    setCement(Number(recipe.cement) || 0);
    setFlyash(Number(recipe.flyash) || 0);
    setSand(Number(recipe.sand) || 0);
    setMm10(Number(recipe.mm10) || 0);
    setMm20(Number(recipe.mm20) || 0);
    setWater(Number(recipe.water) || 0);
    setAdmix(Number(recipe.admix) || 0);

    setRecipeSlump(
      Number((recipe as any).slump) || 0
    );

    setRecipeStrength(
      Number((recipe as any).strength) || 0
    );
  }, [recipe, editingBatchId]);

  function calculateEndTime(
    start: string,
    qty: number
  ) {

    const [hours, minutes] =
      start.split(":").map(Number);


    const date = new Date();

    date.setHours(
      hours,
      minutes,
      0
    );


    // 1 minute 20-22 seconds per m3
    const totalSeconds =
      (qty * 60) +
      (qty * (Math.floor(Math.random() * 3) + 20));


    date.setSeconds(
      date.getSeconds() + totalSeconds
    );


    return date
      .toTimeString()
      .split(" ")[0];

  }
  function getCurrentTime() {
    const now = new Date();

    return now
      .toTimeString()
      .split(" ")[0];
  }

  function generateAct(value: number) {
    if (value === 0) {
      return 0;
    }

    const difference = Math.floor(Math.random() * 4) + 1;
    const direction = Math.random() < 0.5 ? -1 : 1;

    return Math.max(0, value + difference * direction);
  }

  function preventWheelChange(
    e: React.WheelEvent<HTMLInputElement>
  ) {
    e.currentTarget.blur();
  }

  const handleEditBatch = (batch: Batch) => {
    setEditingBatchId(Number(batch.id));

    // Customer
    setSelectedCustomerName(batch.customer || "");
    setCustomerId(Number(batch.customer_id || 0));

    // Recipe
    setRecipeId(Number(batch.recipe_id || 0));

    // Vehicle / Driver
    setVehicleId(Number(batch.vehicleId || batch.vehicle_id || 0));
    setDriverId(Number(batch.driverId || batch.driver_id || 0));

    // Quantities
    setQuantity(Number(batch.quantity || 0));
    setOrderQty(Number(batch.orderQty || batch.order_qty || 0));
    setTicketQty(Number(batch.ticketQty || batch.ticket_qty || 0));
    setOrderQtyLeft(
      Number(batch.orderQtyLeft || batch.order_qty_left || 0)
    );

    // Numbers — KEEP EXISTING VALUES
    setOrderNo(Number(batch.orderNo || batch.order_no || 0));
    setDeliveryNo(
      Number(batch.deliveryNo || batch.delivery_no || 0)
    );
    setTicketNo(
      Number(batch.ticketNo || batch.ticket_no || 0)
    );

    // Type of Loading
    setTypeOfLoading(
      batch.typeOfLoading || batch.type_of_loading || ""
    );

    // Date
    // Date
const savedDate =
  batch.batchDate || batch.batch_date || "";

let formattedDate = "";

if (savedDate) {
  const dateString = String(savedDate);

  if (dateString.includes("T")) {
    // API may return PostgreSQL DATE as ISO timestamp.
    // Convert it to the correct Indian calendar date.
    const date = new Date(dateString);

    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    formattedDate = `${year}-${month}-${day}`;
  } else {
    // Already a YYYY-MM-DD date.
    formattedDate = dateString.slice(0, 10);
  }
}

setBatchDate(formattedDate);

    // Start Time
    const savedTime =
      batch.batchTime || batch.batch_time || "";

    setBatchTime(
      savedTime.length >= 8
        ? savedTime.slice(0, 8)
        : savedTime
    );

    setIsLiveTime(false);

    // Recipe / Material values
    setCement(Number(batch.cement || 0));
    setFlyash(Number(batch.flyash || 0));
    setSand(Number(batch.sand || 0));
    setMm10(Number(batch.mm10 || 0));
    setMm20(Number(batch.mm20 || 0));
    setWater(Number(batch.water || 0));
    setAdmix(Number(batch.admix || 0));

    // Slump / Strength
    setRecipeSlump(Number(batch.slump || 0));
    setRecipeStrength(Number(batch.strength || 0));

    // Clear preview
    setPreviewBatch(null);
    setSavedBatch(null);

    toast.success("Batch loaded for editing.");
  };

  function handleClearBatch() {
    // Customer / Site / Recipe
    setSelectedCustomerName("");
    setCustomerId(0);
    setRecipeId(0);
    setRecipes([]);

    // Vehicle / Driver
    setVehicleId(0);
    setDriverId(0);

    // Type of Loading
    setTypeOfLoading("");

    // Quantities
    setQuantity(0);
    setOrderQty(0);
    setTicketQty(0);
    setOrderQtyLeft(0);

    // Recipe values
    setCement(0);
    setFlyash(0);
    setSand(0);
    setMm10(0);
    setMm20(0);
    setWater(0);
    setAdmix(0);
    setRecipeSlump(0);
    setRecipeStrength(0);
    setEditingBatchId(null);
    // Clear BOTH previews
    setPreviewBatch(null);
    setSavedBatch(null);

    // Reset date/time
    const now = new Date();

    const today =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    setBatchDate(today);
    setBatchTime(
      now.toTimeString().split(" ")[0]
    );

    setIsLiveTime(true);

    toast.success("Batch form cleared.");
  }

  /* ================================================= */
  /* CREATE BATCH PREVIEW                              */
  /* ================================================= */

  function handleCreateBatch() {
    const errors: string[] = [];

    /* --------------------------------------------- */
    /* REQUIRED FIELD VALIDATION                     */
    /* --------------------------------------------- */

    if (!selectedCustomerName) {
      errors.push("Select Customer");
    }

    if (!customerId || !customer) {
      errors.push("Select Site");
    }

    if (!recipeId || !recipe) {
      errors.push("Select Recipe");
    }

    if (!vehicleId) {
      errors.push("Select Vehicle");
    }

    if (!driverId) {
      errors.push("Select Driver");
    }

    if (!typeOfLoading.trim()) {
      errors.push("Select Type of Loading");
    }

    if (!Number.isFinite(orderQty) || orderQty <= 0) {
      errors.push("Enter Order Qty greater than 0");
    }

    if (!batchDate) {
      errors.push("Select Date");
    }

    if (!batchTime) {
      errors.push("Enter Start Time");
    }

    /* --------------------------------------------- */
    /* SHOW ALL ERRORS                               */
    /* --------------------------------------------- */

    if (errors.length > 0) {
      toast.error(
        <div>
          <div className="font-semibold mb-1">
            Please complete the following:
          </div>

          <ul className="list-disc pl-5 text-sm">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>,
        {
          duration: 1000,
        }
      );

      return;
    }

    /* --------------------------------------------- */
    /* SAFETY CHECK                                  */
    /* --------------------------------------------- */

    if (!customer || !recipe) {
      return;
    }

    try {
      /* ------------------------------------------- */
      /* END TIME                                    */
      /* ------------------------------------------- */

      const existingBatch = editingBatchId !== null
        ? batches.find(
          (b: any) =>
            Number(b.id) === Number(editingBatchId)
        )
        : null;

      const generatedEndTime =
        editingBatchId !== null && existingBatch
          ? (existingBatch.end_time || "")
          : calculateEndTime(
            batchTime,
            orderQty
          );

      const newBatchNo =
        editingBatchId !== null && existingBatch
          ? existingBatch.batch_no
          : `B${Date.now()}`;

      /* ------------------------------------------- */
      /* GENERATE ACTUAL VALUES                      */
      /* ------------------------------------------- */
      const cementAct =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).cement_act) || 0
          : generateAct(cement);

      const flyashAct =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).flyash_act) || 0
          : generateAct(flyash);

      const sandAct =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).sand_act) || 0
          : generateAct(sand);

      const mm10Act =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).mm10_act) || 0
          : generateAct(mm10);

      const mm20Act =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).mm20_act) || 0
          : generateAct(mm20);

      const waterAct =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).water_act) || 0
          : generateAct(water);

      const admixAct =
        editingBatchId !== null && existingBatch
          ? Number((existingBatch as any).admix_act) || 0
          : generateAct(admix);
      /* ------------------------------------------- */
      /* GENERATE BATCH REPORT ROWS                  */
      /* ACCORDING TO ORDER QTY                      */
      /* ------------------------------------------- */
     

     
const rows: BatchReportRow[] = (() => {
  const generatedRows: BatchReportRow[] = [];

  let remaining = Number(orderQty);

  while (remaining > 0) {
    const size = remaining >= 1 ? 1 : remaining;

    generatedRows.push({
      batch_size: size,

      cement_set: Number(cement) * size,
      cement_act: generateAct(Number(cement) * size),

      flyash_set: Number(flyash) * size,
      flyash_act: generateAct(Number(flyash) * size),

      sand_set: Number(sand) * size,
      sand_act: generateAct(Number(sand) * size),

      mm10_set: Number(mm10) * size,
      mm10_act: generateAct(Number(mm10) * size),

      mm20_set: Number(mm20) * size,
      mm20_act: generateAct(Number(mm20) * size),

      water_set: Number(water) * size,
      water_act: generateAct(Number(water) * size),

      admix_set: Number(admix) * size,
      admix_act: generateAct(Number(admix) * size),
    });

    remaining -= size;
  }

  return generatedRows;
})();


      /* ------------------------------------------- */
      /* CREATE PREVIEW OBJECT                       */
      /* ------------------------------------------- */

      const preview = {
        id: 0,

        batch_no:
          newBatchNo,

        /* STORE SELECTED IDs */
        customer_id:
          customerId,

        recipe_id:
          recipeId,

        vehicle_id:
          vehicleId,

        driver_id:
          driverId,

        customer:
          customer.customer,

        site:
          customer.site,

        recipe_name:
          recipe.recipe_name,

        recipe_no:
          recipe.recipe_no,

        grade:
          recipe.grade,

        type_of_loading:
          typeOfLoading,

        vehicle_no:
          vehicles.find(
            (v) =>
              v.id === vehicleId
          )?.vehicleNo || "",

        driver_name:
          drivers.find(
            (d) =>
              d.id === driverId
          )?.name || "",

        quantity,

        cumulative_qty: 0,
        order_no:
          editingBatchId !== null && existingBatch
            ? Number(existingBatch.orderNo || existingBatch.order_no || 0)
            : orderNo,

        delivery_no:
          editingBatchId !== null && existingBatch
            ? Number(existingBatch.deliveryNo || existingBatch.delivery_no || 0)
            : deliveryNo,

        ticket_no:
          editingBatchId !== null && existingBatch
            ? Number(existingBatch.ticketNo || existingBatch.ticket_no || 0)
            : ticketNo,

        order_qty:
          orderQty,

        ticket_qty:
          ticketQty,

        order_qty_left:
          orderQtyLeft,

        batch_date:
          batchDate,

        batch_time:
          batchTime,

        end_time:
          generatedEndTime,

        cement,
        flyash,
        sand,
        mm10,
        mm20,
        water,
        admix,

        cement_act:
          cementAct,

        flyash_act:
          flyashAct,

        sand_act:
          sandAct,

        mm10_act:
          mm10Act,

        mm20_act:
          mm20Act,

        water_act:
          waterAct,

        admix_act:
          admixAct,

        slump:
          recipeSlump,

        strength:
          recipeStrength,

        rows,

        status:
          "Completed",
      };

      /* ------------------------------------------- */
      /* SHOW PREVIEW ONLY                           */
      /* ------------------------------------------- */

      setPreviewBatch(preview);

      /* ------------------------------------------- */
      /* REMOVE OLD SAVED BATCH                      */
      /* ------------------------------------------- */

      setSavedBatch(null);

      toast.success(
        "Batch created successfully."

      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create batch."
      );
    }
  }


  /* ================================================= */
  /* SAVE CONFIRMED BATCH                              */
  /* ================================================= */

  async function handleSaveBatch() {
    if (!previewBatch) {
      toast.error("Please create the batch first.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        batchNo: previewBatch.batch_no,

        customerId: previewBatch.customer_id,
        recipeId: previewBatch.recipe_id,
        vehicleId: previewBatch.vehicle_id,
        driverId: previewBatch.driver_id,

        quantity: previewBatch.quantity,

        // Kept for new batch creation.
        // Backend preserves existing Order No during edit.
        orderNo: previewBatch.order_no,

        deliveryNo: previewBatch.delivery_no,
        ticketNo: previewBatch.ticket_no,

        orderQty: previewBatch.order_qty,
        ticketQty: previewBatch.ticket_qty,
        orderQtyLeft: previewBatch.order_qty_left,

        batchDate: previewBatch.batch_date,
        batchTime: previewBatch.batch_time,
        endTime: previewBatch.end_time,

        cement: previewBatch.cement,
        flyash: previewBatch.flyash,
        sand: previewBatch.sand,
        mm10: previewBatch.mm10,
        mm20: previewBatch.mm20,
        water: previewBatch.water,
        admix: previewBatch.admix,

        slump: previewBatch.slump,
        strength: previewBatch.strength,

        cementAct: previewBatch.cement_act,
        flyashAct: previewBatch.flyash_act,
        sandAct: previewBatch.sand_act,
        mm10Act: previewBatch.mm10_act,
        mm20Act: previewBatch.mm20_act,
        waterAct: previewBatch.water_act,
        admixAct: previewBatch.admix_act,

        reportRows: previewBatch.rows,

        status: "Completed",

        typeOfLoading: previewBatch.type_of_loading,
      };

      let saved: any;

      // ============================================
      // EDIT EXISTING BATCH
      // ============================================
      if (editingBatchId !== null) {
        const response = await updateBatch(
          editingBatchId,
          payload
        );

        saved = response?.batch || response;

       setSavedBatch({
  ...previewBatch,

  id: editingBatchId,
        sr_no:
  Number(saved?.sr_no) ||
  
  0,
  customer_id: previewBatch.customer_id,
  recipe_id: previewBatch.recipe_id,
  vehicle_id: previewBatch.vehicle_id,
  driver_id: previewBatch.driver_id,

  customerId: previewBatch.customer_id,
  recipeId: previewBatch.recipe_id,
  vehicleId: previewBatch.vehicle_id,
  driverId: previewBatch.driver_id,

  cumulative_qty:
    Number(saved?.cumulative_qty) || 0,

  status: saved?.status || "Completed",
});

        toast.success("Batch changes saved successfully.");

        // Exit edit mode
        setEditingBatchId(null);
      }

      // ============================================
      // CREATE NEW BATCH
      // ============================================
      else {
  const response = await createBatch(payload);

  saved = response?.batch || response;

  setSavedBatch({
    ...previewBatch,

    // Values generated by PostgreSQL/backend
    id: saved?.id || 0,
    sr_no: Number(saved?.sr_no) || 0,

    // Actual saved numbers from backend
    batch_no:
      saved?.batch_no || previewBatch.batch_no,

    order_no:
      Number(saved?.order_no) || 0,

    delivery_no:
      Number(saved?.delivery_no) || 0,

    ticket_no:
      Number(saved?.ticket_no) || 0,

    customer_id: previewBatch.customer_id,
    recipe_id: previewBatch.recipe_id,
    vehicle_id: previewBatch.vehicle_id,
    driver_id: previewBatch.driver_id,

    customerId: previewBatch.customer_id,
    recipeId: previewBatch.recipe_id,
    vehicleId: previewBatch.vehicle_id,
    driverId: previewBatch.driver_id,

    cumulative_qty:
      Number(saved?.cumulative_qty) || 0,

    status:
      saved?.status || "Completed",
  });

  toast.success("Batch saved successfully.");
}

      // ============================================
      // COMMON AFTER SAVE / UPDATE
      // ============================================

      await loadBatches();

      setPreviewBatch(null);

      setBatchTime(getCurrentTime());
      setIsLiveTime(true);



    } catch (error) {
      console.error(
        "Failed to save batch:",
        error
      );

      toast.error(
        editingBatchId !== null
          ? "Failed to save changes."
          : "Failed to save batch."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================================================= */
  /* COPY WHATSAPP MESSAGE                             */
  /* ================================================= */

  async function handleCopyWhatsAppMessage() {
    if (!savedBatch) {
      toast.error("Please save the batch first.");
      return;
    }

    try {
      const allBatches = await getBatches();

      /* --------------------------------------------- */
      /* CURRENT BATCH DATE                             */
      /* --------------------------------------------- */

      const savedDate = new Date(savedBatch.batch_date);

      const currentDate =
        savedDate.getFullYear() +
        "-" +
        String(savedDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(savedDate.getDate()).padStart(2, "0");


      /* --------------------------------------------- */
      /* SAFE DATE FUNCTION                             */
      /* --------------------------------------------- */

      const getDate = (value: any) => {
        if (!value) return "";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
          return "";
        }

        return (
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0")
        );
      };


      /* --------------------------------------------- */
      /* TODAY'S BATCHES                                */
      /* --------------------------------------------- */

      const todayBatches = allBatches
        .filter(
          (batch: any) =>
            getDate(batch.batch_date) === currentDate
        )
        .sort(
          (a: any, b: any) =>
            Number(a.id) - Number(b.id)
        );


      /* --------------------------------------------- */
      /* SR. NO.                                        */
      /* --------------------------------------------- */

     const srNo =
  todayBatches.findIndex(
    (batch: any) =>
      Number(batch.id) === Number(savedBatch.id)
  ) + 1;


      /* --------------------------------------------- */
      /* CUSTOMER + RECIPE                              */
      /* --------------------------------------------- */

      const currentCustomerId =
        Number(
          savedBatch.customer_id ??
          savedBatch.customerId
        );

      const currentRecipeId =
        Number(
          savedBatch.recipe_id ??
          savedBatch.recipeId
        );


      /* --------------------------------------------- */
      /* PARTY QTY                                      */
      /* SAME CUSTOMER + SAME GRADE/RECIPE             */
      /* --------------------------------------------- */

      const partyQty =
        todayBatches
          .filter((batch: any) => {

            const batchCustomerId =
              Number(
                batch.customer_id ??
                batch.customerId
              );

            const batchRecipeId =
              Number(
                batch.recipe_id ??
                batch.recipeId
              );

            return (
              batchCustomerId ===
              currentCustomerId &&

              batchRecipeId ===
              currentRecipeId &&

              Number(batch.id) <=
              Number(savedBatch.id)
            );
          })
          .reduce(
            (
              total: number,
              batch: any
            ) =>
              total +
              (Number(batch.quantity) || 0),
            0
          );


      /* --------------------------------------------- */
      /* RUNNING QTY                                    */
      /* ALL BATCHES OF THAT DAY                        */
      /* --------------------------------------------- */

      const runningQty =
        todayBatches
          .filter(
            (batch: any) =>
              Number(batch.id) <=
              Number(savedBatch.id)
          )
          .reduce(
            (
              total: number,
              batch: any
            ) =>
              total +
              (Number(batch.quantity) || 0),
            0
          );


      /* --------------------------------------------- */
      /* DATE                                           */
      /* --------------------------------------------- */

      const formattedDate =
        `${String(savedDate.getDate()).padStart(2, "0")}/` +
        `${String(savedDate.getMonth() + 1).padStart(2, "0")}/` +
        `${savedDate.getFullYear()}`;


      /* --------------------------------------------- */
      /* MESSAGE                                        */
      /* --------------------------------------------- */

      const message =
        `\`\`\`
  Date          :- ${formattedDate}
  Site Name     :- ${savedBatch.customer || ""}
  Sr. No.       :- ${srNo}
  Challan No.   :- ${savedBatch.delivery_no || ""}  
  Vehicle No.   :- ${savedBatch.vehicle_no || ""}
  Grade.        :- ${savedBatch.grade || ""}
  Challan Qty.  :- ${Number(savedBatch.quantity || 0).toFixed(2)} m³
  Party Qty.    :- ${partyQty.toFixed(2)} m³
  Running Qty.  :- ${runningQty.toFixed(2)} m³
  Delivery Mode :- ${savedBatch.type_of_loading ||
        savedBatch.typeOfLoading ||
        ""
        }
  \`\`\``;


      /* --------------------------------------------- */
      /* COPY                                           */
      /* --------------------------------------------- */

      await navigator.clipboard.writeText(message);

      toast.success(
        "WhatsApp message copied successfully."
      );

    } catch (error) {

      console.error(
        "Failed to copy WhatsApp message:",
        error
      );

      toast.error(
        "Failed to copy WhatsApp message."
      );
    }
  }


  function handleDeleteBatch(id: number) {

    /*
    * Find the latest created batch.
    * Highest database ID = latest created batch.
    */
    if (batches.length === 0) {
      return;
    }

    const latestBatch = batches.reduce(
      (latest, batch) =>
        Number(batch.id) > Number(latest.id)
          ? batch
          : latest
    );

    /*
    * Only latest batch can be deleted.
    */
    if (Number(id) !== Number(latestBatch.id)) {

      toast.error(
        "Only the latest created batch can be deleted."
      );

      return;
    }

    setDeleteId(id);
    setConfirmOpen(true);
  }





  async function confirmDelete() {

    if (deleteId === null) {
      return;
    }

    try {

      setLoading(true);

      /*
      * Delete the latest batch
      */
      await deleteBatch(deleteId);

      /*
      * Clear currently displayed
      * saved/preview batch if it
      * was the deleted batch.
      */
      if (
        savedBatch &&
        Number(savedBatch.id) === Number(deleteId)
      ) {
        setSavedBatch(null);
      }

      if (
        previewBatch &&
        Number(previewBatch.id) === Number(deleteId)
      ) {
        setPreviewBatch(null);
      }

      /*
      * Reload batches.
      *
      * loadBatches() will automatically
      * calculate:
      *
      * previous max Order No + 1
      * previous max Delivery No + 1
      * previous max Ticket No + 1
      */
      await loadBatches();

      toast.success(
        "Batch deleted successfully."
      );

    } catch (error) {

      console.error(
        "Failed to delete batch:",
        error
      );

      toast.error(
        "Failed to delete batch."
      );

    } finally {

      setLoading(false);

      setConfirmOpen(false);

      setDeleteId(null);

    }
  }


  const handlePrint = () => {
    window.print();
  };


  const printStyles = `
    /* ===================================================== */
    /* NORMAL SCREEN                                         */
    /* ===================================================== */

    /* Hide Page 3 completely on screen */
    .print-page-3 {
      display: none !important;
    }


    /* ===================================================== */
    /* MOVE CHALLANS OUTWARD - SCREEN + PRINT                */
    /* ===================================================== */

    /* LEFT: Customer / Fix */
    .challan-left-copy {
      transform: translateX(-15px) !important;
    }

    /* RIGHT: Invoice / Account */
    .challan-right-copy {
      transform: translateX(15px) !important;
    }


    /* ===================================================== */
    /* PAGE 2 SCREEN PREVIEW                                 */
    /* ===================================================== */

    .print-page-2 {
      display: block !important;

      width: 100% !important;

      /* Gap between Batch Report and Challan */
      margin-top: 30px !important;

      box-sizing: border-box !important;
    }


    .print-page-2 .challan-print-grid {
      display: grid !important;

      grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr) !important;

      column-gap: 16px !important;

      width: 100% !important;

      margin: 0 !important;
      padding: 0 !important;

      position: relative !important;

      box-sizing: border-box !important;
    }


    /* Individual challans */

    .print-page-2 .challan-copy {
      width: 100% !important; 

      min-width: 0 !important;

      box-sizing: border-box !important;
    }


    /* ===================================================== */
    /* SCREEN CUT LINE                                      */
    /* ===================================================== */

    .print-page-2 .challan-cut-line {
      position: absolute !important;

      top: 0 !important;
      bottom: 0 !important;

      left: 50% !important;

      width: 0 !important;

      border-left: 1px dashed #000 !important;

      transform: translateX(-50%) !important;

      z-index: 10 !important;

      pointer-events: none !important;
    }


    /* ===================================================== */
    /* PRINT                                                 */
    /* ===================================================== */

    @media print {

      @page {
        size: landscape;
        margin: 0;
      }


      html,
      body {
        margin: 0 !important;
        padding: 0 !important;

        width: 100% !important;

        height: 100% !important;
        min-height: 0 !important;

        background: white !important;

        overflow: hidden !important;
      }


      /* ================================================= */
      /* HIDE NORMAL APPLICATION                           */
      /* ================================================= */

      body * {
        visibility: hidden !important;
      }


      /* ================================================= */
      /* PRINT ROOT                                        */
      /* ================================================= */

      .print-root,
      .print-root * {
        visibility: visible !important;
      }


      .print-root {
        position: absolute !important;

        left: 0 !important;
        top: 0 !important;

        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        box-sizing: border-box !important;
      }


      /* ================================================= */
      /* PAGE 1 - BATCH REPORT                             */
      /* DO NOT CHANGE                                     */
      /* ================================================= */

      .print-page-1 {
        position: relative !important;

        width: 100% !important;
        height: 210mm !important;

        margin: 0 !important;
        padding: 0 !important;

        box-sizing: border-box !important;

        break-after: page !important;
        page-break-after: always !important;

        overflow: hidden !important;
      }


      [data-print-report],
      [data-print-report] * {
        visibility: visible !important;
      }


      [data-print-report] {
        position: absolute !important;

        left: 50% !important;
        top: 120px !important;

        width: 100% !important;

        transform:
          translateX(-50%)
          scale(0.92) !important;

        transform-origin: top center !important;

        margin: 0 !important;
        padding: 0 !important;

        box-sizing: border-box !important;
      }


      [data-print-report] > div:first-child {
        width: 100% !important;
        box-sizing: border-box !important;
      }


      /* ================================================= */
      /* PAGE 2 - CUSTOMER + INVOICE                      */
      /* ================================================= */

      .print-page-2 {
        display: block !important;

        position: relative !important;

        width: 100% !important;
        height: 210mm !important;

        /* Remove screen gap while printing */
        margin: 0 !important;

        padding: 15mm 0 0 0 !important;

        box-sizing: border-box !important;

        break-after: page !important;
        page-break-after: always !important;

        overflow: hidden !important;
      }


      .print-page-2 .challan-print-grid {
        position: relative !important;

        display: grid !important;

        grid-template-columns: 1fr 1fr !important;

        column-gap: 16px !important;

        width: 94% !important;

        margin: 0 auto !important;
        padding: 0 !important;

        box-sizing: border-box !important;

        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }


      /* Customer + Invoice */

      .print-page-2 .challan-copy {
        width: 100% !important;

        min-width: 0 !important;

        margin: 0 !important;
        padding: 0 !important;

        box-sizing: border-box !important;

        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }


      /* IMPORTANT:
        Do NOT reset transform here.
        The left/right movement should print too.
      */


      /* ================================================= */
      /* PAGE 3 - FIX + ACCOUNT                            */
      /* ================================================= */

      .print-page-3 {
        display: block !important;

        position: relative !important;

        width: 100% !important;
        height: 210mm !important;

        margin: 0 !important;

        padding: 15mm 0 0 0 !important;

        box-sizing: border-box !important;

        break-after: auto !important;
        page-break-after: auto !important;

        overflow: hidden !important;
      }


      .print-page-3 .challan-print-grid {
        position: relative !important;

        display: grid !important;

        grid-template-columns: 1fr 1fr !important;

        column-gap: 16px !important;

        width: 94% !important;

        margin: 0 auto !important;
        padding: 0 !important;

        box-sizing: border-box !important;

        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }


      /* Fix + Account */

      .print-page-3 .challan-copy {
        width: 100% !important;

        min-width: 0 !important;

        margin: 0 !important;
        padding: 0 !important;

        box-sizing: border-box !important;

        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }


      /* IMPORTANT:
        Do NOT reset transform here either.
        Fix moves left, Account moves right.
      */


      /* ================================================= */
      /* CUT LINE - PAGE 2                                */
      /* ================================================= */

      .print-page-2 .challan-cut-line {
        visibility: visible !important;

        position: absolute !important;

        top: 0 !important;
        bottom: 0 !important;

        left: 50% !important;

        width: 0 !important;

        border-left: 1px dashed #000 !important;

        transform: translateX(-50%) !important;

        z-index: 100 !important;

        pointer-events: none !important;
      }


      .print-page-2 .challan-cut-line span {
        visibility: visible !important;
      }


      /* ================================================= */
      /* CUT LINE - PAGE 3                                */
      /* ================================================= */

      .print-page-3 .challan-cut-line {
        visibility: visible !important;

        position: absolute !important;

        top: 0 !important;
        bottom: 0 !important;

        left: 50% !important;

        width: 0 !important;

        border-left: 1px dashed #000 !important;

        transform: translateX(-50%) !important;

        z-index: 100 !important;

        pointer-events: none !important;
      }


      .print-page-3 .challan-cut-line span {
        visibility: visible !important;
      }


      /* ================================================= */
      /* NEVER PRINT BUTTONS                              */
      /* ================================================= */

      .print-buttons {
        display: none !important;

        visibility: hidden !important;
      }

    }
  `;
  return (

    <DashboardLayout hideNavbar>
      <style>{printStyles}</style>
      <div className="fixed top-0 left-64 right-0 z-50 bg-slate-100 border-b-2 border-slate-300 px-6 md:px-8 lg:px-10 pt-2 pb-3">
        <div className="flex items-center justify-between mb-6">
          {/* LEFT - PAGE TITLE */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Batch Entry
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Ready Mix Concrete Production
            </p>
          </div>

          <div className="flex items-center gap-2.5">

            {/* Create Batch */}
            {/* Create Batch / Clear Batch */}

            {savedBatch ? (
              <button
                type="button"
                onClick={handleClearBatch}
                disabled={loading}
                className="
      inline-flex items-center justify-center gap-2
      h-10 px-4
      rounded-lg
      bg-slate-700
      text-white
      text-sm font-bold
      shadow-sm
      transition-all duration-200
      hover:bg-slate-800
      hover:shadow-md
      active:scale-[0.98]
      disabled:opacity-50
      disabled:cursor-not-allowed
      whitespace-nowrap
    "
              >
                Clear Batch
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateBatch}
                disabled={loading}
                className="
      inline-flex items-center justify-center gap-2
      h-10 px-4
      rounded-lg
      bg-blue-600
      text-white
      text-sm font-bold
      shadow-sm
      transition-all duration-200
      hover:bg-blue-700
      hover:shadow-md
      active:scale-[0.98]
      disabled:opacity-50
      disabled:cursor-not-allowed
      whitespace-nowrap
    "
              >
                <Plus size={17} strokeWidth={2.5} />
                {editingBatchId !== null ? "Save Changes" : "Create Batch"}
              </button>
            )}

            {/* Save Batch */}
            {previewBatch && (
              <button
                type="button"
                onClick={handleSaveBatch}
                disabled={loading}
                className="
        inline-flex items-center justify-center gap-2
        h-10 px-4
        rounded-lg
        bg-emerald-600
        text-white
        text-sm font-bold
        shadow-sm
        transition-all duration-200
        hover:bg-emerald-700
        hover:shadow-md
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        whitespace-nowrap
      "
              >
                <Save size={17} strokeWidth={2.5} />
                Save Batch
              </button>
            )}


            {savedBatch && (
              <button
                type="button"
                onClick={handleCopyWhatsAppMessage}
                disabled={loading}
                className="
      inline-flex items-center justify-center gap-2
      h-10 px-4
      rounded-lg
      bg-green-600 text-white
      text-sm font-bold
      shadow-sm
      transition-all duration-200
      hover:bg-green-700
      hover:shadow-md
      active:scale-[0.98]
      disabled:opacity-50
      disabled:cursor-not-allowed
      whitespace-nowrap
    "
              >
                <Copy size={17} strokeWidth={2.5} />
                Copy Message
              </button>
            )}


            {/* Print */}
            {savedBatch && (
              <button
                type="button"
                onClick={handlePrint}
                disabled={loading}
                className="
        inline-flex items-center justify-center gap-2
        h-10 px-4
        rounded-lg
        bg-blue-600
        text-white
        text-sm font-bold
        shadow-sm
        transition-all duration-200
        hover:bg-blue-700
        hover:shadow-md
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        whitespace-nowrap
      "
              >
                <Printer size={17} strokeWidth={2.5} />
                Print
              </button>
            )}

          </div>
        </div>
      </div>



      {loading && (

        <LoadingSpinner text="Loading batches..." />

      )}





      <div className="grid grid-cols-12 gap-6 pt-[100px]">
        <div className="col-span-12">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* ================================================= */}
            {/* CUSTOMER + BATCH DETAILS                         */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 pt-4 pb-4">

              {/* ================================================= */}
              {/* CUSTOMER & DELIVERY DETAILS                      */}
              {/* ================================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3 mb-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="text-sm font-extrabold">1</span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Customer & Delivery Details
                    </h2>

                    <p className="text-xs font-medium text-slate-500">
                      Select customer, site, recipe, vehicle and driver
                    </p>
                  </div>

                </div>


                {/* Customer */}

                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Customer
                    </label>

                    <select
                      value={selectedCustomerName}
                      onChange={(e) => {
                        const name = e.target.value;

                        setSelectedCustomerName(name);
                        setCustomerId(0);
                        setRecipeId(0);
                        setRecipes([]);
                      }}
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Customer</option>

                      {uniqueCustomers.map((c) => (
                        <option
                          key={c.customer.trim().toLowerCase()}
                          value={c.customer}
                        >
                          {c.customer.trim()}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Site */}

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Site
                    </label>

                    <select
                      value={customerId}
                      onChange={(e) => {
                        const id = Number(e.target.value);

                        setCustomerId(id);
                        setRecipeId(0);
                        setRecipes([]);
                      }}
                      disabled={!selectedCustomerName}
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value={0}>Select Site</option>

                      {selectedCustomerSites.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.site}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Recipe */}

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Recipe
                    </label>

                    <select
                      value={recipeId}
                      onChange={(e) => setRecipeId(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value={0}>Select Recipe</option>

                      {recipes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.recipe_name} ({r.grade})
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Vehicle */}

                  <div>
                    <VehicleSelector
                      vehicles={vehicles}
                      value={vehicleId}
                      onChange={setVehicleId}
                    />
                  </div>


                  {/* Driver */}

                  <div>
                    <DriverSelector
                      drivers={drivers}
                      value={driverId}
                      onChange={setDriverId}
                    />
                  </div>

                </div>

              </div>


              {/* ================================================= */}
              {/* BATCH DETAILS                                    */}
              {/* ================================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3 mb-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="text-sm font-extrabold">2</span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Batch Details
                    </h2>

                    <p className="text-xs font-medium text-slate-500">
                      Enter batch numbers, quantity, loading mode and timing
                    </p>
                  </div>

                </div>

                {/* ================================================= */}
                {/* BATCH NUMBERS */}
                {/* ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Order No */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Order No
                    </label>

                    <input
                      value={orderNo}
                      readOnly
                      className="w-full h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>


                  {/* Delivery No */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Delivery No
                    </label>

                    <input
                      value={deliveryNo}
                      readOnly
                      className="w-full h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>


                  {/* Ticket No */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Ticket No
                    </label>

                    <input
                      value={ticketNo}
                      readOnly
                      className="w-full h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>

                </div>


                {/* ================================================= */}
                {/* LOADING + ORDER QTY */}
                {/* ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  {/* Type of Loading */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Type of Loading
                    </label>

                    <select
                      value={typeOfLoading}
                      onChange={(e) =>
                        setTypeOfLoading(e.target.value)
                      }
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select Loading
                      </option>

                      <option value="Pump">
                        Pump
                      </option>

                      <option value="Manual">
                        Manual
                      </option>
                    </select>
                  </div>


                  {/* Order Qty */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Order Qty
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          orderQty === 0
                            ? ""
                            : orderQty
                        }
                        onChange={(e) => {
                          const value =
                            Number(e.target.value);

                          setOrderQty(value);
                          setQuantity(value);
                          setTicketQty(value);
                        }}
                        onWheel={preventWheelChange}
                        placeholder="Enter quantity"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        m³
                      </span>

                    </div>
                  </div>

                </div>


                {/* ================================================= */}
                {/* DATE + START TIME */}
                {/* ================================================= */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

                  {/* Date */}
                  {/* Keep your existing Date field here */}

                  {/* Start Time */}
                  {/* Keep your existing Start Time field here */}

                </div>


                {/* Date + Start Time */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

                  {/* Date */}

                  <div>

                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Date
                    </label>

                    <input
                      type="date"
                      value={batchDate}
                      onChange={(e) => setBatchDate(e.target.value)}
                      onWheel={preventWheelChange}
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  {/* Start Time */}

                  <div>

                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Start Time
                    </label>

                    <input
                      type="time"
                      step="1"
                      value={batchTime}
                      onChange={(e) => {
                        setBatchTime(e.target.value);
                        setIsLiveTime(false);
                      }}
                      onWheel={preventWheelChange}
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* RECIPE / MATERIAL DETAILS                        */}
            {/* ================================================= */}
            {recipe && (
              <div className="border-t border-slate-200 px-6 pt-5 pb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="text-sm font-extrabold">3</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Material Details
                      <span className="ml-2 text-xs font-semibold text-slate-500">
                        (kg / m³)
                      </span>
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      Recipe mix quantities and quality parameters
                    </p>
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <div className="grid grid-cols-9 gap-2 w-full">
                    {/* Cement */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Cement
                      </label>
                      <input
                        type="number"
                        value={cement === 0 ? "" : cement}
                        onChange={(e) => setCement(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add Cement"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Fly Ash */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Fly Ash
                      </label>
                      <input
                        type="number"
                        value={flyash === 0 ? "" : flyash}
                        onChange={(e) => setFlyash(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add Fly Ash"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Sand */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Sand
                      </label>
                      <input
                        type="number"
                        value={sand === 0 ? "" : sand}
                        onChange={(e) => setSand(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add Sand"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* 10 MM */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        10 MM
                      </label>
                      <input
                        type="number"
                        value={mm10 === 0 ? "" : mm10}
                        onChange={(e) => setMm10(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add 10 MM"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* 20 MM */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        20 MM
                      </label>
                      <input
                        type="number"
                        value={mm20 === 0 ? "" : mm20}
                        onChange={(e) => setMm20(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add 20 MM"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Water */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Water
                      </label>
                      <input
                        type="number"
                        value={water === 0 ? "" : water}
                        onChange={(e) => setWater(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add Water"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Admix */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Admixture
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={admix === 0 ? "" : admix}
                        onChange={(e) => setAdmix(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="Add Admix"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Slump */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Slump
                      </label>
                      <input
                        type="number"
                        value={recipeSlump === 0 ? "" : recipeSlump}
                        onChange={(e) => setRecipeSlump(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="0"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Strength */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Strength
                      </label>
                      <input
                        type="number"
                        value={recipeStrength === 0 ? "" : recipeStrength}
                        onChange={(e) => setRecipeStrength(Number(e.target.value))}
                        onWheel={preventWheelChange}
                        placeholder="0"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>


              </div>
            )}
          </div>
        </div>
      </div>

      {(previewBatch || savedBatch) && (
        <div className="mt-8 print-root">

          {/* ================================================= */}
          {/* PAGE 1 - BATCH REPORT                            */}
          {/* ================================================= */}

          <div className="print-page-1">

            <div
              ref={reportRef}
              data-print-report
            >
              <div className="print-batch-report">
                <BatchReportPreview
                  batch={savedBatch || previewBatch}
                />
              </div>
            </div>

          </div>


          {/* ================================================= */}
          {/* PAGE 2 - CUSTOMER + INVOICE                      */}
          {/* ================================================= */}

          <div className="print-page-2">
            <div
              className="challan-print-grid"
              style={{
                width: "95%",
                margin: "0 auto",
              }}
            >

              {/* CUSTOMER COPY - LEFT */}
              <div className="challan-copy challan-left-copy">
                <DeliveryChallanPreview
                  batch={savedBatch || previewBatch}
                  copyType="CUSTOMER COPY"
                />
              </div>

              {/* INVOICE COPY - RIGHT */}
              <div className="challan-copy challan-right-copy">
                <DeliveryChallanPreview
                  batch={savedBatch || previewBatch}
                  copyType="INVOICE COPY"
                />
              </div>

              {/* CUT LINE */}
              <div className="challan-cut-line">
                <span
                  style={{
                    position: "absolute",
                    left: "-8px",
                    top: "50%",
                    transform: "translateY(-50%) rotate(90deg)",
                    background: "#f1f5f9",
                    fontSize: "14px",
                    lineHeight: "16px",
                  }}
                >
                  ✂
                </span>
              </div>

            </div>
          </div>


          {/* ================================================= */}
          {/* PAGE 3 - FIX + ACCOUNT                           */}
          {/* ================================================= */}

          <div className="print-page-3">
            <div
              className="challan-print-grid"
              style={{
                width: "95%",
                margin: "0 auto",
              }}
            >

              {/* FIX COPY - LEFT */}
              <div className="challan-copy challan-left-copy">
                <DeliveryChallanPreview
                  batch={savedBatch || previewBatch}
                  copyType="FIX COPY"
                />
              </div>

              {/* ACCOUNT COPY - RIGHT */}
              <div className="challan-copy challan-right-copy">
                <DeliveryChallanPreview
                  batch={savedBatch || previewBatch}
                  copyType="ACCOUNT COPY"
                />
              </div>

              {/* CUT LINE */}
              <div className="challan-cut-line">
                <span
                  style={{
                    position: "absolute",
                    left: "-8px",
                    top: "50%",
                    transform: "translateY(-50%) rotate(90deg)",
                    background: "#f1f5f9",
                    fontSize: "14px",
                    lineHeight: "16px",
                  }}
                >
                  ✂
                </span>
              </div>

            </div>
          </div>
        </div>
      )}





      <BatchTable
        batches={batches}
        onEdit={handleEditBatch}
        onDelete={handleDeleteBatch}
        onCancel={handleCancelBatch}
      />





      <ConfirmDialog

        open={confirmOpen}

        title="Delete Batch"

        message="Are you sure you want to delete this batch?"

        confirmText="Delete"

        cancelText="Cancel"


        onCancel={() => {

          setConfirmOpen(false);

          setDeleteId(null);

        }}


        onConfirm={confirmDelete}

      />



    </DashboardLayout>

  );

}