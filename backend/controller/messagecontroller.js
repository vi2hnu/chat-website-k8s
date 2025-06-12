import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { io,getReceiverSocketId } from "../server.js";

export const sendmessage = async (req,res)=>{
    try{
        const {message} = req.body;
        const {id : receiverid} = req.params;
        const senderid = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderid,receiverid]},
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderid,receiverid]
            })
        }

        const newMessage = new Message({
            senderid,
            receiverid,
            message,
        })

        //socket io
        const receiverSocketId = getReceiverSocketId(receiverid);
        if (receiverSocketId) {
        io.to(receiverSocketId).emit("New message", newMessage);
        }

        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(),newMessage.save()]);

        res.status(200).json(newMessage);
    }   
    catch (error){
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }
}

export const getmessage = async (req, res) => {
    try {
        const {id : receiverid} = req.params;
        const { _id: senderid } = req.user;

        let conversation = await Conversation.findOne({
            participants: {$all:[senderid, receiverid]},
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({});
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
};
