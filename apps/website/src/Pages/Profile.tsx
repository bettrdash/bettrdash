import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useUser } from "./App";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/constants";
import { Widget } from "@uploadcare/react-widget";
import { queryClient } from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useUser();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const toast = useToast();
  const [profileImg, setImageUrl] = useState(user!.profile_img);
  const navigate = useNavigate();

  const updateProfile = async (img: any) => {
    if (name === "" || email === "") {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (
      newPassword.length > 0 &&
      currentPassword === "" &&
      rePassword === ""
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (newPassword.length > 0 && newPassword !== rePassword) {
      toast({
        title: "Error",
        description: "Password do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      await axios
        .post(
          `${API_URL}/auth/update-profile`,
          {
            name,
            email,
            currentPassword,
            newPassword,
            profile_img: img ? img : profileImg,
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.success) {
            toast({
              title: "Success",
              description: "Profile updated",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setCurrentPassword("");
            setNewPassword("");
            setRePassword("");
            queryClient.invalidateQueries(["session"]);
          } else {
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
            description: e.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };
  return (
    <>
      <Heading textAlign={{ base: "center", md: "start" }}>Profile</Heading>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"100%"}
          bg={useColorModeValue("white", "gray.800")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={10}
        >
          <FormControl id="userName">
            <Center flexDir={["column", "column"]}>
              <FormLabel>Profile picture</FormLabel>

              <Center mb={5} mt={5}>
                <Avatar size="xl" src={profileImg} />
              </Center>
              <Widget
                onChange={(res) => {
                  console.log(res.cdnUrl);
                  setImageUrl(res.cdnUrl as string);
                  updateProfile(res.cdnUrl);
                }}
                publicKey={
                  process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY as string
                }
              />
            </Center>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Current Password</FormLabel>
            <Input
              placeholder="currentpassword"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>New Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="repassword">
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              onClick={() => updateProfile(null)}
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => navigate("/")}
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};
export default Profile;
