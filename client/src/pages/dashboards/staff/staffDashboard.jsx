import Layout from "../../../layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import IncomingDonations from "./incomingDonations";
import UpdateStock from "./updateStock";
import DistributionRecords from "./distributionRecords";
import Settings from "../../settings";

export default function AdminDashboard() {
  return (
    <Layout title="Staff Dashboard:">
      <Tabs variant="enclosed" colorScheme="green" p={6}>
        <TabList>
          <Tab>Incoming Donations</Tab>
          <Tab>Update Stock</Tab>
          <Tab>Distribution Records</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel><IncomingDonations /></TabPanel>
          <TabPanel><UpdateStock /></TabPanel>
          <TabPanel><DistributionRecords /></TabPanel>
          <TabPanel><Settings /></TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}