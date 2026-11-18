/**
 * Socket.IO client interface for MovieChatWidget
 * Supports real socket.io-client when available, with automatic in-memory fallback
 * to ensure zero crash in offline / development / container environments.
 */

export interface ChatSocket {
  connected: boolean;
  auth: {
    token?: string;
    guestName?: string;
    [key: string]: unknown;
  };
  connect(): ChatSocket;
  disconnect(): ChatSocket;
  emit(event: string, ...args: unknown[]): ChatSocket;
  on(event: string, listener: (...args: any[]) => void): ChatSocket;
  off(event: string, listener?: (...args: any[]) => void): ChatSocket;
}

class FallbackSocket implements ChatSocket {
  public connected = false;
  public auth: { token?: string; guestName?: string } = {};
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect(): ChatSocket {
    this.connected = true;
    const connectListeners = this.listeners.get("connect");
    if (connectListeners) {
      connectListeners.forEach((fn) => fn());
    }
    // Emit initial online count
    setTimeout(() => {
      const onlineListeners = this.listeners.get("onlineCount");
      if (onlineListeners) {
        onlineListeners.forEach((fn) => fn({ count: 12 }));
      }
    }, 100);
    return this;
  }

  disconnect(): ChatSocket {
    this.connected = false;
    const disconnectListeners = this.listeners.get("disconnect");
    if (disconnectListeners) {
      disconnectListeners.forEach((fn) => fn("io client disconnect"));
    }
    return this;
  }

  emit(event: string, ...args: unknown[]): ChatSocket {
    if (event === "sendMessage" && args[0]) {
      const payload = args[0] as { room: string; content: string; guestName?: string };
      // Echo message locally for instant test feedback when backend socket server is offline
      setTimeout(() => {
        const msgListeners = this.listeners.get("newMessage");
        if (msgListeners) {
          msgListeners.forEach((fn) =>
            fn({
              id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              room: payload.room || "lounge",
              content: payload.content,
              senderId: null,
              guestName: payload.guestName || "Guest",
              createdAt: new Date().toISOString(),
            })
          );
        }
      }, 50);
    }
    return this;
  }

  on(event: string, listener: (...args: any[]) => void): ChatSocket {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return this;
  }

  off(event: string, listener?: (...args: any[]) => void): ChatSocket {
    if (!listener) {
      this.listeners.delete(event);
    } else {
      const set = this.listeners.get(event);
      if (set) {
        set.delete(listener);
      }
    }
    return this;
  }
}

let socketInstance: ChatSocket | null = null;
let currentToken: string | null | undefined = undefined;
let currentGuestName: string | undefined = undefined;

/**
 * Get or create singleton chat socket instance
 */
export function getChatSocket(
  token?: string | null,
  guestName?: string
): ChatSocket {
  const tokenChanged = currentToken !== token;
  const guestChanged = currentGuestName !== guestName;

  if (socketInstance && (tokenChanged || guestChanged)) {
    socketInstance.auth = {
      token: token || undefined,
      guestName: guestName || undefined,
    };
    currentToken = token;
    currentGuestName = guestName;

    if (socketInstance.connected) {
      socketInstance.disconnect().connect();
    }
    return socketInstance;
  }

  if (!socketInstance) {
    currentToken = token;
    currentGuestName = guestName;

    // Try native socket.io-client if available in runtime, else use resilient fallback
    try {
      const socketIo = require("socket.io-client");
      const io = socketIo.io || socketIo.default || socketIo;
      const apiBase =
        typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://localhost:3001/api/v1";
      const host = apiBase.replace(/\/api\/v1\/?$/, "");
      const chatNamespaceUrl = `${host}/chat`;

      socketInstance = io(chatNamespaceUrl, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        transports: ["websocket", "polling"],
        auth: {
          token: token || undefined,
          guestName: guestName || undefined,
        },
      });
    } catch {
      // socket.io-client module not available or server SSR
      socketInstance = new FallbackSocket();
      socketInstance.auth = {
        token: token || undefined,
        guestName: guestName || undefined,
      };
    }
  }

  return socketInstance!;
}

export function disconnectChatSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    currentToken = undefined;
    currentGuestName = undefined;
  }
}
