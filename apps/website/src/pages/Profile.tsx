import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useOutlet } from "./App";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/constants";
import { Widget } from "@uploadcare/react-widget";
import { queryClient } from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useOutlet();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const toast = useToast();
  const [profileImg, setImageUrl] = useState(user!.profile_img);
  const imageBG = useColorModeValue("gray.100", "gray.900");
  const bg = useColorModeValue("white", "gray.800");
  const [loading, setLoading] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

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
      (newPassword.length > 0 || rePassword.length > 0) &&
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
    } else if (
      (newPassword.length > 0 || rePassword.length > 0) &&
      newPassword !== rePassword
    ) {
      toast({
        title: "Error",
        description: "Password do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (newPassword.length < 6 && newPassword.length > 0) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setLoading(true);
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
          setLoading(false);
          if (res.data.success) {
            setUnsaved(false);
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

  const handleCancel = () => {
    setName(user!.name);
    setEmail(user!.email);
    setUnsaved(false);
  };

  return (
    <>
      <Flex
        w="100%"
        bg={bg}
        rounded={5}
        boxShadow="lg"
        flexDir={{ base: "column", md: "row" }}
        padding={5}
      >
        <Flex
          justify={"center"}
          align={"center"}
          h={255}
          p={5}
          rounded={10}
          bg={imageBG}
          flexDir={["column", "column"]}
        >
          <Avatar mb={5} size="xl" src={profileImg} />
          <Widget
            onChange={(res) => {
              setImageUrl(res.cdnUrl as string);
              updateProfile(res.cdnUrl);
            }}
            publicKey={process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY as string}
          />
        </Flex>
        <VStack
          ml={{ base: 0, md: 5 }}
          mt={{ base: 5, md: 0 }}
          w="100%"
          spacing={5}
        >
          <FormControl id="userName">
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={name}
              onChange={(e) => {
                setUnsaved(true);
                setName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={email}
              onChange={(e) => {
                setUnsaved(true);
                setEmail(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Current Password</FormLabel>
            <Input
              placeholder="currentpassword"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setUnsaved(true);
                setCurrentPassword(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>New Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={newPassword}
              onChange={(e) => {
                setUnsaved(true);
                setNewPassword(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="repassword">
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={rePassword}
              onChange={(e) => {
                setUnsaved(true);
                setRePassword(e.target.value);
              }}
            />
          </FormControl>
          <Stack w="100%" spacing={3} direction={"column"}>
            <Button
              isLoading={loading}
              _hover={{ color: "#1A202C", bg: "gray.200" }}
              disabled={!unsaved}
              color="white"
              onClick={() => updateProfile(null)}
              bgGradient={"linear(to-r, red.400,pink.400)"}
            >
              Save
            </Button>

            <Button
              disabled={!unsaved}
              onClick={handleCancel}
              colorScheme="gray"
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
          </Stack>
        </VStack>
      </Flex>
    </>
  );
};
export default Profile;
