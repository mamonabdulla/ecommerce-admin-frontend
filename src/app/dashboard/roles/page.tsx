"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";


interface Permission {

  id: string;

  name: string;

  description?: string;

  group: {
    id: string;
    name: string;
  };

}



interface Role {

  id: string;

  name: string;

  description?: string;

  isActive: boolean;

  permissions: Permission[];

}





export default function RolesPage() {


  const [roles,setRoles] =
    useState<Role[]>([]);



  const [permissions,setPermissions] =
    useState<Permission[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [modalOpen,setModalOpen] =
    useState(false);



  const [editingRole,setEditingRole] =
    useState<Role | null>(null);



  const [name,setName] =
    useState("");



  const [description,setDescription] =
    useState("");



  const [isActive,setIsActive] =
    useState(true);



  const [selectedPermissions,setSelectedPermissions] =
    useState<string[]>([]);







  async function loadRoles(){


    const response =
      await api.get("/role");


    setRoles(
      response.data
    );


  }







  async function loadPermissions(){


    const response =
      await api.get(
        "/permission?page=1&limit=1000"
      );


    setPermissions(
      response.data.data ?? []
    );


  }







  useEffect(()=>{


    async function init(){


      try {


        await Promise.all([

          loadRoles(),

          loadPermissions()

        ]);



      }catch(error){


        console.log(error);


      }
      finally{


        setLoading(false);


      }


    }


    init();


  },[]);








  function resetForm(){


    setName("");

    setDescription("");

    setIsActive(true);

    setSelectedPermissions([]);

    setEditingRole(null);


  }







  function togglePermission(
    id:string
  ){


    setSelectedPermissions(
      old =>

      old.includes(id)

      ? old.filter(
          item=>item!==id
        )

      : [
          ...old,
          id
        ]

    );


  }







  function openCreate(){


    resetForm();

    setModalOpen(true);


  }







  function openEdit(
    role:Role
  ){


    setEditingRole(role);


    setName(
      role.name
    );


    setDescription(
      role.description ?? ""
    );


    setIsActive(
      role.isActive
    );


    setSelectedPermissions(

      role.permissions.map(
        permission=>permission.id
      )

    );


    setModalOpen(true);


  }







  async function saveRole(){


    const payload = {

      name,

      description,

      isActive,

      permissionIds:
        selectedPermissions,

    };



    try {


      if(editingRole){


        await api.patch(

          `/role/${editingRole.id}`,

          payload

        );


      }
      else{


        await api.post(

          "/role",

          payload

        );


      }



      await loadRoles();


      setModalOpen(false);


      resetForm();



    }
    catch(error:any){


      console.log(

        error.response?.data

      );


    }


  }







  async function deleteRole(
    role:Role
  ){


    if(
      role.name === "Admin" ||
      role.name === "Super Admin"
    ){

      alert(
        "System role cannot be deleted"
      );

      return;

    }



    const confirmDelete =
      confirm(
        `Delete ${role.name}?`
      );



    if(!confirmDelete)
      return;




    try {


      await api.delete(

        `/role/${role.id}`

      );


      loadRoles();


    }
    catch(error:any){


      alert(

        error.response?.data?.message ??
        "Delete failed"

      );


    }


  }







  const groupedPermissions =
    permissions.reduce(

      (
        result:
        Record<string,Permission[]>,

        permission

      )=>{


        const group =
          permission.group?.name ??
          "Other";



        if(!result[group]){

          result[group]=[];

        }



        result[group].push(
          permission
        );



        return result;


      },

      {}

    );

      if (loading) {

    return (

      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
          text-gray-500
        "
      >

        Loading roles...

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

            Roles

          </h1>


          <p
            className="
              mt-2
              text-gray-500
            "
          >

            Manage user roles and permissions.

          </p>


        </div>




        <button

          onClick={openCreate}

          className="
            px-5
            py-3
            rounded-xl
            bg-emerald-600
            text-white
            font-semibold
            hover:bg-emerald-700
          "

        >

          + Create Role

        </button>


      </div>







      <div
        className="
          space-y-5
        "
      >


        {
          roles.map((role)=>(


            <div

              key={role.id}

              className="
                border
                rounded-2xl
                p-6
              "

            >



              <div
                className="
                  flex
                  justify-between
                  items-start
                "
              >


                <div>


                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    {role.name}

                  </h2>


                  <p
                    className="
                      text-gray-500
                      mt-1
                    "
                  >

                    {role.description ||
                      "No description"
                    }

                  </p>


                  <p
                    className="
                      text-sm
                      mt-3
                      text-gray-600
                    "
                  >

                    Permissions:

                    <span
                      className="
                        ml-2
                        font-bold
                      "
                    >

                      {role.permissions.length}

                    </span>

                  </p>


                </div>





                <div
                  className="
                    flex
                    gap-3
                  "
                >


                  <button

                    onClick={() =>
                      openEdit(role)
                    }

                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                    "

                  >

                    Edit

                  </button>





                  {
                    role.name !== "Admin" &&
                    role.name !== "Super Admin" &&

                    <button

                      onClick={() =>
                        deleteRole(role)
                      }

                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-red-50
                        text-red-600
                      "

                    >

                      Delete

                    </button>

                  }



                </div>


              </div>


            </div>


          ))
        }


      </div>








      {
        modalOpen && (


          <div
            className="
              fixed
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              z-50
              p-5
            "
          >


            <div
              className="
                bg-white
                rounded-3xl
                p-8
                w-full
                max-w-3xl
                max-h-[90vh]
                overflow-y-auto
              "
            >



              <h2
                className="
                  text-2xl
                  font-bold
                  mb-6
                "
              >

                {
                  editingRole
                  ? "Edit Role"
                  : "Create Role"
                }

              </h2>





              <input

                value={name}

                onChange={(e)=>
                  setName(e.target.value)
                }

                placeholder="Role name"

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-4
                "

              />





              <textarea

                value={description}

                onChange={(e)=>
                  setDescription(
                    e.target.value
                  )
                }

                placeholder="Description"

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-4
                "

              />





              <label
                className="
                  flex
                  gap-3
                  items-center
                  mb-6
                "
              >

                <input

                  type="checkbox"

                  checked={isActive}

                  onChange={(e)=>
                    setIsActive(
                      e.target.checked
                    )
                  }

                />

                Active

              </label>






              <h3
                className="
                  font-bold
                  mb-4
                "
              >

                Permissions

              </h3>






              {
                Object.entries(
                  groupedPermissions
                )
                .map(
                  ([group,items])=>(


                    <div
                      key={group}
                      className="
                        mb-5
                        border
                        rounded-2xl
                        p-5
                      "
                    >


                      <h4
                        className="
                          font-bold
                          mb-3
                          text-emerald-700
                        "
                      >

                        {group}

                      </h4>




                      <div
                        className="
                          grid
                          md:grid-cols-2
                          gap-3
                        "
                      >


                        {
                          items.map(
                            permission=>(


                              <label
                                key={
                                  permission.id
                                }

                                className="
                                  flex
                                  items-center
                                  gap-3
                                  text-sm
                                "
                              >


                                <input

                                  type="checkbox"

                                  checked={
                                    selectedPermissions.includes(
                                      permission.id
                                    )
                                  }

                                  onChange={()=>
                                    togglePermission(
                                      permission.id
                                    )
                                  }

                                />


                                {
                                  permission.name
                                }


                              </label>


                            )
                          )
                        }


                      </div>


                    </div>


                  )
                )
              }







              <div
                className="
                  flex
                  gap-4
                  mt-6
                "
              >


                <button

                  onClick={()=>{
                    setModalOpen(false);
                    resetForm();
                  }}

                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-gray-100
                  "

                >

                  Cancel

                </button>





                <button

                  onClick={saveRole}

                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-emerald-600
                    text-white
                  "

                >

                  {
                    editingRole
                    ? "Update"
                    : "Create"
                  }

                </button>


              </div>


            </div>


          </div>


        )
      }


    </div>

  );

}