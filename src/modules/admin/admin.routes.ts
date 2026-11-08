import {
Router
} from "express";


import {
profile
} from "./admin.controller";


import {
authMiddleware
} from "../../middleware/auth.middleware";


const router =
Router();



router.get(

"/profile",

authMiddleware,

profile

);



export default router;