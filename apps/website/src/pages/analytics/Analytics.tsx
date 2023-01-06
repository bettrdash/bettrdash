import {
  Badge,
  Button,
  Flex,
  Heading,
  Icon,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { FiTrash } from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { analytics, useRemoveTracking, useTrackWebsite } from "../../api";
import Loading from "../../components/Loading";
import ModalComp from "../../components/ModalComp";
import { WebsiteProps } from "../../utils/types";

const Analytics = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const { data: analyticsData, status: analyticsStatus } = useQuery({
    queryKey: "analytics",
    queryFn: analytics,
    refetchInterval: 300000,
  });

  if (analyticsStatus === "loading") {
    return <Loading />;
  }

  if (analyticsStatus === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (analyticsData.message) {
    return <Text>{analyticsData.message}</Text>;
  }

  const websites = analyticsData.websites;
  const allWebsites = analyticsData.allWebsites;

  return (
    <>
      <Flex
        mt={3}
        h="100%"
        overflowY="auto"
        boxShadow={"lg"}
        w="100%"
        rounded={5}
        flexDir="column"
        p={5}
        bg={bg}
      >
        <TrackWebsite websites={allWebsites} />
        {websites.length > 0 ? (
          <TableContainer mt={5}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>URL</Th>
                  <Th isNumeric>Current Visitors</Th>
                  <Th isNumeric></Th>
                </Tr>
              </Thead>
              <Tbody>
                {websites.map((website: any, index: number) => (
                  <Tr key={index}>
                    <Td
                      _hover={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() =>
                        navigate(`/analytics/${website.website.id}`)
                      }
                    >
                      {website.website.url}
                    </Td>
                    <Td isNumeric>{website.currentVisitors}</Td>
                    <Td isNumeric>
                      <Remove id={website.website.id} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>URL</Th>
                  <Th isNumeric>Current Visitors</Th>
                  <Th isNumeric></Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        ) : (
          <Text mt={5}>
            No websites are being tracked. Feel free to track one!
          </Text>
        )}
      </Flex>
    </>
  );
};

const TrackWebsite = ({ websites }: { websites: WebsiteProps[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id, setId] = useState<any>(null);
  const { mutate, isLoading } = useTrackWebsite();

  const trackWebsite = () => {
    mutate({
      id,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setId(null);
    onClose();
  };

  const selectBg = useColorModeValue("gray.200", "gray.900");
  return (
    <>
      <Button
        _hover={{ color: "gray.800", bg: "gray.200" }}
        color="white"
        bgGradient={"linear(to-r, red.400,pink.400)"}
        onClick={onOpen}
        w={{ base: "100%", md: 150 }}
      >
        Track Website
      </Button>
      <ModalComp
        title={"Track Website"}
        isOpen={isOpen}
        onClose={onClose}
        actionText="Track Website"
        onAction={trackWebsite}
        size={{ base: "md", md: "2xl" }}
        isLoading={isLoading}
      >
        <Select
          onChange={(e) => setId(parseInt(e.target.value))}
          _hover={{ cursor: "pointer" }}
          bg={selectBg}
          placeholder="Select Website"
        >
          {websites.map((website, index) => (
            <option key={index} value={website.id}>
              {website.url}
            </option>
          ))}
        </Select>
        {id ? (
          <>
            <Heading mb={5} mt={14} fontSize={15}>
              {
                "Place this code snippet in the head section of your website's HTML"
              }
            </Heading>
            <CopyBlock
              text={`<script defer data-domain="${
                websites.find((website) => website.id === id)!.url
              }" 
src="${process.env.REACT_APP_ANALYTICS_URL}" >
</script>`}
              language={"html"}
              showLineNumbers={false}
              theme={dracula}
            />
          </>
        ) : null}
      </ModalComp>
    </>
  );
};

const Remove = ({ id }: { id: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useRemoveTracking();

  const removeTracking = () => {
    mutate({ id });
    onClose();
  };
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
        actionText="Remove"
        isOpen={isOpen}
        onClose={onClose}
        onAction={removeTracking}
        isLoading={isLoading}
        deleteBG={true}
        title="Remove Tracking"
      >
        <Text>
          Are you sure, all tracked data will be delete? This action cannot be
          reversed.{" "}
        </Text>
      </ModalComp>
    </>
  );
};

export default Analytics;
