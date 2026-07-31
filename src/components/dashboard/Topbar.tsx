"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { clearTokens, getRefreshToken } from "@/lib/auth";

interface TopbarProps {
  name: string;
  role: string;
}

export default function Topbar({
  name,
  role,
}: TopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        await api.post("/auth/logout", {
          refreshToken,
        });
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      clearTokens();

      // Force complete reload
      window.location.href = "/login";
    }
  }

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        relative
        overflow-hidden
        h-20
        bg-white/85
        backdrop-blur-xl
        border-b
        border-white
        shadow-lg
        flex
        items-center
        justify-between
        px-8
      "
    >
      {/* Background Blobs */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-16
          left-20
          h-40
          w-40
          rounded-full
          bg-emerald-200/20
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, -20, 10, 0],
          y: [0, 15, -10, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-0
          top-0
          h-48
          w-48
          rounded-full
          bg-violet-200/20
          blur-3xl
        "
      />

      <div className="relative z-10">
        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          className="
            inline-flex
            items-center
            rounded-full
            bg-emerald-50
            px-4
            py-2
            text-sm
            font-semibold
            text-emerald-700
            shadow-sm
            mb-2
          "
        >
          Ecommerce Admin
        </motion.div>

        <h2
          className="
            text-xl
            font-bold
            text-gray-900
          "
        >
          Welcome back, {name}
        </h2>
      </div>

      <div
        className="
          relative
          z-10
          flex
          items-center
          gap-5
        "
      >
        <motion.div
          whileHover={{
            y: -2,
          }}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-emerald-50
            to-violet-50
            border
            border-white
            px-5
            py-3
            shadow-sm
          "
        >
          <p
            className="
              font-semibold
              text-gray-900
            "
          >
            {name}
          </p>

          <p
            className="
              text-sm
              text-emerald-600
              font-medium
            "
          >
            {role}
          </p>
        </motion.div>

        <motion.button
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={handleLogout}
          className="
            rounded-xl
            bg-red-50
            px-5
            py-2.5
            font-semibold
            text-red-600
            shadow-sm
            transition-all
            duration-300
            hover:bg-red-100
            hover:shadow-lg
            hover:shadow-red-200/50
          "
        >
          Logout
        </motion.button>
      </div>

      {/* Floating Dots */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="
          absolute
          left-1/2
          top-4
          h-2.5
          w-2.5
          rounded-full
          bg-emerald-300
        "
      />

      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="
          absolute
          right-16
          bottom-4
          h-3
          w-3
          rounded-full
          bg-violet-300
        "
      />
    </motion.header>
  );
}