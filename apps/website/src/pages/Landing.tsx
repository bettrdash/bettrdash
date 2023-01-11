import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
  Stack,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Box,
  SimpleGrid,
  Icon,
  HStack,
  VStack,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  FaCode,
  FaInfinity,
  FaNpm,
  FaCheckCircle,
  FaGithub,
  FaGit,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { ReactComponent as AnalyticsSVG } from "../assets/images/analytics.svg";
import { ReactElement, ReactNode } from "react";

const Landing = () => {
  const dashboardImage = useColorModeValue(
    require("../assets/images/dashboard-light.png"),
    require("../assets/images/dashboard-dark.png")
  );
  const monitorImage = useColorModeValue(
    require("../assets/images/monitor-light.png"),
    require("../assets/images/monitor-dark.png")
  );
  const bodyTextColor = useColorModeValue("gray.600", "gray.300");
  return (
    <>
      <Flex
        fontFamily={"Poppins"}
        fontSize={"xl"}
        py={5}
        px={{ base: 4, md: 12 }}
        flexDir={"column"}
        w="100%"
        h="100%"
        minH="100vh"
      >
        <Flex w="100%" justify="space-between">
          <Heading
            // left={{ base: "30%", md: "0%" }}
            // pos={{ base: "absolute", md: "relative" }}
            fontFamily="monospace"
            alignSelf={"center"}
            fontWeight="bold"
            bgGradient="linear(to-r, red.400, pink.400)"
            bgClip="text"
            fontSize={{ base: "2xl", md: "4xl" }}
          >
            BettrDash
          </Heading>
          <Flex>
            <Icon
              alignSelf={"center"}
              cursor={"pointer"}
              _hover={{ color: "gray.900" }}
              color="red.400"
              as={FaGithub}
              onClick={() =>
                window.open("https://github.com/HelixHEX/bettrdash")
              }
            />
            <Text
              ml={{ base: 2, md: 5 }}
              bgGradient="linear(to-r, red.400, pink.400)"
              bgClip="text"
              fontFamily={"Poppins"}
              fontWeight={"bold"}
              fontSize={"xl"}
              cursor={"pointer"}
              _hover={{ color: "gray.900" }}
              as={RouterLink}
              to="/login"
              alignSelf={"center"}
            >
              Signin
            </Text>
            <Button
              ml={{ base: 2, md: 5 }}
              rounded="full"
              bgGradient="linear(to-r, red.400, pink.400)"
              w={{ base: 78, md: 120 }}
              h={{ base: 10, md: 12 }}
              fontSize={{ base: "sm", md: "md" }}
              color="white"
              _hover={{ bg: "gray.200", color: "gray.800" }}
            >
              Signup
            </Button>
          </Flex>
        </Flex>
        <Flex
          mt={10}
          justify={"space-between"}
          flexDir={{ base: "column", md: "row" }}
        >
          <Flex alignSelf={"center"} flexDir={"column"}>
            <Heading
              // color={bodyTextColor}
              textAlign={{ base: "center", md: "start" }}
              w={{ base: "100%", md: 300, lg: 700 }}
              fontWeight={"bold"}
              fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
              // fontSize='xl'
            >
              Managing your personal projects should be effortless and
              straightforward.
            </Heading>
            <Button
              bgGradient="linear(to-r, red.400, pink.400)"
              mt={10}
              alignSelf={{ base: "center", md: "start" }}
              h={65}
              rounded={"full"}
              w={{ base: 240, sm: 240, md: 300 }}
              color="white"
              _hover={{ bg: "gray.200", color: "gray.800" }}
            >
              Get Started for free
            </Button>
          </Flex>
          <Image
            mt={{ base: 4, md: 0 }}
            rounded={5}
            boxShadow="2xl"
            src={dashboardImage}
            alt="dashboard"
            w={{ base: "100%", md: 400, lg: 600 }}
            h={{ base: 300, sm: 400 }}
          />
        </Flex>
        <Flex
          mt={20}
          justify={"space-between"}
          flexDir={{ base: "column", md: "row" }}
        >
          <Tabs color="red.400" w={{ base: "100%", md: 800, lg: 900 }}>
            <TabList>
              <Tab _selected={{ color: "pink.400", borderColor: "pink.400" }}>
                Custom Integration
              </Tab>
              <Tab _selected={{ color: "pink.400", borderColor: "pink.400" }}>
                NPM Package
              </Tab>
              {/* <Tab>Three</Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel>
                <Image
                  w={{ base: 800, md: 800, lg: 800 }}
                  h={{ base: 300, sm: 400, lg: 500 }}
                  alt="Code demo"
                  mt={12}
                  rounded={5}
                  boxShadow="2xl"
                  src={require("../assets/images/customcode.png")}
                />
              </TabPanel>
              <TabPanel flexDir={"column"}>
                <Link
                  fontWeight="bold"
                  to="https://www.npmjs.com/package/bettrdash-react"
                  as={RouterLink}
                  textAlign={"center"}
                >
                  NPM Package
                </Link>
                <Image
                  w={{ base: "100%", md: 500, lg: 600 }}
                  h={{ base: 400, md: 300, lg: 500 }}
                  alt="Code demo"
                  mt={4}
                  rounded={5}
                  boxShadow="2xl"
                  src={require("../assets/images/npmcode.png")}
                />
              </TabPanel>
              {/* <TabPanel>
                <p>three!</p>
              </TabPanel> */}
            </TabPanels>
          </Tabs>

          <Stack
            mt={{ base: 10, md: 0 }}
            w="100%"
            alignSelf={"center"}
            textAlign={{ base: "center", md: "right" }}
            spacing={{ base: 5, md: 10 }}
          >
            <Heading
              lineHeight={1.1}
              fontWeight={700}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: "30%",
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "red.400",
                  zIndex: -1,
                }}
              >
                Write once,
              </Text>
              <br />
              <Text as={"span"} color={"red.400"}>
                use everywhere!
              </Text>
            </Heading>
            <Text
              alignSelf={{ base: "center", md: "end" }}
              w={{ base: "100%", md: 400 }}
              color={bodyTextColor}
            >
              Our API simplifies the process of accessing your projects,
              eliminating the need for manual coding every time you want to use
              them.
            </Text>
          </Stack>
        </Flex>
        <Flex w="100%" alignItems={"center"} mt={20} flexDir={"column"}>
          <Heading
            fontWeight={700}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Analaytics{" "}
            <Text as={"span"} color={"red.400"}>
              made easy
            </Text>
          </Heading>
          <Text
            textAlign={"center"}
            w={{ base: "100%", md: "70%" }}
            mt={10}
            color={bodyTextColor}
          >
            Our dashboard includes advanced, analytics capabilities powered by{" "}
            <Link
              textDecor={"underline"}
              to="https://plausible.io"
              as={RouterLink}
            >
              plausible.io
            </Link>
            , allowing you to monitor user activity without relying on cookies.
          </Text>
          <Button
            h={55}
            mt={10}
            rounded={"full"}
            w={250}
            bg="red.400"
            color="white"
            _hover={{ bg: "red.500"}}
          >
            Get Started
          </Button>
          <Flex
            mt={10}
            w={{ base: "100%", md: 500 }}
            h={{ base: "100%", md: 500 }}
          >
            <AnalyticsSVG width={"100%"} height={"100%"} />
          </Flex>
        </Flex>
        <Flex
          mt={20}
          justify={"space-between"}
          flexDir={{ base: "column", md: "row" }}
        >
          <Flex textAlign={{ base: "center", md: "start" }} flexDir={"column"}>
            <Heading fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}>
              Monitoring
            </Heading>
            <Text mt={10} w={{ base: "100%", md: 400 }} color={bodyTextColor}>
              Our built-in monitoring service ensures that you are always aware
              of the status of your site, so you can address any downtime
              quickly.
            </Text>
          </Flex>
          <Image
            mt={{ base: 10, md: 0 }}
            src={monitorImage}
            w={{ base: "100%", md: 400, lg: 700 }}
            h={{ base: 110, md: 100, lg: 150 }}
            alt="monitoring"
            rounded={5}
            boxShadow="2xl"
            alignSelf={"center"}
          />
        </Flex>
        <Box p={4}>
          <SimpleGrid
            mt={20}
            w="100%"
            columns={{ base: 1, md: 3 }}
            spacing={10}
          >
            <Feature
              icon={FaCode}
              title={"100% Open Source"}
              text={
                "As a completely open source platform, BettrDash gives you the option to self-host on your own machines, ensuring maximum privacy for your projects."
              }
            />
            <Feature
              icon={FaInfinity}
              title={"Unlimited Websites"}
              text={
                "BettrDash allows you to manage multiple websites for a single project, making it easy to track and organize all of your sites in one place.."
              }
            />
            <Feature
              icon={FaNpm}
              title={"NPM Package"}
              text={
                "BettrDash comes with an NPM package that includes pre-designed styles for project cards and lists, so you can focus on your work instead of styling elements."
              }
            />
          </SimpleGrid>
        </Box>
        <Pricing />
      </Flex>
    </>
  );
};

