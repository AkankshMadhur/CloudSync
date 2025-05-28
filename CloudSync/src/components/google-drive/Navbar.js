// src/components/google-drive/Navbar.js
import React from "react"
import {
  Box,
  Flex,
  Link as ChakraLink,
  Spacer,
  Button,
  useColorMode,
  IconButton,
  Tooltip,
  HStack,
} from "@chakra-ui/react"
import { Link as RouterLink, useHistory } from "react-router-dom"
import { FaMoon, FaSun } from "react-icons/fa"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const history = useHistory()

  return (
    <Box
      bg={colorMode === "light" ? "gray.100" : "gray.900"}
      px={4}
      py={2}
      shadow="sm"
      borderBottom="1px solid"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex align="center">
        <ChakraLink
          as={RouterLink}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color="teal.500"
          letterSpacing="wide"
        >
          CloudSync
        </ChakraLink>

        <Spacer />

        <HStack spacing={2}>
          <Tooltip label="Back">
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => history.goBack()}
              aria-label="Go back"
              variant="ghost"
              size="sm"
              colorScheme="teal"
            />
          </Tooltip>

          <Tooltip label="Forward">
            <IconButton
              icon={<ArrowForwardIcon />}
              onClick={() => history.goForward()}
              aria-label="Go forward"
              variant="ghost"
              size="sm"
              colorScheme="teal"
            />
          </Tooltip>

          <Button
            as={RouterLink}
            to="/user"
            variant="ghost"
            size="sm"
            colorScheme="teal"
          >
            Profile
          </Button>

          <Tooltip label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}>
            <IconButton
              aria-label="Toggle dark mode"
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              size="sm"
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="teal"
            />
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  )
}
