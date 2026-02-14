import { Routes as PageRoutes, Route } from 'react-router'
import ProjectDashboard from './components/Dashboard/ProjectDashboard'
import ProjectTemplate from './components/Templates/ProjectTemplate'

function Routes() {
  return (
    <PageRoutes>
      <Route path="/" element={<ProjectDashboard />} />
      <Route path="/template" element={<ProjectTemplate />} />
    </PageRoutes>
  )
}
export default Routes
