import React, { useEffect, useRef, useState, useCallback } from "react";
import Header from '../../components/layout/Header';
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import api, { API_BASE_URL } from '../../services/api';
import { resolveImageUrl } from '../../utils/image';
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { HiArrowLeft } from "react-icons/hi";

// Socket.io connection initialization
const ENDPOINT = API_BASE_URL.replace('/api', '');
let socketId = null;

// Initialize socket connection
const initializeSocket = () => {
  if (!socketId) {
    socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
  }
  return socketId;
};

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState(null);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchParams] = useSearchParams();
  const scrollRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = initializeSocket();

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Socket connected successfully");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("Socket disconnected");
    });

    return () => {
      // Keep socket connected for real-time messaging
    };
  }, []);

  // Handle incoming messages via socket
  useEffect(() => {
    const socket = initializeSocket();

    const handleMessage = (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images,
        createdAt: new Date(),
      });
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, []);

  // Add incoming message to current chat
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Fetch all conversations
  useEffect(() => {
    const getConversation = async () => {
      if (!user?._id) return;
      try {
        const response = await api.get(
          `/conversation/get-all-conversation-user/${user._id}`
        );
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    getConversation();
  }, [user, messages, arrivalMessage]);

  // Register user and get online status
  useEffect(() => {
    const socket = initializeSocket();

    if (user?._id) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }

    return () => {
      socket.off("getUsers");
    };
  }, [user]);

  // Get messages for current chat
  useEffect(() => {
    const getMessage = async () => {
      if (!currentChat?._id) return;
      try {
        const response = await api.get(
          `/message/get-all-messages/${currentChat._id}`
        );
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    getMessage();
  }, [currentChat]);

  // Check if a user is online
  const onlineCheck = useCallback((chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((u) => u.userId === chatMembers);
    return !!online;
  }, [user, onlineUsers]);

  // Send text message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentChat?._id) return;

    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    // Emit via socket
    socketId?.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    // Save to database
    try {
      const response = await api.post(`/message/create-new-message`, {
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      });

      setMessages((prev) => [...prev, response.data.message]);
      setNewMessage("");
      updateLastMessage(newMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Update last message in conversation
  const updateLastMessage = async (lastMsg) => {
    try {
      socketId?.emit("updateLastMessage", {
        lastMessage: lastMsg,
        lastMessageId: user._id,
      });

      await api.put(`/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: lastMsg,
        lastMessageId: user._id,
      });
    } catch (error) {
      console.error("Failed to update last message:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const imageData = reader.result;
        setImages(imageData);
        await imageSendingHandler(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  // Send image message
  const imageSendingHandler = async (imageData) => {
    if (!currentChat?._id) return;

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    // Emit via socket
    socketId?.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: imageData,
    });

    try {
      const response = await api.post(`/message/create-new-message`, {
        images: imageData,
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      });

      setMessages((prev) => [...prev, response.data.message]);
      setImages(null);
      setNewMessage("");
      await updateLastMessage("Photo");
    } catch (error) {
      console.error("Failed to send image:", error);
    }
  };

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if should open chat from URL params
  useEffect(() => {
    const chatId = searchParams.toString().slice(1);
    if (chatId && !open) {
      const chat = conversations.find((c) => c._id === chatId);
      if (chat) {
        setCurrentChat(chat);
        setOpen(true);
        // Fetch seller data
        const sellerId = chat.members.find((m) => m !== user?._id);
        api
          .get(`/shop/get-shop-info/${sellerId}`)
          .then((res) => setUserData(res.data.shop))
          .catch((err) => console.error("Failed to fetch seller:", err));
      }
    }
  }, [searchParams, conversations, open, user]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {!open && (
        <>
          <Header />
          <div className="w-full py-6">
            <div className="max-w-6xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

              {conversations && conversations.length > 0 ? (
                <div className="grid gap-4">
                  {conversations.map((item, index) => (
                    <MessageList
                      data={item}
                      key={item._id || index}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      me={user?._id}
                      setUserData={setUserData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </>
      )}

      {open && (
        <MessageThread
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          buyerId={user?._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
          socketConnected={socketConnected}
        />
      )}
    </div>
  );
};

// Conversation list item component
const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sellerId = data.members.find((m) => m !== me);
    api
      .get(`/shop/get-shop-info/${sellerId}`)
      .then((res) => setSeller(res.data.shop))
      .catch((err) => console.error("Failed to fetch seller:", err));
  }, [data, me]);

  const handleClick = () => {
    setCurrentChat(data);
    setUserData(seller);
    setActiveStatus(online);
    setOpen(true);
    navigate(`/inbox?${data._id}`);
  };

  const unreadIndicator = !loading && data?.lastMessageId !== me;

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer p-4"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Seller Avatar with Online Status */}
        <div className="relative flex-shrink-0">
          <img
            src={
              resolveImageUrl(seller?.avatar?.url) ||
              "/avatar-placeholder.svg"
            }
            alt={seller?.name || "Seller"}
            className="w-12 h-12 rounded-full object-cover"
          />
          {online ? (
            <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
          ) : (
            <div className="w-3 h-3 bg-gray-400 rounded-full absolute bottom-0 right-0 border-2 border-white" />
          )}
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {seller?.name || "Unknown Seller"}
            </h3>
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {format(data?.updatedAt)}
            </span>
          </div>

          {/* Last Message Preview */}
          <p className="text-sm text-gray-600 truncate mb-2">
            <span className={`${unreadIndicator ? "font-semibold" : ""}`}>
              {!loading && data?.lastMessageId !== seller?._id
                ? "You: "
                : seller?.name
                ? seller.name.split(" ")[0] + ": "
                : ""}
            </span>
            {data?.lastMessage}
          </p>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {online && (
              <span className="inline-block text-xs text-green-600 font-medium">
                Active now
              </span>
            )}
            {unreadIndicator && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
        </div>

        {/* Unread Indicator Badge */}
        {unreadIndicator && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-semibold rounded-full">
              •
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
      <div className="text-gray-300 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-gray-600 font-medium text-lg">No conversations yet</p>
      <p className="text-sm text-gray-500 mt-2">
        Start messaging with shops to get support and ask questions
      </p>
    </div>
  );
};

// Message thread component (conversation view)
const MessageThread = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  buyerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
  socketConnected,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Back to conversations"
            >
              <HiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Seller Info */}
            <div className="relative">
              <img
                src={
                  resolveImageUrl(userData?.avatar?.url) ||
                  "/avatar-placeholder.svg"
                }
                alt={userData?.name || "Seller"}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activeStatus && (
                <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {userData?.name || "Unknown Seller"}
              </h2>
              <p className="text-xs text-gray-500">
                {activeStatus ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    Active now
                  </span>
                ) : (
                  "Away"
                )}
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="text-xs">
            {socketConnected ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                Connected
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                Connecting...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        <div className="max-w-2xl mx-auto w-full">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <MessageBubble
                key={msg._id || index}
                msg={msg}
                isBuyer={msg.sender === buyerId}
                sellerAvatar={userData?.avatar?.url}
                ref={index === messages.length - 1 ? scrollRef : null}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-sm">
                Start a conversation with {userData?.name || "this seller"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <form className="flex items-end gap-3" onSubmit={sendMessageHandler}>
            {/* Image Upload */}
            <label
              htmlFor="image"
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
              title="Upload image"
            >
              <TfiGallery className="w-5 h-5 text-gray-600" />
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>

            {/* Message Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition flex-shrink-0"
              title="Send message"
            >
              <AiOutlineSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Message bubble component
const MessageBubble = React.forwardRef(
  ({ msg, isBuyer, sellerAvatar }, ref) => {
    return (
      <div
        className={`flex w-full ${isBuyer ? "justify-end" : "justify-start"}`}
        ref={ref}
      >
        {!isBuyer && (
          <img
            src={resolveImageUrl(sellerAvatar) || "/avatar-placeholder.svg"}
            className="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover"
            alt="Seller"
          />
        )}

        <div className="flex flex-col gap-2 max-w-xs md:max-w-md">
          {/* Image Message */}
          {msg.images?.url && (
            <img
              src={resolveImageUrl(msg.images.url)}
              className="max-w-xs rounded-lg shadow-sm object-cover"
              alt="Shared content"
            />
          )}

          {/* Text Message */}
          {msg.text && (
            <div
              className={`px-4 py-2 rounded-lg ${
                isBuyer
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm break-words">{msg.text}</p>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`flex items-center gap-1 text-xs text-gray-500 ${
              isBuyer ? "justify-end" : "justify-start"
            }`}
          >
            <span>{format(msg.createdAt)}</span>
            {isBuyer && (
              <span title="Read status" className="text-gray-400">
                ✓
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default UserInbox;