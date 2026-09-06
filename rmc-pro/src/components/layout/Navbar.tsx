import { useEffect, useState } from "react";
import {
  UserCircle2,
  CalendarDays,
  Clock3,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser } from "../../utils/auth";

export default function Navbar() {
  const [dateTime, setDateTime] = useState(new Date());

  /*
   * Animation should happen only when Login.tsx
   * has created this flag.
   *
   * After the first mount, the flag is removed so
   * changing tabs will not replay the animation.
   */
  const [shouldAnimateIn, setShouldAnimateIn] =
    useState(
      sessionStorage.getItem(
        "rmc_navbar_animate"
      ) === "true" ||
        sessionStorage.getItem(
          "rmc_sidebar_animate"
        ) === "true"
    );

  /*
   * Logout animation.
   */
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const user = getCurrentUser();

  // ============================================================
  // CLOCK
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // LOGIN ANIMATION FLAG
  // ============================================================

  useEffect(() => {
    if (shouldAnimateIn) {
      /*
       * Remove immediately.
       *
       * This means if Navbar is mounted again while
       * switching tabs, the animation will NOT run.
       */
      sessionStorage.removeItem(
        "rmc_navbar_animate"
      );

      sessionStorage.removeItem(
        "rmc_sidebar_animate"
      );

      /*
       * Keep animation active for this mount.
       */
      const timer = setTimeout(() => {
        setShouldAnimateIn(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [shouldAnimateIn]);

  // ============================================================
  // LOGOUT ANIMATION
  // ============================================================

  useEffect(() => {
    const handleLogoutStart = () => {
      setIsLoggingOut(true);
    };

    /*
     * Sidebar dispatches this event when Logout
     * is clicked.
     */
    window.addEventListener(
      "rmc-logout-start",
      handleLogoutStart
    );

    return () => {
      window.removeEventListener(
        "rmc-logout-start",
        handleLogoutStart
      );
    };
  }, []);

  // ============================================================
  // DATE / TIME
  // ============================================================

  const date = dateTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const time = dateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // ============================================================
  // ROLE DETAILS
  // ============================================================

  const roleDetails = {
    admin: {
      name: "Administrator",
      label: "Plant Admin",
    },

    operator: {
      name: "Operator",
      label: "Plant Operator",
    },

    accounting: {
      name: "Accounting",
      label: "Accounts",
    },
  };

  const role = user?.role ?? "admin";

  const userDetails = roleDetails[role];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <motion.header
      /*
       * Login animation only.
       *
       * Logout always uses exit animation.
       */
      initial={
        shouldAnimateIn
          ? {
              y: -25,
              opacity: 0,
            }
          : false
      }
      animate={
        isLoggingOut
          ? {
              y: -25,
              opacity: 0,
            }
          : shouldAnimateIn
            ? {
                y: 0,
                opacity: 1,
              }
            : undefined
      }
      transition={{
        duration: isLoggingOut ? 0.45 : 0.45,
        ease: "easeOut",
      }}
      className="
        h-20
        bg-slate-50
        border-b
        border-slate-200
        px-5
        lg:px-7
        flex
        items-center
        justify-between
      "
    >
      {/* ================================================= */}
      {/* LEFT SECTION                                     */}
      {/* ================================================= */}

      <motion.div
        initial={
          shouldAnimateIn
            ? {
                x: -25,
                opacity: 0,
              }
            : false
        }
        animate={
          isLoggingOut
            ? {
                x: -25,
                opacity: 0,
              }
            : shouldAnimateIn
              ? {
                  x: 0,
                  opacity: 1,
                }
              : undefined
        }
        transition={{
          duration: 0.5,
          delay: shouldAnimateIn ? 0.1 : 0,
          ease: "easeOut",
        }}
        className="flex items-center gap-5"
      >
        {/* Dashboard Label */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  y: -8,
                }
              : false
          }
          animate={
            isLoggingOut
              ? {
                  opacity: 0,
                  y: -8,
                }
              : shouldAnimateIn
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : undefined
          }
          transition={{
            duration: 0.4,
            delay: shouldAnimateIn ? 0.15 : 0,
          }}
          className="hidden lg:block"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            RMC Management
          </p>

          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            Plant Dashboard
          </h2>
        </motion.div>

        {/* Divider */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  scaleY: 0,
                }
              : false
          }
          animate={
            isLoggingOut
              ? {
                  scaleY: 0,
                }
              : shouldAnimateIn
                ? {
                    scaleY: 1,
                  }
                : undefined
          }
          transition={{
            duration: 0.35,
            delay: shouldAnimateIn ? 0.25 : 0,
          }}
          className="
            hidden
            lg:block
            h-10
            w-px
            bg-slate-300
            origin-center
          "
        />

        {/* Date */}

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
            isLoggingOut
              ? {
                  opacity: 0,
                  x: -15,
                }
              : shouldAnimateIn
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : undefined
          }
          transition={{
            duration: 0.45,
            delay: shouldAnimateIn ? 0.25 : 0,
          }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{
              y: -2,
              scale: 1.05,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              w-10
              h-10
              rounded-lg
              bg-white
              border
              border-slate-200
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <CalendarDays
              size={19}
              className="text-blue-600"
            />
          </motion.div>

          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Current Date
            </p>

            <p className="text-sm font-semibold text-slate-700">
              {date}
            </p>
          </div>
        </motion.div>

        {/* Time */}

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
            isLoggingOut
              ? {
                  opacity: 0,
                  x: -15,
                }
              : shouldAnimateIn
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : undefined
          }
          transition={{
            duration: 0.45,
            delay: shouldAnimateIn ? 0.35 : 0,
          }}
          className="
            hidden
            xl:flex
            items-center
            gap-2
            pl-4
            border-l
            border-slate-300
          "
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          >
            <Clock3
              size={18}
              className="text-slate-400"
            />
          </motion.div>

          <span className="text-sm font-bold text-slate-700 tabular-nums">
            {time}
          </span>
        </motion.div>
      </motion.div>

      {/* ================================================= */}
      {/* RIGHT SECTION                                    */}
      {/* ================================================= */}

      <motion.div
        initial={
          shouldAnimateIn
            ? {
                x: 25,
                opacity: 0,
              }
            : false
        }
        animate={
          isLoggingOut
            ? {
                x: 25,
                opacity: 0,
              }
            : shouldAnimateIn
              ? {
                  x: 0,
                  opacity: 1,
                }
              : undefined
        }
        transition={{
          duration: 0.5,
          delay: shouldAnimateIn ? 0.15 : 0,
          ease: "easeOut",
        }}
        className="flex items-center"
      >
        {/* System Status */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  scale: 0.9,
                }
              : false
          }
          animate={
            isLoggingOut
              ? {
                  opacity: 0,
                  scale: 0.9,
                }
              : shouldAnimateIn
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : undefined
          }
          transition={{
            duration: 0.4,
            delay: shouldAnimateIn ? 0.3 : 0,
          }}
          whileHover={{
            y: -1,
          }}
          className="
            hidden
            md:flex
            items-center
            gap-2
            mr-5
            px-3
            py-2
            rounded-lg
            bg-white
            border
            border-slate-200
          "
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Circle
              size={9}
              className="fill-emerald-500 text-emerald-500"
            />
          </motion.div>

          <span className="text-xs font-semibold text-slate-600">
            System Online
          </span>
        </motion.div>

        {/* Logged-in User */}

        <motion.div
          initial={
            shouldAnimateIn
              ? {
                  opacity: 0,
                  x: 20,
                }
              : false
          }
          animate={
            isLoggingOut
              ? {
                  opacity: 0,
                  x: 20,
                }
              : shouldAnimateIn
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : undefined
          }
          transition={{
            duration: 0.45,
            delay: shouldAnimateIn ? 0.35 : 0,
          }}
          className="
            flex
            items-center
            gap-3
            pl-5
            border-l
            border-slate-300
          "
        >
          {/* Avatar */}

          <motion.div
            initial={
              shouldAnimateIn
                ? {
                    scale: 0.7,
                    opacity: 0,
                  }
                : false
            }
            animate={
              isLoggingOut
                ? {
                    scale: 0.7,
                    opacity: 0,
                  }
                : shouldAnimateIn
                  ? {
                      scale: 1,
                      opacity: 1,
                    }
                  : undefined
            }
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: shouldAnimateIn ? 0.45 : 0,
            }}
            whileHover={{
              scale: 1.07,
              y: -2,
            }}
            className="relative"
          >
            <motion.div
              whileHover={{
                boxShadow:
                  "0 8px 20px rgba(37, 99, 235, 0.25)",
              }}
              className="
                w-11
                h-11
                rounded-full
                bg-blue-600
                flex
                items-center
                justify-center
                shadow-sm
              "
            >
              <UserCircle2
                size={29}
                className="text-white"
              />
            </motion.div>

            {/* Online Dot */}

            <motion.span
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                bottom-0
                right-0
                w-3
                h-3
                bg-emerald-500
                border-2
                border-slate-50
                rounded-full
              "
            />
          </motion.div>

          {/* User Details */}

          <motion.div
            initial={
              shouldAnimateIn
                ? {
                    opacity: 0,
                    x: 10,
                  }
                : false
            }
            animate={
              isLoggingOut
                ? {
                    opacity: 0,
                    x: 10,
                  }
                : shouldAnimateIn
                  ? {
                      opacity: 1,
                      x: 0,
                    }
                  : undefined
            }
            transition={{
              duration: 0.4,
              delay: shouldAnimateIn ? 0.5 : 0,
            }}
            className="hidden sm:block"
          >
            <p className="text-sm font-bold text-slate-800">
              {userDetails.name}
            </p>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">
                {userDetails.label}
              </span>

              <span className="text-slate-300">
                •
              </span>

              <motion.span
                animate={{
                  opacity: [1, 0.65, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  text-[10px]
                  font-semibold
                  text-emerald-600
                "
              >
                ACTIVE
              </motion.span>
            </div>

            <p
              className="
                text-[10px]
                text-slate-400
                mt-0.5
              "
            >
              @{user?.username}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}