import React from "react"
import {
  Box,
  Flex,
  Link as ChakraLink,
  Spacer,
  Text,
  Button,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

export default function NavbarComponent() {
  return (
    <Box bg="gray.100" px={4} py={2} shadow="sm">
      <Flex align="center">
        <ChakraLink
          as={RouterLink}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color="blue.500"
          letterSpacing="wide"
        >
          CloudSync
        </ChakraLink>
        <Spacer />
        <Button
          as={RouterLink}
          to="/user"
          variant="ghost"
          size="sm"
          colorScheme="blue"
        >
          Profile
        </Button>
      </Flex>
    </Box>
  )
}
