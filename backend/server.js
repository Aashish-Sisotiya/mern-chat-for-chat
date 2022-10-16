const express = require("express");
const dotenv = require("dotenv");
// const createProxyMiddleware = require("../frontend/src/setupProxy");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
const { create } = require("./Models/userModel");
var cors = require('cors')


const path = require("path");



dotenv.config();   // loads .env file content into process.env 

connectDB();

const app = express();

app.use(express.json());  // to accept json data
app.use(cors({
    origin: "*"
}))

// app.use(createProxyMiddleware);


// app.get("/", (req, res) => {    //take a callback as a parameter
//     res.send("Api  is running succesfully");
// });




app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------------------->> Deployment <<-------------------


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.get("/", (req, res) => {    //take a callback as a parameter
        res.send("Api  is running succesfully");
    });
}




// ------------------------------->> Deployment <<-------------------

app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}...`.yellow.bold));


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

//whenever a browser make a request to the server 
//creates a connection
io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);  // created room forr that particular user
        // console.log(userData._id);
        socket.emit("connected");
    })
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined Room " + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));


    socket.on('newMessage', (newMessageReceived) => {
        var chat = newMessageReceived.chat;


        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageReceived);

        });

    });


    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    })
})



















// xdj@hacksnation.com
