import React, { useState } from "react";
import { jsPDF } from "jspdf";
import {
  Box,
  Button,
  Input,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

export default function ImageToPdfUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSelectedImage(null);
    }
  };

  // Generate PDF with selected image
  const generatePdf = () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const doc = new jsPDF();

    // Add image to PDF: 'JPEG' or 'PNG', position (10,10), size (180, auto)
    // Calculate height based on width (keep aspect ratio)
    const imgProps = doc.getImageProperties(selectedImage);
    const pdfWidth = 180;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(selectedImage, "PNG", 10, 10, pdfWidth, pdfHeight);

    doc.save("image.pdf");
  };

  return (
    <VStack spacing={4} align="stretch" maxW="400px" mx="auto" mt={8}>
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedImage && (
        <Box boxSize="300px" border="1px solid" borderColor="gray.300" p={2}>
          <Image
            src={selectedImage}
            alt="Selected"
            boxSize="100%"
            objectFit="contain"
          />
        </Box>
      )}
      <Button colorScheme="blue" onClick={generatePdf}>
        Generate PDF with Image
      </Button>
    </VStack>
  );
}
