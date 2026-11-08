import {z} from "zod";


export const updateAdminValidation =
z.object({

name:z
.string()
.min(2)
.optional()


});