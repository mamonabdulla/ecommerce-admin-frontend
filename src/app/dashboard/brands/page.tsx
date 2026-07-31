"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";
import { useSession } from "@/context/SessionContext";


interface Media {

  id:string;

  fileName:string;

  publicUrl:string;

  thumbnail:string | null;

}



interface Brand {

  id:string;

  name:string;

  slug:string;

  description:string | null;

  status:boolean;

  logo:Media | null;

  createdAt:string;

}



interface BrandForm {

  name:string;

  slug:string;

  description:string;

  logoId:string;

  status:boolean;

}




export default function BrandsPage(){


  const session =
    useSession();



  const permissions =
    session?.permissions ?? [];



  const isCatalogManager =
    session?.role === "Catalog Manager";



  const canCreate =
    permissions.includes(
      "brand:create"
    );



  const canUpdate =
    permissions.includes(
      "brand:update"
    );



  const canDelete =
    permissions.includes(
      "brand:delete"
    )
    &&
    !isCatalogManager;





  const [brands,setBrands] =
    useState<Brand[]>([]);



  const [media,setMedia] =
    useState<Media[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [error,setError] =
    useState("");



  const [search,setSearch] =
    useState("");



  const [status,setStatus] =
    useState("");



  const [page,setPage] =
    useState(1);



  const [totalPages,setTotalPages] =
    useState(1);



  const [showModal,setShowModal] =
    useState(false);



  const [editing,setEditing] =
    useState<Brand | null>(null);



  const [form,setForm] =
    useState<BrandForm>({

      name:"",

      slug:"",

      description:"",

      logoId:"",

      status:true,

    });





  async function fetchBrands(){


    try{


      setLoading(true);

      setError("");



      const response =
        await api.get(
          "/brands",
          {

            params:{

              page,

              limit:10,

              search:
                search || undefined,

              status:
                status || undefined,

            },

          }

        );



      setBrands(
        response.data.data ?? []
      );



      setTotalPages(
        response.data.totalPages ?? 1
      );


    }

    catch(error:any){


      console.error(
        error.response?.data
      );


      setError(
        "Failed to load brands"
      );


    }


    finally{


      setLoading(false);


    }


  }






  async function fetchMedia(){


    try{


      const response =
        await api.get(
          "/media",
          {

            params:{

              page:1,

              limit:100,

            },

          }

        );


      setMedia(
        response.data.data ?? []
      );


    }

    catch(error){


      console.error(error);


    }


  }





  useEffect(()=>{


    fetchBrands();


  },[
    page,
    search,
    status
  ]);




  useEffect(()=>{


    fetchMedia();


  },[]);





  function generateSlug(
    value:string
  ){


    return value

      .toLowerCase()

      .trim()

      .replace(
        /\s+/g,
        "-"
      )

      .replace(
        /[^a-z0-9-]/g,
        ""
      );


  }






  function updateField(
    key:keyof BrandForm,
    value:any
  ){


    setForm(prev=>({

      ...prev,

      [key]:
        value,

    }));


  }






  function resetForm(){


    setForm({

      name:"",

      slug:"",

      description:"",

      logoId:"",

      status:true,

    });


    setEditing(null);


  }



  function openCreate(){


    resetForm();

    setShowModal(true);


  }



  function openEdit(
    brand:Brand
  ){


    setEditing(
      brand
    );


    setForm({

      name:
        brand.name,

      slug:
        brand.slug,

      description:
        brand.description ?? "",

      logoId:
        brand.logo?.id ?? "",

      status:
        brand.status,

    });


    setShowModal(true);


  }

    async function saveBrand(){


    try{


      const payload = {


        name:
          form.name,


        slug:
          form.slug,


        description:
          form.description || undefined,


        logoId:
          form.logoId || undefined,


        status:
          form.status,


      };




      if(editing){


        await api.patch(

          `/brands/${editing.id}`,

          payload

        );


      }

      else{


        await api.post(

          "/brands",

          payload

        );


      }




      setShowModal(false);


      resetForm();


      fetchBrands();


    }


    catch(error:any){


      console.error(
        error.response?.data
      );


      alert(

        error.response?.data?.message ??

        "Failed to save brand"

      );


    }


  }






  async function deleteBrand(
    id:string
  ){


    const confirmed =
      confirm(
        "Are you sure you want to delete this brand?"
      );



    if(!confirmed)
      return;




    try{


      await api.delete(

        `/brands/${id}`

      );



      fetchBrands();


    }


    catch(error:any){


      console.error(
        error.response?.data
      );


      alert(

        error.response?.data?.message ??

        "Delete failed"

      );


    }


  }







  return (

    <div
      className="
        space-y-8
      "
    >



      <div

        className="
          flex
          justify-between
          items-center
        "

      >


        <div>


          <h1

            className="
              text-3xl
              font-bold
            "

          >

            Brands

          </h1>



          <p
            className="
              text-gray-500
            "
          >

            Manage product brands

          </p>


        </div>





        {

          canCreate && (


            <button

              onClick={
                openCreate
              }

              className="
                bg-black
                text-white
                px-5
                py-2
                rounded-lg
              "

            >

              Add Brand

            </button>


          )

        }



      </div>








      <div

        className="
          bg-white
          border
          rounded-xl
          p-5
          space-y-4
        "

      >



        <input

          value={
            search
          }

          onChange={e=>{

            setPage(1);

            setSearch(
              e.target.value
            );

          }}

          placeholder="
            Search brand...
          "

          className="
            border
            rounded-lg
            p-3
            w-full
          "

        />





        <select

          value={
            status
          }

          onChange={e=>{

            setPage(1);

            setStatus(
              e.target.value
            );

          }}

          className="
            border
            rounded-lg
            p-3
          "

        >

          <option value="">

            All Status

          </option>


          <option value="true">

            Active

          </option>


          <option value="false">

            Inactive

          </option>


        </select>



      </div>







      {

        loading && (

          <div>

            Loading brands...

          </div>

        )

      }







      {

        error && (

          <div
            className="
              text-red-600
            "
          >

            {error}

          </div>

        )

      }








      <div

        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-5
        "

      >


        {

          brands.map(brand=>(


            <div

              key={
                brand.id
              }

              className="
                bg-white
                border
                rounded-xl
                p-5
                shadow-sm
              "

            >


              <div

                className="
                  flex
                  items-center
                  gap-4
                "

              >


                {

                  brand.logo && (

                    <img

                      src={

                        `http://localhost:3000${
                          brand.logo.thumbnail ??
                          brand.logo.publicUrl
                        }`

                      }


                      className="
                        w-16
                        h-16
                        rounded-lg
                        object-cover
                        border
                      "

                    />

                  )

                }




                <div>


                  <h2

                    className="
                      font-semibold
                      text-lg
                    "

                  >

                    {brand.name}

                  </h2>



                  <p

                    className="
                      text-sm
                      text-gray-500
                    "

                  >

                    {brand.slug}

                  </p>



                  <p>

                    {
                      brand.status

                      ?

                      "Active"

                      :

                      "Inactive"

                    }

                  </p>


                </div>


              </div>






              <div

                className="
                  flex
                  gap-2
                  mt-5
                "

              >



                {

                  canUpdate && (


                    <button

                      onClick={()=>openEdit(brand)}

                      className="
                        bg-black
                        text-white
                        px-4
                        py-2
                        rounded-lg
                      "

                    >

                      Edit

                    </button>


                  )

                }




                {

                  canDelete && (


                    <button

                      onClick={()=>deleteBrand(brand.id)}

                      className="
                        bg-red-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                      "

                    >

                      Delete

                    </button>


                  )

                }


              </div>



            </div>


          ))

        }


      </div>

            <div
        className="
          flex
          justify-center
          gap-4
        "
      >

        <button

          disabled={
            page === 1
          }

          onClick={()=>setPage(page-1)}

          className="
            border
            px-4
            py-2
            rounded-lg
            disabled:opacity-50
          "

        >

          Previous

        </button>




        <span
          className="
            px-4
            py-2
          "
        >

          {page} / {totalPages}

        </span>




        <button

          disabled={
            page === totalPages
          }

          onClick={()=>setPage(page+1)}

          className="
            border
            px-4
            py-2
            rounded-lg
            disabled:opacity-50
          "

        >

          Next

        </button>


      </div>







      {
        showModal && (

          <div

            className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
              z-50
              p-4
            "

          >


            <div

              className="
                bg-white
                rounded-xl
                p-6
                w-full
                max-w-xl
                space-y-5
              "

            >


              <h2

                className="
                  text-2xl
                  font-bold
                "

              >

                {
                  editing

                  ?

                  "Edit Brand"

                  :

                  "Create Brand"

                }

              </h2>







              <input

                value={
                  form.name
                }

                onChange={e=>{


                  updateField(
                    "name",
                    e.target.value
                  );


                  if(!editing){

                    updateField(

                      "slug",

                      generateSlug(
                        e.target.value
                      )

                    );

                  }


                }}

                placeholder="
                  Brand name
                "

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              />






              <input

                value={
                  form.slug
                }

                onChange={e=>

                  updateField(
                    "slug",
                    e.target.value
                  )

                }

                placeholder="
                  Slug
                "

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              />







              <textarea

                value={
                  form.description
                }

                onChange={e=>

                  updateField(
                    "description",
                    e.target.value
                  )

                }

                placeholder="
                  Description
                "

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                  h-28
                "

              />







              <select

                value={
                  form.logoId
                }

                onChange={e=>

                  updateField(
                    "logoId",
                    e.target.value
                  )

                }

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              >

                <option value="">

                  Select logo

                </option>



                {
                  media.map(item=>(


                    <option

                      key={
                        item.id
                      }

                      value={
                        item.id
                      }

                    >

                      {
                        item.fileName
                      }

                    </option>


                  ))

                }


              </select>







              <label

                className="
                  flex
                  items-center
                  gap-3
                "

              >

                <input

                  type="checkbox"

                  checked={
                    form.status
                  }

                  onChange={e=>

                    updateField(

                      "status",

                      e.target.checked

                    )

                  }

                />

                Active


              </label>








              <div

                className="
                  flex
                  justify-end
                  gap-3
                "

              >



                <button

                  onClick={()=>{

                    setShowModal(false);

                    resetForm();

                  }}

                  className="
                    border
                    px-5
                    py-2
                    rounded-lg
                  "

                >

                  Cancel

                </button>






                {

                  (canCreate || canUpdate) && (

                    <button

                      onClick={
                        saveBrand
                      }

                      className="
                        bg-black
                        text-white
                        px-5
                        py-2
                        rounded-lg
                      "

                    >

                      Save

                    </button>


                  )

                }



              </div>


            </div>


          </div>


        )

      }



    </div>

  );


}