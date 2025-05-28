// src/App.js
import React from "react"
import Signup from "./authentication/Signup"
import { AuthProvider } from "../contexts/AuthContext"
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

import "./App.css"

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

              {/* Private routes (with sidebar + navbar layout) */}
              <Route path="/">
                <Flex>
                  <Sidebar usedStorage={5} totalStorage={15} />
                  <Box ml="250px" w="100%">
                    <Navbar />
                    <Switch>
                      <PrivateRoute exact path="/" component={Dashboard} />
                      <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />
                      <PrivateRoute path="/user" component={Profile} />
                      <PrivateRoute path="/update-profile" component={UpdateProfile} />
                    </Switch>
                  </Box>
                </Flex>
              </Route>
            </Switch>

            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </Router>
      </div>
    </ChakraProvider>
  )
}

export default App
