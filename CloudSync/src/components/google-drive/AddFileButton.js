import React, { useState } from "react"
import {
  useToast,
  Button,
  Icon,
  Box,
  Progress,
  CloseButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { FaFileUpload } from "react-icons/fa"
import { useAuth } from "../../contexts/AuthContext"
import { storage, database } from "../../firebase"
import { ROOT_FOLDER } from "../../hooks/useFolder"
import { v4 as uuidV4 } from "uuid"

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([])
  const { currentUser } = useAuth()
  const toast = useToast()

  // Color mode aware background and text color for the upload notification box
  const bg = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("black", "white")

  function handleUpload(e) {
    const file = e.target.files[0]
    if (currentFolder == null || file == null) return

    const id = uuidV4()
    setUploadingFiles((prev) => [
      ...prev,
      { id, name: file.name, progress: 0, error: false },
    ])

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`

    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes
        setUploadingFiles((prev) =>
          prev.map((uploadFile) =>
            uploadFile.id === id ? { ...uploadFile, progress } : uploadFile
          )
        )
      },
      () => {
        setUploadingFiles((prev) =>
          prev.map((uploadFile) =>
            uploadFile.id === id ? { ...uploadFile, error: true } : uploadFile
          )
        )
        toast({
          title: "Upload failed",
          description: file.name,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      },
      () => {
        setUploadingFiles((prev) =>
          prev.filter((uploadFile) => uploadFile.id !== id)
        )

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then((existingFiles) => {
              const existingFile = existingFiles.docs[0]
              if (existingFile) {
                existingFile.ref.update({
                  url,
                  size: file.size,
                  type: file.type,
                })
              } else {
                database.files.add({
                  url,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  createdAt: database.getCurrentTimestamp(),
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
                })
              }

              toast({
                title: "Upload complete",
                description: file.name,
                status: "success",
                duration: 3000,
                isClosable: true,
              })
            })
        })
      }
    )
  }

  return (
    <>
      <label>
        <input
          type="file"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        <Button
          as="span"
          leftIcon={<Icon as={FaFileUpload} />}
          colorScheme="teal"
          variant="solid"
          size="md"
          cursor="pointer"
          boxShadow="md"
          _hover={{ bg: "teal.600" }}
        >
          Add File
        </Button>
      </label>

      <Box position="fixed" bottom="1rem" right="1rem" maxW="300px" zIndex={9999}>
        {uploadingFiles.map((file) => (
          <Box
            key={file.id}
            bg={bg}
            borderWidth="1px"
            borderRadius="md"
            p={3}
            mb={3}
            boxShadow="lg"
            color={textColor}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" isTruncated maxW="220px">
                {file.name}
              </Text>
              {!file.error && (
                <CloseButton
                  size="sm"
                  onClick={() =>
                    setUploadingFiles((prev) =>
                      prev.filter((uploadFile) => uploadFile.id !== file.id)
                    )
                  }
                />
              )}
            </Box>
            <Progress
              mt={2}
              hasStripe
              isAnimated={!file.error}
              value={file.error ? 100 : file.progress * 100}
              colorScheme={file.error ? "red" : "teal"}
              size="sm"
            />
          </Box>
        ))}
      </Box>
    </>
  )
}
