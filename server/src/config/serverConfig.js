import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const TERMINAL_PORT = process.env.TERMINAL_PORT;
export const TERMINAL_APP_SERVER = process.env.TERMINAL_APP_SERVER;
export const CLIENT_URL = process.env.CLIENT_URL;

export function createReactCommand(projectName) {
  return `npm create vite@latest ${projectName} -- --template react --no-interactive`;
}

export function createExpressApp(projectName) {
  return `express --view=ejs ${projectName}`;
}

export const CREATE_EXPRESS_APP = '';
