// src/components/authentication/UpdateProfile.js
import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";
import { toast } from "react-toastify";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        toast.success("Profile updated successfully!");
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account");
        toast.error("Update failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <CenteredContainer>
      <Box
        p={6}
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="lg"
        shadow="md"
      >
        <Heading size="lg" mb={4} textAlign="center">
          Update Profile
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl id="email" mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              ref={emailRef}
              defaultValue={currentUser.email}
            />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>New Password</FormLabel>
            <Input type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
          </FormControl>
          <FormControl id="password-confirm" mb={4}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
          </FormControl>
          <Button
            colorScheme="blue"
            isFullWidth
            type="submit"
            isLoading={loading}
          >
            Update
          </Button>
        </form>
        <Stack mt={4} textAlign="center">
          <Text>
            <Link to="/">Cancel</Link>
          </Text>
        </Stack>
      </Box>
    </CenteredContainer>
  );
}
