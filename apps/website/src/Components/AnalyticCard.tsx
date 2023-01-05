import { Center, Text, Heading, useColorModeValue } from "@chakra-ui/react";

type Props = {
  title: string;
  value: number | string;
};

const AnalyticCard = ({ title, value }: Props) => {
  return (
    <>
      <Center
        flexDir={"column"}
        rounded={10}
        w={{ base: "100%", md: 450 }}
        h={110}
        bgGradient={"linear(to-r, red.400,pink.400)"}
        color='white'
      >
        <Heading fontSize={50}>{value}</Heading>
        <Text fontWeight={"600"}>{title}</Text>
      </Center>
    </>
  );
};

export default AnalyticCard;
