import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "./App";
import { useQuery } from "react-query";
import { projectApi, queryClient } from "../api";
import {
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import "moment-timezone";
import { ProjectProps } from "../utils/types";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/constants";
import ModalComp from "../Components/ModalComp";
import Loading from "../Components/Loading";

axios.defaults.withCredentials = true;
const IMAGE =
  "https://res.cloudinary.com/practicaldev/image/fetch/s--qo_Wp38Z--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/e0nl7ziy1la7bpwj7rsp.png";

const Project = () => {
  const { id } = useParams();
  const { data: projectData, status: projectStatus } = useQuery({
    queryKey: "project",
    queryFn: () => projectApi(id!),
  });

  if (projectStatus === "loading") {
    return <Loading />;
  }

  if (projectStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (projectData.message) {
    return <Text>{projectData.message}</Text>;
  }

  const project = projectData.project as ProjectProps;

  return (
    <>
      <EditMode project={project} />
    </>
  );
};

const EditMode = ({ project }: { project: ProjectProps }) => {
  const [loading, setLoading] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const toast = useToast();
  const [updatedProject, setUpdatedProject] = useState<any>({
    id: project.id,
    name: project.name,
    live_url: project.live_url,
    github_url: project.github_url,
    language: project.language,
    description: project.description,
    active: project.active,
    image_url: project.image_url,
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUnsaved(true);
    setUpdatedProject({ ...updatedProject, [name]: value });
  };

  const handleSave = async () => {
    if (
      updatedProject.name === "" ||
      updatedProject.description === "" ||
      updatedProject.language === ""
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setLoading(true);
      await axios
        .post(`${API_URL}/projects/update`, { project: updatedProject })
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            setUnsaved(false);
            queryClient.invalidateQueries("project");
            toast({
              description: "Project updated successfully",
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
    }
  };
  const inputBg = useColorModeValue("#f2f2f2", "gray.900");
  const bg = useColorModeValue("white", "gray.800");
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
        <Image
          rounded={10}
          alt="project image"
          w={{ base: "100%", md: 330 }}
          h={250}
          src={project.image_url}
          fallbackSrc={IMAGE}
        />
        <Flex ml={{base: 0, md: 5}} w="100%" flexDir={"column"} mt={{ base: 5, md: 0 }}>
          <Flex>
            <Heading alignSelf={"center"} fontSize={15}>
              Status:
            </Heading>
            <Text
              color="white"
              ml={2}
              rounded={5}
              p={1}
              fontSize={12}
              bg={project.status === "UP" ? "green.400" : "red.400"}
            >
              {project.status}
            </Text>
          </Flex>
          <Flex mt={5} w={"100%"} flexDir={"column"}>
            <Heading fontSize={15}>Name</Heading>
            <Input
              mt={2}
              w="100%"
              bg={inputBg}
              name="name"
              border="none"
              value={updatedProject.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Heading fontSize={15}>Description: </Heading>
            <Textarea
              w="100%"
              mt={2}
              bg={inputBg}
              border="none"
              name="description"
              placeholder="Description"
              value={updatedProject.description}
              onChange={handleChange}
            />
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Heading fontSize={15}>Language: </Heading>
            <Input
              mt={2}
              bg={inputBg}
              border="none"
              name="language"
              value={updatedProject.language}
              onChange={handleChange}
              placeholder="Language"
            />
          </Flex>
          <Flex mt={5}>
            <Heading fontSize={15}>Active: </Heading>
            <Switch
              onChange={() => {
                setUnsaved(true);
                setUpdatedProject({
                  ...updatedProject,
                  active: !updatedProject.active,
                });
              }}
              isChecked={updatedProject.active}
              colorScheme={"green"}
              ml={3}
              alignSelf={"center"}
            />
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Heading fontSize={15}>Live URL: </Heading>
            <Input
              mt={2}
              bg={inputBg}
              border="none"
              name="live_url"
              value={updatedProject.live_url}
              onChange={handleChange}
              placeholder="Live Url"
            />
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Heading fontSize={15}>Github URL: </Heading>
            <Input
              mt={2}
              border="none"
              bg={inputBg}
              name="github_url"
              value={updatedProject.github_url}
              onChange={handleChange}
              placeholder="Github Url"
            />
          </Flex>
          <Flex flexDir={"column"} mt={5}>
            <Heading fontSize={15}>Image URL: </Heading>
            <Input
              mt={2}
              bg={inputBg}
              border="none"
              name="image_url"
              value={updatedProject.image_url}
              onChange={handleChange}
              placeholder="Image Url"
            />
          </Flex>
          <Button
            isLoading={loading}
            _hover={{ color: "#1A202C", bg: "gray.200" }}
            disabled={!unsaved}
            mt={5}
            color="white"
            onClick={handleSave}
            bgGradient={"linear(to-r, red.400,pink.400)"}
          >
            Save
          </Button>
          <DeleteProject id={project.id} />
        </Flex>
      </Flex>
    </>
  );
};

const DeleteProject = ({ id }: { id: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const deleteProject = async () => {
    await axios.post(`${API_URL}/projects/delete`, { id }).then((res) => {
      if (res.data.success) {
        queryClient.invalidateQueries("projects");
        navigate("/");
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
      <Button onClick={onOpen} colorScheme="red" mt={3}>
        <Text>Delete Project</Text>
      </Button>
      <ModalComp
        title="Are you sure?"
        onAction={deleteProject}
        isOpen={isOpen}
        onClose={onClose}
        actionText="Delete Project"
      >
        <Text>This action is irreversible</Text>
      </ModalComp>
    </>
  );
};

export default Project;
