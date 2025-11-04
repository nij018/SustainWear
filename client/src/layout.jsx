import { Box, Flex, Heading } from "@chakra-ui/react";
import Header from "./components/header";

export default function Layout({ title, children }) {
  return (
    <Flex direction="column" minH="100vh" bg="brand.beige">
      <Header />
      <Box flex="1" p={8}>
        <Heading size="lg" color="brand.green" mb={6}>
          {title}
        </Heading>
        {children}
      </Box>
    </Flex>
  );
}