import {
Response
} from "express";

import {
AuthRequest
} from "../../middleware/auth.middleware";



export async function profile(

req:AuthRequest,

res:Response

){


return res.json({

success:true,

admin:req.admin

});


}