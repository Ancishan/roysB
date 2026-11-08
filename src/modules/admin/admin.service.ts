import { prisma } from "../../prisma/prisma";


export async function getDashboardStats(){


const totalProducts =
await prisma.product.count();


const totalOrders =
await prisma.order.count();


const totalAdmins =
await prisma.admin.count();



return {

totalProducts,
totalOrders,
totalAdmins

};


}



export async function getAdminProfile(
id:string
){


const admin =
await prisma.admin.findUnique({

where:{
id
},

select:{
id:true,
name:true,
email:true,
role:true,
createdAt:true
}

});


if(!admin){

throw new Error(
"Admin not found"
);

}


return admin;

}