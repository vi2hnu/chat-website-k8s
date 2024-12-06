import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {getUsers,getallUsers} from "../controller/users.js";

const router = express.Router();

router.get("/",protectRoute,getUsers);
router.get("/all",protectRoute,getallUsers);

export default router;