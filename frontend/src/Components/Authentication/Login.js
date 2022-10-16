import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../constants';


const Login = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState(false);

    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const history = useHistory();


    const handleClick = () => {
        setShow(!show);
    }



    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please fill all the fields ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "content-type": "application/json" 
                },
            };

            const { data } = await axios.post(`${API_URL}api/user/login`, { email, password }, config);
            toast({
                title: 'login successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));


            setLoading(false);

            history.push("/chats");   // it will be used to navigate
        } catch (error) {
            toast({
                title: 'error occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }


    return (
        <VStack spacing="10px">
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    value={email}
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                isLoading={loading}
                style={{ marginTop: 15 }}
                onClick={submitHandler}

            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>

    )
}

export default Login





//   localStorage.setItem("count", JSON.stringify(0));