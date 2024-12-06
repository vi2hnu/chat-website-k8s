import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.send(401).json({error:"not logged in"});
        }

        const decode = jwt.verify(token,process.env.JWT_SECRECT);

        if(!decode){
            return res.send(401).json({error:"not logged in"});
        }

        const user = await User.findOne({ _id: decode.userId}).select("-password");

        req.user = user;

        next();
        
    }
    catch (error){
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }
}


export default protectRoute;