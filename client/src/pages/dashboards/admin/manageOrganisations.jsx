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
  Input,
  Heading,
  Spinner,
  HStack,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ManageOrganisations() {
  const [orgs, setOrgs] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    manager_email: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => { // fetch organisations
    api.get("/organisations")
      .then((res) => {
        setOrgs(res.data);
        setFilteredOrgs(res.data);
      })
      .catch(() => toast.error("Failed to load organisations"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { // search filter
    const lower = searchTerm.toLowerCase();
    setFilteredOrgs(
      orgs.filter(
        (org) =>
          org.name.toLowerCase().includes(lower) ||
          (org.manager_name && org.manager_name.toLowerCase().includes(lower))
      )
    );
  }, [searchTerm, orgs]);

  // create Organisation
  const handleCreate = async () => {
    if (!newOrg.name || !newOrg.manager_email) {
      toast.error("Please fill in organisation name and manager email.");
      return;
    }

    try {
      await api.post("/organisations", newOrg);
      toast.success("Organisation added successfully");
      setNewOrg({ name: "", description: "", manager_email: "" });
      onClose();

      const res = await api.get("/organisations");
      setOrgs(res.data);
      setFilteredOrgs(res.data);
    } catch (err) {
      toast.error(err.response?.data?.errMessage || "Failed to create organisation");
    }
  };

  const handleDelete = async (org_id) => {
    try {
      await api.delete(`/organisations/${org_id}`);
      toast.success("Organisation deleted");
      setOrgs((prev) => prev.filter((o) => o.org_id !== org_id));
      setFilteredOrgs((prev) => prev.filter((o) => o.org_id !== org_id));
    } catch (err) {
      toast.error("Failed to delete organisation");
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6} bg="white" rounded="lg" boxShadow="md">
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Manage Organisations</Heading>
        <Button colorScheme="green" onClick={onOpen}>
          Add Organisation
        </Button>
      </HStack>

      <Input
        placeholder="Search organisations by name or manager..."
        _placeholder={{ color: "gray.400" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
        bg="gray.50"
      />

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Manager</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredOrgs.length > 0 ? (
            filteredOrgs.map((org) => (
              <Tr key={org.org_id}>
                <Td>{org.name}</Td>
                <Td>{org.description || "—"}</Td>
                <Td color={org.manager_name ? "brand.green" : "gray.500"}>
                  {org.manager_name || "— Not assigned —"}
                </Td>
                <Td>{new Date(org.created_at).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(org.org_id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={5} textAlign="center" color="gray.500">
                No organisations found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" />
        <ModalContent
          bg="brand.beige"
          color="brand.green"
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="brand.green"
        >
          <ModalHeader
            textAlign="center"
            fontWeight="bold"
            borderBottom="1px solid"
            borderColor="brand.green"
          >
            Add Organisation
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4} mt={3}>
              <Input
                placeholder="Organisation Name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                bg="white"
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="brand.green"
                focusBorderColor="brand.green"
              />

              <Input
                placeholder="Description"
                value={newOrg.description}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, description: e.target.value })
                }
                bg="white"
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="brand.green"
                focusBorderColor="brand.green"
              />

              <Input
                placeholder="Manager Email (must be registered Staff)"
                value={newOrg.manager_email}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, manager_email: e.target.value })
                }
                bg="white"
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="brand.green"
                focusBorderColor="brand.green"
              />
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="brand.green">
            <Button
              bg="brand.green"
              color="white"
              _hover={{ bg: "green.600" }}
              mr={3}
              onClick={handleCreate}
            >
              Save
            </Button>
            <Button variant="outline" color="brand.green" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}