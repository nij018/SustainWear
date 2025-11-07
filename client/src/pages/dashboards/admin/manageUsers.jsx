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
  Badge,
  Spinner,
  Heading,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(""); // "deactivate" or "promote"
  const confirmModal = useDisclosure();

  // fetch users
  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  // search filter
  useEffect(() => {
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
      await api.put("/admin/users", { user_id, role, is_active });
      toast.success("User updated successfully");
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user_id ? { ...u, role, is_active } : u
        )
      );
    } catch {
      toast.error("Failed to update user");
    }
  };

  // open modal for confirmation
  const openModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    confirmModal.onOpen();
  };

  // confirm action
  const handleConfirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "deactivate") {
      handleUpdate(selectedUser.user_id, selectedUser.role, false);
    } else if (actionType === "promote") {
      handleUpdate(selectedUser.user_id, "Admin", selectedUser.is_active);
    }

    confirmModal.onClose();
    setSelectedUser(null);
  };

  if (loading) return <Spinner size="xl" />;

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
            <Th>Full Name</Th>
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
                <Td>{user.first_name} {user.last_name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge
                    colorScheme={user.role === "Admin" ? "blue" : "gray"}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={user.is_active ? "green" : "red"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {user.role !== "Admin" ? (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => openModal(user, "promote")}
                      >
                        Promote to Admin
                      </Button>
                    ) : (
                      <Badge colorScheme="gray">Already Admin</Badge>
                    )}

                    <Button
                      size="sm"
                      colorScheme={user.is_active ? "red" : "green"}
                      onClick={() =>
                        user.is_active
                          ? openModal(user, "deactivate")
                          : handleUpdate(user.user_id, user.role, true)
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

      <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.onClose} isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.4)" />
        <ModalContent borderRadius="lg" p={4}>
          <ModalHeader textAlign="center">
            {actionType === "promote" ? "Confirm Promotion" : "Confirm Deactivation"}
          </ModalHeader>
          <ModalBody textAlign="center">
            <Text mb={2}>
              {actionType === "promote"
                ? "Are you sure you want to promote this user to an Admin? They will have full administrative privileges, including managing users and organisations."
                : "Are you sure you want to deactivate this user? They will no longer be able to log in."}
            </Text>
            <Text fontWeight="bold" mt={2}>
              {selectedUser?.first_name} {selectedUser?.last_name}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {selectedUser?.email}
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme={actionType === "promote" ? "blue" : "red"}
              mr={3}
              onClick={handleConfirmAction}
            >
              {actionType === "promote" ? "Promote" : "Deactivate"}
            </Button>
            <Button variant="outline" onClick={confirmModal.onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}