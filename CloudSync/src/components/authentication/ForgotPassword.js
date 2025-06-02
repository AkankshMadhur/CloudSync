// src/components/authentication/ForgotPassword.js

import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Text,
  VStack,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions.");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="400px" p={6}>
        <Heading
          as="h1"
          textAlign="center"
          mb={6}
          fontSize="2.5rem"
          fontWeight="bold"
          color="teal.500"
        >
          CloudSync
        </Heading>

        <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <Heading size="md" textAlign="center">Password Reset</Heading>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {message && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                {message}
              </Alert>
            )}

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" ref={emailRef} />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={loading}
            >
              Reset Password
            </Button>
          </VStack>

          <Box textAlign="center" mt={4}>
            <ChakraLink as={Link} to="/login" color="teal.500">
              Login
            </ChakraLink>
          </Box>
        </Box>

        <Text textAlign="center" mt={4}>
          Need an account?{" "}
          <ChakraLink as={Link} to="/signup" color="teal.500">
            Sign Up
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
}