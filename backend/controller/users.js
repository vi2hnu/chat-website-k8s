import User from "../models/user.js";
import Conversation from "../models/conversation.js";

//get connected users 
export const getallUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        })
        .select("participants updatedAt");

        const participantsMap = new Map();

        conversations.forEach((conversation) => {
            conversation.participants.forEach((participant) => {
                const participantId = participant.toString();
                if (participantId !== userId.toString() && !participantsMap.has(participantId)) {
                    participantsMap.set(participantId, conversation.updatedAt);
                }
            });
        });

        const participantIds = Array.from(participantsMap.keys());

        const users = await User.find({ _id: { $in: participantIds } }).select("-password");

        const usersWithTimestamps = users.map((user) => ({
            ...user.toObject(),
            lastInteraction: participantsMap.get(user._id.toString()),
        }));

        usersWithTimestamps.sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction));

        res.status(200).json(usersWithTimestamps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server error" });
    }
};

//find single user
export const getUser = async (req,res) =>{
    try{
        const {username} = req.body;

        const exists = await User.findOne({username}).select("-password");
        if(!exists){
            return res.status(404).json({error:"user not found"});
        }
        res.status(200).json(exists);
    }
    catch (error){
        console.log(error);
        res.status(500).json({error:"server error"});
    }
}