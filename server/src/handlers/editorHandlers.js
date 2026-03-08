import fs from 'node:fs/promises';

function editorHandlers(socket) {
  // Make the users join the room when they open the project
  // Room Id: projectId + file

  // Event function / handler for reading the contents of a file when the file is double-cicked
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

  socket.on('join-room', joinRoom);
  socket.on('read-file', readFileHandler);
}

export default editorHandlers;
