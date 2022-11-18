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
  Divider,
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
  const color = useColorModeValue("#F2F2F2", "#171923");

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
      <Heading textAlign={{ base: "center", md: "start" }}>Monitor</Heading>
      <Flex
        h="100%"
        overflowY="auto"
        boxShadow={"lg"}
        w="100%"
        rounded={10}
        mt={10}
        flexDir="column"
        p={4}
      >
        <Flex  w='100%' justify={'space-between'}>
          <Heading fontSize={14}>URL</Heading>
          <Heading fontSize={14}>Status</Heading>
        </Flex>
        {projects.map((project: ProjectProp, index: number) => (
          <>
            <Flex mt={5} justify="space-between">
              <Text noOfLines={1} w={{base: '80%', md: '100%'}}>{project.live_url}</Text>
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
                  <Flex ml={2} alignSelf={"center"}>
                    <ScaleLoader color={color} width={2} height={10} />
                  </Flex>
                ) : null}
              </Flex>
            </Flex>
            <Divider mt={5} />
          </>
        ))}
        {/* <TableContainer
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
        </TableContainer> */}
      </Flex>
    </>
  );
};

export default Monitor;
