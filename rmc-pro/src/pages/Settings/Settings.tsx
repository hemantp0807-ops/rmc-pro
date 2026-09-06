import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  User,
  ShieldCheck,
  Building2,
  LockKeyhole,
  Settings as SettingsIcon,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getCurrentUser } from "../../utils/auth";

const API_URL = "http://localhost:5000/api/auth";

export default function Settings() {
  const user = getCurrentUser();

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const roleDetails = useMemo(() => {
    switch (user?.role) {
      case "admin":
        return {
          label: "Administrator",
          description: "Full system access",
          badge: "ADMIN",
        };

      case "operator":
        return {
          label: "Operator",
          description: "Plant operations access",
          badge: "OPERATOR",
        };

      case "accounting":
        return {
          label: "Accounting",
          description: "Reports and view access",
          badge: "ACCOUNTING",
        };

      default:
        return {
          label: "User",
          description: "System user",
          badge: "USER",
        };
    }
  }, [user]);

  /* ================================================= */
  /* OPEN PASSWORD MODAL                              */
  /* ================================================= */

  function openPasswordModal() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordModal(true);
  }

  /* ================================================= */
  /* CLOSE PASSWORD MODAL                             */
  /* ================================================= */

  function closePasswordModal() {
    if (changingPassword) return;

    setShowPasswordModal(false);
  }

  /* ================================================= */
  /* CHANGE PASSWORD                                  */
  /* ================================================= */

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password."
      );
      return;
    }

    const token = localStorage.getItem("rmc_token");

    if (!token) {
      toast.error("Your session has expired. Please login again.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        `${API_URL}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password."
        );
      }

      toast.success(
        "Password changed successfully."
      );

      setShowPasswordModal(false);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-full bg-slate-50/70 pb-10">
        {/* ================================================= */}
        {/* HEADER                                            */}
        {/* ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <SettingsIcon
                size={21}
                strokeWidth={2.4}
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Settings
              </h1>

              <p className="mt-0.5 text-xs font-medium text-slate-400">
                Manage your account and system preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================================================= */}
        {/* PROFILE + ROLE                                    */}
        {/* ================================================= */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.45,
          }}
          className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User
                  size={18}
                  strokeWidth={2.4}
                />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Account Information
                </h2>

                <p className="text-[10px] font-medium text-slate-400">
                  Your logged-in account details
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                Username
              </p>

              <p className="text-sm font-black text-slate-800">
                {user?.username || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                Role
              </p>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-800">
                    {roleDetails.label}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    {roleDetails.description}
                  </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[9px] font-black tracking-wide text-blue-600">
                  {roleDetails.badge}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================= */}
        {/* SETTINGS GRID                                     */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* SECURITY */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.45,
            }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <ShieldCheck
                    size={18}
                    strokeWidth={2.4}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Security
                  </h2>

                  <p className="text-[10px] font-medium text-slate-400">
                    Manage your account security
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <button
                type="button"
                onClick={openPasswordModal}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                    <LockKeyhole
                      size={17}
                      strokeWidth={2.3}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-slate-800">
                      Change Password
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      Update your account password
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500"
                />
              </button>
            </div>
          </motion.section>

          {/* PLANT INFORMATION */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.45,
            }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2
                    size={18}
                    strokeWidth={2.4}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Plant Information
                  </h2>

                  <p className="text-[10px] font-medium text-slate-400">
                    RMC plant configuration
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                  Plant Name
                </p>

                <p className="mt-1 text-sm font-black text-slate-800">
                  Lead RMC Plant
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                  System
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <p className="text-xs font-extrabold text-emerald-600">
                    System Online
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ================================================= */}
        {/* ACCESS INFORMATION                                */}
        {/* ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
            duration: 0.45,
          }}
          className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <SettingsIcon
                  size={18}
                  strokeWidth={2.4}
                />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Access Information
                </h2>

                <p className="text-[10px] font-medium text-slate-400">
                  Permissions assigned to your account
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
            <AccessItem
              label="Dashboard"
              allowed={true}
            />

            <AccessItem
              label="Reports"
              allowed={true}
            />

            <AccessItem
              label="Batch Operations"
              allowed={
                user?.role === "admin" ||
                user?.role === "operator"
              }
            />

            <AccessItem
              label="Batch Delete"
              allowed={
                user?.role === "admin"
              }
            />

            <AccessItem
              label="User Management"
              allowed={
                user?.role === "admin"
              }
            />

            <AccessItem
              label="Report Export"
              allowed={true}
            />
          </div>
        </motion.section>
      </div>

      {/* ================================================= */}
      {/* CHANGE PASSWORD MODAL                             */}
      {/* ================================================= */}

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closePasswordModal();
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.97,
              }}
              transition={{
                duration: 0.25,
              }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <LockKeyhole
                      size={19}
                      strokeWidth={2.4}
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Change Password
                    </h2>

                    <p className="text-[10px] font-medium text-slate-400">
                      Update your account password
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                >
                  <X size={17} />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleChangePassword}
                className="space-y-4 p-5"
              >
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showCurrentPassword}
                  onToggle={() =>
                    setShowCurrentPassword(
                      (value) => !value
                    )
                  }
                  disabled={changingPassword}
                />

                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNewPassword}
                  onToggle={() =>
                    setShowNewPassword(
                      (value) => !value
                    )
                  }
                  disabled={changingPassword}
                />

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  disabled={changingPassword}
                />

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <p className="text-[10px] font-semibold leading-4 text-blue-700">
                      Password must contain at least
                      6 characters.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    disabled={changingPassword}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="h-10 rounded-lg bg-blue-600 px-5 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {changingPassword
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

/* ================================================= */
/* PASSWORD FIELD                                   */
/* ================================================= */

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          autoComplete="new-password"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-400 transition hover:text-blue-600 disabled:cursor-not-allowed"
        >
          {show ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ================================================= */
/* ACCESS ITEM                                       */
/* ================================================= */

function AccessItem({
  label,
  allowed,
}: {
  label: string;
  allowed: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
      <span className="text-xs font-bold text-slate-700">
        {label}
      </span>

      <span
        className={`rounded-lg px-2.5 py-1 text-[9px] font-black ${
          allowed
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {allowed ? "ALLOWED" : "RESTRICTED"}
      </span>
    </div>
  );
}