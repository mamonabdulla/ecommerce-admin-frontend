"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";
import { useSession } from "@/context/SessionContext";


interface User {

  id: string;

  name: string;

  email: string;

  phone?: string;

  gender?: string;

  avatar?: string;

  isActive: boolean;

  createdAt: string;

  role: {

    id: string;

    name: string;

  };

}



interface Role {

  id: string;

  name: string;

}



export default function UsersPage() {


  const session = useSession();



  const [users, setUsers] =
    useState<User[]>([]);


  const [roles, setRoles] =
    useState<Role[]>([]);



  const [loading, setLoading] =
    useState(true);



  const [error, setError] =
    useState("");



  const [search, setSearch] =
    useState("");



  const [showCreate, setShowCreate] =
    useState(false);



  const [showEdit, setShowEdit] =
    useState(false);



  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);



  const [form, setForm] =
    useState({

      name: "",

      email: "",

      password: "",

      phone: "",

      gender: "",

      avatar: "",

      roleId: "",

      isActive: true,

    });





  const canCreate =
    session?.permissions.includes(
      "user:create"
    );



  const canUpdate =
    session?.permissions.includes(
      "user:update"
    );



  const canDelete =
    session?.permissions.includes(
      "user:delete"
    );






  async function loadUsers() {


    try {


      setLoading(true);


      const response =
        await api.get("/users");



      setUsers(
        response.data
      );



    } catch(error:any) {


      console.log(
        error.response?.data
      );


      setError(
        "Failed to load users"
      );


    } finally {


      setLoading(false);


    }


  }







  async function loadRoles() {


    try {


      const response =
        await api.get("/role");



      setRoles(
        response.data
      );



    } catch(error:any) {


      console.log(
        "Role error",
        error.response?.data
      );


    }


  }






  useEffect(()=>{


    loadUsers();

    loadRoles();


  },[]);








  function resetForm(){


    setForm({

      name:"",

      email:"",

      password:"",

      phone:"",

      gender:"",

      avatar:"",

      roleId:"",

      isActive:true,

    });


  }







  async function createUser(){


    try{


      await api.post(
        "/users",
        form
      );



      resetForm();


      setShowCreate(false);


      loadUsers();



    }catch(error:any){


      console.log(
        error.response?.data
      );


      setError(
        "Failed to create user"
      );


    }


  }







  function openEdit(user:User){


    setSelectedUser(user);


    setForm({

      name:user.name,

      email:user.email,

      password:"",

      phone:user.phone ?? "",

      gender:user.gender ?? "",

      avatar:user.avatar ?? "",

      roleId:user.role.id,

      isActive:user.isActive,

    });


    setShowEdit(true);


  }






  async function updateUser(){


    if(!selectedUser)
      return;



    try{


      await api.patch(

        `/users/${selectedUser.id}`,

        form

      );



      setShowEdit(false);


      setSelectedUser(null);


      resetForm();


      loadUsers();



    }catch(error:any){


      console.log(
        error.response?.data
      );


      setError(
        "Failed to update user"
      );


    }


  }







  async function deleteUser(id:string){


    const confirmDelete =
      confirm(
        "Are you sure you want to delete this user?"
      );



    if(!confirmDelete)
      return;




    try{


      await api.delete(
        `/users/${id}`
      );


      loadUsers();



    }catch(error:any){


      console.log(
        error.response?.data
      );


      setError(
        "Failed to delete user"
      );


    }


  }






  const filteredUsers =
    users.filter((user)=>

      user.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

      ||

      user.email
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

    );





  if(loading){


    return (

      <div className="p-8">

        Loading users...

      </div>

    );


  }

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


      <div
        className="
          flex
          justify-between
          items-center
          mb-8
        "
      >


        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >
            Users
          </h1>


          <p className="text-gray-500 mt-2">
            Manage platform users
          </p>


        </div>




        {
          canCreate && (

            <button

              onClick={()=>{
                resetForm();
                setShowCreate(true);
              }}

              className="
                bg-emerald-600
                text-white
                px-5
                py-3
                rounded-xl
                hover:bg-emerald-700
                transition
              "

            >

              + Create User

            </button>

          )
        }


      </div>





      <input

        value={search}

        onChange={(e)=>
          setSearch(e.target.value)
        }

        placeholder="Search users..."

        className="
          w-full
          mb-6
          px-4
          py-3
          rounded-xl
          border
          border-gray-200
          outline-none
        "

      />







      {
        error && (

          <div
            className="
              bg-red-50
              text-red-600
              rounded-xl
              p-4
              mb-5
            "
          >

            {error}

          </div>

        )
      }









      <div className="overflow-x-auto">


        <table className="w-full">


          <thead>


            <tr
              className="
                border-b
                text-gray-500
                text-sm
              "
            >

              <th className="p-4 text-left">
                Name
              </th>


              <th className="p-4 text-left">
                Email
              </th>


              <th className="p-4 text-left">
                Role
              </th>


              <th className="p-4 text-left">
                Status
              </th>


              <th className="p-4 text-left">
                Actions
              </th>


            </tr>


          </thead>





          <tbody>


          {
            filteredUsers.map((user)=>(


              <tr
                key={user.id}
                className="
                  border-b
                  hover:bg-gray-50
                "
              >



                <td className="p-4 font-medium">

                  {user.name}

                </td>




                <td className="p-4 text-gray-600">

                  {user.email}

                </td>




                <td className="p-4">


                  <span
                    className="
                      bg-violet-50
                      text-violet-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                    "
                  >

                    {user.role?.name}

                  </span>


                </td>




                <td className="p-4">


                  {
                    user.isActive ?


                    <span
                      className="
                        text-emerald-600
                        font-medium
                      "
                    >

                      Active

                    </span>


                    :


                    <span
                      className="
                        text-red-600
                        font-medium
                      "
                    >

                      Inactive

                    </span>


                  }


                </td>





                <td className="p-4">


                  <div
                    className="
                      flex
                      gap-3
                    "
                  >


                  {
                    canUpdate && (

                      <button

                        onClick={()=>
                          openEdit(user)
                        }

                        className="
                          px-3
                          py-2
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                        "

                      >

                        Edit

                      </button>

                    )
                  }






                  {
                    canDelete && (

                      <button

                        onClick={()=>
                          deleteUser(user.id)
                        }

                        className="
                          px-3
                          py-2
                          rounded-lg
                          bg-red-50
                          text-red-600
                        "

                      >

                        Delete

                      </button>

                    )
                  }



                  </div>


                </td>



              </tr>


            ))
          }



          </tbody>


        </table>


      </div>









      {
        showCreate && (

          <Modal title="Create User">


            <UserForm

              form={form}

              setForm={setForm}

              roles={roles}

            />



            <div className="flex gap-3 mt-6">


              <button

                onClick={createUser}

                className="
                  bg-emerald-600
                  text-white
                  px-5
                  py-2
                  rounded-xl
                "

              >

                Save

              </button>




              <button

                onClick={()=>
                  setShowCreate(false)
                }

                className="
                  bg-gray-100
                  px-5
                  py-2
                  rounded-xl
                "

              >

                Cancel

              </button>


            </div>


          </Modal>

        )
      }









      {
        showEdit && (

          <Modal title="Edit User">


            <UserForm

              form={form}

              setForm={setForm}

              roles={roles}

            />



            <div className="flex gap-3 mt-6">


              <button

                onClick={updateUser}

                className="
                  bg-blue-600
                  text-white
                  px-5
                  py-2
                  rounded-xl
                "

              >

                Update

              </button>




              <button

                onClick={()=>
                  setShowEdit(false)
                }

                className="
                  bg-gray-100
                  px-5
                  py-2
                  rounded-xl
                "

              >

                Cancel

              </button>


            </div>


          </Modal>

        )
      }




    </div>

  );

}





