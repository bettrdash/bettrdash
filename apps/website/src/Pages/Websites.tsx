import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { projectApi, projectWebsitesApi } from "../api";
import Loading from "../components/Loading";
import NewWebsite from "../components/NewWebsite";
import WebsitesTable from "../components/WebsitesTable";
import { ProjectProps, WebsiteProps } from "../utils/types";

const Websites = () => {
  const { id } = useParams();
  const {
    data: projectData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: "websites",
    queryFn: () => projectApi(id!),
  });
  const bg = useColorModeValue("white", "gray.800");

  if (isLoading) return <Loading />;

  if (isError) return <Text>An error has occurred</Text>;

  const websites = projectData.websites as WebsiteProps[];
  const project = projectData.project as ProjectProps;

  return (
    <>
      <Flex
        w="100%"
        bg={bg}
        rounded={5}
        boxShadow="lg"
        flexDir={"column"}
        padding={5}
        height="100%"
      >
        <Breadcrumb fontWeight={'semibold'} mb={5} alignSelf={{ base: "center", md: "start" }}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={`/projects/${project.id}`}>
              {project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as={Link} to={`/projects/${project.id}/websites`}>
              Websites
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <NewWebsite id={project.id} />
        <WebsitesTable websites={websites} />
      </Flex>
    </>
  );
};

export default Websites;
