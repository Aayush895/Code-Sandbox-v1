import fsSync from 'node:fs';
import fs from 'node:fs/promises';

import { getContainerPorts } from '../containers/handleContainerCreation.js';

function editorHandlers(socket, nameSpaceSocket) {
  // Room Id: projectId + file

  // Event function / handler for joining a room when a file is selected
  async function joinRoom({ roomId }) {
    try {
      socket.join(roomId);
      console.log(`The User - ${socket.id} is connected to room: ${roomId}`);
    } catch (error) {
      console.log('Error in joining the room: ', error);
      socket.emit('Error', {
        message: 'Error in joining the room: ',
      });
    }
  }

  async function leaveRoom({ prevRoomId }) {
    try {
      socket.leave(prevRoomId);
      console.log(`The User - ${socket.id} left the room: ${prevRoomId}`);
    } catch (error) {
      console.log('Error in leaving the room: ', error);
      socket.emit('Error', {
        message: 'Error in leaving the room',
      });
    }
  }

  // Event function / handler for reading the contents of a file
  async function readFileHandler({ filePath }) {
    try {
      const readData = await fs.readFile(filePath);
      socket.emit('read-file-success', {
        fileData: readData.toString(),
        activeFile: filePath,
      });
    } catch (error) {
      console.log('Error reading the file: ', error);
      socket.emit('Error', {
        message: 'Error reading the file',
      });
    }
  }

  // Event function / handler for writing the contents of a file
  async function writeFileHandler({ filePath, roomId, fileData }) {
    try {
      await fs.writeFile(filePath, fileData);
      nameSpaceSocket.to(roomId).emit('write-file-success', {
        activeFile: filePath,
        message: 'File written successfully',
      });
    } catch (error) {
      console.log('Error in writing the file: ', error);
      socket.emit('Error', {
        message: 'Error in writing the file',
      });
    }
  }

  // Event function / handler for deleting the file
  async function deleteFileHandler({ filePath, projectId }) {
    try {
      await fs.unlink(filePath);
      socket.emit('delete-file-success', {
        message: 'File was deleted successfully',
        projectId,
      });
    } catch (error) {
      console.log('Error in deleting the file: ', error);
      socket.emit('Error', {
        message: 'Error in deleting the file',
      });
    }
  }

  // Event function / handler for deleting the folder
  async function deleteFolderHandler({ folderPath, projectId }) {
    try {
      await fs.rm(folderPath, { recursive: true });
      socket.emit('delete-folder-success', {
        message: 'Folder was deleted successfully',
        projectId,
      });
    } catch (error) {
      console.log('Error in deleting the folder: ', error);
      socket.emit('Error', {
        message: 'Error in deleting the folder',
      });
    }
  }

  // Event function / handler for renaming the folder
  async function renameFolderHandler({ folderPath, newFolderName, projectId }) {
    try {
      const folderPathParts = folderPath.split('/');
      const oldFolderName = folderPathParts[folderPathParts.length - 1];
      const directoryPath = folderPathParts
        .slice(0, folderPathParts.length - 1)
        .join('/');
      await fs.rename(
        `${directoryPath}/${oldFolderName}`,
        `${directoryPath}/${newFolderName}`
      );
      socket.emit('rename-folder-success', {
        message: 'Folder was renamed successfully',
        projectId,
      });
    } catch (error) {
      console.log('Error in renaming the folder: ', error);
      socket.emit('Error', {
        message: 'Error in renaming the folder',
      });
    }
  }

  // Event function / handler for renaming the file
  async function renameFileHandler({ filePath, newFileName, projectId }) {
    try {
      const filePathParts = filePath.split('/');
      const oldFileName = filePathParts[filePathParts.length - 1];
      const directoryPath = filePathParts
        .slice(0, filePathParts.length - 1)
        .join('/');

      await fs.rename(
        `${directoryPath}/${oldFileName}`,
        `${directoryPath}/${newFileName}`
      );
      socket.emit('rename-file-success', {
        message: 'File was renamed successfully',
        projectId,
      });
    } catch (error) {
      console.log('Error in renaming the file: ', error);
      socket.emit('Error', {
        message: 'Error in renaming the file',
      });
    }
  }

  // Event function / handler for creating a new file
  async function createFileHandler({ folderPath, projectId, newFileName }) {
    try {
      if (fsSync.existsSync(`${folderPath}/${newFileName}`)) {
        return socket.emit('error', {
          message: 'The folder with the given name already exists!',
        });
      }
      await fs.writeFile(`${folderPath}/${newFileName}`, '');
      socket.emit('create-file-success', {
        message: 'File created successfully',
        projectId,
      });
    } catch (error) {
      console.log('Error in creating the file: ', error);
      socket.emit('Error', {
        data: 'Error creating the file',
      });
    }
  }

  // Event function / handler for creating a new folder
  async function createFolderHandler({ folderPath, projectId, newFolderName }) {
    try {
      if (fsSync.existsSync(`${folderPath}/${newFolderName}`)) {
        return socket.emit('error', {
          message: 'The folder with the given name already exists!',
        });
      }
      await fs.mkdir(`${folderPath}/${newFolderName}`);
      socket.emit('create-folder-success', {
        message: 'Folder created successfully',
        projectId,
      });
    } catch (error) {
      console.log('Error creating the folder: ', error);
      socket.emit('error', {
        data: 'Error creating the folder',
      });
    }
  }

  // Get container port for project
  async function fetchContainerPort({ projectId }) {
    try {
      const ports = await getContainerPorts(projectId); 
      socket.emit('fetch-port-success', {
        ports: ports ?? { vite: null, express: null },
        message: 'Ports for the project were fetched successfully',
      });
    } catch (error) {
      console.log('Error in fetching ports: ', error);
      socket.emit('error', {
        data: 'Error in fetching the ports',
      });
    }
  }

  socket.on('join-room', joinRoom);
  socket.on('leave-room', leaveRoom);
  socket.on('read-file', readFileHandler);
  socket.on('write-file', writeFileHandler);
  socket.on('delete-file', deleteFileHandler);
  socket.on('delete-folder', deleteFolderHandler);
  socket.on('rename-folder', renameFolderHandler);
  socket.on('rename-file', renameFileHandler);
  socket.on('create-file', createFileHandler);
  socket.on('create-folder', createFolderHandler);
  socket.on('fetch-port', fetchContainerPort);
}

export default editorHandlers;
