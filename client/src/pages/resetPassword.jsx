import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";

export default function ResetPassword() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // verify token on load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/verifyResetToken/${token}`);
        if (res.data.valid) setValidToken(true);
      } catch {
        toast.error("Invalid or expired password reset link");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  // handle password change
  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("All fields are required");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters long");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setIsSubmitting(true);
    try {
      await api.post("/resetPassword", { token, newPassword, confirmPassword });
      setSuccess(true);
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.errMessage || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) // chakraUI's loading spinner
    return (
      <Center minH="100vh" bg="brand.beige">
        <Spinner size="xl" color="brand.green" />
      </Center>
    );

  if (!validToken) // show when token invalid
    return (
      <Center minH="100vh" bg="brand.beige">
        <Box
          bg="white"
          p={8}
          rounded="lg"
          shadow="md"
          textAlign="center"
          color="brand.green"
        >
          <Heading size="md" mb={3}>
            Invalid or Expired Link
          </Heading>
          <Text>Please request a new password reset link.</Text>
        </Box>
      </Center>
    );

  if (success) // show on success with valid token
    return (
      <Center minH="100vh" bg="brand.beige">
        <Box
          bg="white"
          p={10}
          rounded="lg"
          shadow="lg"
          textAlign="center"
          color="brand.green"
        >
          <Heading size="md" mb={3}>
            Password Changed Successfully
          </Heading>
          <Text>You can now close this page or return to the login screen.</Text>
        </Box>
      </Center>
    );

  return (
    <Center minH="100vh" bg="brand.beige">
      <Box
        bg="brand.green"
        p={10}
        rounded="lg"
        color="white"
        w={["90%", "28rem"]}
        shadow="xl"
      >
        <VStack spacing={5}>
          <Heading size="lg">Reset Password</Heading>
          <Text fontSize="md" textAlign="center">
            Enter your new password below.
          </Text>
          <Input
            type="password"
            placeholder="New Password"
            _placeholder={{ color: "gray.400" }}
            bg="white"
            color="black"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            _placeholder={{ color: "gray.400" }}
            bg="white"
            color="black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            bg="white"
            color="brand.green"
            w="50%"
            _hover={{ bg: "brand.beige" }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}