import { prisma } from "../../prisma/prisma";

import {
comparePassword
} from "../../utils/bcrypt";


import {
generateToken
} from "../../utils/jwt";


import {
LoginInput
} from "./auth.types";



export async function loginAdmin(
data:LoginInput
){


const admin =
await prisma.admin.findUnique({

where:{
email:data.email
}

});



if(!admin){

throw new Error(
"Invalid email or password"
);

}



if(!admin.isActive){

throw new Error(
"Admin account inactive"
);

}



const passwordMatch =
await comparePassword(
data.password,
admin.password
);



if(!passwordMatch){

throw new Error(
"Invalid email or password"
);

}



const token =
generateToken({

id:admin.id,

role:admin.role

});



return {

token,

admin:{

id:admin.id,

name:admin.name,

email:admin.email,

role:admin.role

}

};


}