import {
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { useAddWebsite } from "../api";
import { ProjectProps } from "../utils/types";
import ModalComp from "./ModalComp";

const NewWebsite = ({
  projects,
  linkToProject=false,
  id=null
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
      setProjectId(null);
    }
  };

  return (
    <>
      <Button
        _hover={{ color: "gray.800", bg: "gray.200" }}
        color="white"
        bgGradient={"linear(to-r, red.400,pink.400)"}
        onClick={onOpen}
        w={{base: '100%', md: 150}}
      >
        New Website
      </Button>
      <ModalComp
        title={
          <>
            <HStack>
              <Text>Add Website</Text>
              {/* <Tooltip label="Hover me">
                <Icon color="gray.400" as={FiHelpCircle} />
              </Tooltip> */}
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
        <Input
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          variant={"flushed"}
          placeholder="URL"
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          Environment
        </Heading>
        <Input
          name="environment"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          mt={0}
          variant={"flushed"}
          placeholder="Environment"
        />
        {linkToProject && (
          <>
            <Heading color="gray.500" fontSize={12} mt={5}>
              Link to an existing project
            </Heading>
            <Select
              onChange={(e) => setProjectId(parseInt(e.target.value))}
              mt={3}
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
