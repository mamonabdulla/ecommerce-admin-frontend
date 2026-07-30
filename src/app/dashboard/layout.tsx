"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { clearTokens, getAccessToken } from "@/lib/auth";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

import {
  SessionContext,
  SessionData,
} from "@/context/SessionContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [session, setSession] =
    useState<SessionData | null>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function loadSession() {

      const token = getAccessToken();


      if (!token) {

        router.replace("/login");

        return;

      }


      try {

        const response =
          await api.get("/auth/session");


        setSession({

          user:
            response.data.user ?? null,

          role:
            response.data.role ?? null,

          permissions:
            response.data.permissions ?? [],

        });


      } catch {

        clearTokens();

        router.replace("/login");


      } finally {

        setLoading(false);

      }

    }


    loadSession();


  }, [router]);



  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        Loading...

      </div>

    );

  }



  return (

    <SessionContext.Provider
      value={session}
    >

      <div
        className="
          h-screen
          flex
          overflow-hidden
          bg-gradient-to-br
          from-emerald-50
          via-white
          to-violet-50
        "
      >


        <Sidebar
          permissions={
            session?.permissions ?? []
          }
        />



        <div
          className="
            flex-1
            flex
            flex-col
            overflow-hidden
          "
        >


          <Topbar

            name={
              session?.user?.name ??
              "User"
            }

            role={
              session?.role ??
              "Role"
            }

          />



          <main
            className="
              flex-1
              overflow-y-auto
              p-8
            "
          >

            {children}

          </main>



        </div>


      </div>


    </SessionContext.Provider>

  );

}