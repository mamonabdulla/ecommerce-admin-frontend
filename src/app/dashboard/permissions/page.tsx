"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";


interface Permission {

  id: string;

  name: string;

  description?: string;

  group?: {
    id: string;
    name: string;
  };

}



interface PermissionGroup {

  id: string;

  name: string;

  description?: string;

  permissions?: Permission[];

}




export default function PermissionsPage() {


  const [permissions, setPermissions] =
    useState<Permission[]>([]);


  const [groups, setGroups] =
    useState<PermissionGroup[]>([]);



  const [loading, setLoading] =
    useState(true);



  const [activeTab, setActiveTab] =
    useState<
      "permissions" | "groups"
    >("permissions");



  const [search, setSearch] =
    useState("");



  const [showPermissionModal, setShowPermissionModal] =
    useState(false);



  const [showGroupModal, setShowGroupModal] =
    useState(false);



  const [editGroupId, setEditGroupId] =
    useState<string | null>(null);





  const [permissionName, setPermissionName] =
    useState("");



  const [permissionDescription, setPermissionDescription] =
    useState("");



  const [permissionGroupId, setPermissionGroupId] =
    useState("");





  const [groupName, setGroupName] =
    useState("");



  const [groupDescription, setGroupDescription] =
    useState("");



  const [actions, setActions] =
    useState<string[]>([
      "create",
      "read",
      "update",
      "delete",
      "watch",
    ]);





  async function fetchPermissions(
    value = "",
  ) {

    try {

      const response =
        await api.get(
          `/permission?page=1&limit=1000&search=${value}`,
        );


      setPermissions(
        response.data.data ?? [],
      );


    } catch(error) {

      console.log(
        "Permission fetch error",
        error,
      );

    }

  }







  async function fetchGroups() {

    try {

      const response =
        await api.get(
          "/permission/groups",
        );


      setGroups(
        response.data ?? [],
      );


    } catch(error) {

      console.log(
        "Group fetch error",
        error,
      );

    }

  }







  async function loadData() {

    await Promise.all([

      fetchPermissions(),

      fetchGroups(),

    ]);


    setLoading(false);

  }







  useEffect(() => {

    loadData();

  }, []);








  async function createPermission() {

    try {


      await api.post(
        "/permission",
        {

          name:
            permissionName,

          description:
            permissionDescription,

          groupId:
            permissionGroupId,

        },
      );



      setPermissionName("");

      setPermissionDescription("");

      setPermissionGroupId("");

      setShowPermissionModal(false);



      fetchPermissions();



    } catch(error) {

      console.log(
        "Create permission error",
        error,
      );

    }

  }








  async function deletePermission(
    id:string,
  ) {


    if(
      !confirm(
        "Delete this permission?"
      )
    ) return;



    try {


      await api.delete(
        `/permission/${id}`,
      );


      fetchPermissions();



    } catch(error) {


      console.log(
        "Delete permission error",
        error,
      );


    }


  }








  async function createGroup() {


    try {


      await api.post(
        "/permission/groups",
        {

          name:
            groupName,

          description:
            groupDescription,

          actions,

        },
      );



      setGroupName("");

      setGroupDescription("");

      setShowGroupModal(false);



      loadData();



    } catch(error) {


      console.log(
        "Create group error",
        error,
      );


    }


  }

    async function updateGroup() {

    if (!editGroupId) return;


    try {


      await api.patch(
        `/permission/groups/${editGroupId}`,
        {

          name:
            groupName,

          description:
            groupDescription,

          actions,

        },
      );



      setEditGroupId(null);

      setGroupName("");

      setGroupDescription("");

      setShowGroupModal(false);



      loadData();



    } catch(error) {


      console.log(
        "Update group error",
        error,
      );


    }

  }







  function openEditGroup(
    group: PermissionGroup,
  ) {


    setEditGroupId(
      group.id,
    );


    setGroupName(
      group.name,
    );


    setGroupDescription(
      group.description ?? "",
    );


    setActions(
      group.permissions?.map(
        permission =>
          permission.name.split(":")[1],
      ) ?? [],
    );


    setShowGroupModal(true);

  }







  function toggleAction(
    action:string,
  ) {


    setActions(
      previous =>

        previous.includes(action)

          ?

          previous.filter(
            item =>
              item !== action,
          )

          :

          [
            ...previous,
            action,
          ]

    );


  }







  if(loading){

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gradient-to-br
          from-emerald-50
          via-white
          to-violet-50
        "
      >

        <p className="text-gray-500">
          Loading permissions...
        </p>

      </div>

    );

  }








  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-violet-50
      "
    >


      <div
        className="
          bg-white/90
          backdrop-blur-xl
          rounded-3xl
          shadow-xl
          border
          border-white
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

            <span
              className="
                bg-emerald-50
                text-emerald-700
                px-4
                py-2
                rounded-full
                text-sm
              "
            >
              Access Control
            </span>


            <h1
              className="
                mt-4
                text-4xl
                font-bold
                text-gray-900
              "
            >
              Permissions
            </h1>


            <p className="text-gray-500 mt-2">
              Manage permissions and permission groups.
            </p>

          </div>




          <button

            onClick={() => {

              if(activeTab === "permissions")
                setShowPermissionModal(true);

              else
                setShowGroupModal(true);

            }}

            className="
              rounded-xl
              bg-gradient-to-r
              from-emerald-600
              to-teal-600
              px-5
              py-3
              text-white
              font-semibold
              shadow-lg
            "

          >

            +
            {
              activeTab === "permissions"
              ?
              " Create Permission"
              :
              " Create Group"
            }

          </button>


        </div>





        <div
          className="
            flex
            gap-4
            mb-6
          "
        >

          <button

            onClick={() =>
              setActiveTab("permissions")
            }

            className={`
              px-5
              py-2
              rounded-xl
              ${
                activeTab==="permissions"
                ?
                "bg-emerald-600 text-white"
                :
                "bg-gray-100"
              }
            `}

          >
            Permissions
          </button>



          <button

            onClick={() =>
              setActiveTab("groups")
            }

            className={`
              px-5
              py-2
              rounded-xl
              ${
                activeTab==="groups"
                ?
                "bg-emerald-600 text-white"
                :
                "bg-gray-100"
              }
            `}

          >
            Groups
          </button>


        </div>





        {
          activeTab === "permissions" && (

          <>

          <input

            value={search}

            onChange={(e)=>{

              setSearch(
                e.target.value,
              );

              fetchPermissions(
                e.target.value,
              );

            }}

            placeholder="Search permissions..."

            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              mb-6
            "

          />



          <div
            className="
              space-y-4
            "
          >

          {
            permissions.map(permission => (

              <div
                key={permission.id}
                className="
                  flex
                  justify-between
                  items-center
                  p-5
                  rounded-2xl
                  border
                  bg-white
                  shadow-sm
                "
              >

                <div>

                  <h2 className="font-bold text-lg">
                    {permission.name}
                  </h2>


                  <p className="text-gray-500">
                    {permission.description}
                  </p>


                  <p
                    className="
                      text-sm
                      text-emerald-600
                    "
                  >
                    Group:
                    {" "}
                    {permission.group?.name}
                  </p>

                </div>



                <button

                  onClick={() =>
                    deletePermission(
                      permission.id,
                    )
                  }

                  className="
                    bg-red-50
                    text-red-600
                    px-4
                    py-2
                    rounded-xl
                  "

                >
                  Delete
                </button>


              </div>

            ))
          }

          </div>

          </>

          )
        }





        {
          activeTab === "groups" && (

            <div className="space-y-5">

            {
              groups.map(group => (

                <div

                  key={group.id}

                  className="
                    rounded-2xl
                    border
                    p-6
                    bg-white
                  "

                >

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <div>

                      <h2 className="text-xl font-bold">
                        {group.name}
                      </h2>


                      <p className="text-gray-500">
                        {group.description}
                      </p>

                    </div>


                    <button

                      onClick={() =>
                        openEditGroup(group)
                      }

                      className="
                        bg-violet-50
                        text-violet-600
                        px-4
                        py-2
                        rounded-xl
                      "

                    >
                      Edit
                    </button>


                  </div>




                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                  {
                    group.permissions?.map(permission => (

                      <span

                        key={permission.id}

                        className="
                          bg-emerald-50
                          text-emerald-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        "

                      >

                        {permission.name}

                      </span>

                    ))
                  }

                  </div>


                </div>

              ))
            }

            </div>

          )
        }


      </div>

            {
        showPermissionModal && (

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
                max-w-md
                shadow-2xl
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  mb-6
                "
              >
                Create Permission
              </h2>



              <input
                placeholder="Permission name"
                value={permissionName}
                onChange={(e)=>
                  setPermissionName(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-4
                "
              />



              <input
                placeholder="Description"
                value={permissionDescription}
                onChange={(e)=>
                  setPermissionDescription(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-4
                "
              />



              <select

                value={permissionGroupId}

                onChange={(e)=>
                  setPermissionGroupId(
                    e.target.value
                  )
                }

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-6
                "

              >

                <option value="">
                  Select Permission Group
                </option>


                {
                  groups.map(group => (

                    <option
                      key={group.id}
                      value={group.id}
                    >
                      {group.name}
                    </option>

                  ))
                }


              </select>




              <div className="flex gap-3">


                <button

                  onClick={() =>
                    setShowPermissionModal(false)
                  }

                  className="
                    flex-1
                    bg-gray-100
                    rounded-xl
                    py-3
                  "

                >
                  Cancel
                </button>



                <button

                  onClick={createPermission}

                  className="
                    flex-1
                    bg-emerald-600
                    text-white
                    rounded-xl
                    py-3
                  "

                >
                  Create
                </button>


              </div>


            </div>


          </div>

        )
      }





      {
        showGroupModal && (

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
                max-w-md
                shadow-2xl
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
                  editGroupId
                  ?
                  "Edit Group"
                  :
                  "Create Group"
                }

              </h2>




              <input

                placeholder="Group name"

                value={groupName}

                onChange={(e)=>
                  setGroupName(
                    e.target.value
                  )
                }

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-4
                "

              />





              <input

                placeholder="Description"

                value={groupDescription}

                onChange={(e)=>
                  setGroupDescription(
                    e.target.value
                  )
                }

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  mb-5
                "

              />





              <p className="font-semibold mb-3">
                Actions
              </p>



              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                  mb-6
                "
              >

                {
                  [
                    "create",
                    "read",
                    "update",
                    "delete",
                    "watch",
                    "upload",
                    "write",
                  ].map(action => (

                    <button

                      key={action}

                      onClick={() =>
                        toggleAction(action)
                      }

                      className={`
                        px-3
                        py-2
                        rounded-xl
                        text-sm
                        ${
                          actions.includes(action)
                          ?
                          "bg-emerald-600 text-white"
                          :
                          "bg-gray-100"
                        }
                      `}

                    >

                      {action}

                    </button>

                  ))
                }


              </div>






              <div className="flex gap-3">


                <button

                  onClick={() => {

                    setShowGroupModal(false);

                    setEditGroupId(null);

                  }}

                  className="
                    flex-1
                    bg-gray-100
                    rounded-xl
                    py-3
                  "

                >

                  Cancel

                </button>





                <button

                  onClick={
                    editGroupId
                    ?
                    updateGroup
                    :
                    createGroup
                  }

                  className="
                    flex-1
                    bg-emerald-600
                    text-white
                    rounded-xl
                    py-3
                  "

                >

                  {
                    editGroupId
                    ?
                    "Update"
                    :
                    "Create"
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