import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderid:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"User",
        required:true,
    },
    receiverid:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"User",
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
},{timestamps:true});


const Messages = mongoose.model("Messages",messageSchema);

export default Messages;