const WebSocket = require('ws');

// Enable more detailed logging
const debugMode = true;

function logDebug(...args) {
  if (debugMode) {
    console.log(new Date().toISOString(), ...args);
  }
}

const wss = new WebSocket.Server({ port: 3001 });
const streams = {};

wss.on('connection', function connection(ws, req) {
  logDebug('New WebSocket connection from', req.socket.remoteAddress);
  
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      logDebug('Received message:', data.type);
      
      if (data.type === 'join') {
        streams[data.streamId] = streams[data.streamId] || [];
        streams[data.streamId].push(ws);
        ws.streamId = data.streamId;
        logDebug(`Client joined stream ${data.streamId}. Total clients: ${streams[data.streamId].length}`);
      } else if (data.type === 'signal') {
        logDebug(`Signal ${data.signalType} for stream ${data.streamId}`);
        if (!ws.streamId) {
          logDebug('Error: Client not associated with a stream tried to send signal');
          return;
        }
        
        // Broadcast signaling data to all peers in the same stream except sender
        if (!streams[ws.streamId]) {
          logDebug(`Error: Stream ${ws.streamId} not found`);
          return;
        }
        
        logDebug(`Broadcasting ${data.signalType} to ${streams[ws.streamId].length - 1} other peers in stream ${ws.streamId}`);
        let sentCount = 0;
        streams[ws.streamId].forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            sentCount++;
          }
        });
        logDebug(`Signal sent to ${sentCount} clients`);
      } else {
        logDebug('Unknown message type:', data.type);
      }
    } catch (error) {
      logDebug('Error processing message:', error);
    }
  });

  ws.on('error', (error) => {
    logDebug('WebSocket error:', error);
  });

  ws.on('close', (code, reason) => {
    logDebug('Connection closed:', code, reason ? reason.toString() : 'No reason');
    if (ws.streamId && streams[ws.streamId]) {
      const clientCount = streams[ws.streamId].length;
      streams[ws.streamId] = streams[ws.streamId].filter(client => client !== ws);
      logDebug(`Client left stream ${ws.streamId}. Clients before: ${clientCount}, after: ${streams[ws.streamId].length}`);
    }
  });
});

console.log('Signaling server running on ws://localhost:3001');