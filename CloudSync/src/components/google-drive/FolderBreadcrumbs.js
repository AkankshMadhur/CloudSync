import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Text,
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { ROOT_FOLDER } from "../../hooks/useFolder"

export default function FolderBreadcrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]
  if (currentFolder) path = [...path, ...currentFolder.path]

  const bg = useColorModeValue("gray.100", "gray.700")
  const color = useColorModeValue("gray.800", "whiteAlpha.900")

  return (
    <Breadcrumb
      spacing="8px"
      separator="/"
      flex="1"
      bg={bg}
      px={2}
      py={1}
      borderRadius="md"
    >
      {path.map((folder, index) => (
        <BreadcrumbItem key={folder.id} maxW="150px" isTruncated>
          <BreadcrumbLink
            as={Link}
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : "/",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            }}
            color={color}
            _hover={{ textDecoration: "underline" }}
          >
            {folder.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}

      {currentFolder && (
        <BreadcrumbItem isCurrentPage maxW="200px" isTruncated>
          <Text fontWeight="medium" color={color} isTruncated>
            {currentFolder.name}
          </Text>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  )
}
