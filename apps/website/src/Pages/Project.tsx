import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "./App";
import { useQuery } from "react-query";
import { projectApi, queryClient } from "../api";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  Link,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Moment from "react-moment";
import "moment-timezone";
import { ProjectProps } from "../utils/types";
import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import axios from "axios";
import { API_URL } from "../api/constants";
import { FiTrash2 } from "react-icons/fi";
import ModalComp from "../Components/ModalComp";
import Loading from "../Components/Loading";

axios.defaults.withCredentials = true;

const Project = () => {
  const [view, setView] = useState("view");
  const { id } = useParams();
  const { user } = useUser();
  const { data: projectData, status: projectStatus } = useQuery({
    queryKey: "project",
    queryFn: () => projectApi(user!.id, id!),
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
      <Image alt="project image" w={200} h={200} src={project.image_url} />
      <Flex mt={5}>
        <Text fontWeight={'700'} alignSelf={"center"}>Status:</Text>
        <Text
        color='white'
          ml={2}
          rounded={5}
          p={1}
          fontSize={12}
          bg={project.status === "UP" ? "green.400" : "red.400"}
        >
          {project.status}
        </Text>
      </Flex>
      {view === "view" ? (
        <ViewMode project={project} setView={setView} />
      ) : (
        <EditMode project={project} setView={setView} />
      )}
    </>
  );
};

const ViewMode = ({
  project,
  setView,
}: {
  project: ProjectProps;
  setView: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <Flex mt={5}>
        <IconButton
          onClick={() => setView("edit")}
          aria-label="Edit project"
          icon={<BiEditAlt />}
          alignSelf="center"
        />
        <DeleteProject id={project.id} />
        <Heading ml={3}>{project.name}</Heading>
        <Flex fontWeight={"500"} ml={3} alignSelf={"end"} mb={1.5}>
          <Text mr={3}>•</Text>
          <Moment format="MMMM Do YYYY">{project.createdAt}</Moment>
        </Flex>
      </Flex>
      <Flex fontSize={20} flexDir="column">
        <Flex mt={10}>
          <Text fontWeight={"600"}>Description: </Text>
          <Text ml={3}>{project.description}</Text>
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Language: </Text>
          <Text ml={3}>{project.language}</Text>
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Active: </Text>
          <Text ml={3}>{project.active ? "Yes" : "No"}</Text>
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Live URL: </Text>
          <Link
            href={project.live_url}
            _hover={{
              bgClip: "text",
              bgGradient: "linear(to-r, red.400,pink.400)",
            }}
            ml={3}
          >
            {project.live_url}
          </Link>
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Github URL: </Text>
          <Link
            href={project.github_url}
            _hover={{
              bgClip: "text",
              bgGradient: "linear(to-r, red.400,pink.400)",
            }}
            ml={3}
          >
            {project.github_url}
          </Link>
        </Flex>
      </Flex>
    </>
  );
};

const EditMode = ({
  project,
  setView,
}: {
  project: ProjectProps;
  setView: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
      await axios
        .post(`${API_URL}/projects/update`, { project: updatedProject })
        .then((res) => {
          if (res.data.success) {
            queryClient.invalidateQueries("project");
            setView("view");
            window.location.reload();
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

  return (
    <>
      <Flex mt={5}>
        <Button onClick={() => setView("view")}>Cancel</Button>
        <Button
          ml={3}
          color="white"
          onClick={handleSave}
          bgGradient={"linear(to-r, red.400,pink.400)"}
        >
          Save
        </Button>
        <Input
          ml={3}
          w={400}
          name="name"
          variant="flushed"
          value={updatedProject.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <DeleteProject id={project.id} />
      </Flex>
      <Flex fontSize={20} flexDir="column">
        <Flex mt={10}>
          <Text fontWeight={"600"}>Description: </Text>
          <Textarea
            ml={3}
            w={400}
            name="description"
            placeholder="Description"
            value={updatedProject.description}
            onChange={handleChange}
          />
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Language: </Text>
          <Input
            ml={3}
            w={400}
            variant="flushed"
            name="language"
            value={updatedProject.language}
            onChange={handleChange}
            placeholder="Language"
          />
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Active: </Text>
          <Switch
            onChange={() =>
              setUpdatedProject({
                ...updatedProject,
                active: !updatedProject.active,
              })
            }
            isChecked={updatedProject.active}
            colorScheme={"green"}
            ml={3}
            alignSelf={"center"}
          />
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Live URL: </Text>
          <Input
            ml={3}
            w={400}
            variant="flushed"
            name="live_url"
            value={updatedProject.live_url}
            onChange={handleChange}
            placeholder="Live Url"
          />
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Github URL: </Text>
          <Input
            ml={3}
            w={400}
            variant="flushed"
            name="github_url"
            value={updatedProject.github_url}
            onChange={handleChange}
            placeholder="Github Url"
          />
        </Flex>
        <Flex mt={3}>
          <Text fontWeight={"600"}>Image URL: </Text>
          <Input
            ml={3}
            w={400}
            variant="flushed"
            name="image_url"
            value={updatedProject.image_url}
            onChange={handleChange}
            placeholder="Image Url"
          />
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
      <IconButton
        onClick={onOpen}
        ml={3}
        colorScheme="red"
        alignSelf="center"
        aria-label="delete project"
        icon={<FiTrash2 />}
      />
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
