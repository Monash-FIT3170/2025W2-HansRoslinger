/**
 * In-memory storage for active stream information
 * In a production app, this would be a database
 */
type StreamSession = {
  id: string;
  createdAt: Date;
  offers: Record<string, RTCSessionDescriptionInit>;
  answers: Record<string, RTCSessionDescriptionInit>;
  iceCandidates: Record<string, RTCIceCandidateInit[]>;
};

// Map of stream ID to stream session
export const activeStreams: Record<string, StreamSession> = {};

// Function to create a new stream session
export const createStreamSession = (streamId: string): StreamSession => {
  const session: StreamSession = {
    id: streamId,
    createdAt: new Date(),
    offers: {},
    answers: {},
    iceCandidates: {},
  };
  
  activeStreams[streamId] = session;
  return session;
};

// Function to get a stream session
export const getStreamSession = (streamId: string): StreamSession | null => {
  return activeStreams[streamId] || null;
};

// Function to delete a stream session
export const deleteStreamSession = (streamId: string): void => {
  delete activeStreams[streamId];
};

// Function to add an offer to a stream session
export const addOffer = (
  streamId: string,
  peerId: string,
  offer: RTCSessionDescriptionInit
): void => {
  const session = getStreamSession(streamId);
  if (!session) return;
  
  session.offers[peerId] = offer;
};

// Function to add an answer to a stream session
export const addAnswer = (
  streamId: string,
  peerId: string,
  answer: RTCSessionDescriptionInit
): void => {
  const session = getStreamSession(streamId);
  if (!session) return;
  
  session.answers[peerId] = answer;
};

// Function to add ICE candidates to a stream session
export const addIceCandidate = (
  streamId: string,
  peerId: string,
  candidate: RTCIceCandidateInit
): void => {
  const session = getStreamSession(streamId);
  if (!session) return;
  
  if (!session.iceCandidates[peerId]) {
    session.iceCandidates[peerId] = [];
  }
  
  session.iceCandidates[peerId].push(candidate);
};

// Clean up old streams (would be on a timer in production)
export const cleanupOldSessions = (): void => {
  const now = new Date();
  Object.keys(activeStreams).forEach((streamId) => {
    const session = activeStreams[streamId];
    // Remove sessions older than 3 hours
    if (now.getTime() - session.createdAt.getTime() > 3 * 60 * 60 * 1000) {
      deleteStreamSession(streamId);
    }
  });
};