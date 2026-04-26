export function handleTerminalCreation(container, terminalSocket) {
  container.exec(
    {
      Cmd: ['bash', '-i'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      User: 'sandbox',
    },
    function (err, exec) {
      if (err) {
        console.log('Error in executing the container: ', err);
        return;
      }

      exec.start({ hijack: true }, function (err, stream) {
        if (err) {
          console.log('Error while starting container exec: ', err);
          return;
        }

        processStreamOutput(stream, terminalSocket);

        terminalSocket.on('message', (data) => {
          stream.write(data);
        });
      });
    }
  );
}

function processStreamOutput(stream, terminalSocket) {
  let nextDataType = null;
  let nextDataLength = null;
  let buffer = Buffer.from('');

  function processStreamData(data) {
    if (data) {
      buffer = Buffer.concat([buffer, data]);
    }

    if (!nextDataType) {
      if (buffer.length >= 8) {
        const header = bufferSlicer(8);
        nextDataType = header.readUInt32BE(0);
        nextDataLength = header.readUInt32BE(4);
        processStreamData();
      }
    } else {
      if (buffer.length >= nextDataLength) {
        const content = bufferSlicer(nextDataLength);
        terminalSocket.send(content);
        nextDataType = null;
        nextDataLength = null;
        processStreamData();
      }
    }
  }

  function bufferSlicer(end) {
    const output = buffer.slice(0, end);
    buffer = Buffer.from(buffer.slice(end, buffer.length));
    return output;
  }

  stream.on('data', processStreamData);
}
