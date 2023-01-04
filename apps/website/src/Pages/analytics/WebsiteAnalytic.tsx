import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
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
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  analyticsAggregate,
  analyticsSources,
  analyticsTopPages,
} from "../../api";
import AnalyticCard from "../../components/AnalyticCard";
import Loading from "../../components/Loading";
import { AggregateProps, SourcesProps, TopPagesProps } from "../../utils/types";

const WebsiteAnalytic = () => {
  const bg = useColorModeValue("white", "gray.800");
  const { id } = useParams();
  const {
    data: aggregateData,
    isLoading: aggregateLoading,
    isError: aggregateError,
  } = useQuery({
    queryKey: "analyticsAggregate",
    queryFn: () => analyticsAggregate({ id: id! }),
  });

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesError,
  } = useQuery({
    queryKey: "analyticsSources",
    queryFn: () => analyticsSources({ id: id! }),
  });

  const {
    data: topPagesData,
    isLoading: topPagesLoading,
    isError: topPagesError,
  } = useQuery({
    queryKey: "analyticsTopPages",
    queryFn: () => analyticsTopPages({ id: id! }),
  });

  if (aggregateLoading || sourcesLoading || topPagesLoading) {
    return <Loading />;
  }

  if (aggregateError || sourcesError || topPagesError) {
    return <Text>An error has occurred</Text>;
  }

  if (aggregateData.message || sourcesData.message || topPagesData.message) {
    return (
      <Text>
        {aggregateData.message || sourcesData.message || topPagesData.message}
      </Text>
    );
  }

  const aggregate = aggregateData.aggregate.results;
  const sources = sourcesData.sources.results;
  const topPages = topPagesData.topPages.results;

  return (
    <>
      <Flex
        w="100%"
        bg={bg}
        rounded={5}
        boxShadow="lg"
        flexDir={"column"}
        padding={5}
        height="100%"
      >
        <Breadcrumb
          fontWeight={"semibold"}
          alignSelf={{ base: "center", md: "start" }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/analytics">
              Analytics
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{aggregateData.websiteUrl}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Aggregate aggregate={aggregate} />
      </Flex>
      <Stack gap={10} mt={10} direction={{ base: "column", md: "row" }}>
        <Sources sources={sources} />
        <TopPages topPages={topPages} />
      </Stack>
    </>
  );
};

const Aggregate = ({ aggregate }: { aggregate: AggregateProps }) => {
  return (
    <>
      <Grid
        w="100%"
        templateColumns="repeat(auto-fit, minmax(280px, 1fr))"
        autoRows={"inherit"}
        columnGap={40}
        rowGap={10}
        mt={5}
      >
        <GridItem>
          <Center>
            <AnalyticCard
              title="Visitors"
              value={aggregate.visitors.value.toString()}
            />
          </Center>
        </GridItem>
        <GridItem>
          <Center>
            <AnalyticCard
              title="Visit Duration"
              value={`${Math.trunc(
                aggregate.visit_duration.value / 60
              )}m ${Math.trunc(aggregate.visit_duration.value % 60)}s`}
            />
          </Center>
        </GridItem>
        <GridItem>
          <Center>
            <AnalyticCard
              title="Total Pageviews"
              value={aggregate.pageviews.value.toString()}
            />
          </Center>
        </GridItem>
        <GridItem>
          <Center>
            <AnalyticCard
              title="Bounce Rate"
              value={aggregate.bounce_rate.value.toString()}
            />
          </Center>
        </GridItem>
      </Grid>
      {/* <TableContainer mt={5}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Visitors</Td>
              <Td isNumeric>{aggregate.visitors.value}</Td>
            </Tr>
            <Tr>
              <Td>Visit Duration</Td>
              <Td isNumeric>{aggregate.visit_duration.value}</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Metric</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer> */}
    </>
  );
};

const Sources = ({ sources }: { sources: SourcesProps[] }) => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <>
      <Flex
        flexDir={"column"}
        rounded={5}
        boxShadow="lg"
        padding={5}
        bg={bg}
        w="100%"
        h="100%"
      >
        <Heading as="h3" size="md" mt={5}>
          Sources
        </Heading>
        <TableContainer mt={5}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Source</Th>
                <Th isNumeric>Visitors</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sources.map((source, index) => (
                <>
                  <Tr>
                    <Td>{source.source}</Td>
                    <Td isNumeric>{source.visitors}</Td>
                  </Tr>
                </>
              ))}
            </Tbody>
            {sources.length > 0 && (
              <Tfoot>
                <Tr>
                  <Th>Source</Th>
                  <Th isNumeric>Visitors</Th>
                </Tr>
              </Tfoot>
            )}
          </Table>
        </TableContainer>
      </Flex>
    </>
  );
};

const TopPages = ({ topPages }: { topPages: TopPagesProps[] }) => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <>
      <Flex
        flexDir={"column"}
        rounded={5}
        boxShadow="lg"
        padding={5}
        bg={bg}
        w="100%"
        h="100%"
      >
        <Heading as="h3" size="md" mt={5}>
          Top Pages
        </Heading>
        <TableContainer mt={5}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Page</Th>
                <Th isNumeric>Visitors</Th>
              </Tr>
            </Thead>
            <Tbody>
              {topPages.map((page, index) => (
                <>
                  <Tr>
                    <Td>{page.page}</Td>
                    <Td isNumeric>{page.visitors}</Td>
                  </Tr>
                </>
              ))}
            </Tbody>
            {topPages.length > 0 && (
              <Tfoot>
                <Tr>
                  <Th>Source</Th>
                  <Th isNumeric>Visitors</Th>
                </Tr>
              </Tfoot>
            )}
          </Table>
        </TableContainer>
      </Flex>
    </>
  );
};

export default WebsiteAnalytic;
