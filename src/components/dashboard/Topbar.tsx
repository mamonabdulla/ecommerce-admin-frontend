"use client";

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


      const refreshToken =
        getRefreshToken();



      if (refreshToken) {


        await api.post(
          "/auth/logout",
          {
            refreshToken,
          }
        );


      }



    } catch (error) {


      console.log(
        "Logout error:",
        error,
      );


    } finally {


      clearTokens();


      // Force complete reload
      window.location.href = "/login";


    }


  }





  return (

    <header
      className="
        h-20
        bg-white
        border-b
        border-gray-100
        flex
        items-center
        justify-between
        px-8
      "
    >


      <div>


        <h2
          className="
            text-xl
            font-bold
            text-gray-900
          "
        >

          Ecommerce Admin

        </h2>



        <p
          className="
            text-sm
            text-gray-500
          "
        >

          Welcome back, {name}

        </p>


      </div>






      <div
        className="
          flex
          items-center
          gap-5
        "
      >



        <div className="text-right">


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
            "
          >

            {role}

          </p>



        </div>






        <button

          onClick={handleLogout}

          className="
            px-4
            py-2
            rounded-xl
            bg-red-50
            text-red-600
            hover:bg-red-100
            transition
            font-medium
          "

        >

          Logout

        </button>



      </div>



    </header>

  );

}