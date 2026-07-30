"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );


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

      console.log(
        "LOGIN ERROR:",
        error.response?.data
      );

      setError(
        "Invalid email or password"
      );


    } finally {

      setLoading(false);

    }

  }



  return (

    <main
      className="
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


      <div className="w-full max-w-md">


        <div
          className="
            bg-white/90
            backdrop-blur-xl
            rounded-3xl
            shadow-2xl
            border
            border-white
            p-9
          "
        >


          <div className="mb-9">


            <div
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
              "
            >

              Ecommerce Management Portal

            </div>



            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-gray-900
              "
            >

              Welcome back

            </h1>



            <p
              className="
                mt-3
                text-gray-500
                leading-relaxed
              "
            >

              Sign in to manage products, users,
              roles and your workspace.

            </p>


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


              <input

                type="email"

                value={email}

                onChange={(e)=>
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
                  transition
                  focus:bg-white
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
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


              <input

                type="password"

                value={password}

                onChange={(e)=>
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
                  transition
                  focus:bg-white
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                "

                required

              />

            </div>







            {error && (

              <div
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

              </div>

            )}







            <button

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
                transition
                hover:from-emerald-700
                hover:to-teal-700
                active:scale-[0.98]
                disabled:opacity-60
              "

            >

              {loading
                ? "Signing in..."
                : "Continue"
              }

            </button>



          </form>







          <div className="mt-8 text-center">


            <p
              className="
                text-xs
                text-gray-400
              "
            >

              Secure role-based access management

            </p>


          </div>



        </div>


      </div>


    </main>

  );

}