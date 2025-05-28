import React from "react"
import {
  Box,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Link,
  IconButton,
  useToast,
} from "@chakra-ui/react"
import { FaFile, FaEllipsisV } from "react-icons/fa"
import { DeleteFile } from "./DeleteFile"

export default function File({ file }) {
  const toast = useToast()

  const handleDelete = async () => {
    if (window.confirm(`Delete "${file.name}"?`)) {
      try {
        await DeleteFile(file)
        toast({
          title: "File deleted!",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: "Failed to delete.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        console.error(error)
      }
    }
  }

  const handleProperties = () => {
    toast({
      title: "File Info",
      description: `Name: ${file.name}
Created: ${file.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
Size: ${formatSize(file.size)}`,
      status: "info",
      duration: 5000,
      isClosable: true,
    })
  }

  const formatSize = (bytes) => {
    if (!bytes) return "Unknown size"
    const kb = bytes / 1024
    return kb > 1024 ? (kb / 1024).toFixed(2) + " MB" : kb.toFixed(2) + " KB"
  }

  const isImage = file.type && file.type.startsWith("image/")

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="gray.50"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      p={3}
      shadow="sm"
      maxW="500px"
      mb={3}
    >
      <Flex align="center" gap={2} overflow="hidden">
        {isImage ? (
          <Image
            src={file.url}
            alt={file.name}
            boxSize="40px"
            objectFit="cover"
            borderRadius="md"
          />
        ) : (
          <Icon as={FaFile} boxSize={5} color="gray.500" />
        )}
        <Link
          href={file.url}
          isExternal
          color="blue.700"
          fontWeight="medium"
          textDecoration="none"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          maxW="200px"
        >
          {file.name}
        </Link>
      </Flex>

      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FaEllipsisV />}
          variant="ghost"
          size="sm"
        />
        <MenuList>
          <MenuItem onClick={handleProperties}>View Properties</MenuItem>
          <MenuItem onClick={handleDelete} color="red.500">
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
