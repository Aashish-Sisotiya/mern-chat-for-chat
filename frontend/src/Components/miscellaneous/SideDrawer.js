import React, { useEffect, useState } from 'react';
import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerBody, Input, DrawerHeader, useToast, Spinner } from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/hooks';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../context/chatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import UserListItem from "../Avatar/UserListItem"
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();


    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();



    
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }
    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        // console.log(userId);
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/chat', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the Text",
                description: error.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <Box
                display={'flex'} justifyContent="space-between" alignItems="center" bg={"white"} w="100%" p="5px 10px 5px 10px" borderWidth={"5px"}
            >

                <Tooltip label="Search users to text" hasArrow placement='bottom-start' bg="white">
                    <Button variant={"ghost"} onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px="4"> Search User</Text>
                    </Button>
                </Tooltip>



                <Text fontSize="2xl" fontFamily="Work sans" color={'black'} >
                    Chat-For-Chat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1} >
                            <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                            <BellIcon fontSize={"2xl"}></BellIcon>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notific) => (
                                <MenuItem
                                    key={notific._id}
                                    onClick={() => {
                                        setSelectedChat(notific.chat)
                                        setNotification(notification.filter((n) => n !== notific));
                                    }}
                                >
                                    {notific.chat.isGroupChat
                                        ? `New Message in ${notific.chat.chatName}`
                                        : `New Message from ${getSender(user, notific.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>

                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={"sm"} cursor="pointer" name={user.name} src={user.pic}></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem >My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>



            <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent >
                    <DrawerHeader borderBottomWidth="1px">
                        Search User
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2} >
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loading && <Spinner ml={"auto"} display="flex" />}
                    </DrawerBody>
                </DrawerContent>


            </Drawer>
        </>
    )
}

export default SideDrawer



