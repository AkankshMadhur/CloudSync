// src/components/google-drive/BillingPage.js

import React, { useState } from "react"
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import { FaCrown, FaStar, FaGem } from "react-icons/fa"
import { useAuth } from "../../contexts/AuthContext"
import { database } from "../../firebase"

const plans = [
  {
    name: "Free",
    value: "free",
    storage: "5 GB",
    price: "₹0/month",
    icon: FaStar,
    color: "gray.200",
    benefits: ["Basic storage", "Limited support","No cost"],
  },
  {
    name: "Pro",
    value: "pro",
    storage: "30 GB",
    price: "₹50/month",
    icon: FaCrown,
    color: "blue.200",
    benefits: ["More storage", "Priority support", "No ads"],
  },
  {
    name: "Premium",
    value: "premium",
    storage: "100 GB",
    price: "₹100/month",
    icon: FaGem,
    color: "purple.200",
    benefits: ["Massive storage", "Premium support", "Advanced features"],
  },
]

export default function BillingPage() {
  const { currentUser } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const toast = useToast()

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan.value)

    try {
      await database.users.doc(currentUser.uid).update({
        plan: plan.value,
        storageLimit:
          plan.value === "pro" ? 30 : plan.value === "premium" ? 100 : 5,
      })

      toast({
        title: `Plan updated to ${plan.name}`,
        description: "Mock billing successful. Storage limit updated.",
        status: "success",
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error updating plan:", error)
      toast({
        title: "Update failed",
        description: "Could not update your billing plan.",
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const cardBg = useColorModeValue("white", "gray.800")
  const cardHover = useColorModeValue("teal.50", "teal.900")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Box p={8}>
      <Heading mb={6} textAlign="center">
        Choose a Storage Plan
      </Heading>

      <SimpleGrid columns={[1, null, 3]} spacing={8}>
        {plans.map((plan) => (
          <Box
            key={plan.value}
            borderWidth="2px"
            borderColor={
              selectedPlan === plan.value ? "teal.400" : borderColor
            }
            borderRadius="xl"
            p={6}
            bg={cardBg}
            _hover={{ bg: cardHover, transform: "scale(1.03)" }}
            transition="all 0.2s"
            boxShadow="md"
            cursor="pointer"
            onClick={() => handleSelectPlan(plan)}
          >
            <VStack spacing={4}>
              <Icon as={plan.icon} boxSize={10} color="teal.400" />
              <Text fontSize="2xl" fontWeight="bold">
                {plan.name}
              </Text>
              <Text fontSize="lg" color="gray.500">
                {plan.storage}
              </Text>
              <Text fontSize="md" fontWeight="medium">
                {plan.price}
              </Text>

              <VStack spacing={1} fontSize="sm" align="start" pt={2}>
                {plan.benefits.map((benefit, idx) => (
                  <Text key={idx}>• {benefit}</Text>
                ))}
              </VStack>

              <Button
                colorScheme="teal"
                width="100%"
                variant={selectedPlan === plan.value ? "solid" : "outline"}
              >
                {selectedPlan === plan.value ? "Selected" : "Select"}
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}
