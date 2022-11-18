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
  GridItem,
  Center,
} from "@chakra-ui/react";
import ModalComp from "../Components/ModalComp";
import { projectsApi, useAddProject } from "../api";
import { useQuery } from "react-query";
import { ProjectProps } from "../utils/types";
import { useUser } from "./App";
import * as Sentry from "@sentry/react";
import Loading from "../Components/Loading";
const Projects = () => {
  const [view, _] = useState("list");
  const { user } = useUser();
  const { data: projectsData, status: projectsStatus } = useQuery({
    queryKey: "projects",
    queryFn: () => projectsApi(),
  });

  if (projectsStatus === "loading") {
    return <Loading />;
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
      <HStack justify={{base: 'center', md: 'flex-start'}}>
        <Heading>Projects</Heading>
        <NewProject />
      </HStack>
      <Grid
        w="100%"
        templateColumns="repeat(auto-fit, minmax(280px, 1fr))"
        autoRows={"inherit"}
        gap={20}
        mt={55}
      >
        {projects.map((project: ProjectProps, index: number) => (
          <GridItem key={index}>
            <Center>
              <ProjectCard project={project} view={view} />
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
  const [live_url, setLiveURL] = useState("");
  const [github_url, setGithubUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  const [image_url, setImageUrl] = useState("");
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
    if (!name || !description || !language) {
      // Sentry.setUser({email: 'randomemail@mail.com'})
      Sentry.setTag("testTag", "randomuser");
      Sentry.captureMessage("Missing required fields");
      toast({
        title: "Error",
        description: "All fields are required.",
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
        live_url,
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
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant={"flushed"}
          placeholder="Project Title"
        />
        <Input
          name="live_url"
          value={live_url}
          onChange={(e) => setLiveURL(e.target.value)}
          mt={5}
          variant={"flushed"}
          placeholder="Live Link"
        />
        <Input
          name="github_url"
          value={github_url}
          onChange={(e) => setGithubUrl(e.target.value)}
          mt={5}
          variant={"flushed"}
          placeholder="Github URL"
        />
        <Input
          name="image_url"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
          mt={5}
          variant={"flushed"}
          placeholder="Image URL"
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
