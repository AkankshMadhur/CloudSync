 //src/components/authentication/Profile.js

import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory, Link } from "react-router-dom"
import { storage, database } from "../../firebase" // make sure firebase exports storage & database
import CenteredContainer from "./CenteredContainer"

export default function Profile() {
  const { currentUser, logout, updateProfileName, updateProfilePicture } = useAuth()
  const history = useHistory()
  const toast = useToast()

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState(currentUser.displayName || "")
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL || "")
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef()

  // Handle logout
  async function handleLogout() {
    setError("")
    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  // Upload profile picture
  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setUploading(true)

      // Upload to Firebase Storage under 'profile_pictures/userId'
      const storageRef = storage.ref()
      const fileRef = storageRef.child(`profile_pictures/${currentUser.uid}`)
      await fileRef.put(file)

      // Get URL and update profile
      const photoURL = await fileRef.getDownloadURL()
      await updateProfilePicture(photoURL)
      setPhotoURL(photoURL)

      toast({
        title: "Profile picture updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setUploading(false)
    }
  }

  // Update display name
  async function handleUpdateName() {
    if (!displayName.trim()) {
      toast({
        title: "Display name cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true)
      await updateProfileName(displayName.trim())
      toast({
        title: "Display name updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Failed to update display name",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CenteredContainer>
      <Box
        p={6}
        maxW="400px"
        w="100%"
        borderWidth={1}
        borderRadius="lg"
        bg={useColorModeValue("gray.50", "gray.700")}
        boxShadow="md"
      >
        <Center mb={6} flexDirection="column" gap={4}>
          <Heading size="lg">Profile</Heading>
          {error && (
            <Text color="red.400" fontWeight="bold">
              {error}
            </Text>
          )}
          <Image
            src={photoURL || "https://bit.ly/dan-abramov"}
            alt="Profile Picture"
            boxSize="120px"
            objectFit="cover"
            borderRadius="full"
            border="2px solid"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            cursor="pointer"
            onClick={() => fileInputRef.current.click()}
          />
          <Input
            type="file"
            display="none"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button size="sm" onClick={() => fileInputRef.current.click()} isLoading={uploading}>
            Change Profile Picture
          </Button>
        </Center>

        <Stack spacing={4}>
          <FormControl id="email" isDisabled>
            <FormLabel>Email address</FormLabel>
            <Input value={currentUser.email} isReadOnly />
          </FormControl>

          <FormControl id="displayName">
            <FormLabel>Display Name</FormLabel>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </FormControl>

          <Button
            colorScheme="blue"
            onClick={handleUpdateName}
            isLoading={loading}
            isDisabled={loading}
          >
            Update Display Name
          </Button>

          <Button
            as={Link}
            to="/update-profile"
            colorScheme="teal"
            variant="outline"
            w="100%"
          >
            Update Other Profile Details
          </Button>

          <Button
            colorScheme="red"
            variant="ghost"
            onClick={handleLogout}
            w="100%"
          >
            Log Out
          </Button>
        </Stack>
      </Box>
    </CenteredContainer>
  )
}
