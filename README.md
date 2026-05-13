# ☁️ Cloud Code

> An online code sandbox prototype built to understand how production-grade applications like CodeSandbox and Project IDX work under the hood.

---

## 📌 Overview

**Cloud Code** is a browser-based code sandbox that lets users create, edit, and run **React** and **Express** applications directly in the browser — no local setup required. It was built as a personal deep-dive into understanding how cloud-based IDEs work internally, from real-time collaborative editing to streaming terminal I/O through Docker containers.

This is a **prototype**, not a production application. The goal was to simplify and demystify the internals of these complex systems.

---

## 🎬 Demo

> 📸 Screenshots and screen recordings will be added here.

### Creating a Project

![Home Page](https://github.com/user-attachments/assets/db703b45-1010-407b-987c-912a52c5aadd)

![Create Project](https://github.com/user-attachments/assets/01fc97ff-3903-4ceb-820b-1edbc91c2ac9)

### Code Editor

![Editor](https://github.com/user-attachments/assets/d17411da-7360-46c2-a9a0-f18adb76266c)


### Screen Recording
| Application Demo | [Watch](https://res.cloudinary.com/dlbkhcvej/video/upload/v1778676942/Project-recording_jopqex.mov)     |

---

## Project Startup

- `React Apps`: Once the necessary packages have been installed after running `npm install` command, run the project via this command only, `npm run dev -- --host 0.0.0.0`
- `Express Apps`: Once the necessary packages have been installed after running `npm install` command, go inside the `bin` folder and open the file with name `www` and replace line number 28 with the following code `server.listen(port, '0.0.0.0');`

## ✨ Features

### 🗂️ Project Creation

- Create new **React** (Vite) or **Express** projects from the browser
- Each project gets a unique shareable URL

### 👥 Real-time Collaboration

- Share your project link with another user
- Both users can open and edit the same file simultaneously
- Changes made by one user are reflected **live** on the other user's screen powered by Socket.io rooms

### 💻 Web Terminal

- A fully functional terminal inside the browser
- The UI is powered by **xterm.js** but the actual command execution happens inside a **Docker container**
- Every command typed in the browser is streamed to the Docker container, executed there, and the output is streamed back to the UI in real time
- Each project gets its own isolated Docker container terminal session

### 🌐 Inbuilt Browser Preview

- Preview your running app directly inside the sandbox
- On smaller screens, copy the preview URL and open it in a new browser tab for a cleaner view

### 📁 File Explorer

- Full file tree with support for creating, renaming, and deleting files and folders
- Right-click context menu for quick actions

---

## ⚠️ Limitations

These are known limitations of the current prototype:

1. **No authentication** — there is no login or user management system
2. **No database** — projects are stored directly on the server filesystem, not in a database
3. **Shared terminal issues** — when two users share the same project link, they can edit files simultaneously without issues, but sharing the terminal will produce unexpected behavior since each project has only one terminal session
4. **Terminal sessions are not persisted** — hard refreshing the browser restarts the terminal session and the user will need to navigate back to their working directory. File contents remain intact
5. **No project listing** — since there is no authentication, the app cannot display a list of projects per user

---

## 🐛 Bugs

All bugs found during initial testing have been resolved. Since this project was built as a personal learning exercise, rigorous testing and unit tests were kept out of scope.

If you find a bug, feel free to open an issue. If there is enough interest from users, proper testing, bug fixes, and new features will be prioritised accordingly.

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| React 19         | UI framework                            |
| Vite             | Build tool and dev server               |
| Tailwind CSS v4  | Utility-first styling                   |
| DaisyUI          | Component library built on Tailwind     |
| Monaco Editor    | VS Code-like code editor in the browser |
| xterm.js         | Terminal UI emulator                    |
| Socket.io Client | Real-time communication with the server |
| Zustand          | Client-side state management            |
| TanStack Query   | Server state and data fetching          |
| Axios            | HTTP client                             |
| Allotment        | Resizable split pane layout             |
| React Router v7  | Client-side routing                     |

### Backend

| Technology     | Purpose                                            |
| -------------- | -------------------------------------------------- |
| Node.js        | Runtime                                            |
| Express v5     | HTTP server and REST APIs                          |
| Socket.io      | Real-time collaborative editing via WebSockets     |
| ws             | WebSocket server for terminal streaming            |
| Dockerode      | Node.js Docker API client for container management |
| chokidar       | File system watcher                                |
| directory-tree | Project folder tree generation                     |
| uuid           | Unique project ID generation                       |
| dotenv         | Environment variable management                    |
| cors           | Cross-origin resource sharing                      |

### Infrastructure & Deployment

| Technology           | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| Docker               | Isolated container per project for terminal execution                                |
| DigitalOcean Droplet | Cloud server hosting (Ubuntu 24.04)                                                  |
| PM2                  | Node.js process manager — keeps servers running and auto-restarts on crash or reboot |

---

## 🏗️ Architecture

```
Browser
  ├── REST API calls          → Express Server (Port 3000)
  ├── Socket.io (editor)      → Express Server (Port 3000)
  └── WebSocket (terminal)    → Terminal Server (Port 4002)
                                      └── Docker Container (per project)
                                              └── /bin/bash (command execution)
```

---

## 🚀 Local Setup

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/)
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/Aayush895/Code-Sandbox-v1
cd cloud-code
```

---

### 2. Build the Docker sandbox image

The terminal runs inside a Docker container. You need to build the sandbox image first:

```bash
cd docker
docker build -t sandbox .
```

Verify the image was created:

```bash
docker images | grep sandbox
```

---

### 3. Set up the main server (Project + Socket.io)

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=<PORT>
TERMINAL_PORT=<PORT>
TERMINAL_APP_SERVER=http://localhost:<PORT>
CLIENT_URL=http://localhost:<PORT>
```

Start the server:

```bash
npm start
```

---

### 4. Set up the terminal server

Start the terminal server:

```bash
nodemon src/terminalApp.js
```

---

### 5. Set up the client

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:<PORT>
VITE_TERMINAL_SOCKET_URL=ws://localhost:<PORT>/terminal
```

Start the client:

```bash
npm run dev
```

---

### 6. Open the app

Visit [http://localhost:<PORT>](http://localhost:5173) in your browser.

---

## 👨‍💻 Author

**Aayush Kumar Jha**

---

## 📄 License

This project is licensed under the ISC License.
