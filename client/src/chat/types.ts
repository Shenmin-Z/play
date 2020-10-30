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

export type IncomingMessage =
  | {
      kind: "ProfileUploaded";
    }
  | {
      kind: "ClientCreated";
      payload: string;
    }
  | {
      kind: "NameUpdated";
      payload: string;
    };

export type OutgoingMessage = { kind: "UpdateName"; payload: string };

export type User = {
  id: string;
  name: string;
  hasProfile: boolean;
};

export type ChatMessage = {
  user: User;
  text: string;
  timestamp: number;
};

export type Conversation = {
  id: string;
  name: string;
  users: User[];
  history: ChatMessage[];
};
