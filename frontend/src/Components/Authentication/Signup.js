import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
// import { set } from 'mongoose';
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../constants';


const Signup = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setpassword] = useState();
    const [confirmpassword, setconfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setloading] = useState(false);

    const toast = useToast();
    const history = useHistory();

    const handleClick = () => {
        setShow(!show);
    }

    const postDetails = (pics) => {
        setloading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an image ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dgrbeglok");
            fetch("https://api.cloudinary.com/v1_1/dgrbeglok/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log("data", data);
                    setloading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setloading(false);
                })
        }
        else {
            toast({
                title: 'Please select an image ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
            return;
        }

    }
    const submitHandler = async () => {
        setloading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'Please fill all the fields ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: 'Password do not match ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "content-type": "application/json"
                    // "Access- Control - Allow - Origin": "*"
                },
            };

            const { data } = await axios.post(`${API_URL}api/user`, { name, email, password, pic }, config);
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setloading(false);
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
            setloading(false);
        }
    }


    return (
        <VStack spacing='5px' color="black">
            <FormControl id='first-name' isRequired>
                <FormLabel >Name</FormLabel>
                <Input placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel  >Email </FormLabel>
                <Input placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel  > Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='Password'
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel  > Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='Confirm Password'
                        onChange={(e) => setconfirmpassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic'>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => { postDetails(e.target.files[0]) }}
                />
            </FormControl>
            <Button
                colorScheme="cyan"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}

            >
                Sign Up
            </Button>
        </VStack >
    )
}

export default Signup