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
      payload: User;
    }
  | {
      kind: "NameUpdated";
      payload: string;
    }
  | {
      kind: "ClientList";
      payload: User[];
    }
  | { kind: "ClientUpdateNotification" }
  | {
      kind: "ConversationCreated";
      payload: { id: string; name: string; users: User[] };
    }
  | {
      kind: "NewConversationMessage";
      payload: NewConversationMessage;
    }
  | {
      kind: "ConversationKilled";
      payload: string;
    };

export type OutgoingMessage =
  | { kind: "UpdateName"; payload: string }
  | { kind: "GetClientList" }
  | {
      kind: "CreateConversation";
      payload: {
        name: string;
        users: string[];
      };
    }
  | {
      kind: "NewConversationMessage";
      payload: {
        id: string;
        sender: string;
        message: string;
      };
    };

export type User = {
  id: string;
  name: string;
  profile: boolean;
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
  alive:boolean;
};

export type NewConversationMessage = {
  id: string;
  user: string;
  message: string;
  timestamp: number;
};
