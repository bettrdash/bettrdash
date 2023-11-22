import React, { ReactNode } from "react";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  useToast,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiChevronDown,
  FiActivity,
  FiBarChart,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { BreadCrumbProps, UserProps } from "../utils/types";
import Logo from "./Logo";
import { API_URL } from "../api/constants";
import axios from "axios";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  // { name: "Overview", icon: FiBarChart, path: "" },
  { name: "Monitor", icon: FiActivity, path: "/monitor" },
  // { name: "Analytics", icon: FiBarChart2, path: "/analytics" },
  // { name: "Settings", icon: FiSettings, path: "/settings" },
];

const useHomePage = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return pathname === "/";
};

const useSettingsPage = () => {
  const location = useLocation()
  const pathname = location.pathname
  return pathname === '/settings'
}

interface NavProps {
  children: ReactNode;
  user: UserProps;
  breadcrumbs: BreadCrumbProps["breadcrumbs"];
}

const Nav = ({ children, user, breadcrumbs }: NavProps) => {
  const isHomePage = useHomePage();
  const isSettingsPage = useSettingsPage()
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        breadcrumbs={breadcrumbs}
        onClose={() => onClose}
        display={{ base: "none", md: isHomePage || isSettingsPage ? "none" : "block" }}
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
          <SidebarContent breadcrumbs={breadcrumbs} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav breadcrumbs={breadcrumbs} user={user} onOpen={onOpen} />
      <Box mt={{ base: 0, md: 20 }} ml={{ base: 0, md: isHomePage || isSettingsPage ? 0 : 60 }}>
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
  breadcrumbs: BreadCrumbProps["breadcrumbs"];
}

const SidebarContent = ({ onClose, breadcrumbs, ...rest }: SidebarProps) => {
  const { projectId } = useParams();

  return (
    <Box
      mt={{ base: 0, md: 20 }}
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <NavItem originalPath={"/"} icon={FiBarChart}>
        Overview
      </NavItem>
      {LinkItems.map((link) => {
        const lastItemPath = breadcrumbs.slice(-1)[0].path;
        return (
          <NavItem originalPath={link.path} key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        );
      })}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  originalPath: string;
}
const NavItem = ({ originalPath, icon, children, ...rest }: NavItemProps) => {
  const location = useLocation();
  const { projectId } = useParams();
  const path = `/projects/${projectId}${originalPath}`;
  const currentPath =
    location.pathname === path ||
    (originalPath === "/" &&
      parseInt(location.pathname.substring(location.pathname.length - 1)));
  // const currentPath =
  //   location.pathname === path ||
  //   (location.pathname !== path && originalPath === "/");
  return (
    <RouterLink to={`${path}`} style={{ textDecoration: "none" }}>
      <Flex
        bgGradient={
          currentPath ? "linear(to-r, red.400,pink.400)" : "transparent"
        }
        align="center"
        p="4"
        mx="4"
        mt={2}
        borderRadius="lg"
        color={currentPath ? "white" : "gray.600"}
        role="group"
        cursor="pointer"
        fontWeight={currentPath ? "semibold" : "normal"}
        _hover={{
          bgGradient: "linear(to-r, red.400,pink.400)",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </RouterLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  user: UserProps;
  breadcrumbs: BreadCrumbProps["breadcrumbs"];
}
const MobileNav = ({ onOpen, user, breadcrumbs, ...rest }: MobileProps) => {
  const isHomePage = useHomePage();
  const location = useLocation();
  const mapLocation = () => {
    return location.pathname.split("/");
  };
  const toast = useToast();
  const logout = async () => {
    await axios
      .post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          window.location.href = "/";
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
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    window.location.href = "/login";
  };
  return (
    <Flex
      w="100%"
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "space-between" }}
      {...rest}
      pos={{ base: "relative", md: "fixed" }}
      zIndex={1000}
    >
      <IconButton
        display={{ base: isHomePage ? "none" : "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <HStack spacing={8}>
        <Logo />
        {location.pathname !== '/settings' && (
          breadcrumbs.length > 0 && (
            <Breadcrumb
              alignSelf={"center"}
              display={{ base: "none", md: "flex" }}
            >
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                  isCurrentPage={index === breadcrumbs.length - 1}
                  key={index}
                >
                  {index === 0 && <BreadcrumbSeparator color="gray.400" />}
                  <BreadcrumbLink
                    color={breadcrumb.color ? breadcrumb.color : "gray.400"}
                    fontWeight={"semibold"}
                    href={breadcrumb.path}
                  >
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          )
        )}
      </HStack>
      {/* <Breadcrumb display={{ base: "none", md: "flex" }}>
        {LinkItems.map((link, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink
              href={link.path}
            >{link.name}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb> */}
      {/* {location.pathname.split('/').map(test => (
        <Text>{test}</Text>
      ))} */}

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={user.profile_img} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user.name}</Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>
                <RouterLink to="/profile">Profile</RouterLink>
              </MenuItem>
              <MenuItem>
                <RouterLink to="/settings">settings</RouterLink>
              </MenuItem>
              {/* <RouterLink to="/billing">Billing</RouterLink> */}
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Nav;
