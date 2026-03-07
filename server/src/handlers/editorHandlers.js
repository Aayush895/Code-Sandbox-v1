import fs from 'node:fs/promises';

function editorHandlers(socket) {
  // Make the users join the room when they open the project
  // Room Id: projectId + file

  // Event function / handler for reading the contents of a file when the file is double-cicked
  async function readFileHandler({ filePath }) {
    try {
      const readData = await fs.readFile(`${filePath}`);
      socket.emit('read-file-success', {
        fileData: readData,
        activeFile: filePath,
      });
    } catch (error) {
      console.log('Error reading the file: ', error);
      socket.emit('Error', {
        data: 'Error reading the file',
      });
    }
  }

  socket.on('read-file', readFileHandler);
}

export default editorHandlers;