function Modal({

  title,

  children,

}:{

  title:string;

  children:React.ReactNode;

}){


  return (

    <div
      className="
        fixed
        inset-0
        bg-black/30
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          p-8
          w-full
          max-w-lg
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-5
          "
        >

          {title}

        </h2>


        {children}


      </div>


    </div>

  );

}









function UserForm({

  form,

  setForm,

  roles,

}:any){


  return (

    <div className="space-y-4">


      <input

        placeholder="Name"

        value={form.name}

        onChange={(e)=>
          setForm({
            ...form,
            name:e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "

      />




      <input

        placeholder="Email"

        value={form.email}

        onChange={(e)=>
          setForm({
            ...form,
            email:e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "

      />





      <input

        placeholder="Password"

        type="password"

        value={form.password}

        onChange={(e)=>
          setForm({
            ...form,
            password:e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "

      />






      <select

        value={form.roleId}

        onChange={(e)=>
          setForm({
            ...form,
            roleId:e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "

      >

        <option value="">
          Select Role
        </option>


        {
          roles.map((role:Role)=>(

            <option
              key={role.id}
              value={role.id}
            >

              {role.name}

            </option>

          ))
        }


      </select>







      <label
        className="
          flex
          gap-3
          items-center
        "
      >

        <input

          type="checkbox"

          checked={form.isActive}

          onChange={(e)=>
            setForm({
              ...form,
              isActive:e.target.checked
            })
          }

        />


        Active


      </label>



    </div>

  );

}