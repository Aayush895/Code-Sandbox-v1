import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

function createReactCommand(projectName) {
  return `npm create vite@latest ${projectName} -- --template react --no-interactive`;
}
export const CREATE_REACT_COMMAND = createReactCommand;

export const CREATE_EXPRESS_APP = '';
