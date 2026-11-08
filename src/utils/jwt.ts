import jwt from "jsonwebtoken";


const JWT_SECRET =
process.env.JWT_SECRET as string;


if(!JWT_SECRET){

  throw new Error(
    "JWT_SECRET missing"
  );

}



export interface JwtPayload {

  id:string;

  role:string;

}



export function generateToken(
payload:JwtPayload
){

return jwt.sign(
  payload,
  JWT_SECRET,
  {
    expiresIn:"7d"
  }
);

}



export function verifyToken(
token:string
){

return jwt.verify(
  token,
  JWT_SECRET
) as JwtPayload;

}