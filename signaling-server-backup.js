const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });
const streams = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === 'join') {
      streams[data.streamId] = streams[data.streamId] || [];
      streams[data.streamId].push(ws);
      ws.streamId = data.streamId;
    } else if (data.type === 'signal') {
      // Broadcast signaling data to all peers in the same stream except sender
      streams[ws.streamId].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on('close', () => {
    if (ws.streamId && streams[ws.streamId]) {
      streams[ws.streamId] = streams[ws.streamId].filter(client => client !== ws);
    }
  });
});

console.log('Signaling server running on ws://localhost:3001');
