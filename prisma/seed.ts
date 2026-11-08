import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";


const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({
  adapter,
});


async function main() {


  const existingAdmin =
    await prisma.admin.findUnique({
      where:{
        email:"admin@gmail.com"
      }
    });



  if(existingAdmin){

    console.log(
      "Admin already exists"
    );

    return;

  }



  const hashedPassword =
    await bcrypt.hash(
      "Admin@123",
      10
    );



  const admin =
    await prisma.admin.create({

      data:{
        name:"Super Admin",
        email:"admin@gmail.com",
        password:hashedPassword,
        role:"SUPER_ADMIN",
        isActive:true
      }

    });



  console.log(
    "Admin created:",
    admin.email
  );


}



main()
.then(()=>{

  console.log(
    "Seed completed"
  );

})
.catch((error)=>{

  console.error(error);

})
.finally(async()=>{

  await prisma.$disconnect();

});