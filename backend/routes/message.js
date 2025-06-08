import express from "express";
import {sendmessage , getmessage } from "../controller/messagecontroller.js"
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();


router.get("/",protectRoute,getmessage);
router.post("/send",protectRoute,sendmessage);


export default router;