// src/components/PdfSummarizer.js

import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  Spinner,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfSummarizer() {
  const [pdfText, setPdfText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const extractTextFromPdf = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map((item) => item.str).join(" ");
            fullText += text + "\n";
          }

          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a valid PDF.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
    } catch (error) {
      toast({
        title: "Error reading PDF",
        description: error.message || "Unable to extract text from PDF.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const summarizeText = async () => {
    if (!pdfText) return;
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Summarize the following document:\n\n${pdfText.slice(0, 25000)}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const summaryText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary found.";
      setSummary(summaryText);
    } catch (error) {
      toast({
        title: "Summarization error",
        description: error.message || "Failed to summarize document.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={4} align="stretch">
        <Input type="file" accept=".pdf" onChange={handleFileUpload} />
        {pdfText && (
          <Button
            colorScheme="teal"
            onClick={summarizeText}
            isDisabled={loading}
          >
            Summarize PDF
          </Button>
        )}
        {loading && <Spinner />}
        {summary && (
          <Box
            p={4}
            bg={bgColor}
            color={textColor}
            borderRadius="md"
            whiteSpace="pre-wrap"
          >
            <Text fontWeight="bold">Summary:</Text>
            <Text mt={2}>{summary}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
