// Create client:
// Request: name, icon
// Response: clientId

// Create room:
// Request: name? clientId[]
// Response: roomId

// Send message:
// Request: roomId, Message
// Response: success|fail

// Update clients:
// All clients

// Update rooms:
// All rooms where the client is a member of

// New message:
// clientId, Message

export type Message = {
  kind: "ProfileUploaded";
  payload: string;
};
