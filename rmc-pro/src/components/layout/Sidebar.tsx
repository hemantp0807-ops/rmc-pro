import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Truck,
  UserCog,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  FlaskConical,
  Loader2,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  hasRole,
  logoutUser,
} from "../../utils/auth";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "operator", "accounting"] as const,
  },

  {
    name: "Customers",
    path: "/customers",
    icon: Users,
    roles: ["admin", "operator", "accounting"] as const,
  },

  {
    name: "Recipes",
    path: "/recipes",
    icon: FlaskConical,
    roles: ["admin", "operator", "accounting"] as const,
  },

  {
    name: "Vehicles",
    path: "/vehicles",
    icon: Truck,
    roles: ["admin", "operator", "accounting"] as const,
  },

  {
    name: "Drivers",
    path: "/drivers",
    icon: UserCog,
    roles: ["admin", "operator", "accounting"] as const,
  },

  {
    name: "Batch Entry",
    path: "/batch",
    icon: ClipboardList,
    roles: ["admin", "operator"] as const,
  },

  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
    roles: ["admin", "operator", "accounting"] as const,
  },

  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin", "operator"] as const,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  /*
   * This flag is created by Login.tsx after a
   * successful login.
   *
   * It allows the sidebar entrance animation to
   * happen only once after login.
   */
  const [shouldAnimateIn, setShouldAnimateIn] =
    useState(
      sessionStorage.getItem(
        "rmc_sidebar_animate"
      ) === "true"
    );

  useEffect(() => {
    if (shouldAnimateIn) {
      /*
       * Remove the flag immediately.
       *
       * This is important because when the user
       * changes tabs, Sidebar may mount again.
       * Since the flag is already removed, the
       * entrance animation will NOT play again.
       */
      sessionStorage.removeItem(
        "rmc_sidebar_animate"
      );

      /*
       * Keep the animation enabled for the
       * current mount only.
       */
      const timer = setTimeout(() => {
        setShouldAnimateIn(false);
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [shouldAnimateIn]);

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    window.dispatchEvent(
  new Event("rmc-logout-start")
);
    /*
     * Give the logout animation time to play
     * before removing the user session.
     */
    setTimeout(() => {
      logoutUser();

      /*
       * Make sure the next login gets the
       * entrance animation again.
       */
      sessionStorage.removeItem(
        "rmc_sidebar_animate"
      );

      navigate("/");
    }, 650);
  };

  // ============================================================
  // SIDEBAR ANIMATIONS
  // ============================================================

  const sidebarAnimation = {
    hidden: {
      x: -280,
      opacity: 0,
    },

    visible: {
      x: 0,
      opacity: 1,

      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },

    exit: {
      x: -280,
      opacity: 0,

      transition: {
        duration: 0.45,
        ease: "easeIn" as const,
      },
    },
  };

  const menuContainer = {
    hidden: {},

    visible: {
      transition: {
        delayChildren: 0.35,
        staggerChildren: 0.08,
      },
    },
  };

  const menuItem = {
    hidden: {
      opacity: 0,
      x: -25,
    },

    visible: {
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const footerAnimation = {
    hidden: {
      opacity: 0,
      y: 15,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.45,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.aside
      /*
       * Only use the entrance animation when
       * Login.tsx has requested it.
       */
      initial={
        shouldAnimateIn
          ? "hidden"
          : false
      }

      /*
       * Logout always gets its animation.
       *
       * Normal tab switching gets no animation.
       */
      animate={
        isLoggingOut
          ? "exit"
          : shouldAnimateIn
            ? "visible"
            : undefined
      }

      variants={sidebarAnimation}
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-64
        flex-col
        border-r
        border-slate-800
        bg-slate-950
        text-white
        shadow-xl
      "
    >
      {/* ================================================= */}
      {/* BRAND HEADER                                      */}
      {/* ================================================= */}

      <motion.div
        initial={
          shouldAnimateIn
            ? {
                opacity: 0,
                y: -20,
              }
            : false
        }
        animate={
          shouldAnimateIn
            ? {
                opacity: 1,
                y: 0,
              }
            : undefined
        }
        transition={{
          delay: 0.2,
          duration: 0.55,
          ease: "easeOut",
        }}
        className="
          relative
          flex
          h-[76px]
          shrink-0
          items-center
          gap-3
          overflow-hidden
          border-b
          border-blue-500/20
          bg-gradient-to-br
          from-blue-700
          via-blue-600
          to-blue-500
          px-5
        "
      >
        {/* Background decoration */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  scale: 0.7,
                }
              : false
          }
          animate={
            shouldAnimateIn
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : undefined
          }
          transition={{
            delay: 0.45,
            duration: 0.7,
          }}
          className="
            absolute
            -right-8
            -top-10
            h-28
            w-28
            rounded-full
            border-[18px]
            border-white/5
          "
        />

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  scale: 0.7,
                }
              : false
          }
          animate={
            shouldAnimateIn
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : undefined
          }
          transition={{
            delay: 0.5,
            duration: 0.7,
          }}
          className="
            absolute
            -bottom-12
            right-12
            h-24
            w-24
            rounded-full
            bg-white/5
          "
        />

        {/* Logo */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  scale: 0.5,
                  rotate: -20,
                }
              : false
          }
          animate={
            shouldAnimateIn
              ? {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }
              : undefined
          }
          transition={{
            delay: 0.3,
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          whileHover={{
            scale: 1.08,
            rotate: 3,
          }}
          className="
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white/15
            shadow-inner
            ring-1
            ring-white/20
          "
        >
          <Building2
            size={24}
            strokeWidth={2.2}
            className="text-white"
          />
        </motion.div>

        {/* Brand */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  x: -15,
                }
              : false
          }
          animate={
            shouldAnimateIn
              ? {
                  opacity: 1,
                  x: 0,
                }
              : undefined
          }
          transition={{
            delay: 0.42,
            duration: 0.5,
          }}
          className="
            relative
            min-w-0
          "
        >
          <h1
            className="
              text-lg
              font-extrabold
              tracking-wide
              text-white
            "
          >
            LEAD RMC
          </h1>

          <p
            className="
              mt-0.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-blue-100
            "
          >
            ERP Management
          </p>
        </motion.div>
      </motion.div>

      {/* ================================================= */}
      {/* NAVIGATION                                        */}
      {/* ================================================= */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
        "
      >
        {/* Section title */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                }
              : false
          }
          animate={
            shouldAnimateIn
              ? {
                  opacity: 1,
                }
              : undefined
          }
          transition={{
            delay: 0.3,
            duration: 0.4,
          }}
          className="mb-3 px-3"
        >
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.16em]
              text-slate-500
            "
          >
            Main Menu
          </p>
        </motion.div>

        {/* Menu */}

       <motion.div
  variants={menuContainer}
  initial={
    shouldAnimateIn
      ? "hidden"
      : undefined
  }
  animate={
    shouldAnimateIn
      ? "visible"
      : undefined
  }
  className="space-y-1"
>
  {menus
    .filter((item) =>
      hasRole(...item.roles)
    )
    .map((item) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.name}
          initial={
            shouldAnimateIn
              ? "hidden"
              : false
          }
          animate={
            shouldAnimateIn
              ? "visible"
              : {
                  opacity: 1,
                  x: 0,
                }
          }
          variants={menuItem}
          whileHover={{
            x: 3,
          }}
          transition={{
            duration: 0.18,
          }}
        >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `
                      group
                      relative
                      flex
                      h-11
                      items-center
                      gap-3
                      rounded-xl
                      px-3.5
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-950/30"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator */}

                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active"
                            initial={{
                              opacity: 0,
                              scaleY: 0,
                            }}
                            animate={{
                              opacity: 1,
                              scaleY: 1,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="
                              absolute
                              left-0
                              top-1/2
                              h-6
                              w-1
                              -translate-y-1/2
                              rounded-r-full
                              bg-white
                            "
                          />
                        )}

                        {/* Icon */}

                        <motion.div
                          whileHover={{
                            scale: 1.08,
                          }}
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            transition-all
                            duration-200

                            ${
                              isActive
                                ? "bg-white/15 text-white"
                                : "bg-slate-900 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                            }
                          `}
                        >
                          <Icon
                            size={17}
                            strokeWidth={2.2}
                          />
                        </motion.div>

                        {/* Label */}

                        <span
                          className={`
                            text-sm
                            font-semibold

                            ${
                              isActive
                                ? "text-white"
                                : "text-slate-300 group-hover:text-white"
                            }
                          `}
                        >
                          {item.name}
                        </span>

                        {/* Active dot */}

                        {isActive && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              scale: 0,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className="
                              ml-auto
                              h-1.5
                              w-1.5
                              rounded-full
                              bg-white
                            "
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
        </motion.div>
      </nav>

      {/* ================================================= */}
      {/* SYSTEM STATUS                                     */}
      {/* ================================================= */}

      <motion.div
        initial={
          shouldAnimateIn
            ? {
                opacity: 0,
                y: 15,
              }
            : false
        }
        animate={
          shouldAnimateIn
            ? {
                opacity: 1,
                y: 0,
              }
            : undefined
        }
        transition={{
          delay: 1.05,
          duration: 0.5,
        }}
        className="
          mx-3
          mb-3
          rounded-xl
          border
          border-slate-800
          bg-slate-900/70
          px-3
          py-2.5
        "
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-emerald-400
                opacity-60
              "
            />

            <span
              className="
                relative
                inline-flex
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-500
              "
            />
          </span>

          <div className="leading-tight">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              System Status
            </p>

            <p
              className="
                text-xs
                font-semibold
                text-emerald-400
              "
            >
              Operational
            </p>
          </div>
        </div>
      </motion.div>

      {/* ================================================= */}
      {/* FOOTER                                            */}
      {/* ================================================= */}

      <motion.div
        variants={footerAnimation}
        initial={
          shouldAnimateIn
            ? "hidden"
            : false
        }
        animate={
          shouldAnimateIn
            ? "visible"
            : undefined
        }
        transition={{
          delay: 1.15,
        }}
        className="
          border-t
          border-slate-800
          px-3
          py-3
        "
      >
        {/* ================================================= */}
        {/* LOGOUT                                             */}
        {/* ================================================= */}

        <motion.button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          whileHover={
            !isLoggingOut
              ? {
                  x: 3,
                }
              : undefined
          }
          whileTap={
            !isLoggingOut
              ? {
                  scale: 0.97,
                }
              : undefined
          }
          className={`
            group
            flex
            h-11
            w-full
            items-center
            gap-3
            rounded-xl
            px-3.5
            transition-all
            duration-200

            ${
              isLoggingOut
                ? "cursor-wait bg-red-500/10 text-red-400"
                : "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            }
          `}
        >
          <motion.div
            animate={
              isLoggingOut
                ? {
                    rotate: -90,
                    scale: 0.9,
                  }
                : {
                    rotate: 0,
                    scale: 1,
                  }
            }
            transition={{
              duration: 0.35,
            }}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-slate-900
              transition
              group-hover:bg-red-500/10
            "
          >
            {isLoggingOut ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <LogOut
                size={17}
                strokeWidth={2.2}
              />
            )}
          </motion.div>

          <motion.span
            animate={
              isLoggingOut
                ? {
                    opacity: 0.6,
                  }
                : {
                    opacity: 1,
                  }
            }
            className="text-sm font-semibold"
          >
            {isLoggingOut
              ? "Logging out..."
              : "Logout"}
          </motion.span>
        </motion.button>

        {/* Version */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                }
              : false
          }
          animate={
            shouldAnimateIn
              ? {
                  opacity: 1,
                }
              : undefined
          }
          transition={{
            delay: 1.3,
            duration: 0.4,
          }}
          className="
            mt-2
            flex
            items-center
            justify-between
            px-3
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            LEAD RMC
          </span>

          <span
            className="
              text-[10px]
              font-semibold
              text-slate-600
            "
          >
            v1.0.0
          </span>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}