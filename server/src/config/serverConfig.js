import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export function createReactCommand(projectName) {
  return `npm create vite@latest ${projectName} -- --template react --no-interactive`;
}

export function createExpressApp(projectName) {
  return `express --view=ejs ${projectName}`;
}

export function createReactExpressApp(isClient) {
  if (isClient) {
    return createReactCommand;
  }

  return createExpressApp;
}

export const CREATE_EXPRESS_APP = '';
