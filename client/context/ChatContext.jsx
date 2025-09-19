// import { createContext, useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import toast from "react-hot-toast";

// export const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unseenMessages, setUnseenMessages] = useState({});

//   const { socket, axios } = useContext(AuthContext);

//   // ------------------------------
//   // Get all users for sidebar
//   // ------------------------------
//   const getUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/messages/users");
//       if (data.success) {
//         setUsers(data.users || []); // fallback to empty array
//         setUnseenMessages(data.unseenMessages || {});
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // ------------------------------
//   // Get messages for selected user
//   // ------------------------------
//   const getMessages = async (userId) => {
//     try {
//       const { data } = await axios.get(`/api/messages/${userId}`);
//       if (data.success) {
//         setMessages(data.messages || []);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // ------------------------------
//   // Send message
//   // ------------------------------
//   const sendMessage = async (messageData) => {
//     if (!selectedUser) {
//       toast.error("No user selected to send a message");
//       return;
//     }
//     try {
//       const { data } = await axios.post(
//         `/api/messages/send/${selectedUser._id}`,
//         messageData
//       );
//       if (data.success) {
//         setMessages((prev) => [...prev, data.newMessage]);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // ------------------------------
//   // Subscribe to socket messages
//   // ------------------------------
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewMessage = (newMessage) => {
//       if (!newMessage || !newMessage.senderId) return;

//       if (selectedUser && newMessage.senderId === selectedUser._id) {
//         newMessage.seen = true;
//         setMessages((prev) => [...prev, newMessage]);
//         axios.put(`/api/messages/mark/${newMessage._id}`);
//       } else {
//         setUnseenMessages((prev) => ({
//           ...prev,
//           [newMessage.senderId]: prev[newMessage.senderId]
//             ? prev[newMessage.senderId] + 1
//             : 1,
//         }));
//       }
//     };

//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [socket, selectedUser, axios]);

//   // ------------------------------
//   // 🚀 Fetch users on mount
//   // ------------------------------
//   useEffect(() => {
//     getUsers();
//   }, []);

//   // ------------------------------
//   // Context value
//   // ------------------------------
//   const value = {
//     messages,
//     users,
//     selectedUser,
//     getUsers,
//     getMessages,
//     sendMessage,
//     setSelectedUser,
//     unseenMessages,
//     setUnseenMessages,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };


import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenMessages || {}); // ✅ key matches backend
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) setMessages((prev) => [...prev, data.newMessage]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Listen to socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (!newMessage.senderId) return;

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser, axios]);

  useEffect(() => {
    getUsers();
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        unseenMessages,
        setUnseenMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
