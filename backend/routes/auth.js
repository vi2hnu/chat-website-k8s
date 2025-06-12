import express from "express";
import { login , signup , logout } from "../controller/authcontroller.js";
import protectRoute from "../middleware/protectRoute.js";
const router  = express.Router();


router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout)
router.get('/check',protectRoute,(req,res)=>{
    res.status(200).json({
        user: req.user._id
    })
})

export default router;