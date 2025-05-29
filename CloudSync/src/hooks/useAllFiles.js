import { useEffect, useState } from "react"
import { database } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

export default function useAllFiles() {
  const { currentUser } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    return database.files
      .where("userId", "==", currentUser.uid)
      .onSnapshot(snapshot => {
        const userFiles = snapshot.docs.map(database.formatDoc)
        setFiles(userFiles)
        setLoading(false)
      })
  }, [currentUser])

  return { files, loading }
}