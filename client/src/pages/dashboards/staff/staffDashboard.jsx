import Layout from "../../../layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export default function AdminDashboard() {
  return (
    <Layout title="Staff Dashboard:">
      <Tabs variant="enclosed" colorScheme="green" p={6}>
        <TabList>
          <Tab>Incoming Donations</Tab>
          <Tab>Update Stock</Tab>
          <Tab>Distribution Records</Tab>
        </TabList>

        <TabPanels>

        </TabPanels>
      </Tabs>
    </Layout>
  );
}