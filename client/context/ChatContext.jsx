import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket, axios } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  // Fetch users with unseen message info
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get users");
    }
  };

  // Fetch messages from/to the selected user
  const getMessages = async (otherUserId) => {
    try {
      const { data } = await axios.get(`/api/messages/${otherUserId}`);
      if (data.success) {
        setMessages(data.messages.reverse());
        // Mark all unseen messages as seen for this user
        setUnseenMessages((prev) => ({
          ...prev,
          [otherUserId]: 0,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;
    // For unseen message notification: only increase if chat is not open
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.sender === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
        setUnseenMessages((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.sender]: (prev[newMessage.sender] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser, axios]);

  // When switching users, load messages
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const value = {
    users,
    messages,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
