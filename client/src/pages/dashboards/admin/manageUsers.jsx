import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Badge,
  Spinner,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { // fetch users
    api.get("/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { // search filter
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.first_name.toLowerCase().includes(term) ||
          u.last_name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, users]);

  // update user data
  const handleUpdate = async (user_id, role, is_active) => {
    try {
      await api.put("/users", { user_id, role, is_active });
      toast.success("User updated successfully");
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user_id ? { ...u, role, is_active } : u
        )
      );
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  if (loading) return <Spinner size="xl" />; // chakraUI loading spinner on update

  return (
    <Box p={6} bg="white" rounded="lg" boxShadow="md">
      <Heading size="md" mb={4}>
        Manage Users
      </Heading>

      <Input
        placeholder="Search by name or email..."
        _placeholder={{ color: "gray.400" }}
        mb={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        bg="gray.50"
        borderColor="gray.300"
      />

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody color="grey">
          {filteredUsers.length === 0 ? (
            <Tr>
              <Td colSpan={6} textAlign="center" color="gray.500">
                No users found
              </Td>
            </Tr>
          ) : (
            filteredUsers.map((user) => (
              <Tr key={user.user_id}>
                <Td>{user.first_name}</Td>
                <Td>{user.last_name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Select
                    value={user.role}
                    onChange={(e) =>
                      handleUpdate(user.user_id, e.target.value, user.is_active)
                    }
                  >
                    <option value="Donor">Donor</option>
                    <option value="Admin">Admin</option>
                  </Select>
                </Td>
                <Td>
                  <Badge colorScheme={user.is_active ? "green" : "red"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <HStack>
                    <Button
                      size="sm"
                      colorScheme={user.is_active ? "red" : "green"}
                      onClick={() =>
                        handleUpdate(user.user_id, user.role, !user.is_active)
                      }
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}