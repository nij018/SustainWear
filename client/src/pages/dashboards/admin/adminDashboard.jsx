import Layout from "../../../layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ManageUsers from "./manageUsers";
import ManageOrganisations from "./manageOrganisations";
import ManageReports from "./manageReports";
import AdminLog from "./adminLog";

export default function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard:">
      <Tabs variant="enclosed" colorScheme="green" p={6}>
        <TabList>
          <Tab>Manage Users</Tab>
          <Tab>Manage Organisations</Tab>
          <Tab>Manage Reports</Tab>
          <Tab>Admin Log</Tab>
        </TabList>

        <TabPanels>
          <TabPanel><ManageUsers /></TabPanel>
          <TabPanel><ManageOrganisations /></TabPanel>
          <TabPanel><ManageReports /></TabPanel>
          <TabPanel><AdminLog /></TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}