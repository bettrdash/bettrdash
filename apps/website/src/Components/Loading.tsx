import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { ScaleLoader } from "react-spinners";

const Loading = () => {
  const color = useColorModeValue('#171923', '#F2F2F2')
  return (
    <>
      <Flex
        color={color}
        width="100%"
        h="100%"
        justify={"center"}
        align="center"
      >
        <Heading mr={5} pb={0.5}>
          Loading
        </Heading>
        <ScaleLoader color={color} />
      </Flex>
    </>
  );
};

export default Loading;
