// src/components/Sidebar.js
import React from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { MdHome, MdAccessTime, MdStorage } from "react-icons/md"

export default function Sidebar({ usedStorage = 5, totalStorage = 15 }) {
  const usagePercentage = (usedStorage / totalStorage) * 100
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <Box
      w="250px"
      h="100vh"
      p={4}
      bg={bgColor}
      position="fixed"
      left={0}
      top={0}
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <VStack align="stretch" spacing={6}>
        {/* Links */}
        <VStack align="start" spacing={4}>
          <HStack as={RouterLink} to="/" spacing={3}>
            <Icon as={MdHome} />
            <Text fontWeight="medium">Home</Text>
          </HStack>

          <HStack as={RouterLink} to="/recent" spacing={3}>
            <Icon as={MdAccessTime} />
            <Text fontWeight="medium">Recent</Text>
          </HStack>
        </VStack>

        {/* Storage */}
        <Box mt={8}>
          <HStack spacing={2} mb={2}>
            <Icon as={MdStorage} />
            <Text fontWeight="semibold">Storage</Text>
          </HStack>
          <Text fontSize="sm" color="gray.500" mb={1}>
            {usedStorage} GB of {totalStorage} GB used
          </Text>
          <Progress
            colorScheme="teal"
            size="sm"
            value={usagePercentage}
            borderRadius="sm"
            mb={2}
          />
          <Button size="sm" colorScheme="teal" w="full">
            Get More Storage
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}
