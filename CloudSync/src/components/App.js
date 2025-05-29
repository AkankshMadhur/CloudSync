// src/App.js

import React, { useState, useEffect } from "react"
import Signup from "./authentication/Signup"
import { database } from "../firebase" // ✅ Correct import
import { useAuth, AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Profile from "./authentication/Profile"
import Login from "./authentication/Login"
import PrivateRoute from "./authentication/PrivateRoute"
import ForgotPassword from "./authentication/ForgotPassword"
import UpdateProfile from "./authentication/UpdateProfile"
import Dashboard from "./google-drive/Dashboard"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ChakraProvider, Flex, Box } from "@chakra-ui/react"
import Sidebar from "./Sidebar"
import Navbar from "./google-drive/Navbar"
import PdfSummarizer from "../components/PdfSummarizer"
import ImageToPdf from "../components/ImageToPdf"
import StorageView from "./google-drive/StorageView"

import "./App.css"

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [usedStorage, setUsedStorage] = useState(0)
  const totalStorage = 5 // GB quota

  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return

    const unsubscribe = database.files
      .where("userId", "==", currentUser.uid)
      .onSnapshot(snapshot => {
        const totalBytes = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data()
          return acc + (data.size || 0)
        }, 0)

        const totalGB = totalBytes / (1024 ** 3)
        setUsedStorage(parseFloat(totalGB.toFixed(2)))
      })

    return unsubscribe
  }, [currentUser])

  return (
    <Flex>
      <Sidebar usedStorage={usedStorage} totalStorage={totalStorage} />
      <Box ml="250px" w="100%">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Switch>
          <PrivateRoute
            exact
            path="/"
            render={(props) => (
              <Dashboard {...props} searchQuery={searchQuery} />
            )}
          />

          <PrivateRoute
            path="/storage"
            render={() => (
              <StorageView
                usedStorage={usedStorage}
                totalStorage={totalStorage}
              />
            )}
          />

          <PrivateRoute
            exact
            path="/folder/:folderId"
            render={(props) => (
              <Dashboard {...props} searchQuery={searchQuery} />
            )}
          />
          <PrivateRoute path="/user" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <PrivateRoute path="/summarize" component={PdfSummarizer} />
          <PrivateRoute path="/image-to-pdf" component={ImageToPdf} />
        </Switch>
      </Box>
    </Flex>
  )
}

function App() {
  return (
    <ChakraProvider>
      <div className="app-background">
        <Router>
          <AuthProvider>
            <Switch>
              {/* Public routes (no sidebar or navbar) */}
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />

              {/* Private layout with sidebar + navbar */}
              <Route path="/" component={AppContent} />
            </Switch>

            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </Router>
      </div>
    </ChakraProvider>
  )
}

export default App