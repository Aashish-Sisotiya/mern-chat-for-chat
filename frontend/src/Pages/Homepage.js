import React, { useEffect, useState } from 'react'
import {
    Container,
    Box,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';
import { useHistory } from 'react-router-dom';


const Homepage = () => {
    const history = useHistory();
    const [data] = useState(localStorage.getItem("userInfo"));
     

    useEffect(() => {
        const user = JSON.parse(data);       


        if (user) {
            history.push("/chats")
        }

    }, [history, data])



    return (
        <Container maxW="xl" centerContent>
            <Box
                display={"flex"}
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="2xl" fontFamily="Work sans" color={'black'} >
                    Chat-For-Chat
                </Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" color={'black'} borderWidth="1px">
                <Tabs isFitted variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}


export default Homepage


