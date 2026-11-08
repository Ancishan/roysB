import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  verifyToken
} from "../utils/jwt";


export interface AuthRequest extends Request {

  admin?: {

    id:string;

    role:string;

  };

}



export function authMiddleware(

req:AuthRequest,

res:Response,

next:NextFunction

){


try{


const token =
req.cookies.admin_token;



if(!token){

return res.status(401).json({

success:false,

message:"Please login first"

});

}



const decoded =
verifyToken(token);



req.admin = decoded;



next();



}
catch(error){


return res.status(401).json({

success:false,

message:"Invalid or expired token"

});


}


}