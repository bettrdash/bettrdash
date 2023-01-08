import React, { ReactComponentElement, ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactComponentElement<any>;
  children: ReactNode;
  actionText?: string;
  onAction?: () => void;
  scrollBehavior?: "inside" | "outside";
  gradientBG?: boolean;
  isLoading?: boolean;
  deleteBG?: boolean;
  size?: {
    base:
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "full";
    md:
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "full";
  };
};
const ModalComp = ({
  isOpen,
  onClose,
  children,
  title,
  actionText,
  onAction,
  scrollBehavior = "inside",
  gradientBG = false,
  isLoading = false,
  deleteBG = false,
  size = { base: "sm", md: "lg" },
}: Props) => {
  const bg = useColorModeValue("white", "gray.800");
  return (
    <>
      <Modal
        scrollBehavior={scrollBehavior}
        size={size}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalCloseButton />
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            <Button
              variant={deleteBG ? "ghost" : "solid"}
              colorScheme={deleteBG ? "gray" : "red"}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            {onAction &&
              (gradientBG ? (
                <Button
                  _hover={{ color: "gray.700" }}
                  isLoading={isLoading}
                  bgGradient={
                    gradientBG ? "linear(to-r, red.400,pink.400)" : ""
                  }
                  onClick={onAction}
                  variant={deleteBG ? "solid" : "ghost"}
                  color={"white"}
                >
                  {actionText}
                </Button>
              ) : (
                <Button
                  isLoading={isLoading}
                  colorScheme={deleteBG ? "red" : "gray"}
                  onClick={onAction}
                  variant={deleteBG ? "solid" : "ghost"}
                >
                  {actionText}
                </Button>
              ))}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;
