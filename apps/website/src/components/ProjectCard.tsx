import {
  Box,
  HStack,
  Heading,
  Image,
  Stack,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ProjectProps } from "../utils/types";

// type Props = {
//   project: {
//     id: number;
//     name: string;
//     language: string;
//     description: string;
//     github_url?: string;
//     active: boolean;
//     live_url?: string;
//     image_url: string;
//   };
// };

const IMAGE =
  "https://res.cloudinary.com/practicaldev/image/fetch/s--qo_Wp38Z--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/e0nl7ziy1la7bpwj7rsp.png";

const ProjectCard = (project: ProjectProps) => {
  const navigate = useNavigate();
  const imageBG = useColorModeValue("gray.500", "gray.700");
  return (
    <>
      <Flex
        _hover={{ 
          cursor: "pointer",
          translate: "0px  = -5px",
          boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => navigate(`/projects/${project.id}`)}
        role={"group"}
        maxW={"100%"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        rounded={"lg"}
        // pos={"relative"}
        // zIndex={1}
        h={250}
        borderWidth={2}

        borderColor={useColorModeValue('gray.200', 'gray.700')}
        p={4}
        justifyContent={"space-between"}
        flexDir={"column"}
      >
        <Heading fontSize={20}>{project.name}</Heading>
        <HStack>
          {project.defaultWebsiteId && (
            <HStack>
              <Heading color="gray.500" fontSize={14}>
                STATUS:
              </Heading>
              <Heading
                color={
                  project.websites![0].status === "UP" ? "green.400" : "red.400"
                }
                fontSize={14}
              >
                {project.websites![0].status}
              </Heading>
            </HStack>
          )}
          <HStack>
              <Heading color="gray.500" fontSize={14}>
                ACTIVE:
              </Heading>
              <Heading
                color={
                  project.active ? "green.400" : "red.400"
                }
                fontSize={14}
              >
                {project.active ? 'YES' : 'NO'}
              </Heading>
            </HStack>
        </HStack>
        {/* <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          alignSelf="center"
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${project.image_url})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
          bg={imageBG}
            alignSelf={"center"}
            alt=""
            rounded={"lg"}
            height={230}
            width={"100%"}
            objectFit={"cover"}
            src={project.image_url}
            fallbackSrc={IMAGE}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text
            color={useColorModeValue("green.400", "green.200")}
            fontSize={"sm"}
            textTransform={"uppercase"}
          >
            {project.active ? "Active" : "Inactive"}
          </Text>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            {project.name}
          </Heading>
          <Text fontWeight={"200"} textAlign="center">
            {project.description}
          </Text>
        </Stack> */}
      </Flex>
    </>
  );
};

export default ProjectCard;
