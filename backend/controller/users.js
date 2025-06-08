import User from "../models/user.js";
import Conversation from "../models/conversation.js";

export const getUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        }).select("participants");

        const participantIds = new Set();
        conversations.forEach((conversation) => {
            conversation.participants.forEach((participant) => {
                if (participant.toString() !== userId.toString()) {
                    participantIds.add(participant.toString());
                }
            });
        });

        const filteredUsers = await User.find({ _id: { $in: Array.from(participantIds) } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server error" });
    }
};

export const getallUsers = async (req,res) =>{
    try{
        const user = req.user._id;

        const filtered = await User.find({_id:{$ne:user}}).select("-password");

        res.status(200).json(filtered);
    }
    catch (error){
        console.log(error);
        res.status(500).json({error:"server error"});
    }
}