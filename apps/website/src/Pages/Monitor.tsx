import {
  Center,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Flex,
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
      <Heading>Monitor</Heading>
      <Center h="100%">
        <TableContainer
          h="100%"
          overflowY="auto"
          boxShadow={"2xl"}
          w="100%"
          rounded={10}
          mt={10}
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Website</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects.map((project: ProjectProp, index: number) => (
                <Tr key={index}>
                  <Td>{project.live_url}</Td>
                  <Td>
                    {" "}
                    <Flex>
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
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>
    </>
  );
};

export default Monitor;
