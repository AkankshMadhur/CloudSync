import React from "react"
import { FaFile, FaEllipsisV, FaFilePdf, FaFileVideo } from "react-icons/fa"
import {
  Box,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
  IconButton,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import { DeleteFile } from "./DeleteFile"
import { database } from "../../firebase"

export default function File({ file }) {
  const toast = useToast()

  // Icon color adapts to light/dark mode
  const fileIconColor = useColorModeValue("gray.500", "gray.300")

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

  // File type checks
  const isImage = file.type && file.type.startsWith("image/")
  const isPdf = file.type === "application/pdf"
  const isVideo = file.type && file.type.startsWith("video/")

  const handleRename = async () => {
    const newName = window.prompt("Enter new file name:", file.name)
    if (!newName || newName.trim() === "" || newName === file.name) {
      return // no change or empty input
    }
    try {
      await database.files.doc(file.id).update({ name: newName.trim() })
      toast({
        title: "File renamed",
        description: `Renamed to "${newName.trim()}"`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Failed to rename file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      console.error(error)
    }
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      bg={useColorModeValue("gray.50", "gray.700")}
      border="1px"
      borderColor={useColorModeValue("gray.200", "gray.600")}
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
        ) : isPdf ? (
          <Icon as={FaFilePdf} boxSize={6} color={fileIconColor} />
        ) : isVideo ? (
          <Icon as={FaFileVideo} boxSize={6} color={fileIconColor} />
        ) : (
          <Icon as={FaFile} boxSize={5} color={fileIconColor} />
        )}

        <Link
          href={file.url}
          isExternal
          color={useColorModeValue("blue.700", "blue.300")}
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
          <MenuItem onClick={handleRename}>Rename</MenuItem>
          <MenuItem onClick={handleProperties}>View Properties</MenuItem>
          <MenuItem onClick={handleDelete} color="red.500">
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
