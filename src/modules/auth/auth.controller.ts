import {
Request,
Response
} from "express";


import {
loginValidation
} from "./auth.validation";


import {
loginAdmin
} from "./auth.service";



export async function login(
req:Request,
res:Response
){


try{


const data =
loginValidation.parse(
req.body
);



const result =
await loginAdmin(data);



res.cookie(
"admin_token",
result.token,
{

httpOnly:true,

sameSite:"lax",

}

);



return res.json({

success:true,

admin:result.admin

});


}
catch(error:any){


return res.status(400).json({

success:false,

message:
error.message

});


}


}