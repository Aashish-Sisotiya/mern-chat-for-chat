// chatName
//isGroupChat
//users
//latesMessage
//groupAdmin

//npm install express dotenv mongoose 

//mongoose is used to connect to our database and make query to tht databse


const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;