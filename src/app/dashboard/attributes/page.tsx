"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import {
  useSession,
} from "@/context/SessionContext";



interface AttributeValue {

  id:string;

  value:string;

  slug:string;

  referenceValue:string | null;

  createdAt:string;

}



interface Attribute {

  id:string;

  name:string;

  slug:string;

  type:string;

  values:AttributeValue[];

  createdAt:string;

}





interface AttributeForm {

  name:string;

  slug:string;

  type:string;

}



interface ValueForm {

  value:string;

  slug:string;

  referenceValue:string;

}








const attributeTypes = [

  {
    label:"Dropdown",
    value:"dropdown",
  },

  {
    label:"Radio",
    value:"radio",
  },

  {
    label:"Checkbox",
    value:"checkbox",
  },

  {
    label:"Colour Swatch",
    value:"colour_swatch",
  },

  {
    label:"Image Swatch",
    value:"image_swatch",
  },

];







export default function AttributesPage(){



  const session =
    useSession();



  const permissions =
    session?.permissions ?? [];




  const canCreate =
    permissions.includes(
      "attribute:create"
    );



  const canUpdate =
    permissions.includes(
      "attribute:update"
    );



  const canDelete =
    permissions.includes(
      "attribute:delete"
    );







  const [attributes,setAttributes] =
    useState<Attribute[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [error,setError] =
    useState("");



  const [search,setSearch] =
    useState("");




  const [showModal,setShowModal] =
    useState(false);



  const [editing,setEditing] =
    useState<Attribute | null>(null);




  const [expanded,setExpanded] =
    useState<string[]>([]);







  const [form,setForm] =
    useState<AttributeForm>({

      name:"",

      slug:"",

      type:"dropdown",

    });








  const [valueModal,setValueModal] =
    useState(false);



  const [selectedAttribute,setSelectedAttribute] =
    useState<Attribute | null>(null);




  const [editingValue,setEditingValue] =
    useState<AttributeValue | null>(null);




  const [valueForm,setValueForm] =
    useState<ValueForm>({

      value:"",

      slug:"",

      referenceValue:"",

    });









  async function fetchAttributes(){


    try{


      setLoading(true);

      setError("");



      const response =
        await api.get(
          "/attributes"
        );



      setAttributes(
        response.data
      );


    }


    catch(error:any){


      console.error(
        error
      );


      setError(
        "Failed to load attributes"
      );


    }


    finally{


      setLoading(false);


    }


  }









  useEffect(()=>{


    fetchAttributes();


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

    key:keyof AttributeForm,

    value:string,

  ){


    setForm(prev=>({

      ...prev,

      [key]:
        value,

    }));


  }









  function updateValueField(

    key:keyof ValueForm,

    value:string,

  ){


    setValueForm(prev=>({

      ...prev,

      [key]:
        value,

    }));


  }








  function resetAttributeForm(){


    setForm({

      name:"",

      slug:"",

      type:"dropdown",

    });


    setEditing(null);


  }









  function resetValueForm(){


    setValueForm({

      value:"",

      slug:"",

      referenceValue:"",

    });


    setEditingValue(null);


  }









  function openCreate(){


    resetAttributeForm();


    setShowModal(true);


  }









  function openEdit(
    attribute:Attribute
  ){


    setEditing(
      attribute
    );


    setForm({

      name:
        attribute.name,


      slug:
        attribute.slug,


      type:
        attribute.type,


    });



    setShowModal(true);


  }








  function toggleExpand(
    id:string
  ){


    setExpanded(prev=>

      prev.includes(id)

      ?

      prev.filter(
        item=>item!==id
      )

      :

      [
        ...prev,
        id
      ]

    );


  }

    async function saveAttribute(){


    try{


      const payload = {


        name:
          form.name,


        slug:
          form.slug,


        type:
          form.type,


      };





      if(editing){


        await api.patch(

          `/attributes/${editing.id}`,

          payload

        );


      }

      else{


        await api.post(

          "/attributes",

          payload

        );


      }






      setShowModal(false);


      resetAttributeForm();


      fetchAttributes();


    }


    catch(error:any){


      console.error(
        error.response?.data
      );


      alert(

        error.response?.data?.message ??

        "Failed to save attribute"

      );


    }


  }









  async function deleteAttribute(
    id:string
  ){


    const confirmDelete =
      confirm(
        "Are you sure you want to delete this attribute?"
      );



    if(!confirmDelete)
      return;





    try{


      await api.delete(

        `/attributes/${id}`

      );



      fetchAttributes();


    }


    catch(error:any){


      alert(

        error.response?.data?.message ??

        "Delete failed"

      );


    }


  }









  function openAddValue(
    attribute:Attribute
  ){


    setSelectedAttribute(
      attribute
    );


    resetValueForm();


    setValueModal(true);


  }









  function openEditValue(

    attribute:Attribute,

    value:AttributeValue,

  ){


    setSelectedAttribute(
      attribute
    );



    setEditingValue(
      value
    );



    setValueForm({

      value:
        value.value,


      slug:
        value.slug,


      referenceValue:
        value.referenceValue ?? "",


    });



    setValueModal(true);


  }









  async function saveValue(){


    if(!selectedAttribute)
      return;





    try{


      const payload = {


        value:
          valueForm.value,


        slug:
          valueForm.slug,


        referenceValue:

          valueForm.referenceValue ||

          undefined,


      };





      if(editingValue){


        await api.patch(

          `/attributes/values/${editingValue.id}`,

          payload

        );


      }

      else{


        await api.post(

          `/attributes/${selectedAttribute.id}/values`,

          payload

        );


      }







      setValueModal(false);


      resetValueForm();


      fetchAttributes();


    }


    catch(error:any){


      console.error(
        error.response?.data
      );


      alert(

        error.response?.data?.message ??

        "Failed to save value"

      );


    }


  }









  async function deleteValue(
    id:string
  ){


    const confirmDelete =
      confirm(
        "Delete this attribute value?"
      );



    if(!confirmDelete)
      return;





    try{


      await api.delete(

        `/attributes/values/${id}`

      );



      fetchAttributes();


    }


    catch(error:any){


      alert(

        error.response?.data?.message ??

        "Failed to delete value"

      );


    }


  }









  const filteredAttributes =
    attributes.filter(attribute=>{


      if(!search.trim())
        return true;




      return (

        attribute.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        attribute.slug
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );


    });









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

            Attributes


          </h1>



          <p

            className="
              text-gray-500
            "

          >

            Manage product attributes and values


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

              Add Attribute


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
            Search attribute...
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

          <p>
            Loading attributes...
          </p>

        )

      }







      {

        error && (

          <p
            className="
              text-red-600
            "
          >

            {error}

          </p>

        )

      }









      <div
        className="
          space-y-4
        "
      >



        {

          filteredAttributes.map(attribute=>(


            <div

              key={
                attribute.id
              }

              className="
                bg-white
                border
                rounded-xl
                p-5
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


                  <h2

                    className="
                      text-xl
                      font-semibold
                    "

                  >

                    {attribute.name}


                  </h2>



                  <p

                    className="
                      text-sm
                      text-gray-500
                    "

                  >

                    {attribute.slug}

                  </p>



                  <p

                    className="
                      text-sm
                    "

                  >

                    Type: {attribute.type}

                  </p>



                </div>






                <div

                  className="
                    flex
                    gap-2
                  "

                >


                  <button

                    onClick={()=>

                      toggleExpand(
                        attribute.id
                      )

                    }


                    className="
                      border
                      px-4
                      py-2
                      rounded-lg
                    "

                  >

                    Values

                  </button>





                  {

                    canUpdate && (


                      <button

                        onClick={()=>

                          openEdit(
                            attribute
                          )

                        }


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

                        onClick={()=>

                          deleteAttribute(
                            attribute.id
                          )

                        }


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

                            {


                expanded.includes(attribute.id) && (


                  <div

                    className="
                      mt-5
                      border-t
                      pt-5
                      space-y-3
                    "

                  >



                    <div

                      className="
                        flex
                        justify-between
                        items-center
                      "

                    >


                      <h3

                        className="
                          font-semibold
                        "

                      >

                        Attribute Values


                      </h3>





                      <button

                        onClick={()=>openAddValue(attribute)}

                        className="
                          bg-emerald-600
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                        "

                      >

                        Add Value


                      </button>


                    </div>








                    {

                      attribute.values.length === 0 && (

                        <p

                          className="
                            text-gray-500
                          "

                        >

                          No values added

                        </p>

                      )

                    }








                    {

                      attribute.values.map(value=>(


                        <div

                          key={
                            value.id
                          }

                          className="
                            flex
                            justify-between
                            items-center
                            bg-gray-50
                            rounded-lg
                            p-4
                          "

                        >



                          <div>


                            <p

                              className="
                                font-medium
                              "

                            >

                              {value.value}


                            </p>



                            <p

                              className="
                                text-sm
                                text-gray-500
                              "

                            >

                              {value.slug}

                            </p>



                            {

                              value.referenceValue && (

                                <p

                                  className="
                                    text-xs
                                    text-gray-400
                                  "

                                >

                                  Ref:
                                  {" "}
                                  {value.referenceValue}

                                </p>

                              )

                            }


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

                                  onClick={()=>


                                    openEditValue(

                                      attribute,

                                      value

                                    )


                                  }


                                  className="
                                    bg-black
                                    text-white
                                    px-3
                                    py-1
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

                                  onClick={()=>


                                    deleteValue(
                                      value.id
                                    )


                                  }


                                  className="
                                    bg-red-600
                                    text-white
                                    px-3
                                    py-1
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


                      ))

                    }



                  </div>


                )


              }



            </div>


          ))

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
                max-w-lg
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
                  "Edit Attribute"
                  :
                  "Create Attribute"
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

                placeholder="Attribute name"

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

                placeholder="Slug"

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              />






              <select

                value={
                  form.type
                }

                onChange={e=>

                  updateField(
                    "type",
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


                {
                  attributeTypes.map(type=>(

                    <option

                      key={
                        type.value
                      }

                      value={
                        type.value
                      }

                    >

                      {type.label}

                    </option>


                  ))

                }


              </select>







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

                    resetAttributeForm();

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






                <button

                  onClick={
                    saveAttribute
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


              </div>



            </div>


          </div>

        )
      }









      {
        valueModal && (

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
                max-w-lg
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
                  editingValue
                  ?
                  "Edit Value"
                  :
                  "Add Value"
                }


              </h2>





              <input

                value={
                  valueForm.value
                }

                onChange={e=>{

                  updateValueField(
                    "value",
                    e.target.value
                  );


                  if(!editingValue){

                    updateValueField(
                      "slug",
                      generateSlug(
                        e.target.value
                      )
                    );

                  }


                }}

                placeholder="Value"

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              />






              <input

                value={
                  valueForm.slug
                }

                onChange={e=>

                  updateValueField(
                    "slug",
                    e.target.value
                  )

                }

                placeholder="Slug"

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              />







              <input

                value={
                  valueForm.referenceValue
                }

                onChange={e=>

                  updateValueField(
                    "referenceValue",
                    e.target.value
                  )

                }

                placeholder="Reference value (optional)"

                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "

              />








              <div

                className="
                  flex
                  justify-end
                  gap-3
                "

              >


                <button

                  onClick={()=>{

                    setValueModal(false);

                    resetValueForm();

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






                <button

                  onClick={
                    saveValue
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


              </div>



            </div>


          </div>


        )
      }





    </div>


  );


}