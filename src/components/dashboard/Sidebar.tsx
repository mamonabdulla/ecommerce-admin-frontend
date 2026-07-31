"use client";

import Link from "next/link";

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
    path: "/products",
    permission: menuPermissions.Products,
  },

];




export default function Sidebar({

  permissions,

}: SidebarProps) {



  const visibleMenus =
    menuItems.filter((item) =>
      permissions.includes(item.permission)
    );




  return (

    <aside
      className="
        w-72
        min-h-screen
        bg-white
        border-r
        border-gray-100
        p-6
      "
    >


      <div className="mb-10">

        <h1
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Ecommerce
        </h1>


        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Management Portal
        </p>


      </div>



      <nav className="space-y-2">

        {visibleMenus.map((item) => (

          <Link

            key={item.path}

            href={item.path}

            className="
              block
              rounded-xl
              px-4
              py-3
              text-gray-700
              hover:bg-emerald-50
              hover:text-emerald-700
              transition
            "

          >

            {item.name}

          </Link>

        ))}


      </nav>


    </aside>

  );

}