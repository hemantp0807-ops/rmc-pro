import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Settings,
  ShieldCheck,
  Users,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { loginUser } from "../../services/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    localStorage.getItem("rmc_remembered_username") || ""
  );

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(
    Boolean(localStorage.getItem("rmc_remembered_username"))
  );

  // ============================================================
  // ANIMATION VARIANTS
  // ============================================================

  const leftContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.13,
      },
    },
  };

  const leftItem = {
    hidden: {
      opacity: 0,
      x: -35,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: "easeOut" as const,
      },
    },
  };

  const logoAnimation = {
    hidden: {
      opacity: 0,
      x: -70,
      scale: 0.92,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.94,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const formContainer = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.35,
        staggerChildren: 0.12,
      },
    },
  };

  const formItem = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

 

  // ============================================================
  // LOGIN
  // ============================================================

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      localStorage.setItem(
        "rmc_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "rmc_token",
        data.token
      );

      if (rememberMe) {
        localStorage.setItem(
          "rmc_remembered_username",
          username
        );
      } else {
        localStorage.removeItem(
          "rmc_remembered_username"
        );
      }
      sessionStorage.setItem(
  "rmc_sidebar_animate",
  "true"
);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#eef2f7]">

      {/* ====================================================== */}
      {/* DESKTOP VERSION                                        */}
      {/* ====================================================== */}

      <div className="hidden min-h-screen lg:block">

        {/* RIGHT BACKGROUND */}

        <div className="absolute inset-0 bg-[#f1f5f9]" />


        {/* ==================================================== */}
        {/* LEFT IMAGE                                           */}
        {/* ==================================================== */}

        <div
          className="
            absolute
            inset-y-0
            left-0
            z-10
            w-[57%]
            overflow-hidden
          "
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 79% 100%, 0 100%)",
          }}
        >

          {/* Animated Background */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.08,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
            }}
           className="
  absolute
  inset-0
  bg-cover
  bg-no-repeat
