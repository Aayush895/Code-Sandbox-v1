import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import useCreateProject from '../../Hooks/mutations/useCreateProject'
import Card from '../Shared/Card'
import ErrorAlert from '../Shared/ErrorAlert'
import Loader from '../Shared/Loader'

function ProjectTemplate() {
  const [projectName, setprojectName] = useState('')
  const [error, setError] = useState('')
  const { createProjectMutation, isProjectLoading } = useCreateProject()

  const navigate = useNavigate()
  function handleCancel() {
    navigate(-1)
  }

  function handleProjectName(e) {
    setprojectName(e.target.value)
  }

  async function handleCreateProject() {
    if (!projectName) {
      setError('Please provide a project name!')
      return
    }

    try {
      const data = await createProjectMutation(projectName)
      navigate(`/project/${data?.id}`)
    } catch (error) {
      console.log('Error: ', error)
      setError('Something went wrong when creating the project')
    }
  }

  useEffect(() => {
    let timerId = null

    if (error) {
      timerId = setTimeout(() => {
        setError(null)
      }, 3000)
    }

    return () => {
      clearInterval(timerId)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-base-200 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold">Create New Project</h1>
          <p className="mt-4 text-base-content/70 text-lg">
            Choose a template to get started with your v0 project
          </p>
        </div>

        {/* Template Grid */}
        <div className="w-[60%] flex items-center mx-auto flex-col">
          {/* React Template (Selected Example) */}
          <Card
            cardTitle="React App"
            cardDesc="Modern React application with Vite, hot reload, and component
              development environment"
            cardBadges={['React 18', 'Vite', 'Hot Reload', 'JSX']}
            cardIcon="⚛️"
          />

          <Card
            cardTitle="Express API"
            cardDesc="Node.js backend with Express framework, ready for REST API
                development."
            cardBadges={['Node.js', 'Express', 'REST API', 'Middleware']}
            cardIcon="🚀"
          />

          <Card
            cardTitle="React + Express"
            cardDesc="Full-stack setup with React frontend and Express backend,
                pre-configured to work together."
            cardBadges={['Full Stack', 'React', 'Express', 'Proxy']}
            cardIcon="🔗"
          />
        </div>

        {/* Project Name Section */}
        <div className="mt-16 max-w-xl mx-auto">
          <div className="flex items-center relative">
            <label className="label mx-3">
              <span className="label-text font-semibold text-base">
                Project Name
              </span>
            </label>
            <input
              type="text"
              placeholder="my-awesome-project"
              className="input input-bordered w-full mx-3"
              value={projectName}
              onChange={handleProjectName}
            />
          </div>

          <div className={`mt-8 flex justify-center items-center gap-4`}>
            <button className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateProject}>
              Create Project
            </button>
            {isProjectLoading && <Loader />}
          </div>
          {error && (
            <div className="flex justify-center mt-4">
              <ErrorAlert reason={error} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectTemplate
