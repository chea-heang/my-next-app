"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getChatSocket, type ChatSocket } from "@/lib/socket";

export interface ChatSender {
  id: string;
  name: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  room: string;
  content: string;
  senderId: string | null;
  guestName: string | null;
  createdAt: string | Date;
  sender?: ChatSender | null;
}

interface RoomConfig {
  id: string;
  nameEn: string;
  nameKh: string;
  icon: string;
  descEn: string;
  descKh: string;
}

const CHAT_ROOMS: RoomConfig[] = [
  {
    id: "lounge",
    nameEn: "Movie Lounge",
    nameKh: "បន្ទប់ជជែកទូទៅ",
    icon: "🍿",
    descEn: "General movie talks & reviews",
    descKh: "ការពិភាក្សាភាពយន្តទូទៅ",
  },
  {
    id: "spiderman",
    nameEn: "Spider-Man Hub",
    nameKh: "Spider-Man Universe",
    icon: "🕷️",
    descEn: "No Way Home & MCU debates",
    descKh: "ជជែកពីខ្សែភាពយន្ត Spider-Man",
  },
  {
    id: "cambodia-cinemas",
    nameEn: "Cinemas Chat",
    nameKh: "រោងកុននៅកម្ពុជា",
    icon: "📍",
    descEn: "Major Cineplex & Legend screenings",
    descKh: "ព័ត៌មានរោងកុន Major និង Legend",
  },
];

