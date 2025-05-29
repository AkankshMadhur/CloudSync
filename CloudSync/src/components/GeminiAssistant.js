import React, { useState } from "react";
import {
  Box,
  IconButton,
  Textarea,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  VStack,
  Spinner,
  Button,
  useColorModeValue,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

export default function GeminiAssistant() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const responseBg = useColorModeValue("gray.100", "gray.700");
  const responseText = useColorModeValue("black", "white");
  const drawerBg = useColorModeValue("white", "gray.800");

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        setResponse(`Error: ${data.error.message}`);
      } else {
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        setResponse(text);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch response.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <IconButton
        icon={<FaRobot />}
        aria-label="Open Gemini"
        position="fixed"
        bottom={6}
        right={6}
        colorScheme="teal"
        size="lg"
        onClick={onOpen}
        zIndex={10}
      />

      {/* Side Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent bg={drawerBg}>
        <DrawerHeader borderBottomWidth="1px">
  <Flex align="center" gap={3}>
    <Box
      bg={useColorModeValue("gray.100", "gray.700")}
      p={2}
      borderRadius="md"
      boxShadow="md"
    >
      <Image
        src="/images/gemini-logo.png" // Make sure this path is correct
        alt="Gemini Logo"
        height="30px" // Adjust as needed
        objectFit="contain"
      />
    </Box>
    <Text fontWeight="bold" fontSize="lg">
      Ask Gemini
    </Text>
  </Flex>
</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Textarea
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSubmit}
                colorScheme="blue"
                rightIcon={<FaPaperPlane />}
                isDisabled={loading}
              >
                Ask
              </Button>
              {loading && <Spinner />}
              {response && (
                <Box
                  p={3}
                  bg={responseBg}
                  borderRadius="md"
                  whiteSpace="pre-wrap"
                  fontSize="sm"
                  color={responseText}
                >
                  {response}
                </Box>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
