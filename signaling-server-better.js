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
      logDebug('Received message:', data.type, 'Role:', data.role || 'unknown', 'PeerId:', data.peerId || 'unspecified');
      
      if (data.type === 'join') {
        // Store the role and peerId on the WebSocket for later reference
        ws.role = data.role || 'unknown';
        ws.peerId = data.peerId;
        ws.streamId = data.streamId;
        
        streams[data.streamId] = streams[data.streamId] || [];
        streams[data.streamId].push(ws);
        
        logDebug(`Client joined stream ${data.streamId} as ${ws.role}. Total clients: ${streams[data.streamId].length}`);
        
        // If this is a viewer joining, notify all broadcasters in this stream
        if (data.role === 'viewer') {
          let broadcasterCount = 0;
          streams[data.streamId].forEach(client => {
            if (client.role === 'broadcaster' && client.readyState === WebSocket.OPEN) {
              logDebug(`Notifying broadcaster about new viewer: ${data.peerId}`);
              client.send(JSON.stringify({
                type: 'join',
                role: 'viewer',
                peerId: data.peerId,
                streamId: data.streamId
              }));
              broadcasterCount++;
            }
          });
          logDebug(`Notified ${broadcasterCount} broadcasters about new viewer`);
        }
      } else if (data.type === 'signal') {
        logDebug(`Signal ${data.signalType} from ${ws.role} (${ws.peerId}) for stream ${data.streamId}, targeting peer: ${data.peerId}`);
        if (!ws.streamId) {
          logDebug('Error: Client not associated with a stream tried to send signal');
          return;
        }
        
        // Broadcast signaling data to all peers in the same stream except sender
        if (!streams[ws.streamId]) {
          logDebug(`Error: Stream ${ws.streamId} not found`);
          return;
        }
        
        logDebug(`Broadcasting ${data.signalType} to peer ${data.peerId}`);
        let delivered = false;
        streams[ws.streamId].forEach(client => {
          // Send signal only to the specified peer
          if (client !== ws && client.readyState === WebSocket.OPEN && client.peerId === data.peerId) {
            client.send(JSON.stringify(data));
            delivered = true;
            logDebug(`Signal delivered to ${client.role} (${client.peerId})`);
          }
        });
        
        if (!delivered) {
          logDebug(`Warning: Signal could not be delivered to peer ${data.peerId}`);
        }
      } else if (data.type === 'end') {
        logDebug(`Stream end request for ${data.streamId}`);
        if (streams[data.streamId]) {
          streams[data.streamId].forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'end', streamId: data.streamId }));
            }
          });
        }
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
      logDebug(`Client ${ws.role} (${ws.peerId || 'unknown'}) left stream ${ws.streamId}. Clients before: ${clientCount}, after: ${streams[ws.streamId].length}`);
      
      // If this was a broadcaster, notify all viewers that the stream has ended
      if (ws.role === 'broadcaster') {
        streams[ws.streamId].forEach(client => {
          if (client.role === 'viewer' && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'end', streamId: ws.streamId }));
          }
        });
      }
    }
  });
});

logDebug('Signaling server running on ws://localhost:3001');