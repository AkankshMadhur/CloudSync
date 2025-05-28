import React from "react"
import { Link } from "react-router-dom"
import {
  Box,
  IconButton,
  Text,
  Flex,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import { FaFolder, FaEllipsisV, FaTrash } from "react-icons/fa"
import { DeleteFolder } from "./DeleteFolder"

export default function Folder({ folder }) {
  const toast = useToast()

  const handleDelete = async () => {
    if (window.confirm(`Delete folder "${folder.name}" and all its contents?`)) {
      try {
        await DeleteFolder(folder)
        toast({
          title: "Folder deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (err) {
        toast({
          title: "Failed to delete folder.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        console.error(err)
      }
    }
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      borderWidth="1px"
      borderRadius="md"
      p={3}
      bg="gray.50"
      boxShadow="md"
      _hover={{ bg: "gray.100" }}
    >
      <Link
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
      >
        <Flex align="center" gap="2">
          <FaFolder color="#3182CE" />
          <Text fontWeight="medium" isTruncated>
            {folder.name}
          </Text>
        </Flex>
      </Link>

      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FaEllipsisV />}
          variant="ghost"
          size="sm"
        />
        <MenuList>
          <MenuItem icon={<FaTrash />} onClick={handleDelete} color="red.500">
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