"
style={{
  backgroundImage: "url('/login-background.jpeg')",
  backgroundPosition: "calc(50% - 200px) center",
}}
          />

          {/* Dark Gradient */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/75
              via-black/30
              to-transparent
            "
          />

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[270px]
              bg-gradient-to-t
              from-black/70
              via-black/20
              to-transparent
            "
          />


          {/* ================================================= */}
          {/* LEFT CONTENT                                      */}
          {/* ================================================= */}

          <motion.div
            variants={leftContainer}
            initial="hidden"
            animate="visible"
            className="
              relative
              z-20
              flex
              h-full
              w-full
              flex-col
              justify-between
              px-[54px]
              py-[72px]
            "
          >

            {/* ================================================= */}
            {/* BRAND                                              */}
            {/* ================================================= */}

            <motion.div
              variants={logoAnimation}
            >

              <div className="flex items-center">

                <span
                  className="
                    text-[52px]
                    font-black
                    leading-none
                    tracking-[-2px]
                    text-red-600
                  "
                >
                  LEAD
                </span>

                <span
                  className="
                    ml-2
                    text-[52px]
                    font-black
                    leading-none
                    tracking-[-2px]
                    text-white
                  "
                >
                  RMC
                </span>

              </div>

              <p
                className="
                  mt-2
                  text-[13px]
                  font-medium
                  uppercase
                  tracking-[0.31em]
                  text-white
                "
              >
                "MIXING THE STRENGTH"
              </p>

              <div
                className="
                  mt-3
                  h-[3px]
                  w-[92px]
                  bg-red-600
                "
              />

            </motion.div>


            {/* ================================================= */}
            {/* VALUES                                            */}
            {/* ================================================= */}

            <div className="flex flex-col gap-[18px]">

              {/* QUALITY */}

              <motion.div
                variants={leftItem}
                className="flex items-center gap-4"
              >

                <div
                  className="
                    flex
                    h-[66px]
                    w-[66px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white/40
                    bg-black/20
                  "
                >
                  <Settings
                    size={32}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <div>

                  <p className="text-[15px] font-bold text-white">
                    QUALITY
                  </p>

                  <p className="text-[12px] text-white/85">
                    Consistent Mix
                  </p>

                  <p className="text-[12px] text-white/85">
                    Superior Strength
                  </p>

                </div>

              </motion.div>


              {/* SAFETY */}

              <motion.div
                variants={leftItem}
                className="flex items-center gap-4"
              >

                <div
                  className="
                    flex
                    h-[66px]
                    w-[66px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white/40
                    bg-black/20
                  "
                >
                  <ShieldCheck
                    size={33}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <div>

                  <p className="text-[15px] font-bold text-white">
                    SAFETY
                  </p>

                  <p className="text-[12px] text-white/85">
                    People First
                  </p>

                  <p className="text-[12px] text-white/85">
                    Always
                  </p>

                </div>

              </motion.div>


              {/* TRUST */}

              <motion.div
                variants={leftItem}
                className="flex items-center gap-4"
              >

                <div
                  className="
                    flex
                    h-[66px]
                    w-[66px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white/40
                    bg-black/20
                  "
                >
                  <Users
                    size={33}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <div>

                  <p className="text-[15px] font-bold text-white">
                    TRUST
                  </p>

                  <p className="text-[12px] text-white/85">
                    Built on Commitment
                  </p>

                </div>

              </motion.div>


              {/* GROWTH */}

              <motion.div
                variants={leftItem}
                className="flex items-center gap-4"
              >

                <div
                  className="
                    flex
                    h-[66px]
                    w-[66px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white/40
                    bg-black/20
                  "
                >
                  <BarChart3
                    size={33}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <div>

                  <p className="text-[15px] font-bold text-white">
                    GROWTH
                  </p>

                  <p className="text-[12px] text-white/85">
                    Stronger
                  </p>

                  <p className="text-[12px] text-white/85">
                    Together
                  </p>

                </div>

              </motion.div>

            </div>


            {/* ================================================= */}
            {/* SLOGAN                                             */}
            {/* ================================================= */}

            <motion.div
              variants={leftItem}
            >

              <p
                className="
                  text-[25px]
                  font-light
                  italic
                  leading-[1.15]
                  text-white
                "
              >
                Concrete Solutions
              </p>

              <p
                className="
                  text-[25px]
                  font-light
                  italic
                  leading-[1.15]
                  text-white
                "
              >
                for a Better Tomorrow
              </p>

              <div
                className="
                  mt-3
                  h-[3px]
                  w-[150px]
                  rotate-[-4deg]
                  bg-red-600
                "
              />

            </motion.div>

          </motion.div>

        </div>


        {/* ==================================================== */}
        {/* DIAGONAL WHITE EDGE                                  */}
        {/* ==================================================== */}

        <div
          className="
            absolute
            inset-y-0
            left-[51.8%]
            z-[15]
            w-[105px]
            bg-[#f1f5f9]
          "
          style={{
            clipPath:
              "polygon(42% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />


        {/* ==================================================== */}
        {/* LOGIN SECTION                                        */}
        {/* ==================================================== */}

        <div
          className="
            absolute
            inset-y-0
            right-0
            z-20
            flex
            w-[52%]
            items-center
            justify-center
            pr-[45px]
          "
        >

          {/* ================================================= */}
          {/* LOGIN CARD                                        */}
          {/* ================================================= */}

          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            whileHover={{
              y: -3,
              transition: {
                duration: 0.25,
              },
            }}
            className="
              relative
              w-[570px]
              max-w-[calc(100%-50px)]
              rounded-[17px]
              border
              border-slate-200
              bg-white
              px-[45px]
              pb-[29px]
              pt-[46px]
              shadow-[0_12px_35px_rgba(15,23,42,0.09)]
            "
          >

            {/* VERSION */}

            <span
              className="
                absolute
                right-[20px]
                top-[18px]
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              v1.0.0
            </span>


            {/* ================================================= */}
            {/* HEADER                                            */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.55,
              }}
              className="text-center"
            >

              <h1
                className="
                  text-[36px]
                  font-extrabold
                  leading-tight
                  tracking-[-1px]
                  text-slate-950
                "
              >
                Welcome Back
              </h1>

              <p
                className="
                  mt-1
                  text-[15px]
                  font-normal
                  text-slate-500
                "
              >
                Login to access your RMC Management System
              </p>

              <div
                className="
                  mx-auto
                  mt-[14px]
                  h-[3px]
                  w-[48px]
                  rounded-full
                  bg-red-600
                "
              />

            </motion.div>


            {/* ================================================= */}
            {/* LOGIN FORM                                        */}
            {/* ================================================= */}

            <motion.form
              variants={formContainer}
              initial="hidden"
              animate="visible"
              onSubmit={handleLogin}
              className="mt-[20px]"
            >

              {/* USERNAME */}

              <motion.div
                variants={formItem}
                className="relative"
              >

                <User
                  size={22}
                  strokeWidth={2}
                  className="
                    absolute
                    left-[20px]
                    top-1/2
                    -translate-y-1/2
                    text-slate-600
                  "
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Username"
                  autoComplete="username"
                  required
                  className="
                    h-[60px]
                    w-full
                    rounded-[11px]
                    border
                    border-slate-200
                    bg-white
                    pl-[58px]
                    pr-5
                    text-[15px]
                    text-slate-700
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-red-500
                    focus:ring-2
                    focus:ring-red-500/10
                  "
                />

              </motion.div>


              {/* PASSWORD */}

              <motion.div
                variants={formItem}
                className="relative mt-[14px]"
              >

                <Lock
                  size={22}
                  strokeWidth={2}
                  className="
                    absolute
                    left-[20px]
                    top-1/2
                    -translate-y-1/2
                    text-slate-600
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="
                    h-[60px]
                    w-full
                    rounded-[11px]
                    border
                    border-slate-200
                    bg-white
                    pl-[58px]
                    pr-[58px]
                    text-[15px]
                    text-slate-700
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-red-500
                    focus:ring-2
                    focus:ring-red-500/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-[17px]
                    top-1/2
                    -translate-y-1/2
                    p-1
                    text-slate-500
                    transition
                    hover:text-slate-800
                  "
                >
                  {showPassword ? (
                    <EyeOff size={21} />
                  ) : (
                    <Eye size={21} />
                  )}
                </button>

              </motion.div>


              {/* ================================================= */}
              {/* REMEMBER / FORGOT                                 */}
              {/* ================================================= */}

              <motion.div
                variants={formItem}
                className="
                  mt-[15px]
                  flex
                  items-center
                  justify-between
                "
              >

                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                  "
                >

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="
                      h-[21px]
                      w-[21px]
                      cursor-pointer
                      accent-red-600
                    "
                  />

                  <span
                    className="
                      text-[14px]
                      font-medium
                      text-slate-700
                    "
                  >
                    Remember me
                  </span>

                </label>


                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Please contact the administrator to reset your password."
                    )
                  }
                  className="
                    text-[14px]
                    font-semibold
                    text-red-600
                    transition
                    hover:text-red-700
                  "
                >
                  Forgot Password?
                </button>

              </motion.div>


              {/* ERROR */}

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="
                    mt-4
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </motion.div>
              )}


              {/* ================================================= */}
              {/* LOGIN BUTTON                                      */}
              {/* ================================================= */}

              <motion.button
                variants={formItem}
                whileHover={{
                  scale: 1.015,
                  boxShadow:
                    "0 10px 25px rgba(220,38,38,0.30)",
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="
                  mt-[18px]
                  flex
                  h-[61px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-[11px]
                  bg-red-600
                  text-[18px]
                  font-bold
                  text-white
                  shadow-[0_7px_16px_rgba(220,38,38,0.23)]
                  transition-all
                  duration-200
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <LogIn
                  size={26}
                  strokeWidth={2}
                />

                <span>
                  {loading
                    ? "Signing in..."
                    : "Login"}
                </span>

              </motion.button>

            </motion.form>


           


          


            {/* ================================================= */}
            {/* CARD BOTTOM BRAND                                 */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.15,
                duration: 0.6,
              }}
              className="
                mt-[31px]
                flex
                items-center
                justify-center
              "
            >

              <div
                className="
                  h-[2px]
                  w-[80px]
                  bg-red-600
                "
              />

              <div className="mx-4 text-center">

                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.30em]
                    text-slate-800
                  "
                >
                  LEAD RMC
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.27em]
                    text-slate-400
                  "
                >
                  Ready Mix Concrete
                </p>

              </div>

              <div
                className="
                  h-[2px]
                  w-[80px]
                  bg-red-600
                "
              />

            </motion.div>

          </motion.div>


</div></div>

      {/* ====================================================== */}
      {/* MOBILE VERSION                                         */}
      {/* ====================================================== */}

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-8
          lg:hidden
        "
      >

        {/* Mobile Background */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 1.06,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
          }}
          className="
            absolute
            inset-0
            bg-cover
            bg-center
          "
          style={{
            backgroundImage:
              "url('/login-background.jpeg')",
          }}
        />

        <div className="absolute inset-0 bg-slate-950/60" />


        {/* Mobile Card */}

        <motion.div
          initial={{
            opacity: 0,
            y: 45,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative
            z-10
            w-full
            max-w-[570px]
            rounded-[18px]
            border
            border-white/40
            bg-white
            px-7
            py-8
            shadow-2xl
          "
        >

          {/* Mobile Header */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.5,
            }}
            className="text-center"
          >

            <div className="mb-4">

              <span className="text-4xl font-black text-red-600">
                LEAD
              </span>

              <span className="ml-2 text-4xl font-black text-slate-900">
                RMC
              </span>

            </div>

            <h1 className="text-3xl font-extrabold text-slate-950">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Login to access your RMC Management System
            </p>

            <div className="mx-auto mt-4 h-[3px] w-12 bg-red-600" />

          </motion.div>


          {/* Mobile Form */}

          <motion.form
            variants={formContainer}
            initial="hidden"
            animate="visible"
            onSubmit={handleLogin}
            className="mt-6 space-y-4"
          >

            {/* Username */}

            <motion.div
              variants={formItem}
              className="relative"
            >

              <User
                size={21}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Username"
                autoComplete="username"
                required
                className="
                  h-14
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  pl-12
                  pr-4
                  outline-none
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-500/10
                "
              />

            </motion.div>


            {/* Password */}

            <motion.div
              variants={formItem}
              className="relative"
            >

              <Lock
                size={21}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                autoComplete="current-password"
                required
                className="
                  h-14
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  pl-12
                  pr-12
                  outline-none
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-500/10
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              >
                {showPassword ? (
                  <EyeOff size={21} />
                ) : (
                  <Eye size={21} />
                )}
              </button>

            </motion.div>


            {/* Remember / Forgot */}

            <motion.div
              variants={formItem}
              className="flex items-center justify-between"
            >

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="
                    h-5
                    w-5
                    accent-red-600
                  "
                />

                <span className="text-sm text-slate-700">
                  Remember me
                </span>

              </label>

              <button
                type="button"
                onClick={() =>
                  setError(
                    "Please contact the administrator to reset your password."
                  )
                }
                className="
                  text-sm
                  font-semibold
                  text-red-600
                "
              >
                Forgot Password?
              </button>

            </motion.div>


            {/* Error */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >
                {error}
              </motion.div>
            )}


            {/* Login Button */}

            <motion.button
              variants={formItem}
              whileHover={{
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={loading}
              className="
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-red-600
                text-lg
                font-bold
                text-white
                shadow-lg
                transition
                hover:bg-red-700
                disabled:opacity-60
              "
            >

              <LogIn size={24} />

              {loading
                ? "Signing in..."
                : "Login"}

            </motion.button>

          </motion.form>


          {/* Mobile Bottom Brand */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 0.5,
            }}
            className="
              mt-7
              flex
              items-center
              justify-center
            "
          >

            <div className="h-[2px] w-16 bg-red-600" />

            <div className="mx-4 text-center">

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                "
              >
                LEAD RMC
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-slate-400
                "
              >
                Ready Mix Concrete
              </p>

            </div>

            <div className="h-[2px] w-16 bg-red-600" />

          </motion.div>

        </motion.div>

      </div>

    </div>
  );
}