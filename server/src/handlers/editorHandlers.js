import fs from 'node:fs/promises';

function editorHandlers(socket) {
  // Room Id: projectId + file

  // Event function / handler for joining a room when a file is selected
  async function joinRoom({ roomId }) {
    try {
      socket.join(roomId);
      console.log('The User is connected to room: ', roomId);
    } catch (error) {
      console.log('Error in joining the room: ', error);
      socket.emit('Error', {
        data: 'Error in joining the room: ',
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
        data: 'Error reading the file',
      });
    }
  }

  // Event function / handler for writing the contents of a file
  async function writeFileHandler({ filePath, roomId, fileData }) {
    try {
      const writeFileResponse = await fs.writeFile(filePath, fileData);
      socket.to(roomId).emit('write-file-success', {
        fileData: writeFileResponse,
        activeFile: filePath,
        message: 'File written successfully',
      });
    } catch (error) {
      console.log('Error in writing the file: ', error);
      socket.emit('Error', {
        data: 'Error in writing the file',
      });
    }
  }

  socket.on('join-room', joinRoom);
  socket.on('read-file', readFileHandler);
  socket.on('write-file', writeFileHandler);
}

export default editorHandlers;
