"use client";

import { motion } from "framer-motion";
import { useSession } from "@/context/SessionContext";

export default function DashboardPage() {
  const session = useSession();

  return (
    <main
      className="
        relative
        overflow-hidden
        min-h-screen
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-violet-50
        p-6
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
        className="
          absolute
          -top-24
          -left-24
          h-80
          w-80
          rounded-full
          bg-emerald-200/30
          blur-3xl
        "
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
        className="
          absolute
          -bottom-24
          -right-24
          h-96
          w-96
          rounded-full
          bg-violet-200/30
          blur-3xl
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white
          bg-white/90
          backdrop-blur-xl
          shadow-2xl
          p-8
        "
      >
        {/* Gradient Glow */}
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
          <motion.h1
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >
            Welcome back, {session?.user?.name ?? "User"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              mt-2
              text-gray-500
            "
          >
            Manage your ecommerce platform from here.
          </motion.p>

          <div
            className="
              mt-8
              grid
              gap-5
              md:grid-cols-3
            "
          >
            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className="
                rounded-2xl
                bg-emerald-50
                p-5
                border
                border-emerald-100
                shadow-sm
                transition-all
              "
            >
              <p className="text-sm font-medium text-emerald-700">
                Role
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {session?.role ?? "N/A"}
              </h2>
            </motion.div>

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className="
                rounded-2xl
                bg-violet-50
                p-5
                border
                border-violet-100
                shadow-sm
                transition-all
              "
            >
              <p className="text-sm font-medium text-violet-700">
                Permissions
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {session?.permissions?.length ?? 0}
              </h2>
            </motion.div>

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className="
                rounded-2xl
                bg-gray-50
                p-5
                border
                border-gray-100
                shadow-sm
                transition-all
              "
            >
              <p className="text-sm font-medium text-gray-600">
                Status
              </p>

              <h2
                className="
                  mt-2
                  text-xl
                  font-bold
                  text-emerald-600
                "
              >
                Active
              </h2>
            </motion.div>
          </div>
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
          className="
            absolute
            top-10
            right-10
            h-3
            w-3
            rounded-full
            bg-emerald-300
          "
        />

        <motion.div
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="
            absolute
            bottom-10
            left-10
            h-2.5
            w-2.5
            rounded-full
            bg-violet-300
          "
        />
      </motion.div>
    </main>
  );
}