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
  Text,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { FaMoon, FaSun } from "react-icons/fa"

export default function NavbarComponent() {
  const { colorMode, toggleColorMode } = useColorMode()

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
        {/* App Logo/Name */}
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

        <HStack spacing={3}>
          {/* Upload status indicator could go here */}
          {/* <UploadIndicator uploading={true} /> */}

          {/* Profile link */}
          <Button
            as={RouterLink}
            to="/user"
            variant="ghost"
            size="sm"
            colorScheme="teal"
          >
            Profile
          </Button>

          {/* Dark mode toggle */}
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