interface FeatureProps {
  title: string;
  text: string;
  icon: IconType;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        alignSelf={{ base: "center", md: "flex-start" }}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"gray.100"}
        mb={1}
      >
        <Icon color="red.400" as={icon} w={10} h={10} />
      </Flex>
      <Text alignSelf={{ base: "center", md: "flex-start" }} fontWeight={600}>
        {title}
      </Text>
      <Text textAlign={{ base: "center", md: "start" }} color={"gray.600"}>
        {text}
      </Text>
    </Stack>
  );
};

const PriceWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
};

const Pricing = () => {
  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Hobby
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="5xl" fontWeight="900">
                Free
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue("gray.50", "gray.700")}
            py={4}
            borderBottomRadius={"xl"}
          >
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                25 projects
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Monitoring for all websites
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />2 websites per
                project
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />3 websites not
                associated with a project
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Analytics tracking for 3 websites
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button
                w="full"
                _hover={{ bg: "red.400", color: "white" }}
                borderColor="red.400"
                variant="outline"
              >
                Get started for free
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <Text
                textTransform="uppercase"
                bg={useColorModeValue("red.300", "red.700")}
                px={3}
                py={1}
                color="white"
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Most Popular
              </Text>
            </Box>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Growth
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  5
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue("gray.50", "gray.700")}
              py={4}
              borderBottomRadius={"xl"}
            >
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Unlimted projects
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Monitoring for all websites
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  10 websites per project
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  10 websites not associated with a project
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Analytics tracking for all websites
                </ListItem>
              </List>
              <Box w="80%" pt={7}>
                <Button
                  _hover={{ bg: "red.500" }}
                  color="white"
                  w="full"
                  bg="red.400"
                >
                  Select plan
                </Button>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
      </Stack>
    </Box>
  );
};

export default Landing;
