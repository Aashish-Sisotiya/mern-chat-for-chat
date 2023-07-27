import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { getSender, getSenderFull } from "../config/ChatLogics"
import ProfileModel from "./miscellaneous/ProfileModel"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from 'axios';
import "./style.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
// import Lottie from "react-lottie";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json"
import { API_URL } from '../constants';






const ENDPOINT = "https://chat-app-backend-3zp4.onrender.com/";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const fetchMessages = async (event) => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`${API_URL}api/message/${selectedChat._id}`, config);
            // console.log(data);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"

            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);  //initialise te socket
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));

    }, []);


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);



    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notiication
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([...notification, newMessageRecieved]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    })


    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${API_URL}api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                console.log("data is ", data);

                socket.emit("newMessage", data);


                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        }

    }



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // typing indicator logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        // rendererSettings: {
        //     preserveAspectRatio: "xMidYMid slice"
        // }
    };


    return (
        <>
            {selectedChat ? (
                <>

                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {
                            (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModel
                                        user={getSenderFull(user, selectedChat.users)}
                                    />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            ))}
                    </Text>

                    <Box
                        display={"flex"}
                        p={3}
                        flexDir="column"
                        justifyContent={"flex-end"}
                        bg="#ffffff"
                        w="100%"
                        h="100%"
                        overflow={"hidden"}
                        borderRadius="lg"

                    >
                        {loading ? (
                            <Spinner
                                size="lg"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )

                        }
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ?
                                <Lottie animationData={animationData} loop={true} />
                                : <> </>}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>

                </>
            ) : (
                <Box display={"flex"} alignItems="center" justifyContent={"center"} h="100%">
                    <Text>Click on a user to start  Chatting</Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat