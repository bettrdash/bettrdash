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
  Link,
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
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiSettings,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import axios from "axios";
import { API_URL } from "../api/constants";
import { UserProps } from "../utils/types";
import { useNavigate } from "react-router-dom";

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
      <Box minH="100vh" h="auto" ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      // transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Dashboard
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem path={link.path} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  path: string;
}
const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  return (
    <Link
      href={path}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
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
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  user: UserProps;
}
const MobileNav = ({ user, onOpen, ...rest }: MobileProps) => {
  const toast = useToast();
  const navigate = useNavigate();
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
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Dashboard
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <ColorModeSwitcher />
        {/* <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        /> */}
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
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              zIndex={2}
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => logout()}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Nav;
