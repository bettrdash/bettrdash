import React from "react";
import StatCard from "../Components/Stat";
import { Heading, HStack, Text } from "@chakra-ui/react";

const Home = () => {
  return (
    <>
      <Heading>Home</Heading>
      <HStack mt={10}>
        <StatCard title="Projects" data={25} />
        <StatCard title="Active" data={4} />
      </HStack>
    </>
  );
};

export default Home;
