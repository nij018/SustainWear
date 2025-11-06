import { useState } from "react";
import {
  Box,
  Text,
  Link,
  Button,
  Input,
  VStack,
  Heading,
  Center,
} from "@chakra-ui/react";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => { // submit register form
    try {
      const res = await api.post("/register", form);
      toast.success(res.data.message);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.errMessage || "Something went wrong");
    }
  };

  return (
    <Center minH="100vh" bg="brand.beige">
      <Box bg="brand.green" p={10} rounded="md" color="white" w="sm">
        <Heading size="lg" textAlign="center" mb={6}>
          Create Your Account
        </Heading>
        <VStack spacing={4}>
          <Input
            placeholder="First Name"
            _placeholder={{ color: "gray.400" }}
            name="first_name"
            onChange={handleChange}
            bg="white"
            color="black"
          />
          <Input
            placeholder="Last Name"
            _placeholder={{ color: "gray.400" }}
            name="last_name"
            onChange={handleChange}
            bg="white"
            color="black"
          />
          <Input
            placeholder="Email"
            _placeholder={{ color: "gray.400" }}
            name="email"
            onChange={handleChange}
            bg="white"
            color="black"
          />
          <Input
            placeholder="Password"
            _placeholder={{ color: "gray.400" }}
            name="password"
            type="password"
            onChange={handleChange}
            bg="white"
            color="black"
          />
          <Input
            placeholder="Confirm Password"
            _placeholder={{ color: "gray.400" }}
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            bg="white"
            color="black"
          />
          <Button bg="white" color="brand.green" onClick={handleSubmit}>
            Register
          </Button>

          <Box>
            <Text opacity="80%">Already a user? <Link as={RouterLink} to="/login" textDecor="underline">Login</Link></Text>
          </Box>
        </VStack>
      </Box>
    </Center>
  );
}