//StorageView.js

import React from "react"
import {
  Box,
  Text,
  Progress,
  VStack,
  Divider,
  Spinner,
} from "@chakra-ui/react"
import useAllFiles from "../../hooks/useAllFiles"
import File from "./File"

export default function StorageView() {
  const { files, loading } = useAllFiles()

  const totalUsed = files.reduce((sum, file) => sum + (file.size || 0), 0)
  const usedGB = (totalUsed / (1024 ** 3)).toFixed(2)
  const totalGB = 5
  const usagePercent = (usedGB / totalGB) * 100

  const sortedFiles = [...files].sort((a, b) => (b.size || 0) - (a.size || 0))

  return (
    <VStack align="start" spacing={6} p={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          Storage Usage
        </Text>
        <Text fontSize="sm" mt={1}>
          {usedGB} GB of {totalGB} GB used
        </Text>
        <Progress
          value={usagePercent}
          size="md"
          colorScheme="teal"
          borderRadius="md"
          mt={2}
        />
      </Box>

      <Divider />

      <Box w="100%">
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Files (sorted by size)
        </Text>
        {loading ? (
          <Spinner />
        ) : sortedFiles.length > 0 ? (
          <VStack spacing={3} align="stretch">
            {sortedFiles.map(file => (
              <File key={file.id} file={file} view="list" />
            ))}
          </VStack>
        ) : (
          <Text>No files found.</Text>
        )}
      </Box>
    </VStack>
  )
}