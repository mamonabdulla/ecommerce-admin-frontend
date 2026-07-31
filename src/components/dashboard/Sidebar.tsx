"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { menuPermissions } from "@/lib/permissions";

interface SidebarProps {
  permissions: string[];
}

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    permission: menuPermissions.Dashboard,
  },
  {
    name: "Permissions",
    path: "/dashboard/permissions",
    permission: menuPermissions.Permissions,
  },
  {
    name: "Roles",
    path: "/dashboard/roles",
    permission: menuPermissions.Roles,
  },
  {
    name: "Users",
    path: "/dashboard/users",
    permission: menuPermissions.Users,
  },
  {
    name: "Media",
    path: "/dashboard/media",
    permission: menuPermissions.Media,
  },
  {
    name: "Categories",
    path: "/dashboard/categories",
    permission: menuPermissions.Categories,
  },
  {
    name: "Brands",
    path: "/dashboard/brands",
    permission: menuPermissions.Brands,
  },
  {
    name: "Attributes",
    path: "/dashboard/attributes",
    permission: menuPermissions.Attributes,
  },
  {
    name: "Products",
    path: "/dashboard/products",
    permission: menuPermissions.Products,
  },
];

export default function Sidebar({
  permissions,
}: SidebarProps) {
  const pathname = usePathname();

  const visibleMenus = menuItems.filter((item) =>
    permissions.includes(item.permission)
  );

  return (
    <motion.aside
      initial={{ x: -25, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="
        relative
        shrink-0
        w-72
        h-screen
        overflow-y-auto
        bg-white/90
        backdrop-blur-xl
        border-r
        border-white
        shadow-xl
      "
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -15, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-16
            -left-16
            h-48
            w-48
            rounded-full
            bg-emerald-200/30
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -20, 20, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-0
            right-0
            h-56
            w-56
            rounded-full
            bg-violet-200/30
            blur-3xl
          "
        />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div
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
            "
          >
            Ecommerce
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {visibleMenus.map((item, index) => {
            const active = pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.path}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    rounded-2xl
                    px-4
                    py-3
                    font-medium
                    transition-all
                    duration-300
                    ${
                      active
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-violet-50 hover:text-emerald-700 hover:translate-x-1"
                    }
                  `}
                >
                  {!active && (
                    <span
                      className="
                        absolute
                        left-0
                        top-2
                        bottom-2
                        w-1
                        rounded-r-full
                        bg-emerald-500
                        scale-y-0
                        transition-transform
                        duration-300
                        group-hover:scale-y-100
                      "
                    />
                  )}

                  <span className="relative z-10">
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5">
          <div
            className="
              rounded-2xl
              bg-gradient-to-r
              from-emerald-50
              to-violet-50
              p-4
            "
          >
            <p className="text-xs text-gray-500">
              Secure
            </p>

            <p className="font-semibold text-gray-800">
              Role-Based Access
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}