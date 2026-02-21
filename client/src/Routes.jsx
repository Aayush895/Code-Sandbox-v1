import { Routes as PageRoutes, Route } from 'react-router'
import Project from './components/BrowserIDE/Project'
import ProjectDashboard from './components/Dashboard/ProjectDashboard'
import ProjectTemplate from './components/Templates/ProjectTemplate'

function Routes() {
  return (
    <PageRoutes>
      <Route path="/" element={<ProjectDashboard />} />
      <Route path="/template" element={<ProjectTemplate />} />
      <Route path="/project" element={<Project />} />
    </PageRoutes>
  )
}
export default Routes
