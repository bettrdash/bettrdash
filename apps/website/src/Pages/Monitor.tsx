import {
  Heading,
  Text,
  Flex,
  useColorModeValue,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { projectMonitor } from "../api";
import Loading from "../Components/Loading";

type ProjectProp = {
  id: number;
  status: string;
  live_url: string;
};
const Monitor = () => {
  const bg = useColorModeValue("white", "gray.800");
  const { data: projectMonitorData, status: projectMonitorStatus } = useQuery(
    "projectMonitor",
    projectMonitor
  );

  if (projectMonitorStatus === "loading") {
    return <Loading />;
  }

  if (projectMonitorStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (projectMonitorData.message) {
    return <Text>{projectMonitorData.message}</Text>;
  }

  const projects = projectMonitorData.projects;
  return (
    <>
      <Flex
        h="100%"
        overflowY="auto"
        boxShadow={"lg"}
        w="100%"
        rounded={5}
        flexDir="column"
        p={5}
        bg={bg}
      >
        <Flex w="100%" justify={"space-between"}>
          <Heading fontSize={14}>URL</Heading>
          <Heading fontSize={14}>Status</Heading>
        </Flex>
        {projects.map((project: ProjectProp, index: number) => (
          <>
            <Flex mt={5} justify="space-between">
              <Text noOfLines={1} w={{ base: "80%", md: "100%" }}>
                {project.live_url}
              </Text>
              <Badge
              alignSelf={'center'}
                alignContent={"center"}
                colorScheme={project.status === "ONLINE" ? "green" : "red"}
              >
                {project.status}
              </Badge>
            </Flex>
            <Divider mt={5} />
          </>
        ))}
      </Flex>
    </>
  );
};

export default Monitor;
