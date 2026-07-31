"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";



interface Media {
  id: string;
  fileName: string;
  publicUrl: string;
}



interface Brand {
  id: string;
  name: string;
}



interface Category {
  id: string;
  name: string;
}



interface AttributeValue {
  id: string;
  value: string;
  attribute: {
    id: string;
    name: string;
  };
}



interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}



interface ProductMedia {
  id: string;
  media: Media;
  isThumbnail: boolean;
  isGallery: boolean;
}



interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  stockStatus: string;
  weight: number | null;
  isActive: boolean;

  media: Media[];

  attributeValues: {
    id: string;
    attributeValue: AttributeValue;
  }[];
}



interface Product {

  id: string;

  name: string;

  slug: string;

  sku: string;


  shortDescription: string | null;

  longDescription: string | null;


  hasVariants: boolean;


  price: number | null;

  salePrice: number | null;

  stock: number | null;


  stockStatus: string | null;


  weight: number | null;


  isActive: boolean;

  isFeatured: boolean;

  sortOrder: number;


  brand: Brand | null;


  categories: Category[];


  productMedia: ProductMedia[];


  variants: ProductVariant[];

}



interface ProductForm {

  name:string;

  slug:string;

  sku:string;

  shortDescription:string;

  longDescription:string;

  hasVariants:boolean;

  price:number | "";

  salePrice:number | "";

  stock:number | "";

  stockStatus:string;

  weight:number | "";

  isActive:boolean;

  isFeatured:boolean;

  sortOrder:number;

  brandId:string;

  categoryIds:string[];

  mediaIds:string[];

}



interface VariantForm {

  sku:string;

  price:number | "";

  salePrice:number | "";

  stock:number | "";

  stockStatus:string;

  weight:number | "";

  isActive:boolean;

  mediaIds:string[];

  attributeValueIds:string[];

}





