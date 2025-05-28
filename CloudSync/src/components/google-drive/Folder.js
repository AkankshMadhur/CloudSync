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
  useColorModeValue,
} from "@chakra-ui/react"
import { FaFolder, FaEllipsisV, FaTrash } from "react-icons/fa"
import { DeleteFolder } from "./DeleteFolder"

export default function Folder({ folder }) {
  const toast = useToast()

  // Colors switch based on color mode
  const bg = useColorModeValue("gray.50", "gray.700")
  const hoverBg = useColorModeValue("gray.100", "gray.600")
  const folderIconColor = useColorModeValue("#3182CE", "#63B3ED") // lighter blue for dark mode

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
      bg={bg}
      boxShadow="md"
      _hover={{ bg: hoverBg }}
    >
      <Link
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
      >
        <Flex align="center" gap="2">
          <FaFolder color={folderIconColor} />
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
