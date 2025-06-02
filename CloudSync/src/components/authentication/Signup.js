// src/components/authentication/Signup.js

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

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (passwordRef.current.value.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      toast.success("Account created successfully!");
      history.push("/");
    } catch (err) {
      setError("Failed to create an account");
      toast.error("Signup failed. Try again.");
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
              Sign Up
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

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" ref={passwordConfirmRef} />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              w="100%"
              isLoading={loading}
              mt={2}
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text>
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="teal.500">
            Log In
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
}
