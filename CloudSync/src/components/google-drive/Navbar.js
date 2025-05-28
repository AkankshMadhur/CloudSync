// src/components/google-drive/Navbar.js
import React from "react"
import {
  Box,
  Flex,
  Input,
  IconButton,
  Tooltip,
  HStack,
  useColorMode,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { FaMoon, FaSun, FaSearch } from "react-icons/fa"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import { useHistory, Link as RouterLink } from "react-router-dom"
import { Button } from "@chakra-ui/react"

export default function Navbar({ searchQuery, setSearchQuery }) {
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
      <Flex align="center" gap={4}>
        {/* Search Bar */}
        <InputGroup maxW="600px" mx="auto" flex={1}>
          <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.400" />} />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in CloudSync"
            bg={colorMode === "light" ? "white" : "gray.700"}
            borderRadius="md"
          />
        </InputGroup>

        {/* Right Side Buttons */}
        <HStack spacing={2} ml="auto">
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
