"use client";

import { useSession } from "@/context/SessionContext";

export default function DashboardPage() {
  const session = useSession();

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-gray-100
        p-8
      "
    >
      <h1
        className="
          text-3xl
          font-bold
          text-gray-900
        "
      >
        Welcome back,{" "}
        {session?.user?.name ?? "User"}
      </h1>

      <p
        className="
          mt-2
          text-gray-500
        "
      >
        Manage your ecommerce platform from here.
      </p>

      <div
        className="
          mt-8
          grid
          md:grid-cols-3
          gap-5
        "
      >
        <div
          className="
            rounded-2xl
            bg-emerald-50
            p-5
          "
        >
          <p className="text-sm text-emerald-700">
            Role
          </p>

          <h2 className="mt-2 font-bold text-xl">
            {session?.role ?? "N/A"}
          </h2>
        </div>

        <div
          className="
            rounded-2xl
            bg-violet-50
            p-5
          "
        >
          <p className="text-sm text-violet-700">
            Permissions
          </p>

          <h2 className="mt-2 font-bold text-xl">
            {session?.permissions?.length ?? 0}
          </h2>
        </div>

        <div
          className="
            rounded-2xl
            bg-gray-50
            p-5
          "
        >
          <p className="text-sm text-gray-600">
            Status
          </p>

          <h2
            className="
              mt-2
              font-bold
              text-xl
              text-emerald-600
            "
          >
            Active
          </h2>
        </div>
      </div>
    </div>
  );
}