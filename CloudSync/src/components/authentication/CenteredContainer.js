// src/components/authentication/CenteredContainer.js
import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";


export default function CenteredContainer({ children }) {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
    >
      <Box w="100%" maxW="400px">
        {children}
      </Box>
    </Box>
  );
}
