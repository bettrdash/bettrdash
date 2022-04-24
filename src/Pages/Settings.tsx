import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import ModalComp from "../Components/ModalComp";

axios.defaults.withCredentials = true;

const Settings = () => {
  const [settings, setSettings] = useState<any>({})
  const toast = useToast();
  const { data: apiKeyData, status: apiKeyStatus } = useQuery(
    "api_key",
    apiKeyAPI
  );
  const { data: apiSettingsData, status: apiSettingsStatus} = useQuery(
    "api_settings",
    apiSettingsApi
  );

  useEffect(() => {
    if (apiSettingsData) {
      setSettings(apiSettingsData.settings);
    }
  }, [apiSettingsData])

  if (apiKeyStatus === "loading" || apiSettingsStatus === "loading") {
    return <Text>Loading...</Text>;
  }

  if (apiKeyStatus === "error" || apiSettingsStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKeyData.apiKey);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const updateSettings = async (setting:any, newValue: any) => {
    console.log(newValue)
    setSettings({...settings, [setting]: newValue})
    await axios.post(`${API_URL}/api/settings/update`, {
      settings: {...settings, [setting]: newValue}
    }).then(res => {
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Settings updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries(['api_settings'])
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
  }


  return (
    <>
      <Heading>Settings</Heading>
      <Flex mt={5}>
        <Text fontWeight={"600"} fontSize={25}>
          API Settings
        </Text>
        <GenerateKey />
      </Flex>
      <Flex mt={3}>
        <Text alignSelf={"center"}>{apiKeyData.message}</Text>
        <Flex>
          <Text fontSize={20} fontWeight={"600"}>
            API Key:{" "}
          </Text>
          <Text ml={3} alignSelf={"center"}>
            {apiKeyData.apiKey}
          </Text>
          <Button
            bgGradient={"linear(to-r, red.400,pink.400)"}
            onClick={() => copyToClipboard()}
            size="sm"
            ml={3}
            color='white'
            _hover={{bg: 'gray.200', color: 'gray.800'}}
          >
            Copy
          </Button>
        </Flex>
      </Flex>
      <Flex>
        <Text fontSize={20} fontWeight={"600"}>Show Inactive Projects: </Text>
        <Switch onChange={() => updateSettings('show_inactive_projects', !settings.show_inactive_projects)} isChecked={settings.show_inactive_projects} colorScheme='green' ml={3} alignSelf='center' />
      </Flex>
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
        onClose()
        toast({
          title: "Success",
          description: 'API key generated',
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
      <Button onClick={onOpen} ml={3}>
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
