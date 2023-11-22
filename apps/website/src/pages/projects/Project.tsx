import {
  Link as RouterLink,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useQuery } from "react-query";
import { projectApi, queryClient } from "../../api";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
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
  Link,
  VStack,
} from "@chakra-ui/react";
import { ProjectProps } from "../../utils/types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api/constants";
import ModalComp from "../../components/ModalComp";
import Loading from "../../components/Loading";
import { useOutlet } from "../App";

axios.defaults.withCredentials = true;
const IMAGE =
  "https://res.cloudinary.com/practicaldev/image/fetch/s--qo_Wp38Z--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/e0nl7ziy1la7bpwj7rsp.png";

const Project = () => {
  const { setBreadcrumbs } = useOutlet();
  const { projectId } = useParams();
  const { data: projectData, status: projectStatus } = useQuery({
    queryKey: "project",
    queryFn: () => projectApi(projectId!),
  });

  useEffect(() => {
    if (projectData) {
      if (projectData.project) {
        setBreadcrumbs([
          { path: "/", label: "Projects" },
          {
            path: `/projects/${projectData.project.id}`,
            label: projectData.project.name,
            color: "red.400",
          },
        ]);
      }
    }
  }, [projectData, setBreadcrumbs]);

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
  const inputBg = useColorModeValue("white", "gray.900");
  const bg = useColorModeValue("white", "gray.800");
  const imageBG = useColorModeValue("gray.400", "gray.900");
  return (
    <>
      <Flex w="100%" flexDir={"column"}>
        <Flex p={10} bg={useColorModeValue('white', 'gray.900')}>
          <Heading fontSize={30} color="gray.400">
            {project.name}
          </Heading>
          <Flex alignSelf={"center"} ml={4}>
            <Heading alignSelf={"center"} fontSize={15}>
              Active:{" "}
            </Heading>
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
        </Flex>
        <VStack bg={useColorModeValue('gray.100', 'gray.800')} spacing={8} py={4} px={10}>
          <Image
            rounded={10}
            bg={imageBG}
            alt="project image"
            w={{ base: "100%", md: 120 }}
            h={120}
            src={project.image_url}
            fallbackSrc={IMAGE}
            alignSelf={"start"}
          />
          <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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
          <Flex color="gray.500" w={"100%"} flexDir={"column"}>
            <Heading fontSize={15}>Description: </Heading>
            <Textarea
              minH={92}
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
          <Flex color="gray.500" w={"100%"} flexDir={"column"}>
            <Heading fontSize={15}>Programming Language: </Heading>
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

          <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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
          <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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
          <VStack spacing={8} alignSelf={"end"}>
            <Button
              alignSelf={"end"}
              isLoading={loading}
              _hover={{ color: "#1A202C", bg: "gray.200" }}
              disabled={!unsaved}
              color="white"
              onClick={handleSave}
              bgGradient={"linear(to-r, red.400,pink.400)"}
            >
              Save
            </Button>
            <Flex flexDir={"column"}>
              <Heading fontSize={28} fontWeight={"bold"} color={"red.500"}>
                DANGER ZONE
              </Heading>
              <DeleteProject id={project.id} />
            </Flex>
          </VStack>
        </VStack>
        {/* <Breadcrumb
          fontWeight={"semibold"}
          alignSelf={{ base: "center", md: "start" }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as={Link} to={`/projects/${project.id}`}>
              {project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex mt={5} flexDir={{ base: "column", md: "row" }}>
          <Image
            rounded={10}
            bg={imageBG}
            alt="project image"
            w={{ base: "100%", md: 330 }}
            h={250}
            src={project.image_url}
            fallbackSrc={IMAGE}
          />
          <Flex
            ml={{ base: 0, md: 5 }}
            w="100%"
            flexDir={"column"}
            mt={{ base: 5, md: 0 }}
          >
            <Link as={RouterLink} style={{ width: 120 }} to={`websites`}>
              <Text
                fontWeight={"bold"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                View Websites
              </Text>
            </Link>
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
            <Flex color="gray.500" w={"100%"} flexDir={"column"}>
              <Heading fontSize={15}>Description: </Heading>
              <Textarea
                minH={92}
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
            <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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

            <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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
            <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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
            <Flex color="gray.500" w={"100%"} flexDir={"column"}>
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
        </Flex> */}
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
