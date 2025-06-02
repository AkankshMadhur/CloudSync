// src/components/authentication/Login.js

import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      toast.success("Logged in successfully!");
      history.push("/");
    } catch {
      setError("Failed to log in");
      toast.error("Login failed. Please check your credentials.");
    }
    setLoading(false);
  }

  return (
    <Container maxW="md" centerContent py={12}>
      <VStack spacing={6} w="100%">
        <Heading
          size="2xl"
          fontWeight="bold"
          color="#319795"
          letterSpacing="1px"
          textAlign="center"
        >
          CloudSync
        </Heading>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg={useColorModeValue("white", "gray.800")}
          p={8}
          rounded="lg"
          boxShadow="lg"
          w="100%"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md" textAlign="center">
              Log In
            </Heading>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" ref={emailRef} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" ref={passwordRef} />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              w="100%"
              isLoading={loading}
              mt={2}
            >
              Log In
            </Button>

            <Text textAlign="center" mt={2}>
              <ChakraLink as={Link} to="/forgot-password" color="teal.500">
                Forgot Password?
              </ChakraLink>
            </Text>
          </VStack>
        </Box>

        <Text>
          Need an account?{" "}
          <ChakraLink as={Link} to="/signup" color="teal.500">
            Sign Up
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
}
