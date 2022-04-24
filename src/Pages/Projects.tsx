import React, { useEffect, useState } from "react";
import ProjectCard from "../Components/ProjectCard";
import {
  Flex,
  Heading,
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
} from "@chakra-ui/react";
import ModalComp from "../Components/ModalComp";
import { projectsApi, useAddProject } from "../api";
import { useQuery } from "react-query";
import { ProjectProps } from "../utils/types";
import { useUser } from "./App";

const Projects = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, _] = useState("list");
  const { user } = useUser();
  const { data: projectsData, status: projectsStatus } = useQuery({
    queryKey: "projects",
    queryFn: () => projectsApi(user!.id),
  });

  if (projectsStatus === "loading") {
    return <Text>Loading...</Text>;
  }

  if (projectsStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (projectsData.message) {
    return <Text>{projectsData.message}</Text>
  }

  const projects = projectsData.projects;
  return (
    <>
      <HStack>
        <Heading>Projects</Heading>
        <NewProject />
      </HStack>
      <Flex justifyContent={"center"}>
        <Grid
          w="100%"
          templateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          autoRows={"inherit"}
          gap={20}
          mt={10}
        >
          {/* {[...Array(20)].map((_, i) => (
            <ProjectCard view={view} key={i} />
          ))} */}
          {projects.map((project: ProjectProps, index: number) => (
            <ProjectCard project={project} view={view} key={index} />
          ))}
        </Grid>
      </Flex>
    </>
  );
};

const NewProject = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [github_url, setGithubUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  const toast = useToast();

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
    if (!name || !description || !github_url || !language || !active) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      addUpload({ name, description, github_url, language, active });
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
      <Button _hover={{color: 'gray.800', bg: 'gray.200'}} color='white' bgGradient={'linear(to-r, red.400,pink.400)'} onClick={onOpen}>
        New Project
      </Button>
      <ModalComp
        title={"New Project"}
        actionText="Add Project"
        isOpen={isOpen}
        onClose={onClose}
        onAction={addProject}
      >
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant={"flushed"}
          placeholder="Project Title"
        />
        <Input
          name="github_url"
          value={github_url}
          onChange={(e) => setGithubUrl(e.target.value)}
          mt={5}
          variant={"flushed"}
          placeholder="Github URL"
        />
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Select language"
          mt={5}
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
        <Textarea
          name={"description"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mt={5}
          placeholder="Description"
        />
        <HStack mt={5}>
          <Text fontSize={20} fontWeight={"200"}>
            Active?
          </Text>
          <Switch
            isChecked={active}
            onChange={() => setActive(!active)}
            colorScheme={"green"}
          />
        </HStack>
      </ModalComp>
    </>
  );
};

export default Projects;
