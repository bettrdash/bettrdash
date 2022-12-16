import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Badge,
  Flex,
  Icon,
  Heading,
  Input,
  HStack,
  useToast,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";
import { WebsiteProps } from "../utils/types";

import { FiEdit, FiTrash } from "react-icons/fi";
import ModalComp from "./ModalComp";
import { useEffect, useState } from "react";
import { queryClient, updateWebsite, useDeleteWebsite, useUpdateWebsite } from "../api";
import { useMutation } from "react-query";

const WebsitesTable = ({ websites }: { websites: WebsiteProps[] }) => {
  return (
    <>
      {websites.length > 0 ? (
        <TableContainer mt={5}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>URL</Th>
                <Th isNumeric>Status</Th>
                <Th isNumeric>Environment</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {websites.map((website: any, index: number) => (
                <Tr key={index}>
                  <Td>{website.url}</Td>
                  <Td isNumeric>
                    <Badge
                      alignSelf={"center"}
                      alignContent={"center"}
                      colorScheme={website.status === "UP" ? "green" : "red"}
                    >
                      {website.status}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    <Badge
                      alignSelf={"center"}
                      alignContent={"center"}
                      colorScheme={"gray"}
                    >
                      {website.environment}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    {/* <Flex> */}
                    <Edit website={website} />
                    <Delete id={website.id} />
                    {/* </Flex> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>URL</Th>
                <Th isNumeric>Status</Th>
                <Th isNumeric>Environment</Th>
                <Th isNumeric></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      ) : (
        <Text mt={5}>No websites available. Feel free to create one!</Text>
      )}
    </>
  );
};

const Edit = ({ website }: { website: WebsiteProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [url, setUrl] = useState(website.url);
  const [environment, setEnvironment] = useState(website.environment);
  const [makeDefault, setMakeDefault] = useState(website.default);
  const toast = useToast();
  const { isLoading, mutate } = useUpdateWebsite({onClose});

  const save = () => {
    if (url) {
      mutate({ url, environment, default: makeDefault, id: website.id });
    } else {
      toast({
        title: "URL field is required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Icon
        onClick={onOpen}
        _hover={{ cursor: "pointer" }}
        w={18}
        h={18}
        as={FiEdit}
      />
      <ModalComp
        title={
          <>
            <HStack>
              <Text>Edit Website</Text>
            </HStack>
          </>
        }
        actionText="Save"
        isOpen={isOpen}
        onClose={onClose}
        onAction={save}
        gradientBG={true}
        isLoading={isLoading}
      >
        <Heading color="gray.500" fontSize={12}>
          URL
        </Heading>
        <Input
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          variant={"flushed"}
          placeholder="URL"
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          Environment
        </Heading>
        <Input
          name="environment"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          mt={0}
          variant={"flushed"}
          placeholder="Environment"
        />
        <Heading mt={5} color="gray.500" fontSize={12}>
          Make Default Website?
        </Heading>
        <HStack>
          <Text fontSize={20} fontWeight={"200"}>
            Default
          </Text>
          <Switch
            isChecked={makeDefault}
            onChange={() => setMakeDefault(!makeDefault)}
            colorScheme={"green"}
          />
        </HStack>
      </ModalComp>
    </>
  );
};

const Delete = ({id}: {id: number}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {mutate, isLoading} = useDeleteWebsite();

  const deleteWebsite = () => {
    mutate({id})
  }
  return (
    <>
      <Icon
        color="red.400"
        _hover={{ cursor: "pointer", color: "red.600" }}
        ml={4}
        w={18}
        h={18}
        as={FiTrash}
        onClick={onOpen}
      />
      <ModalComp
        actionText="Delete"
        isOpen={isOpen}
        onClose={onClose}
        onAction={deleteWebsite}
        isLoading={isLoading}
        deleteBG={true}
        title="Delete Website"
      >
        <Text>Are you sure? This action cannot be reversed.</Text>
      </ModalComp>
    </>
  );
};

export default WebsitesTable;