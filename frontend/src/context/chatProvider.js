import { createContext, useContext, useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
const ChatContext = createContext();


const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const history = useHistory();
    const [data] = useState(localStorage.getItem("userInfo"));
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(data);
        setUser(userInfo);
        if (!userInfo) {
            history.push("/");
        }
    }, [history, data]);


    return (
        <ChatContext.Provider value={{
            user,
            setUser,
            selectedChat,
            setSelectedChat,
            chats,
            setChats,
            notification,
            setNotification
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}



export default ChatProvider;
