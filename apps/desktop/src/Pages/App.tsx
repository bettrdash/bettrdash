import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { checkAuth } from "../api";
import Nav from "../Components/Nav";
import { UserProps } from "../utils/types";

type ContextType = { user: UserProps | null };

const App = () => {
  const { data, status } = useQuery("session", checkAuth);

  if (status === "loading") {
    return <Text>Loading...</Text>;
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