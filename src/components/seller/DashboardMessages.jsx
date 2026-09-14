import api, { API_BASE_URL } from "../../services/api";
import { resolveImageUrl } from "../../utils/image";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from '../../styles/styles';
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = API_BASE_URL.replace('/api', '');
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller,isLoading } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await api.get(
          `/conversation/get-all-conversation-seller/${seller?._id}`
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [seller, messages, arrivalMessage]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await api.get(
          `/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await api
          .post(`/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await api
      .put(`/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });

    try {
      await api
        .post(`/message/create-new-message`, {
          images: e,
          sender: seller._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await api.put(
      `/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {!open && (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-blue-25 border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-Poppins font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage all your conversations</p>
          </div>

          {/* Message list with responsive scrolling */}
          <div className="max-h-screen overflow-y-auto">
            {conversations && conversations.length > 0 ? (
              <div className="p-2">
                {conversations.map((item, index) => (
                  <MessageList
                    data={item}
                    key={index}
                    index={index}
                    setOpen={setOpen}
                    setCurrentChat={setCurrentChat}
                    me={seller._id}
                    setUserData={setUserData}
                    userData={userData}
                    online={onlineCheck(item)}
                    setActiveStatus={setActiveStatus}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 font-medium">No messages yet</p>
                <p className="text-sm text-gray-500 mt-1">Start conversations with buyers to manage inquiries</p>
              </div>
            )}
          </div>
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  isLoading
}) => {
  console.log(data);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);

  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await api.get(`/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  const isUnread = data?.lastMessageId !== me;
  const truncateMessage = (msg, len = 50) => msg?.length > len ? msg.substring(0, len) + '...' : msg;

  return (
    <div
      className={`w-full m-3 p-4 rounded-lg border transition-all cursor-pointer ${
        active === index 
          ? "bg-blue-50 border-blue-300 shadow-md" 
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="flex items-start gap-4">
        {/* Avatar with online status */}
        <div className="relative flex-shrink-0">
          <img
            src={resolveImageUrl(user?.avatar?.url) || "/avatar-placeholder.svg"}
            alt={user?.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className={`w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-white ${
            online ? "bg-green-500" : "bg-gray-400"
          }`} />
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-semibold text-gray-900 truncate">{user?.name}</h1>
            <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
              online ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              {online ? "Active" : "Inactive"}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 truncate mb-2">
            <span className="font-medium text-gray-700">
              {!isLoading && !isUnread ? "You:" : user?.name ? user.name.split(" ")[0] + ": " : ""}
            </span>
            {' '}
            {truncateMessage(data?.lastMessage)}
          </p>

          {/* Unread indicator */}
          {isUnread && (
            <div className="inline-block">
              <span className="text-xs font-semibold text-white bg-blue-500 px-2 py-1 rounded-full">
                Unread
              </span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
          {data?.updatedAt ? format(new Date(data.updatedAt)) : "Recently"}
        </div>
      </div>
    </div>
  );
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Message header */}
      <div className="w-full flex p-4 items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={resolveImageUrl(userData?.avatar?.url) || "/avatar-placeholder.svg"}
            alt={userData?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{userData?.name}</h1>
            <p className={`text-xs font-medium ${activeStatus ? "text-green-600" : "text-gray-500"}`}>
              {activeStatus ? "🟢 Active now" : "⚫ Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Close conversation"
        >
          <AiOutlineArrowRight size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 px-4 py-4 overflow-y-auto bg-gray-50">
        {messages && messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((item, index) => {
              const isSender = item.sender === sellerId;
              return (
                <div
                  key={index}
                  className={`flex w-full gap-2 ${isSender ? "justify-end" : "justify-start"}`}
                  ref={scrollRef}
                >
                  {!isSender && (
                    <img
                      src={resolveImageUrl(userData?.avatar?.url) || "/avatar-placeholder.svg"}
                      className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                      alt={userData?.name}
                    />
                  )}
                  
                  <div className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
                    {/* Image message */}
                    {item.images?.url && (
                      <img
                        src={resolveImageUrl(item.images.url)}
                        className="w-32 h-32 object-cover rounded-lg mb-2"
                        alt="message attachment"
                      />
                    )}

                    {/* Text message */}
                    {item.text !== "" && (
                      <div className={`px-4 py-2 rounded-lg break-words ${
                        isSender 
                          ? "bg-blue-600 text-white rounded-br-none" 
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}>
                        <p className="text-sm">{item.text}</p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className={`text-xs mt-1 ${isSender ? "text-gray-600" : "text-gray-500"}`}>
                      {format(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-gray-500 text-lg">Start the conversation</p>
              <p className="text-gray-400 text-sm mt-1">Send a message to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Message input form */}
      <form
        className="p-4 border-t border-gray-200 bg-white"
        onSubmit={sendMessageHandler}
      >
        <div className="flex items-end gap-3">
          {/* Image upload */}
          <div className="relative">
            <input
              type="file"
              name="image"
              id="image"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
            <label 
              htmlFor="image"
              className="block p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              title="Attach image"
            >
              <TfiGallery size={20} className="text-gray-600" />
            </label>
          </div>

          {/* Message input */}
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
            title="Send message"
          >
            <AiOutlineSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;