import React, { ReactNode } from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useToast,
  Heading,
  Center,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

import {
  FiTrendingUp,
  FiSettings,
  FiMenu,
  FiChevronDown,
  FiActivity,
  FiUser,
  FiLogOut,
  FiBarChart2
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import axios from "axios";
import { API_URL } from "../api/constants";
import { UserProps } from "../utils/types";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}
const LinkItems: Array<LinkItemProps> = [
  // { name: "Home", icon: FiHome, path: "/" },
  { name: "Projects", icon: FiTrendingUp, path: "/" },
  // { name: "Explore", icon: FiCompass },
  // { name: "Favourites", icon: FiStar },
  { name: "Monitor", icon: FiActivity, path: "/monitor" },
  { name: "Analytics", icon: FiBarChart2, path: "/analytics" },
  { name: "Profile", icon: FiUser, path: "/profile" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

const Nav = ({ children, user }: { children: ReactNode; user: UserProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box h="auto" minH="100vh" bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav user={user} onOpen={onOpen} />
      <Box h="100%" ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const toast = useToast();
  const logout = async () => {
    await axios
      .post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          window.location.href = "/login";
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "An error has occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    window.location.href = "/login";
  };
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      {/* <Flex mx='8' bg='red' alignItems="center" justifyContent="center">
        <Heading textAlign={'center'} fontFamily="monospace" fontWeight="bold">
          BettrDash
        </Heading>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex> */}
      <Flex
        h={105}
        alignItems="center"
        justify={{ base: "flex-start", md: "center" }}
      >
        <CloseButton
          ml={4}
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
        <Heading
          left={{ base: "30%", md: "0%" }}
          pos={{ base: "absolute", md: "relative" }}
          fontFamily="monospace"
          fontWeight="bold"
        >
          BettrDash
        </Heading>
      </Flex>
      <Flex h="80%" flexDir={"column"} justify="space-between">
        <Flex flexDir={"column"}>
          {LinkItems.map((link) => (
            <NavItem
              onClose={onClose}
              path={link.path}
              key={link.name}
              icon={link.icon}
            >
              {link.name}
            </NavItem>
          ))}
        </Flex>
        <Flex
          p="4"
          onClick={logout}
          mt={2}
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          fontWeight='semibold'
          // color={"white"}
          _hover={{
            bgGradient: "linear(to-r, red.400,pink.400)",
            color: "white",
          }}
        >
          <Icon
            mr="4"
            alignSelf={"center"}
            fontSize="16"
            _groupHover={{}}
            as={FiLogOut}
          />
          Logout
        </Flex>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  path: string;
  onClose: () => void;
}
const NavItem = ({ onClose, icon, children, path, ...rest }: NavItemProps) => {
  const location = useLocation();
  return (
    <Link
      onClick={onClose}
      to={path}
      style={{ textDecoration: "none" }}
      // _focus={{ boxShadow: "none" }}
    >
      <Flex
        bgGradient={
          location.pathname === path
            ? "linear(to-r, red.400,pink.400)"
            : "transparent"
        }
        align="center"
        p="4"
        mt={2}
        mx="4"
        borderRadius="lg"
        role="group"
        fontWeight='semibold'
        cursor="pointer"
        color={location.pathname === path ? "white" : "gray.600"}
        _hover={{
          bgGradient: "linear(to-r, red.400,pink.400)",
          color: "white",
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" _groupHover={{}} as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  user: UserProps;
}
const MobileNav = ({ user, onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      pt={{ base: 4, md: 4 }}
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      justifyContent={"center"}
      {...rest}
    >
      <IconButton
        pos="absolute"
        left="4"
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        alignSelf={"center"}
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        BettrDash
      </Text>
    </Flex>
  );
};

export default Nav;
