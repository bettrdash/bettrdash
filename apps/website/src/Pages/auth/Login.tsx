import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  useToast,
} from "@chakra-ui/react";
import {Link as RouterLink} from 'react-router-dom'

import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api/constants";
import { ColorModeSwitcher } from "../../components/ColorModeSwitcher";
import * as Sentry from '@sentry/react'
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = false;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (email === "" || password === "") {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      await axios
        .post(
          `${API_URL}/auth/login`,
          {
            email,
            password,
          },
        )
        .then((res) => {
          if (res.data.success) {
            Sentry.setUser({ email: email });
            navigate('/')
          } else {
            Sentry.captureMessage(res.data.message);
            toast({
              title: "Error",
              description: res.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .catch((e) => {
          toast({
            title: "Error",
            description: "An error has occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Flex pos="absolute" right={5} top={5}>
        <ColorModeSwitcher />
      </Flex>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </FormControl>
              <Stack spacing={10}>
                <HStack>
                  <Text>New User?</Text>
                  <Link as={RouterLink} bgClip='text' bgGradient={"linear(to-r, red.400,pink.400)"} to="/signup" >
                    Sign Up!
                  </Link>
                </HStack>
                <Button
                  type="submit"
                  fontFamily={"heading"}
                  mt={8}
                  w={"full"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={"white"}
                  _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
