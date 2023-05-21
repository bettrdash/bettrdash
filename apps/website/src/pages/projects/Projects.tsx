import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import {
  Flex,
  HStack,
  Grid,
  Button,
  useDisclosure,
  Text,
  Input,
  Textarea,
  Switch,
  Select,
  useToast,
  GridItem,
  Center,
  Stack,
  IconButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
  useColorModeValue,
  Tfoot,
  Heading,
} from "@chakra-ui/react";
import ModalComp from "../../components/ModalComp";
import { projectsApi, useAddProject } from "../../api";
import { useQuery } from "react-query";
import { ProjectProps } from "../../utils/types";
import Loading from "../../components/Loading";
import { FiGrid, FiList } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useOutlet } from "../App";

const Projects = () => {
  const { setBreadcrumbs } = useOutlet();
  const [filter, setFilter] = useState<string>("name");
  const [display, setDisplay] = useState<string>("grid");
  const { data: projectsData, status: projectsStatus } = useQuery(
    ["projects", filter],
    () => projectsApi({ filter })
  );

  useEffect(() => {
    setBreadcrumbs([{path: 'projects', label: 'Projects'}]);
  }, [setBreadcrumbs]);

  if (projectsStatus === "loading") {
    return (
      <>
        <Flex flexDir={"column"} w="100%" h="100%">
          <Center w="100%" h="100%">
            <Loading />
          </Center>
        </Flex>
      </>
    );
  }

  if (projectsStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (projectsData.message) {
    return <Text>{projectsData.message}</Text>;
  }

  const projects = projectsData.projects;
  return (
    <>
      <Flex p={{base: 5, md: 32}} flexDir={"column"}>
        <Flex>
          <Heading mr={4} alignSelf={"center"} color="gray.500">
            Projects
          </Heading>
          <NewProject />
        </Flex>
        <GridView projects={projects} />
      </Flex>
    </>
  );
};

const Header = ({
  filter,
  setFilter,
  display,
  setDisplay,
}: {
  filter: string;
  display: string;
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const bg = useColorModeValue("gray.200", "gray.700");
  return (
    <>
      <Stack direction={{ base: "column", md: "row" }}>
        <NewProject />
        <HStack w="100%" justify="space-between">
          <Flex>
            <IconButton
              onClick={() => setDisplay("grid")}
              color={display === "grid" ? "pink.400" : ""}
              bg={display === "grid" ? bg : "none"}
              _hover={{ bg }}
              aria-label="Grid"
              icon={<FiGrid size={20} />}
            />
            <IconButton
              onClick={() => setDisplay("list")}
              color={display === "list" ? "pink.400" : ""}
              bg={display === "list" ? bg : "none"}
              ml={1}
              _hover={{ bg }}
              aria-label="List"
              icon={<FiList size={20} />}
            />
          </Flex>
          <Flex alignSelf={{ base: "center", md: "start" }}>
            <Text alignSelf={"center"}>Sort by: </Text>
            <Select
              value={filter}
              ml={2}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              size="sm"
              variant="filled"
              w={170}
            >
              <option value="name">Name</option>
              <option value="active">Active</option>
              <option value="status">Status</option>
            </Select>
          </Flex>
        </HStack>
      </Stack>
    </>
  );
};

const GridView = ({ projects }: { projects: any }) => {
  return (
    <>
      <Grid
        w="100%"
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        autoRows={"inherit"}
        gap={20}
        mt={20}
      >
        {projects.map((project: ProjectProps, index: number) => (
          <GridItem key={index}>
            <Center>
              <ProjectCard {...project} />
            </Center>
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

const NewProject = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [github_url, setGithubUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  const [image_url, setImageUrl] = useState("");
  const toast = useToast();

  const inputBg = useColorModeValue("gray.200", "gray.900");

  const {
    mutate: addUpload,
    isSuccess,
    data: res,
    isError,
    isLoading,
  } = useAddProject();

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "There was an error adding the upload",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    if (isSuccess && !isLoading) {
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Project created!",
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

  const addProject = () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Name field is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      addUpload({
        name,
        description,
        github_url,
        language,
        active,
        url,
        environment,
        image_url,
      });
      onClose();
      setName("");
      setGithubUrl("");
      setLanguage("");
      setDescription("");
      setActive(false);
    }
  };
  return (
    <>
      <Button
        _hover={{ color: "gray.800", bg: "gray.200" }}
        color="white"
        bgGradient={"linear(to-r, red.400,pink.400)"}
        onClick={onOpen}
        alignSelf={"center"}
      >
        New Project
      </Button>
      <ModalComp
        title={"New Project"}
        actionText="Add Project"
        isOpen={isOpen}
        onClose={onClose}
        onAction={addProject}
      >
        <Heading color="gray.500" fontSize={12}>
          Active?
        </Heading>
        <HStack>
          <Text fontSize={20} fontWeight={"200"}>
            Active?
          </Text>
          <Switch
            isChecked={active}
            onChange={() => setActive(!active)}
            colorScheme={"green"}
          />
        </HStack>
        <Heading color="gray.500" fontSize={12} mt={5}>
          Project Name
        </Heading>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          Description
        </Heading>
        <Textarea
          name={"description"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          Select Language
        </Heading>
        <Select
          mt={3}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Select Language"
          backgroundColor={inputBg}
          borderColor={inputBg}
        >
          <option>Javascript</option>
          <option>Python</option>
          <option>Ruby on Rails</option>
          <option>HTML</option>
          <option>Java</option>
          <option>C++</option>
          <option>C</option>
          <option>C#</option>
        </Select>
        <HStack>
          <Flex flexDir={"column"}>
            <Heading color="gray.500" fontSize={12} mt={5}>
              URL
            </Heading>
            <Input
              name="url"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="URL"
              mt={3}
              backgroundColor={inputBg}
              borderColor={inputBg}
            />
          </Flex>
          <Flex flexDir={"column"}>
            <Heading color="gray.500" fontSize={12} mt={5}>
              Environment
            </Heading>
            <Input
              name="environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="Environment"
              mt={3}
              backgroundColor={inputBg}
              borderColor={inputBg}
            />
          </Flex>
        </HStack>
        <Heading color="gray.500" fontSize={12} mt={5}>
          github_url
        </Heading>
        <Input
          name="github_url"
          value={github_url}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="Github URL"
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          image_url
        </Heading>
        <Input
          name="image_url"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
          placeholder="Image URL"
        />
      </ModalComp>
    </>
  );
};

export default Projects;
