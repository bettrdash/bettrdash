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
  actionText: string;
  onAction: () => void;
  scrollBehavior?: "inside" | "outside";
  gradientBG?: boolean;
  isLoading?: boolean;
  deleteBG?: boolean;
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
}: Props) => {
  const bg = useColorModeValue("white", "gray.800");
  return (
    <>
      <Modal
        scrollBehavior={scrollBehavior}
        size={{ base: "sm", md: "lg" }}
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
            <Button
              isLoading={isLoading}
              bgGradient={
                gradientBG ? "linear(to-r, red.400,pink.400)" : "null"
              }
              colorScheme={deleteBG ? "red" : "blue"}
              onClick={onAction}
              variant={gradientBG || deleteBG ? "solid" : "ghost"}
              color={gradientBG || deleteBG ? "white" : "gray.800"}
            >
              {actionText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;
