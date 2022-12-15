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
};
const ModalComp = ({
  isOpen,
  onClose,
  children,
  title,
  actionText,
  onAction,
}: Props) => {
  const bg = useColorModeValue("white", "gray.800");
  return (
    <>
      <Modal size={{ base: "sm", md: "lg" }} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalCloseButton />
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            <Button colorScheme={"red"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onAction} variant="ghost">
              {actionText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;
