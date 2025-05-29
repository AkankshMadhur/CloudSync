// src/Sidebar.js


import React from "react"
import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  Divider,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { FaImage, FaHome, FaClock, FaDatabase, FaFileAlt } from "react-icons/fa" // Added FaFileAlt icon

export default function Sidebar({ usedStorage, totalStorage }) {
  const bg = useColorModeValue("gray.50", "gray.800")

  const storagePercent = (usedStorage / totalStorage) * 100

  return (
    <Box
      as="aside"
      position="fixed"
      top={0}
      left={0}
      h="100vh"
      w="250px"
      bg={bg}
      p={4}
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <VStack align="stretch" spacing={6}>
        {/* Logo/Title */}
        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
          CloudSync
        </Text>

        {/* Navigation */}
        <VStack align="stretch" spacing={3}>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<Icon as={FaHome} />}
            justifyContent="flex-start"
            variant="ghost"
            colorScheme="teal"
          >
            Home
          </Button>
          <Button
            as={RouterLink}
            to="/recent"
            leftIcon={<Icon as={FaClock} />}
            justifyContent="flex-start"
            variant="ghost"
            colorScheme="teal"
          >
            Recent
          </Button>
          <Button
            as={RouterLink}
            to="/storage"
            leftIcon={<Icon as={FaDatabase} />}
            justifyContent="flex-start"
            variant="ghost"
            colorScheme="teal"
          >
            Storage
          </Button>
          {/* New Summarize PDF Option */}
          <Button
            as={RouterLink}
            to="/summarize"
            leftIcon={<Icon as={FaFileAlt} />}
            justifyContent="flex-start"
            variant="ghost"
            colorScheme="teal"
          >
            Summarize PDF
          </Button>
          <Button
  as={RouterLink}
  to="/image-to-pdf"
  leftIcon={<Icon as={FaImage} />}
  justifyContent="flex-start"
  variant="ghost"
  colorScheme="teal"
>
  Image to PDF
</Button>
        </VStack>

        <Divider />

        {/* Storage Info */}
        <Box>
          <Text fontSize="sm" mb={1}>
            {usedStorage} GB of {totalStorage} GB used
          </Text>
          <Progress
            value={storagePercent}
            size="sm"
            colorScheme="teal"
            borderRadius="md"
          />
          <Button mt={2} size="sm" colorScheme="teal" variant="outline" width="100%">
            Get more storage
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}