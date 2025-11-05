import Layout from "../../../layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

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

        </TabPanels>
      </Tabs>
    </Layout>
  );
}