import React, { useState } from "react"
import {
  Button,
  Icon,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { FaFolderPlus } from "react-icons/fa"
import { database } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { ROOT_FOLDER } from "../../hooks/useFolder"

export default function AddFolderButton({ currentFolder }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState("")
  const { currentUser } = useAuth()
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentFolder || name.trim() === "") return

    const path = [...currentFolder.path]
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id })
    }

    database.folders.add({
      name: name.trim(),
      parentId: currentFolder.id,
      userId: currentUser.uid,
      path: path,
      createdAt: database.getCurrentTimestamp(),
    })

    toast({
      title: "Folder created",
      description: `"${name.trim()}" has been added successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })

    setName("")
    onClose()
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={FaFolderPlus} />}
        colorScheme="teal"
        variant="solid"
        size="md"
        onClick={onOpen}
        _hover={{ bg: "teal.600" }}
        boxShadow="md"
      >
        Add Folder
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Folder</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Folder Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" colorScheme="teal">
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
