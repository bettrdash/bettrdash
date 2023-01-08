import {
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { queryClient, useAddWebsite } from "../api";
import { ProjectProps } from "../utils/types";
import ModalComp from "./ModalComp";

const NewWebsite = ({
  projects,
  linkToProject = false,
  id = null,
}: {
  projects?: ProjectProps[];
  linkToProject?: boolean;
  id?: number | null;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [url, setUrl] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [projectId, setProjectId] = useState<number | null>(id as number);
  const toast = useToast();

  const bg = useColorModeValue("gray.200", "gray.900");

  useEffect(() => {
    console.log(projectId);
  }, [projectId])
  const {
    mutate: addWebsite,
    isSuccess,
    data: res,
    isError,
    isLoading,
  } = useAddWebsite();

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "There was an error adding the website",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    if (isSuccess && !isLoading) {
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Website created!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries(["websites"]);
        queryClient.invalidateQueries(["monitor"]);
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    toast,
    res?.data.success,
    res?.data.message,
  ]);

  const hanldeAddWebsite = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "URL field is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      addWebsite({
        url,
        environment,
        projectId,
      });
      onClose();
      setUrl("");
      setEnvironment("production");
    }
  };

  return (
    <>
      <Button
        _hover={{ color: "gray.800", bg: "gray.200" }}
        color="white"
        bgGradient={"linear(to-r, red.400,pink.400)"}
        onClick={onOpen}
        w={{ base: "100%", md: 150 }}
      >
        New Website
      </Button>
      <ModalComp
        title={
          <>
            <HStack>
              <Text>Add Website</Text>
            </HStack>
          </>
        }
        actionText="Add Website"
        isOpen={isOpen}
        onClose={onClose}
        onAction={hanldeAddWebsite}
      >
        <Heading color="gray.500" fontSize={12} mt={5}>
          URL
        </Heading>
        <InputGroup>
          <InputLeftAddon mt={3}>
            https://
          </InputLeftAddon>
          <Input
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            bg={bg}
            mt={3}
          />
        </InputGroup>
        <Heading color="gray.500" fontSize={12} mt={5}>
          Environment
        </Heading>
        <Input
        // _hover={{borderColor: 'gray.800'}}
          name="environment"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          placeholder="Environment"
          bg={bg}
          border='none'
          mt={3}
        />
        {linkToProject && (
          <>
            <Heading color="gray.500" fontSize={12} mt={5}>
              Link to an existing project
            </Heading>
            <Select
              onChange={(e) => setProjectId(parseInt(e.target.value))}
              mt={3}
              bg={bg}
              borderWidth={1}
              _hover={{ cursor: "pointer" }}
            >
              <option key={null} value={undefined}>
                None
              </option>
              {projects!.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </>
        )}
      </ModalComp>
    </>
  );
};

export default NewWebsite;
