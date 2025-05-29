import React, { useState } from "react"
import  {QRCodeSVG} from "qrcode.react"
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
  Text,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react"
import {
  FaFile,
  FaEllipsisV,
  FaFilePdf,
  FaFileVideo,
  FaShareAlt,
} from "react-icons/fa"
import { DeleteFile } from "./DeleteFile"
import { database } from "../../firebase"

export default function File({ file, view = "list" }) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fileIconColor = useColorModeValue("gray.500", "gray.300")
  const bgColor = useColorModeValue("gray.50", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const linkColor = useColorModeValue("blue.700", "blue.300")

  const isImage = file.type?.startsWith("image/")
  const isPdf = file.type === "application/pdf"
  const isVideo = file.type?.startsWith("video/")

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

  const handleRename = async () => {
    const newName = window.prompt("Enter new file name:", file.name)
    if (!newName || newName.trim() === "" || newName === file.name) return
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

  const handleShareModal = () => {
    onOpen()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(file.url)
      toast({
        title: "Link copied!",
        description: "File link copied to clipboard.",
        status: "info",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return "Unknown size"
    const kb = bytes / 1024
    return kb > 1024 ? (kb / 1024).toFixed(2) + " MB" : kb.toFixed(2) + " KB"
  }

  const formatDate = (timestamp) => {
    return timestamp?.toDate?.().toLocaleDateString?.() || "N/A"
  }

  const MenuOptions = () => (
    <MenuList>
      <MenuItem onClick={handleRename}>Rename</MenuItem>
      <MenuItem onClick={handleProperties}>View Properties</MenuItem>
      <MenuItem onClick={handleShareModal} icon={<FaShareAlt />}>
        Share
      </MenuItem>
      <MenuItem onClick={handleDelete} color="red.500">
        Delete
      </MenuItem>
    </MenuList>
  )

  const ShareModal = () => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={1}>Public Link</Text>
          <Input value={file.url} isReadOnly mb={3} />
  
          <Button colorScheme="teal" size="sm" onClick={handleCopyLink} mb={4}>
            Copy Link
          </Button>
  
          <Text fontWeight="bold" mb={2}>QR Code</Text>
          <Flex justify="center">
            <QRCodeSVG value={file.url} size={128} />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )

  if (view === "grid") {
    return (
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        shadow="sm"
        w="220px"
        overflow="hidden"
      >
        <Flex align="center" px={2} py={1} justify="space-between" gap={2}>
          <Icon
            as={
              isPdf ? FaFilePdf : isVideo ? FaFileVideo : isImage ? FaFile : FaFile
            }
            boxSize={5}
            color={fileIconColor}
          />
          <Text
            flex="1"
            fontSize="sm"
            fontWeight="medium"
            color={linkColor}
            noOfLines={1}
            textAlign="center"
          >
            {file.name}
          </Text>
          <Menu>
            <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="ghost" size="sm" />
            {MenuOptions()}
          </Menu>
        </Flex>

        <Box
          h="140px"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <Link href={file.url} isExternal>
            {isImage ? (
              <Image src={file.url} alt={file.name} objectFit="cover" h="100%" w="100%" />
            ) : isVideo ? (
              <video
                src={file.url}
                muted
                autoPlay
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : isPdf ? (
              <embed
                src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Icon as={FaFile} boxSize={10} color={fileIconColor} />
            )}
          </Link>
        </Box>

        <ShareModal />
      </Box>
    )
  }

  return (
    <Flex
      align="center"
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      px={3}
      py={2}
      shadow="sm"
      width="100%"
      minW="0"
      mb={2}
    >
      <Flex align="center" flex="2" gap={2} minW={0}>
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
          color={linkColor}
          fontWeight="medium"
          textDecoration="none"
          noOfLines={1}
          minW={0}
          flex="1"
        >
          {file.name}
        </Link>
      </Flex>

      <Text flex="1" fontSize="sm" color="gray.500" isTruncated>
        {formatDate(file.createdAt)}
      </Text>
      <Text flex="1" fontSize="sm" color="gray.500" isTruncated>
        {formatSize(file.size)}
      </Text>

      <Box>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaEllipsisV />}
            variant="ghost"
            size="sm"
          />
          {MenuOptions()}
        </Menu>
      </Box>

      <ShareModal />
    </Flex>
  )
}
