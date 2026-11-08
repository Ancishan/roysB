import {z} from "zod";


export const loginValidation =
z.object({

email:z
.string()
.email("Invalid email"),


password:z
.string()
.min(
6,
"Password minimum 6 characters"
)

});