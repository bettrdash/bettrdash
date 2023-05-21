import {
  Heading,
  Text,
  Flex,
  useColorModeValue,
  Divider,
  Badge,
  Input,
  Button,
  Select,
  Textarea,
  HStack,
  Switch,
  useToast,
  useDisclosure,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { FiHelpCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { projectMonitor, useAddWebsite } from "../api";
import Loading from "../components/Loading";
import ModalComp from "../components/ModalComp";
import { ProjectProps } from "../utils/types";
import WebsitesTable from "../components/WebsitesTable";
import NewWebsite from "../components/NewWebsite";
import { useParams } from "react-router-dom";

type ProjectProp = {
  id: number;
  status: string;
  live_url: string;
};
const Monitor = () => {
  const {projectId} = useParams();
  const bg = useColorModeValue("white", "gray.800");
  const { data: websiteMonitorData, status: websiteMonitorStatus } = useQuery({
    queryKey: "monitor",
    queryFn: () => projectMonitor({projectId: projectId!})
  })

  if (websiteMonitorStatus === "loading") {
    return <Loading />;
  }

  if (websiteMonitorStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (websiteMonitorData.message) {
    return <Text>{websiteMonitorData.message}</Text>;
  }

  const websites = websiteMonitorData.websites;
  const projects = websiteMonitorData.projects;


  return (
    <>
      {/* <NewWebsite projects={projects} /> */}
      <Flex
        mt={3}
        h="100%"
        overflowY="auto"
        boxShadow={"lg"}
        w="100%"
        rounded={5}
        flexDir="column"
        p={5}
        bg={bg}
      >
        <NewWebsite linkToProject={true} projects={projects} />
        <WebsitesTable websites={websites} />
        {/* <Flex w="100%" justify={"space-between"}>
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
                alignSelf={"center"}
                alignContent={"center"}
                colorScheme={project.status === "ONLINE" ? "green" : "red"}
              >
                {project.status}
              </Badge>
            </Flex>
            <Divider mt={5} />
          </>
        ))} */}
      </Flex>
    </>
  );
};

// const NewWebsite = ({ projects }: { projects: ProjectProps[] }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [url, setUrl] = useState("");
//   const [environment, setEnvironment] = useState("production");
//   const [projectId, setProjectId] = useState<number | null>(null);
//   const toast = useToast();

//   const {
//     mutate: addWebsite,
//     isSuccess,
//     data: res,
//     isError,
//     isLoading,
//   } = useAddWebsite();

//   useEffect(() => {
//     if (isError) {
//       toast({
//         title: "Error",
//         description: "There was an error adding the website",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//     if (isSuccess && !isLoading) {
//       if (res.data.success) {
//         toast({
//           title: "Success",
//           description: "Website created!",
//           status: "success",
//           duration: 5000,
//           isClosable: true,
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: res.data.message,
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//         });
//       }
//     }
//   }, [
//     isLoading,
//     isSuccess,
//     isError,
//     toast,
//     res?.data.success,
//     res?.data.message,
//   ]);

//   const hanldeAddWebsite = () => {
//     if (!url) {
//       toast({
//         title: "Error",
//         description: "URL field is required",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } else {
//       addWebsite({
//         url,
//         environment,
//         projectId,
//       });
//       onClose();
//       setUrl("");
//       setEnvironment("production");
//       setProjectId(null);
//     }
//   };

//   return (
//     <>
//       <Button
//         _hover={{ color: "gray.800", bg: "gray.200" }}
//         color="white"
//         bgGradient={"linear(to-r, red.400,pink.400)"}
//         onClick={onOpen}
//       >
//         New Website
//       </Button>
//       <ModalComp
//         title={
//           <>
//             <HStack>
//               <Text>Add Website</Text>
//               <Tooltip label="Hover me">
//                 <Icon color='gray.400' as={FiHelpCircle} />
//               </Tooltip>
//             </HStack>
//           </>
//         }
//         actionText="Add Website"
//         isOpen={isOpen}
//         onClose={onClose}
//         onAction={hanldeAddWebsite}
//       >
//         <Heading color="gray.500" fontSize={12} mt={5}>
//           URL
//         </Heading>
//         <Input
//           name="url"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           variant={"flushed"}
//           placeholder="URL"
//         />
//         <Heading color="gray.500" fontSize={12} mt={5}>
//           Environment
//         </Heading>
//         <Input
//           name="environment"
//           value={environment}
//           onChange={(e) => setEnvironment(e.target.value)}
//           mt={0}
//           variant={"flushed"}
//           placeholder="Environment"
//         />
//         <Heading color="gray.500" fontSize={12} mt={5}>
//           Link to an existing project
//         </Heading>
//         <Select onChange={(e) => setProjectId(parseInt(e.target.value))} mt={3}>
//           <option key={null} value={undefined}>
//             None
//           </option>
//           {projects.map((project) => (
//             <option key={project.id} value={project.id}>
//               {project.name}
//             </option>
//           ))}
//         </Select>
//       </ModalComp>
//     </>
//   );
// };

export default Monitor;
