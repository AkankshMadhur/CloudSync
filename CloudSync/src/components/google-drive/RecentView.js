//RecentView.js


import React, { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { database } from "../../firebase"
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react"
import File from "./File"

export default function RecentView() {
  const { currentUser } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = database.files
      .where("userId", "==", currentUser.uid)
      .orderBy("createdAt", "desc") 
      .limit(50)
      .onSnapshot(snapshot => {
        setFiles(snapshot.docs.map(database.formatDoc))
        setLoading(false)
      })

    return unsubscribe
  }, [currentUser])

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>
        Recent Files
      </Heading>
      {loading ? (
        <Spinner />
      ) : (
        <VStack spacing={4} align="stretch">
          {files.length === 0 ? (
            <Text>No recent files found.</Text>
          ) : (
            files.map(file => <File key={file.id} file={file} />)
          )}
        </VStack>
      )}
    </Box>
  )
}