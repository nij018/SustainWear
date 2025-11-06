import Layout from "../../../layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DonateItem from "./donateItem";
import DonationHistory from "./donationHistory";
import Notifications from "./notifications";

export default function AdminDashboard() {
  return (
    <Layout title="Donor Dashboard:">
      <Tabs variant="enclosed" colorScheme="green" p={6}>
        <TabList>
          <Tab>Donate</Tab>
          <Tab>History and Impact</Tab>
          <Tab>Notifications</Tab>
        </TabList>

        <TabPanels>
          <TabPanel><DonateItem /></TabPanel>
          <TabPanel><DonationHistory /></TabPanel>
          <TabPanel><Notifications /></TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}