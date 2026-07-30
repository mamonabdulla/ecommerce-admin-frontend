"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";
import { useSession } from "@/context/SessionContext";



interface Media {

  id: string;

  fileName: string;

  publicUrl: string;

  thumbnail: string | null;

  title: string | null;

  altText: string | null;

  mimeType: string;

  size: number;

  createdAt: string;

}





interface PaginationResponse {

  data: Media[];

  total: number;

  page: number;

  limit: number;

}







export default function MediaPage() {


  const session =
    useSession();



  const isCatalogManager =
    session?.role === "Catalog Manager";



  const [media,setMedia] =
    useState<Media[]>([]);



  const [loading,setLoading] =
    useState(false);



  const [error,setError] =
    useState("");





  const [page,setPage] =
    useState(1);



  const [total,setTotal] =
    useState(0);



  const limit = 12;





  const [search,setSearch] =
    useState("");



  const [type,setType] =
    useState("");






  const [files,setFiles] =
    useState<File[]>([]);



  const [previews,setPreviews] =
    useState<string[]>([]);



  const [title,setTitle] =
    useState("");



  const [altText,setAltText] =
    useState("");



  const [uploading,setUploading] =
    useState(false);







  const [selected,setSelected] =
    useState<Media | null>(null);



  const [editTitle,setEditTitle] =
    useState("");



  const [editAlt,setEditAlt] =
    useState("");









  async function fetchMedia(){


    try{


      setLoading(true);


      setError("");



      const response =
        await api.get<PaginationResponse>(
          "/media",
          {

            params:{

              page,

              limit,

              search,

              type,

            },

          }
        );



      setMedia(
        response.data.data
      );



      setTotal(
        response.data.total
      );



    }


    catch(error){


      setError(
        "Failed to load media"
      );


    }


    finally{


      setLoading(false);


    }


  }









  useEffect(()=>{


    fetchMedia();


  },[
    page,
    search,
    type
  ]);









  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ){


    const selectedFiles =
      Array.from(
        e.target.files ?? []
      );



    setFiles(
      selectedFiles
    );



    const urls =
      selectedFiles.map(
        file =>
          URL.createObjectURL(file)
      );



    setPreviews(
      urls
    );


  }


    async function uploadMedia(){


    if(files.length===0){

      alert(
        "Select image first"
      );

      return;

    }



    try{


      setUploading(true);





      const formData =
        new FormData();





      if(files.length === 1){


        formData.append(
          "file",
          files[0],
        );


      }
      else{


        files.forEach(
          file => {

            formData.append(
              "files",
              file,
            );

          }
        );


      }





      formData.append(
        "title",
        title
      );


      formData.append(
        "altText",
        altText
      );






      if(files.length === 1){


        await api.post(
          "/media/upload",
          formData,
        );



      }

      else{


        await api.post(
          "/media/upload-multiple",
          formData,
        );


      }






      setFiles([]);

      setPreviews([]);

      setTitle("");

      setAltText("");



      fetchMedia();



    }


    catch(error){


      console.error(
        error
      );


      alert(
        "Upload failed"
      );


    }


    finally{


      setUploading(false);


    }


  }









  async function updateMedia(){


    if(!selected)
      return;



    try{


      await api.patch(

        `/media/${selected.id}`,

        {

          title:
            editTitle,

          altText:
            editAlt,

        }

      );



      setSelected(null);



      fetchMedia();



    }


    catch(error){


      alert(
        "Update failed"
      );


    }


  }









  async function deleteMedia(
    id:string
  ){


    const confirmDelete =
      confirm(
        "Are you sure you want to delete this image?"
      );



    if(!confirmDelete)
      return;




    try{


      await api.delete(
        `/media/${id}`
      );



      fetchMedia();



    }


    catch(error){


      alert(
        "Delete failed"
      );


    }


  }









  function formatSize(
    size:number
  ){


    if(size < 1024)
      return `${size} B`;



    if(size < 1024*1024)
      return `${(
        size/1024
      ).toFixed(1)} KB`;



    return `${(
      size/(1024*1024)
    ).toFixed(1)} MB`;


  }









  function copyUrl(
    url:string
  ){


    navigator.clipboard.writeText(
      url
    );


    alert(
      "URL copied"
    );


  }









  const totalPages =
    Math.ceil(
      total / limit
    );









  return (

    <div
      className="
        space-y-8
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

          Media Library

        </h1>


        <p
          className="
            text-gray-500
          "
        >

          Upload and manage product images

        </p>


      </div>



      <div
        className="
          bg-white
          border
          rounded-xl
          p-6
          space-y-5
        "
      >


        <h2
          className="
            text-xl
            font-semibold
          "
        >

          Upload Media

        </h2>



        <input

          type="file"

          multiple

          accept="
            image/png,
            image/jpeg,
            image/webp
          "

          onChange={
            handleFileChange
          }

          className="
            border
            p-2
            rounded-lg
            w-full
          "

        />



        {
          previews.length > 0 && (

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-5
                gap-4
              "
            >

              {
                previews.map(
                  preview => (

                    <img

                      key={preview}

                      src={preview}

                      className="
                        h-32
                        w-full
                        object-cover
                        rounded-lg
                        border
                      "

                    />

                  )
                )
              }

            </div>

          )
        }



        <input

          value={title}

          onChange={
            e =>
              setTitle(
                e.target.value
              )
          }

          placeholder="Title"

          className="
            border
            rounded-lg
            p-2
            w-full
          "

        />



        <input

          value={altText}

          onChange={
            e =>
              setAltText(
                e.target.value
              )
          }

          placeholder="Alt text"

          className="
            border
            rounded-lg
            p-2
            w-full
          "

        />



        <button

          onClick={
            uploadMedia
          }

          disabled={
            uploading
          }

          className="
            bg-black
            text-white
            px-5
            py-2
            rounded-lg
            disabled:opacity-50
          "

        >

          {
            uploading
            ?
            "Uploading..."
            :
            "Upload"

          }


        </button>



      </div>

            <div
        className="
          bg-white
          border
          rounded-xl
          p-5
          flex
          flex-col
          md:flex-row
          gap-4
        "
      >

        <input

          value={search}

          onChange={
            e => {

              setPage(1);

              setSearch(
                e.target.value
              );

            }
          }

          placeholder="Search media..."

          className="
            border
            rounded-lg
            p-2
            flex-1
          "

        />



        <select

          value={type}

          onChange={
            e => {

              setPage(1);

              setType(
                e.target.value
              );

            }
          }

          className="
            border
            rounded-lg
            p-2
          "

        >

          <option value="">
            All Types
          </option>


          <option value="image">
            Images
          </option>


        </select>


      </div>





      {
        loading && (

          <div>
            Loading media...
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
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
        "
      >

        {
          media.map(
            item => (

              <div
                key={item.id}

                className="
                  bg-white
                  border
                  rounded-xl
                  overflow-hidden
                  shadow-sm
                "
              >

                <img

                  src={
                    `http://localhost:3000${
                      item.thumbnail ??
                      item.publicUrl
                    }`
                  }

                  alt={
                    item.altText ??
                    item.fileName
                  }

                  className="
                    w-full
                    h-48
                    object-cover
                  "

                />



                <div
                  className="
                    p-4
                    space-y-2
                  "
                >

                  <p
                    className="
                      font-semibold
                      truncate
                    "
                  >

                    {
                      item.title ??
                      item.fileName
                    }

                  </p>



                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >

                    {item.mimeType}

                  </p>



                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >

                    {
                      formatSize(item.size)
                    }

                  </p>




                  <div
                    className="
                      flex
                      gap-2
                      pt-3
                    "
                  >


                    <button

                      onClick={() => {

                        setSelected(item);

                        setEditTitle(
                          item.title ?? ""
                        );

                        setEditAlt(
                          item.altText ?? ""
                        );

                      }}

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





                    <button

                      onClick={() =>
                        copyUrl(
                          item.publicUrl
                        )
                      }

                      className="
                        border
                        px-3
                        py-1
                        rounded-lg
                        text-sm
                      "

                    >

                      Copy URL

                    </button>






                    {
                      !isCatalogManager && (

                        <button

                          onClick={() =>
                            deleteMedia(
                              item.id
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


              </div>

            )

          )
        }


      </div>





      {
        totalPages > 1 && (

          <div
            className="
              flex
              justify-center
              gap-4
              items-center
            "
          >

            <button

              disabled={
                page === 1
              }

              onClick={() =>
                setPage(page - 1)
              }

              className="
                border
                px-4
                py-2
                rounded-lg
              "

            >

              Previous

            </button>



            <span>

              Page {page} / {totalPages}

            </span>



            <button

              disabled={
                page === totalPages
              }

              onClick={() =>
                setPage(page + 1)
              }

              className="
                border
                px-4
                py-2
                rounded-lg
              "

            >

              Next

            </button>


          </div>

        )
      }




      {
        selected && (

          <div

            className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
              z-50
            "

          >

            <div

              className="
                bg-white
                rounded-xl
                p-6
                w-full
                max-w-md
                space-y-5
              "

            >

              <h2
                className="
                  text-xl
                  font-bold
                "
              >

                Edit Media

              </h2>




              <input

                value={editTitle}

                onChange={
                  e =>
                    setEditTitle(
                      e.target.value
                    )
                }

                className="
                  border
                  rounded-lg
                  p-2
                  w-full
                "

              />




              <input

                value={editAlt}

                onChange={
                  e =>
                    setEditAlt(
                      e.target.value
                    )
                }

                className="
                  border
                  rounded-lg
                  p-2
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

                  onClick={() =>
                    setSelected(null)
                  }

                  className="
                    border
                    px-4
                    py-2
                    rounded-lg
                  "

                >

                  Cancel

                </button>



                <button

                  onClick={
                    updateMedia
                  }

                  className="
                    bg-black
                    text-white
                    px-4
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