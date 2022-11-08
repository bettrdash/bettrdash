import React from "react";
import { Text, VStack } from "@chakra-ui/react";

type Props = {
  title: string;
  data: any;
};

const StatCard = ({ title, data }: Props) => {
  return (
    <>
      <VStack color='white' p={4} rounded={5} w={200} bg="blue.600">
        <Text fontSize={25}>{data}</Text>
        <Text fontSize={20} fontWeight={'200'}>{title}</Text>
      </VStack>
    </>
  );
};

export default StatCard;
