import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { apiKeyAPI, apiSettingsApi, queryClient } from "../api";
import axios from "axios";
import { API_URL } from "../api/constants";
import {
  Text,
  Heading,
  Button,
  Flex,
  useToast,
  useDisclosure,
  Switch,
  Center,
  Divider,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import ModalComp from "../components/ModalComp";
import Loading from "../components/Loading";

axios.defaults.withCredentials = true;

const Settings = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const [settings, setSettings] = useState<any>({});
  const toast = useToast();
  const bg = useColorModeValue("white", "gray.800");
  const { data: apiKeyData, status: apiKeyStatus } = useQuery(
    "api_key",
    apiKeyAPI
  );
  const { data: apiSettingsData, status: apiSettingsStatus } = useQuery(
    "api_settings",
    apiSettingsApi
  );

  useEffect(() => {
    if (apiSettingsData) {
      setSettings(apiSettingsData.settings);
    }
  }, [apiSettingsData]);

  if (apiKeyStatus === "loading" || apiSettingsStatus === "loading") {
    return <Loading />;
  }

  if (apiKeyStatus === "error" || apiSettingsStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const updateSettings = async (setting: any, newValue: any) => {
    setSettings({ ...settings, [setting]: newValue });
    await axios
      .post(`${API_URL}/api/settings/update`, {
        settings: { ...settings, [setting]: newValue },
      })
      .then((res) => {
        if (res.data.success) {
          toast({
            title: "Success",
            description: "Settings updated",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries(["api_settings"]);
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <>
      <Center>
        <Flex
          bg={bg}
          flexDir={"column"}
          boxShadow={"xl"}
          w={"100%"}
          padding={5}
          rounded={5}
        >
          <Flex flexDir={"column"}>
            <Heading>Appearance</Heading>
            <Flex mt={3}>
              <Heading alignSelf={"center"} fontSize={15}>
                Mode:{" "}
              </Heading>
              <Select
                ml={3}
                value={colorMode}
                onChange={(e) => toggleColorMode()}
                w={120}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </Flex>
            <Divider mt={5} />
            <Heading mt={5}>API Settings</Heading>
            <Text mt={5} alignSelf={"center"}>
              {apiKeyData.message}
            </Text>
            <Flex mt={3} flexDir={"column"}>
              <Heading fontSize={15}>API URL: </Heading>
              <Flex justify={"space-between"}>
                <Text w={{ base: "70%", md: "90%" }} alignSelf={"center"}>
                  https://api.bettrdash.com/projects/?key=
                  {apiKeyData.apiKey}
                </Text>
                <Button
                  bgGradient={"linear(to-r, red.400,pink.400)"}
                  onClick={() =>
                    copyToClipboard(
                      `https://api.bettrdash.com/projects/?key=${apiKeyData.apiKey}`
                    )
                  }
                  size="sm"
                  color="white"
                  _hover={{ bg: "gray.200", color: "gray.800" }}
                >
                  Copy
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Text alignSelf={"center"}>{apiKeyData.message}</Text>
            <Flex flexDir={"column"}>
              <Heading fontSize={15}>API Key: </Heading>
              <Flex justify={"space-between"}>
                <Text w={{ base: "70%", md: "90%" }} alignSelf={"center"}>
                  {apiKeyData.apiKey}
                </Text>
                <Button
                  bgGradient={"linear(to-r, red.400,pink.400)"}
                  onClick={() => copyToClipboard(`${apiKeyData.apiKey}`)}
                  size="sm"
                  color="white"
                  _hover={{ bg: "gray.200", color: "gray.800" }}
                >
                  Copy
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Text alignSelf={"center"}>{apiKeyData.message}</Text>
            <Flex>
              <Heading alignSelf={"center"} fontSize={15}>
                Show Inactive Projects:{" "}
              </Heading>
              <Switch
                onChange={() =>
                  updateSettings(
                    "show_inactive_projects",
                    !settings.show_inactive_projects
                  )
                }
                isChecked={settings.show_inactive_projects}
                colorScheme="green"
                ml={3}
                alignSelf="center"
              />
            </Flex>
          </Flex>
          <GenerateKey />
        </Flex>
      </Center>
    </>
  );
};

const GenerateKey = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const generateToken = async () => {
    await axios.post(`${API_URL}/api/generate-key`).then((res) => {
      if (res.data.success) {
        queryClient.invalidateQueries(["api_key"]);
        onClose();
        toast({
          title: "Success",
          description: "API key generated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  return (
    <>
      <Button mt={5} onClick={onOpen}>
        Generate API Key
      </Button>
      <ModalComp
        title="Are you sure?"
        isOpen={isOpen}
        onClose={onClose}
        onAction={generateToken}
        actionText="Generate"
      >
        <Text>This will generate a new key</Text>
        <Text>All applications using the old key will no longer work</Text>
      </ModalComp>
    </>
  );
};

export default Settings;
