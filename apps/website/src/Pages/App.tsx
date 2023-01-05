import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { checkAuth } from "../api";
import Loading from "../components/Loading";
import Nav from "../components/Nav";
import { UserProps } from "../utils/types";

type ContextType = { user: UserProps | null };

const App = () => {
  const { data, status } = useQuery("session", checkAuth);

  if (status === "loading") {
    return (
      <Flex w="100%" h="100vh">
        <Loading />
      </Flex>
    );
  }

  if (status === "error") {
    return <Text>An error has occurred</Text>;
  }

  if (!data.success) return <Navigate replace to="/login" />;

  return (
    <>
      <Flex flexDir={"column"} w="100%" h="auto" minH="100vh">
        <Nav user={data.user}>
          <Outlet context={{ user: data.user }} />
        </Nav>
      </Flex>
    </>
  );
};

export const useUser = () => {
  return useOutletContext<ContextType>();
};

export default App;
