import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Recipes from "../pages/Recipes/Recipes";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import BatchTicket from "../pages/Reports/BatchTicket";
import CustomerRecipes from "../pages/CustomerRecipes/CustomerRecipes";
import Customers from "../pages/Customers/Customers";
import Vehicles from "../pages/Vehicles/Vehicles";
import Drivers from "../pages/Drivers/Drivers";
import BatchReports from "../pages/Reports/BatchReports";
import BatchEntry from "../pages/Batch/BatchEntry";
import Production from "../pages/Production/Production";
import Dispatch from "../pages/Dispatch/Dispatch";

import Reports from "../pages/Reports/Reports";
import BatchReport from "../pages/Reports/BatchReport";
import ProductionReport from "../pages/Reports/ProductionReport";

import CustomerReport from "../pages/Reports/CustomerReport";
import VehicleReport from "../pages/Reports/VehicleReport";
import DriverReport from "../pages/Reports/DriverReport";
import Settings from "../pages/Settings/Settings";
import {
  isAuthenticated,
  hasRole,
  type UserRole,
} from "../utils/auth";




/* ================================================= */
/* PROTECTED ROUTE                                   */
/* ================================================= */

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  /* --------------------------------------------- */
  /* NOT LOGGED IN                                 */
  /* --------------------------------------------- */

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }


  /* --------------------------------------------- */
  /* ROLE CHECK                                    */
  /* --------------------------------------------- */

  if (
    allowedRoles &&
    !hasRole(...allowedRoles)
  ) {
    return <Navigate to="/dashboard" replace />;
  }


  /* --------------------------------------------- */
  /* ALLOWED                                        */
  /* --------------------------------------------- */

  return <>{children}</>;
}


/* ================================================= */
/* APP ROUTES                                        */
/* ================================================= */

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================= */}
        {/* LOGIN                                     */}
        {/* ========================================= */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* ========================================= */}
        {/* DASHBOARD                                 */}
        {/* All logged-in users                       */}
        {/* ========================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ========================================= */}
        {/* MASTERS                                   */}
        {/* Admin + Operator + Accounting             */}
        {/* ========================================= */}

        <Route
          path="/customers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <Vehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <Drivers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <Recipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer-recipes"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <CustomerRecipes />
            </ProtectedRoute>
          }
        />


        {/* ========================================= */}
        {/* OPERATIONS                                */}
        {/* Admin + Operator                          */}
        {/* ========================================= */}

        <Route
          path="/batch"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
              ]}
            >
              <BatchEntry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/production"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
              ]}
            >
              <Production />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dispatch"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
              ]}
            >
              <Dispatch />
            </ProtectedRoute>
          }
        />


        {/* ========================================= */}
        {/* REPORTS                                   */}
        {/* All three roles                           */}
        {/* ========================================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/batch"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <BatchReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/batch-reports"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <BatchReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/production"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <ProductionReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/customers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <CustomerReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/vehicles"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <VehicleReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/drivers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <DriverReport />
            </ProtectedRoute>
          }
        />


        {/* ========================================= */}
        {/* BATCH TICKET                              */}
        {/* All three roles                           */}
        {/* ========================================= */}

        <Route
          path="/reports/batch-ticket/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "operator",
                "accounting",
              ]}
            >
              <BatchTicket />
            </ProtectedRoute>
          }
        />


        {/* ========================================= */}
        {/* SETTINGS                                  */}
        {/* Admin + Operator                          */}
        {/* ========================================= */}

      <Route
  path="/settings"
  element={
    <ProtectedRoute allowedRoles={["admin", "operator"]}>
      <Settings />
    </ProtectedRoute>
  }
/>


        {/* ========================================= */}
        {/* FALLBACK                                  */}
        {/* ========================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}