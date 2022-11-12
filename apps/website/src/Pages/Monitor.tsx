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
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { ScaleLoader } from "react-spinners";
import { projectMonitor } from "../api";
import Loading from "../Components/Loading";

type ProjectProp = {
  id: number;
  status: string;
  live_url: string;
};
const Monitor = () => {
  const color = useColorModeValue('#F2F2F2', '#171923')

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
          boxShadow={"lg"}
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
                      <Flex
                        ml={2}
                        rounded={5}
                        p={1}
                        fontSize={12}
                        color={color}
                        bg={project.status === "UP" ? "green.400" : "red.400"}
                      >
                        {project.status}
                        {project.status === "pending" ? (
                         <Flex ml={2} alignSelf={'center'}>
                           <ScaleLoader color={color} width={2} height={10} />
                           </Flex>
                        ) : null}
                      </Flex>
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
