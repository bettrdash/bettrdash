import React, { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  children: ReactNode,
  actionText: string,
  onAction: () => void
}
const ModalComp = ({isOpen, onClose, children, title, actionText, onAction}: Props) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={'red'} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onAction} variant="ghost">{actionText}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;
