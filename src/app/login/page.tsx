"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refreshToken
      );

      router.push("/dashboard");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data);

      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        overflow-hidden
        min-h-screen
        flex
        items-center
        justify-center
        px-5
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-violet-50
      "
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 30, -10, 0],
          scale: [1.1, 1, 1.15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          whileHover={{
            y: -6,
            transition: { duration: 0.3 },
          }}
          className="
            relative
            bg-white/90
            backdrop-blur-xl
            rounded-3xl
            shadow-2xl
            border
            border-white
            p-9
            overflow-hidden
          "
        >
          {/* Animated Gradient Border */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear",
            }}
            className="
              absolute
              -inset-[150px]
              opacity-20
              bg-conic
              from-emerald-400
              via-transparent
              to-violet-400
            "
          />

          <div className="relative z-10">
            <div className="mb-9">
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                }}
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-emerald-50
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-emerald-700
                  mb-5
                  transition
                  shadow-sm
                  hover:shadow-md
                "
              >
                Ecommerce Management Portal
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2,
                }}
                className="
                  text-4xl
                  font-bold
                  tracking-tight
                  text-gray-900
                "
              >
                Welcome back
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.3,
                }}
                className="
                  mt-3
                  text-gray-500
                  leading-relaxed
                "
              >
                Sign in to manage products, users,
                roles and your workspace.
              </motion.p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                  "
                >
                  Email address
                </label>

                <motion.input
                  whileHover={{ scale: 1.015 }}
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-gray-900
                    outline-none
                    transition-all
                    duration-300
                    focus:bg-white
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    hover:border-emerald-300
                    hover:bg-white
                  "
                  required
                />
              </div>

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                  "
                >
                  Password
                </label>

                <motion.input
                  whileHover={{ scale: 1.015 }}
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-gray-900
                    outline-none
                    transition-all
                    duration-300
                    focus:bg-white
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    hover:border-emerald-300
                    hover:bg-white
                  "
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    rounded-xl
                    bg-red-50
                    border
                    border-red-100
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{
                  scale: 1.03,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-emerald-600
                  to-teal-600
                  py-3.5
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-emerald-600/20
                  transition-all
                  duration-300
                  hover:shadow-2xl
                  hover:shadow-emerald-500/30
                  hover:from-emerald-700
                  hover:to-teal-700
                  disabled:opacity-60
                "
              >
                {loading
                  ? "Signing in..."
                  : "Continue"}
              </motion.button>
            </form>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
              }}
              className="mt-8 text-center"
            >
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Secure role-based access management
              </p>
            </motion.div>
          </div>

          {/* Floating Decorations */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="absolute top-10 right-10 h-3 w-3 rounded-full bg-emerald-300"
          />

          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="absolute bottom-10 left-8 h-2.5 w-2.5 rounded-full bg-violet-300"
          />
        </motion.div>
      </motion.div>
    </main>
  );
}