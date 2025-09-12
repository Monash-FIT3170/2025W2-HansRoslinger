const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Track active streams and connections
const streams = new Map(); // streamId -> { broadcaster, viewers }
const connections = new Map(); // ws -> { role, streamId, peerId }

console.log('Starting enhanced WebRTC signaling server...');

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Log all messages with key details
      console.log(`[${new Date().toISOString()}] Message:`, {
        type: data.type,
        signalType: data.signalType || null,
        role: data.role || connections.get(ws)?.role || null,
        streamId: data.streamId || connections.get(ws)?.streamId || null,
        peerId: data.peerId || connections.get(ws)?.peerId || null
      });
      
      // Handle join message - register client with a stream
      if (data.type === 'join') {
        handleJoin(ws, data);
      }
      // Handle signal messages - relay to target peer
      else if (data.type === 'signal') {
        handleSignal(ws, data);
      }
      // Handle end message - terminate a stream
      else if (data.type === 'end') {
        handleEnd(ws, data);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    handleDisconnect(ws);
  });
});

// Handle join messages
function handleJoin(ws, data) {
  const { streamId, role, peerId } = data;
  console.log(`Join request: streamId=${streamId}, role=${role}, peerId=${peerId || 'unknown'}`);
  
  if (!streamId || !role) {
    console.error('Invalid join request - missing streamId or role');
    return;
  }
  
  // Store connection info
  connections.set(ws, { 
    role, 
    streamId, 
    peerId: peerId || `${role}-${Date.now()}`
  });
  
  // Initialize stream if it doesn't exist
  if (!streams.has(streamId)) {
    streams.set(streamId, { broadcaster: null, viewers: new Map() });
    console.log(`Created new stream: ${streamId}`);
  }
  
  const stream = streams.get(streamId);
  
  // Handle broadcaster join
  if (role === 'broadcaster') {
    stream.broadcaster = ws;
    console.log(`Broadcaster joined stream: ${streamId}`);
  }
  // Handle viewer join
  else if (role === 'viewer') {
    if (!stream.broadcaster) {
      console.log(`Viewer tried to join non-existent stream: ${streamId}`);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Stream not found' 
      }));
      return;
    }
    
    stream.viewers.set(peerId, ws);
    console.log(`Viewer ${peerId} joined stream: ${streamId} (${stream.viewers.size} viewers total)`);
    
    // Notify broadcaster of new viewer
    stream.broadcaster.send(JSON.stringify({
      type: 'join',
      streamId,
      peerId,
      role: 'viewer'
    }));
  }
}

// Handle signal messages (offers, answers, ICE candidates)
function handleSignal(ws, data) {
  const { streamId, peerId, signalType } = data;
  const connection = connections.get(ws);
  
  if (!connection) {
    console.error('Signal from unknown connection');
    return;
  }
  
  console.log(`Signal: ${signalType} from ${connection.role} in stream ${streamId}`);
  
  if (!streams.has(streamId)) {
    console.error(`Signal for non-existent stream: ${streamId}`);
    return;
  }
  
  const stream = streams.get(streamId);
  const message = JSON.stringify(data);
  
  // Broadcaster sending to viewer
  if (connection.role === 'broadcaster') {
    const viewer = stream.viewers.get(peerId);
    if (viewer) {
      console.log(`Forwarding ${signalType} from broadcaster to viewer ${peerId}`);
      viewer.send(message);
    } else {
      console.error(`Cannot forward to unknown viewer: ${peerId}`);
    }
  }
  // Viewer sending to broadcaster
  else if (connection.role === 'viewer') {
    if (stream.broadcaster) {
      console.log(`Forwarding ${signalType} from viewer ${peerId} to broadcaster`);
      stream.broadcaster.send(message);
    } else {
      console.error(`Cannot forward to broadcaster: not connected`);
    }
  }
}

// Handle stream end message
function handleEnd(ws, data) {
  const { streamId } = data;
  const connection = connections.get(ws);
  
  console.log(`Stream end request: ${streamId}`);
  
  if (!connection || connection.role !== 'broadcaster') {
    console.error('End request from non-broadcaster');
    return;
  }
  
  if (streams.has(streamId)) {
    const stream = streams.get(streamId);
    
    // Notify all viewers that the stream has ended
    for (const [peerId, viewer] of stream.viewers) {
      console.log(`Notifying viewer ${peerId} that stream ${streamId} has ended`);
      viewer.send(JSON.stringify({ type: 'end', streamId }));
    }
    
    // Clean up the stream
    streams.delete(streamId);
    console.log(`Deleted stream: ${streamId}`);
  }
}

// Handle client disconnection
function handleDisconnect(ws) {
  const connection = connections.get(ws);
  if (!connection) {
    console.log('Unknown client disconnected');
    return;
  }
  
  const { role, streamId, peerId } = connection;
  console.log(`Client disconnected: ${role} from stream ${streamId}`);
  
  if (streams.has(streamId)) {
    const stream = streams.get(streamId);
    
    // Broadcaster disconnected
    if (role === 'broadcaster' && stream.broadcaster === ws) {
      // Notify all viewers
      for (const [viewerId, viewer] of stream.viewers) {
        console.log(`Notifying viewer ${viewerId} that broadcaster has disconnected`);
        viewer.send(JSON.stringify({ type: 'end', streamId }));
      }
      
      // Remove the stream
      streams.delete(streamId);
      console.log(`Broadcaster disconnected, removed stream: ${streamId}`);
    }
    // Viewer disconnected
    else if (role === 'viewer') {
      stream.viewers.delete(peerId);
      console.log(`Viewer ${peerId} disconnected from stream ${streamId} (${stream.viewers.size} viewers remaining)`);
      
      // Notify broadcaster that viewer has left
      if (stream.broadcaster) {
        stream.broadcaster.send(JSON.stringify({
          type: 'viewer-left',
          streamId,
          peerId
        }));
      }
    }
  }
  
  // Clean up connection
  connections.delete(ws);
}

// Server status information
function getServerStatus() {
  const status = {
    activeStreams: streams.size,
    totalConnections: connections.size,
    streams: []
  };
  
  for (const [streamId, stream] of streams.entries()) {
    status.streams.push({
      id: streamId,
      broadcasterConnected: !!stream.broadcaster,
      viewerCount: stream.viewers.size
    });
  }
  
  return status;
}

// Print server status periodically
setInterval(() => {
  const status = getServerStatus();
  console.log('\n--- Server Status ---');
  console.log(`Active Streams: ${status.activeStreams}`);
  console.log(`Total Connections: ${status.totalConnections}`);
  
  if (status.streams.length > 0) {
    console.log('\nStreams:');
    status.streams.forEach(stream => {
      console.log(`- ${stream.id}: Broadcaster: ${stream.broadcasterConnected ? 'Connected' : 'Disconnected'}, Viewers: ${stream.viewerCount}`);
    });
  }
  console.log('--------------------\n');
}, 10000);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebRTC signaling server running on port ${PORT}`);
});