export default function ProductsPage(){






const [products,setProducts]
=
useState<Product[]>([]);



const [brands,setBrands]
=
useState<Brand[]>([]);



const [categories,setCategories]
=
useState<Category[]>([]);



const [media,setMedia]
=
useState<Media[]>([]);



const [attributes,setAttributes]
=
useState<Attribute[]>([]);



const [loading,setLoading]
=
useState(false);



const [error,setError]
=
useState("");



const [search,setSearch]
=
useState("");



const [showProductModal,setShowProductModal]
=
useState(false);



const [showVariantModal,setShowVariantModal]
=
useState(false);



const [editing,setEditing]
=
useState<Product | null>(null);



const [editingVariant,setEditingVariant]
=
useState<ProductVariant | null>(null);



const [selectedProduct,setSelectedProduct]
=
useState<Product | null>(null);





const emptyProduct:ProductForm={

name:"",

slug:"",

sku:"",

shortDescription:"",

longDescription:"",

hasVariants:false,

price:"",

salePrice:"",

stock:"",

stockStatus:"in_stock",

weight:"",

isActive:true,

isFeatured:false,

sortOrder:0,

brandId:"",

categoryIds:[],

mediaIds:[],

};





const emptyVariant:VariantForm={

sku:"",

price:"",

salePrice:"",

stock:"",

stockStatus:"in_stock",

weight:"",

isActive:true,

mediaIds:[],

attributeValueIds:[],

};





const [form,setForm]
=
useState<ProductForm>(
emptyProduct
);



const [variantForm,setVariantForm]
=
useState<VariantForm>(
emptyVariant
);





async function apiRequest(
  url:string,
  options:RequestInit={}
){

  const response =
    await api.request({
      url,
      ...options,
    });


  return response.data;

}





useEffect(()=>{

loadData();

},[]);





async function loadData(){


try{


setLoading(true);

setError("");



const [
productsData,
brandsData,
categoriesData,
mediaData,
attributesData

]
=
await Promise.all([


apiRequest(
  "/products"),


apiRequest(
  "/brands"),


apiRequest(
  "/categories"),


apiRequest(
  "/media"),


apiRequest(
  "/attributes")


]);



setProducts(
Array.isArray(productsData)
?
productsData
:
productsData?.data || []
);



setBrands(
Array.isArray(brandsData)
?
brandsData
:
brandsData?.data || []
);



setCategories(
Array.isArray(categoriesData)
?
categoriesData
:
categoriesData?.data || []
);



setMedia(
Array.isArray(mediaData)
?
mediaData
:
mediaData?.data || []
);



setAttributes(
Array.isArray(attributesData)
?
attributesData
:
attributesData?.data || []
);



}

catch(error:any){

console.log(error);

setError(
error.message ||
"Failed loading data"
);


}

finally{

setLoading(false);

}


}


function updateProduct(
key:keyof ProductForm,
value:any
){

setForm(prev=>({

...prev,

[key]:value

}));

}



function updateVariant(
key:keyof VariantForm,
value:any
){

setVariantForm(prev=>({

...prev,

[key]:value

}));

}





function toggleProductArray(
key:"categoryIds"|"mediaIds",
id:string
){

setForm(prev=>({

...prev,

[key]:

prev[key].includes(id)

?

prev[key].filter(
item=>item!==id
)

:

[
...prev[key],
id
]

}));

}




function toggleVariantArray(
key:"mediaIds"|"attributeValueIds",
id:string
){

setVariantForm(prev=>({

...prev,

[key]:

prev[key].includes(id)

?

prev[key].filter(
item=>item!==id
)

:

[
...prev[key],
id
]

}));

}






function openCreateProduct(){


setEditing(null);


setForm({
...emptyProduct
});


setShowProductModal(true);


}






function openEditProduct(
product:Product
){


setEditing(product);



setForm({

name:product.name,

slug:product.slug,

sku:product.sku,

shortDescription:
product.shortDescription || "",

longDescription:
product.longDescription || "",

hasVariants:
product.hasVariants,

price:
product.price ?? "",

salePrice:
product.salePrice ?? "",

stock:
product.stock ?? "",

stockStatus:
product.stockStatus || "in_stock",

weight:
product.weight ?? "",

isActive:
product.isActive,

isFeatured:
product.isFeatured,

sortOrder:
product.sortOrder,

brandId:
product.brand?.id || "",

categoryIds:
product.categories?.map(
item=>item.id
) || [],

mediaIds:
product.productMedia?.map(
item=>item.media.id
) || [],

});


setShowProductModal(true);


}








async function saveProduct(){


try{


const payload={


...form,


brandId:
form.brandId === ""
?
null
:
form.brandId,


price:
form.price===""
?
null
:
Number(form.price),



salePrice:
form.salePrice===""
?
null
:
Number(form.salePrice),



stock:
form.stock===""
?
null
:
Number(form.stock),



weight:
form.weight===""
?
null
:
Number(form.weight),


};




if(editing){


await apiRequest(

`/products/${editing.id}`,
{

method:"PATCH",

data: payload

}

);


}

else{


await apiRequest(

`/products`,
{

method:"POST",

data: payload

}

);


}





await loadData();



setShowProductModal(false);


setEditing(null);


}

catch(error:any){


alert(
error.message ||
"Product save failed"
);


}


}







async function deleteProduct(
id:string
){


if(
!confirm("Delete product?")
)
return;



try{


await apiRequest(

`/products/${id}`,
{

method:"DELETE"

}

);



await loadData();


}

catch(error:any){


alert(error.message);


}


}







function openCreateVariant(
product:Product
){


setSelectedProduct(product);


setEditingVariant(null);


setVariantForm({
...emptyVariant
});


setShowVariantModal(true);


}







function openEditVariant(
product:Product,
variant:ProductVariant
){


setSelectedProduct(product);


setEditingVariant(variant);



setVariantForm({

sku:variant.sku,

price:variant.price,

salePrice:
variant.salePrice ?? "",

stock:variant.stock,

stockStatus:
variant.stockStatus,

weight:
variant.weight ?? "",

isActive:
variant.isActive,


mediaIds:
variant.media.map(
item=>item.id
),


attributeValueIds:
variant.attributeValues.map(
item=>item.attributeValue.id
),


});



setShowVariantModal(true);


}







async function saveVariant(){


if(!selectedProduct)
return;



try{


const payload={


productId:
selectedProduct.id,


...variantForm,


price:Number(
variantForm.price
),


salePrice:
variantForm.salePrice===""
?
null
:
Number(
variantForm.salePrice
),


stock:Number(
variantForm.stock
),


weight:
variantForm.weight===""
?
null
:
Number(
variantForm.weight
),


};





if(editingVariant){


await apiRequest(

`/product-variants/${editingVariant.id}`,
{

method:"PATCH",

data: payload

}

);



}
else{


await apiRequest(

`/product-variants`,
{

method:"POST",

data: payload

}

);



}



await loadData();



setShowVariantModal(false);


setSelectedProduct(null);


setEditingVariant(null);


}

catch(error:any){


alert(
error.message ||
"Variant save failed"
);


}


}






async function deleteVariant(
id:string
){


if(
!confirm("Delete variant?")
)
return;



try{


await apiRequest(

`/product-variants/${id}`,
{

method:"DELETE"

}

);



await loadData();


}

catch(error:any){

alert(error.message);

}


}



const filteredProducts =
products.filter(
product=>

product.name
.toLowerCase()
.includes(
search.toLowerCase()
)

);


return (

<div className="space-y-6 p-6">


<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold">
Products
</h1>


<p className="text-gray-500">
Manage your products
</p>


</div>



<button

onClick={openCreateProduct}

className="bg-black text-white px-5 py-2 rounded-lg"

>

Add Product

</button>


</div>





<input

className="border rounded-lg p-3 w-full"

placeholder="Search products"

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>






{
loading &&

<p>
Loading products...
</p>

}





{
error &&

<p className="text-red-600">

{error}

</p>

}








<div className="space-y-5">


{

filteredProducts.map(product=>(


<div

key={product.id}

className="border rounded-xl p-5 space-y-4"

>


<div className="flex justify-between">


<div>


<h2 className="text-xl font-bold">

{product.name}

</h2>



<p>

SKU: {product.sku}

</p>



<p>

{
product.hasVariants
?
"Variable Product"
:
"Simple Product"
}

</p>




{
product.brand &&

<p>

Brand:
{product.brand.name}

</p>

}



{

product.price !== null &&

<p>

Price:
{product.price}

</p>

}


</div>







<div className="flex gap-2">


<button

onClick={()=>
openEditProduct(product)
}

className="border px-3 py-2 rounded"

>

Edit

</button>




<button

onClick={()=>
deleteProduct(product.id)
}

className="bg-red-600 text-white px-3 py-2 rounded"

>

Delete

</button>


</div>



</div>









{
product.productMedia?.length > 0 &&


<div className="flex gap-3 flex-wrap">


{

product.productMedia.map(item=>(


<img

key={item.id}

src={item.media.publicUrl}

className="w-20 h-20 rounded object-cover"

/>


))


}



</div>


}









{
product.hasVariants &&


<div className="border-t pt-4">


<div className="flex justify-between items-center">


<h3 className="font-bold">

Variants

</h3>




<button

onClick={()=>
openCreateVariant(product)
}

className="bg-black text-white px-3 py-2 rounded"

>

Add Variant

</button>



</div>







{

product.variants?.map(variant=>(


<div

key={variant.id}

className="bg-gray-100 rounded p-3 mt-3 flex justify-between"

>



<div>


<p>
SKU:
{variant.sku}
</p>


<p>
Price:
{variant.price}
</p>


<p>
Stock:
{variant.stock}
</p>


<p>
Status:
{variant.stockStatus}
</p>


</div>







<div className="flex gap-2">


<button

onClick={()=>
openEditVariant(
product,
variant
)
}

className="border px-3 py-1 rounded"

>

Edit

</button>






<button

onClick={()=>
deleteVariant(
variant.id
)
}

className="bg-red-600 text-white px-3 py-1 rounded"

>

Delete

</button>



</div>



</div>


))


}



</div>


}




</div>


))


}


</div>





{
showProductModal &&


<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">


<div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-5">


<h2 className="text-2xl font-bold">

{
editing
?
"Edit Product"
:
"Create Product"
}

</h2>





{
[
["name","Name"],
["slug","Slug"],
["sku","SKU"],
["shortDescription","Short Description"],
["longDescription","Long Description"]

].map(([key,label])=>(


<input

key={key}

className="border p-3 rounded w-full"

placeholder={label}

value={(form as any)[key]}

onChange={
e=>
updateProduct(
key as keyof ProductForm,
e.target.value
)
}

/>


))


}







<label className="flex gap-2 items-center">


<input

type="checkbox"

checked={form.hasVariants}

onChange={
e=>
updateProduct(
"hasVariants",
e.target.checked
)
}

/>


Has Variants


</label>






<select

className="border p-3 rounded w-full"

value={form.brandId}

onChange={
e=>
updateProduct(
"brandId",
e.target.value
)
}

>


<option value="">

Select Brand

</option>



{

brands.map(brand=>(


<option

key={brand.id}

value={brand.id}

>

{brand.name}

</option>


))


}


</select>







<div>


<p className="font-bold">
Categories
</p>



{

categories.map(category=>(


<label

key={category.id}

className="flex gap-2"

>


<input

type="checkbox"

checked={
form.categoryIds.includes(
category.id
)
}

onChange={()=>
toggleProductArray(
"categoryIds",
category.id
)
}

/>


{category.name}


</label>


))


}


</div>







<div>


<p className="font-bold">
Images
</p>


{

media.map(item=>(


<label

key={item.id}

className="flex gap-2"

>


<input

type="checkbox"

checked={
form.mediaIds.includes(
item.id
)
}

onChange={()=>
toggleProductArray(
"mediaIds",
item.id
)
}

/>


{item.fileName}


</label>


))


}


</div>








<div className="flex gap-3">


<button

onClick={saveProduct}

className="bg-black text-white px-5 py-2 rounded"

>

Save

</button>



<button

onClick={()=>
setShowProductModal(false)
}

className="border px-5 py-2 rounded"

>

Cancel

</button>


</div>





</div>


</div>


}








{
showVariantModal &&


<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">


<div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-5">


<h2 className="text-2xl font-bold">

{
editingVariant
?
"Edit Variant"
:
"Create Variant"
}

</h2>






{

[
["sku","SKU"],
["price","Price"],
["salePrice","Sale Price"],
["stock","Stock"],
["weight","Weight"]

].map(([key,label])=>(


<input

key={key}

className="border p-3 rounded w-full"

placeholder={label}

value={(variantForm as any)[key]}

onChange={
e=>
updateVariant(
key as keyof VariantForm,
e.target.value
)
}

/>


))


}








<div>


<p className="font-bold">

Media

</p>


{

media.map(item=>(


<label

key={item.id}

className="flex gap-2"

>


<input

type="checkbox"

checked={
variantForm.mediaIds.includes(
item.id
)
}

onChange={()=>
toggleVariantArray(
"mediaIds",
item.id
)
}

/>


{item.fileName}


</label>


))


}


</div>








<div>


<p className="font-bold">

Attributes

</p>



{

attributes.map(attribute=>(


<div key={attribute.id}>


<p>
{attribute.name}
</p>



{

attribute.values.map(value=>(


<label

key={value.id}

className="flex gap-2"

>


<input

type="checkbox"

checked={
variantForm.attributeValueIds.includes(
value.id
)
}

onChange={()=>
toggleVariantArray(
"attributeValueIds",
value.id
)
}

/>


{value.value}


</label>


))


}


</div>


))


}


</div>








<div className="flex gap-3">


<button

onClick={saveVariant}

className="bg-black text-white px-5 py-2 rounded"

>

Save

</button>




<button

onClick={()=>
setShowVariantModal(false)
}

className="border px-5 py-2 rounded"

>

Cancel

</button>



</div>





</div>


</div>


}





</div>


);


}