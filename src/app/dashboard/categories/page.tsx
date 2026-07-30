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

  title:string | null;

}





interface Category {

  id:string;

  name:string;

  slug:string;

  description:string | null;

  image:Media | null;

  parent:Category | null;

  children:Category[];

  isActive:boolean;

  sortOrder:number;

  createdAt:string;

}







interface CategoryForm {

  name:string;

  slug:string;

  description:string;

  imageId:string;

  parentId:string;

  isActive:boolean;

  sortOrder:number;

}







export default function CategoriesPage(){



  const session =
    useSession();




  const permissions =
    session?.permissions ?? [];




  const isCatalogManager =
    session?.role === "Catalog Manager";




  const canCreate =
    permissions.includes(
      "category:create"
    );




  const canUpdate =
    permissions.includes(
      "category:update"
    );




  const canDelete =
    permissions.includes(
      "category:delete"
    )
    &&
    !isCatalogManager;








  const [categories,setCategories] =
    useState<Category[]>([]);



  const [media,setMedia] =
    useState<Media[]>([]);




  const [loading,setLoading] =
    useState(true);



  const [error,setError] =
    useState("");




  const [search,setSearch] =
    useState("");




  const [showModal,setShowModal] =
    useState(false);



  const [editing,setEditing] =
    useState<Category | null>(null);




  const [form,setForm] =
    useState<CategoryForm>({

      name:"",

      slug:"",

      description:"",

      imageId:"",

      parentId:"",

      isActive:true,

      sortOrder:0,

    });






  async function fetchCategories(){


    try{


      setLoading(true);

      setError("");



      const response =
        await api.get(
          "/categories"
        );



      setCategories(
        response.data
      );



    }


    catch(error:any){


      console.error(
        error
      );


      setError(
        "Failed to load categories"
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


      console.error(
        error
      );


    }


  }








  useEffect(()=>{


    fetchCategories();

    fetchMedia();


  },[]);








  function resetForm(){


    setForm({

      name:"",

      slug:"",

      description:"",

      imageId:"",

      parentId:"",

      isActive:true,

      sortOrder:0,

    });


    setEditing(null);


  }








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
    key:keyof CategoryForm,
    value:any
  ){


    setForm(prev=>({

      ...prev,

      [key]:
        value,

    }));


  }








  function openCreate(){


    resetForm();


    setShowModal(true);


  }








  function openEdit(
    category:Category
  ){


    setEditing(
      category
    );



    setForm({

      name:
        category.name,


      slug:
        category.slug,


      description:
        category.description ?? "",


      imageId:
        category.image?.id ?? "",


      parentId:
        category.parent?.id ?? "",


      isActive:
        category.isActive,


      sortOrder:
        category.sortOrder,


    });



    setShowModal(true);


  }








  async function saveCategory(){


    try{


      const payload = {


        name:
          form.name,


        slug:
          form.slug,


        description:
          form.description || undefined,


        imageId:
          form.imageId || undefined,


        parentId:
          form.parentId || undefined,


        isActive:
          form.isActive,


        sortOrder:
          form.sortOrder,


      };



      if(editing){


        await api.patch(

          `/categories/${editing.id}`,

          payload

        );


      }

      else{


        await api.post(

          "/categories",

          payload

        );


      }



      setShowModal(false);


      resetForm();


      fetchCategories();


    }


    catch(error:any){


      console.error(
        error.response?.data
      );


      alert(

        error.response?.data?.message ??

        "Failed to save category"

      );


    }


  }

    async function deleteCategory(
    id:string
  ){


    const confirmDelete =
      confirm(
        "Are you sure you want to delete this category?"
      );



    if(!confirmDelete)
      return;




    try{


      await api.delete(
        `/categories/${id}`
      );



      fetchCategories();


    }


    catch(error:any){


      console.error(
        error.response?.data
      );


      alert(

        error.response?.data?.message ??

        "Delete failed. Category may contain child categories."

      );


    }


  }








  function getAllCategories(
    items:Category[]
  ):Category[]{


    let result:Category[] = [];



    items.forEach(item=>{


      result.push(item);



      if(
        item.children &&
        item.children.length
      ){


        result.push(
          ...getAllCategories(
            item.children
          )
        );


      }


    });



    return result;


  }








  function filterTree(
    items:Category[]
  ):Category[]{


    if(!search.trim())
      return items;




    return items.filter(item=>{


      const matched =
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );



      const childMatched =
        item.children?.some(child=>

          child.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        );



      return matched || childMatched;


    });


  }








  function renderCategory(

    category:Category,

    level:number = 0

  ){



    return (

      <div

        key={
          category.id
        }

        className="
          space-y-3
        "

        style={{

          marginLeft:
            level * 25,

        }}

      >



        <div

          className="
            bg-white
            border
            rounded-xl
            p-5
            flex
            justify-between
            items-center
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
              category.image && (


                <img

                  src={

                    `http://localhost:3000${
                      category.image.thumbnail ??
                      category.image.publicUrl
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


              <h3

                className="
                  text-lg
                  font-semibold
                "

              >

                {category.name}


              </h3>




              <p

                className="
                  text-sm
                  text-gray-500
                "

              >

                {category.slug}


              </p>




              <p

                className="
                  text-sm
                "

              >

                {
                  category.isActive

                  ?

                  "Active"

                  :

                  "Inactive"

                }


              </p>




              {

                category.children &&
                category.children.length > 0 && (


                  <p

                    className="
                      text-xs
                      text-gray-400
                    "

                  >

                    {

                      category.children.length

                    }

                    {" "}
                    child categories


                  </p>


                )

              }


            </div>



          </div>









          <div

            className="
              flex
              gap-2
            "

          >



            {

              canUpdate && (


                <button

                  onClick={()=>openEdit(category)}

                  className="
                    bg-black
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                  "

                >

                  Edit


                </button>


              )

            }







            {

              canDelete && (


                <button

                  onClick={()=>deleteCategory(category.id)}

                  className="
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                  "

                >

                  Delete


                </button>


              )

            }



          </div>



        </div>







        {

          category.children &&

          category.children.length > 0 && (


            <div

              className="
                space-y-3
              "

            >


              {

                category.children.map(child=>

                  renderCategory(

                    child,

                    level + 1

                  )

                )


              }


            </div>


          )

        }




      </div>


    );


  }








  const allCategories =
    getAllCategories(
      categories
    );







  const availableParents =
    allCategories.filter(category=>

      category.id !== editing?.id

    );

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
              text-gray-900
            "

          >

            Categories


          </h1>



          <p

            className="
              text-gray-500
            "

          >

            Manage product categories


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

              Add Category


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
        "

      >


        <input

          value={
            search
          }


          onChange={e=>

            setSearch(
              e.target.value
            )

          }


          placeholder="
            Search category...
          "


          className="
            border
            rounded-lg
            p-3
            w-full
          "


        />



      </div>








      {

        loading && (


          <div>

            Loading categories...


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
          space-y-4
        "

      >


        {

          filterTree(
            categories
          )
          .map(category=>

            renderCategory(
              category
            )

          )

        }



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
                max-h-[90vh]
                overflow-y-auto
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

                  "Edit Category"

                  :

                  "Create Category"


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
                  Category name
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
                  form.imageId
                }



                onChange={e=>

                  updateField(

                    "imageId",

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


                  Select image


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









              <select


                value={
                  form.parentId
                }



                onChange={e=>

                  updateField(

                    "parentId",

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


                  No Parent Category


                </option>




                {

                  availableParents.map(category=>(


                    <option

                      key={
                        category.id
                      }


                      value={
                        category.id
                      }


                    >


                      {

                        category.name

                      }


                    </option>


                  ))


                }


              </select>

                            <input

                type="number"


                value={
                  form.sortOrder
                }


                onChange={e=>

                  updateField(

                    "sortOrder",

                    Number(
                      e.target.value
                    )

                  )

                }


                placeholder="
                  Sort Order
                "


                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "


              />









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
                    form.isActive
                  }


                  onChange={e=>

                    updateField(

                      "isActive",

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

                  canCreate || canUpdate ? (



                    <button


                      onClick={
                        saveCategory
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



                  ) : null


                }



              </div>







            </div>




          </div>



        )

      }





    </div>

  );

}