import React, { useState } from "react"
import {
  Box,
  Button,
  Flex,
  HStack,
  VStack,
  Select,
  Divider,
  Container as ChakraContainer,
} from "@chakra-ui/react"
import { useParams, useLocation } from "react-router-dom"

import { useFolder } from "../../hooks/useFolder"
import AddFolderButton from "./AddFolderButton"
import AddFileButton from "./AddFileButton"
import Folder from "./Folder"
import File from "./File"
import Navbar from "./Navbar"
import FolderBreadcrumbs from "./FolderBreadcrumbs"

const SORT_OPTIONS = {
  NAME_ASC: {
    label: "Name (A–Z)",
    compare: (a, b) => a.name.localeCompare(b.name),
  },
  NAME_DESC: {
    label: "Name (Z–A)",
    compare: (a, b) => b.name.localeCompare(a.name),
  },
  DATE_NEWEST: {
    label: "Date (Newest)",
    compare: (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
  },
  DATE_OLDEST: {
    label: "Date (Oldest)",
    compare: (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0),
  },
  SIZE_LARGE: {
    label: "Size (Largest)",
    compare: (a, b) => (b.size || 0) - (a.size || 0),
  },
  SIZE_SMALL: {
    label: "Size (Smallest)",
    compare: (a, b) => (a.size || 0) - (b.size || 0),
  },
}

export default function Dashboard() {
  const { folderId } = useParams()
  const { state = {} } = useLocation()
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)
  const [sortOption, setSortOption] = useState("NAME_ASC")

  const sortedFiles = [...childFiles].sort(
    SORT_OPTIONS[sortOption]?.compare || (() => 0)
  )

  return (
    <>
      <Navbar />
      <ChakraContainer maxW="container.xl" py={4}>
        {/* Header: Breadcrumbs and Buttons + Sort */}
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          mb={6}
          gap={4}
        >
          {/* Left Side */}
          <HStack spacing={4} flexWrap="wrap">
            <FolderBreadcrumbs currentFolder={folder} />
            <AddFileButton currentFolder={folder} />
            <AddFolderButton currentFolder={folder} />
          </HStack>

          {/* Right Side */}
          <Select
            size="sm"
            maxW="200px"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            placeholder="Sort"
          >
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </Select>
        </Flex>

        {/* Folders */}
        {childFolders.length > 0 && (
          <Flex wrap="wrap" gap={4} mb={4}>
            {childFolders.map((childFolder) => (
              <Box key={childFolder.id} maxW="250px">
                <Folder folder={childFolder} />
              </Box>
            ))}
          </Flex>
        )}

        {childFolders.length > 0 && childFiles.length > 0 && <Divider my={4} />}

        {/* Files */}
        {sortedFiles.length > 0 && (
          <Flex wrap="wrap" gap={4}>
            {sortedFiles.map((childFile) => (
              <Box key={childFile.id} maxW="250px">
                <File file={childFile} />
              </Box>
            ))}
          </Flex>
        )}
      </ChakraContainer>
    </>
  )
}
