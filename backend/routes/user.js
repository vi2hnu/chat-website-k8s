import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {getUser,getallUsers} from "../controller/users.js";

const router = express.Router();

router.get("/",protectRoute,getallUsers);
router.get("/search",protectRoute,getUser);

export default router;