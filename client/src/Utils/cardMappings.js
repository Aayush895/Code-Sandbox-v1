// TODO: Use the UUID library to give unique id to each card type

export const cardTypes = [
  {
    id: 1,
    type: 'react',
    cardTitle: 'React App',
    cardDesc:
      'Modern React application with Vite, hot reload, and component development environment',
    cardBadges: ['React 18', 'Vite', 'Hot Reload', 'JSX'],
    cardIcon: '⚛️',
  },
  {
    id: 2,
    type: 'express',
    cardTitle: 'Express API',
    cardDesc:
      'Node.js backend with Express framework, ready for REST API development.',
    cardBadges: ['Node.js', 'Express', 'REST API', 'Middleware'],
    cardIcon: '🚀',
  },
  {
    id: 3,
    type: 'fullstack',
    cardTitle: 'React + Express',
    cardDesc:
      'Full-stack setup with React frontend and Express backend, pre-configured to work together.',
    cardBadges: ['Full Stack', 'React', 'Express', 'Proxy'],
    cardIcon: '🔗',
  },
]