export default function MovieChatWidget() {
  const { user, token, isAuthenticated, openLoginModal } = useAuth();
  const { language } = useLanguage();
  const isKh = language === "KH";

  // Widget Open / Minimize State
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string>("lounge");

  // Chat Data State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Guest Nickname State
  const [guestName, setGuestName] = useState<string>("Guest");
  const [isEditingGuestName, setIsEditingGuestName] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState("Guest");

  const socketRef = useRef<ChatSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or restore guest nickname asynchronously after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const savedGuest = localStorage.getItem("chat_guest_name");
        if (savedGuest) {
          setGuestName(savedGuest);
          setGuestNameInput(savedGuest);
        } else {
          const randomGuest = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
          setGuestName(randomGuest);
          setGuestNameInput(randomGuest);
          try {
            localStorage.setItem("chat_guest_name", randomGuest);
          } catch {
            // ignore storage error
          }
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Socket Connection and Event Subscription Lifecycle
  useEffect(() => {
    const socket = getChatSocket(token, guestName);
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    // Join the initial room
    socket.emit("joinRoom", { room: activeRoom });

    const handleRoomHistory = (payload: { room: string; messages: ChatMessage[] }) => {
      if (payload.room === activeRoom) {
        setMessages(payload.messages || []);
      }
    };

    const handleNewMessage = (newMsg: ChatMessage) => {
      if (newMsg.room === activeRoom) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        // If widget is minimized, increment unread badge
        if (!isOpen) {
          setUnreadCount((c) => c + 1);
        }
      }
    };

    const handleOnlineCount = (data: { count: number }) => {
      if (typeof data?.count === "number") {
        setOnlineCount(data.count);
      }
    };

    const handleUserTyping = (data: { room: string; user: string; isTyping: boolean }) => {
      if (data.room === activeRoom) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (data.isTyping) {
            next.add(data.user);
          } else {
            next.delete(data.user);
          }
          return next;
        });
      }
    };

    socket.on("roomHistory", handleRoomHistory);
    socket.on("newMessage", handleNewMessage);
    socket.on("onlineCount", handleOnlineCount);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("roomHistory", handleRoomHistory);
      socket.off("newMessage", handleNewMessage);
      socket.off("onlineCount", handleOnlineCount);
      socket.off("userTyping", handleUserTyping);
    };
  }, [token, guestName, activeRoom, isOpen]);

  // Switch Rooms
  const handleRoomChange = useCallback(
    (newRoom: string) => {
      if (newRoom === activeRoom) return;
      setActiveRoom(newRoom);
      setMessages([]);
      setTypingUsers(new Set());
      if (socketRef.current) {
        socketRef.current.emit("joinRoom", { room: newRoom });
      }
    },
    [activeRoom]
  );

  // Auto-scroll to bottom of message stream
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      room: activeRoom,
      content: trimmed,
      guestName: isAuthenticated ? undefined : guestName,
    });

    // Clear typing status immediately
    if (socketRef.current) {
      socketRef.current.emit("typing", { room: activeRoom, isTyping: false });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setInputText("");
  };

  // Typing event handler with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (socketRef.current) {
      socketRef.current.emit("typing", { room: activeRoom, isTyping: true });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit("typing", { room: activeRoom, isTyping: false });
        }
      }, 2000);
    }
  };

  const handleSaveGuestName = () => {
    const trimmed = guestNameInput.trim();
    if (trimmed) {
      setGuestName(trimmed);
      localStorage.setItem("chat_guest_name", trimmed);
      setIsEditingGuestName(false);

      // Reconnect with new guest name
      if (socketRef.current) {
        socketRef.current.auth = {
          token: token || undefined,
          guestName: trimmed,
        };
        socketRef.current.disconnect().connect();
        socketRef.current.emit("joinRoom", { room: activeRoom });
      }
    }
  };

  // Determine current room details
  const currentRoom =
    CHAT_ROOMS.find((r) => r.id === activeRoom) || CHAT_ROOMS[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* Floating Chat Launcher Button (when minimized) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="group relative flex items-center gap-2.5 rounded-full bg-linear-to-r from-red-600 to-rose-600 px-5 py-3 text-white shadow-xl shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 focus:outline-none"
          aria-label="Open Live Chat"
        >
          <span className="text-xl">💬</span>
          <span className="font-semibold text-sm">
            {isKh ? "ជជែកផ្ទាល់" : "Live Chat"}
          </span>

          {/* Online count pill */}
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {onlineCount}
          </span>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-gray-950 shadow-md">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Floating Chat Box */}
      {isOpen && (
        <div className="flex h-[560px] w-[380px] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl transition-all duration-300 dark:border-gray-800/80 dark:bg-gray-900 dark:text-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200/80 bg-linear-to-r from-red-600 to-rose-600 px-4 py-3 text-white dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentRoom.icon}</span>
              <div>
                <h3 className="text-sm font-bold leading-tight">
                  {isKh ? currentRoom.nameKh : currentRoom.nameEn}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-red-100">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {onlineCount} {isKh ? "អ្នកកំពុងអនឡាញ" : "online"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
                title={isKh ? "បង្រួម" : "Minimize"}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Room Selection Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50/80 px-2 py-1.5 text-xs dark:border-gray-800 dark:bg-gray-950/50">
            {CHAT_ROOMS.map((room) => {
              const isActive = room.id === activeRoom;
              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomChange(room.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 font-medium transition-all ${
                    isActive
                      ? "bg-white text-red-600 shadow-xs dark:bg-gray-800 dark:text-red-400 font-bold"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <span>{room.icon}</span>
                  <span className="truncate">
                    {isKh ? room.nameKh : room.nameEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Persona Bar (Guest Nickname or Authenticated Profile) */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-100/60 px-3.5 py-1.5 text-xs text-gray-600 dark:border-gray-800/60 dark:bg-gray-900/40 dark:text-gray-300">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                  {isKh ? "សមាជិក" : "Member"}
                </span>
              </div>
            ) : isEditingGuestName ? (
              <div className="flex flex-1 items-center gap-1.5">
                <input
                  type="text"
                  maxLength={25}
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Your Nickname"
                />
                <button
                  onClick={handleSaveGuestName}
                  className="rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-red-700"
                >
                  {isKh ? "រក្សាទុក" : "Save"}
                </button>
                <button
                  onClick={() => setIsEditingGuestName(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">👤</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {guestName || "Guest"}
                  </span>
                  <button
                    onClick={() => setIsEditingGuestName(true)}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    ✏️ {isKh ? "ប្ដូរឈ្មោះ" : "Edit"}
                  </button>
                </div>
                <button
                  onClick={() => openLoginModal("login")}
                  className="font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  {isKh ? "ចូលគណនី" : "Log In"}
                </button>
              </div>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/40">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                <span className="text-4xl mb-2">{currentRoom.icon}</span>
                <p className="text-xs font-medium">
                  {isKh
                    ? `ស្វាគមន៍មកកាន់ ${currentRoom.nameKh}`
                    : `Welcome to ${currentRoom.nameEn}`}
                </p>
                <p className="text-[11px] text-gray-400/80 mt-1">
                  {isKh
                    ? "ចូលរួមផ្ញើសារជជែកគ្នាដំបូងគេ!"
                    : "Be the first to share your movie thoughts!"}
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = isAuthenticated
                  ? msg.senderId === user?.id
                  : !msg.senderId && msg.guestName === guestName;

                const displayName =
                  msg.sender?.name || msg.guestName || "Anonymous";
                const isVerified = !!msg.sender;

                const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Sender name label */}
                    <div className="mb-1 flex items-center gap-1.5 px-1 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{displayName}</span>
                      {isVerified ? (
                        <span className="rounded bg-red-100 px-1 py-0.2 text-[9px] font-bold text-red-600 dark:bg-red-950/80 dark:text-red-400">
                          {isKh ? "សមាជិក" : "Member"}
                        </span>
                      ) : (
                        <span className="rounded bg-gray-200 px-1 py-0.2 text-[9px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          {isKh ? "ភ្ញៀវ" : "Guest"}
                        </span>
                      )}
                      <span>·</span>
                      <span className="text-[10px] text-gray-400">{timeStr}</span>
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words shadow-xs ${
                        isMe
                          ? "bg-linear-to-tr from-red-600 to-rose-600 text-white rounded-tr-none"
                          : "bg-white text-gray-900 border border-gray-200/80 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700/60 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}

            {/* Live Typing Indicator */}
            {typingUsers.size > 0 && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500 italic dark:text-gray-400">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>
                  {Array.from(typingUsers).join(", ")}{" "}
                  {isKh ? "កំពុងវាយអត្ថបទ..." : "is typing..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200/80 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={
                  isKh ? "សរសេរសាររបស់អ្នក..." : "Type your message..."
                }
                maxLength={1000}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 transition focus:border-red-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-red-500 dark:focus:bg-gray-900"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs transition hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600"
                aria-label="Send message"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
