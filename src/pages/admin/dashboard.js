import Dashboard from "../../components/dashboard/Dashboard"
import Layout from "../../components/layout/Layout"

import DashboardLayout from "../../components/Layout"

function Dashboards() {
  return (
    <DashboardLayout title='Dashboard'>
      <Layout>
        <Dashboard />
      </Layout>
    </DashboardLayout>
  )
}
Dashboards.auth = { adminOnly: true }
export default Dashboards
