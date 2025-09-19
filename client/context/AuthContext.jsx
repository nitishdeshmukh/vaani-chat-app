// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [authUser, setAuthUsers] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [socket, setSocket] = useState(null);

//   // ------------------------------
//   // Check if user is authenticated
//   // ------------------------------
//   const checkAuth = async () => {
//     try {
//       const { data } = await axios.get("/api/auth/check");
//       if (data.success) {
//         setAuthUsers(data.user);
//         connectSocket(data.user);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // ------------------------------
//   // Login function
//   // ------------------------------
//   const login = async (state, credentials) => {
//     try {
//       const { data } = await axios.post(`/api/auth/${state}`, credentials);
//       if (data.success) {
//         setAuthUsers(data.userData);
//         connectSocket(data.userData);
//         axios.defaults.headers.common["token"] = data.token;
//         setToken(data.token);
//         localStorage.setItem("token", data.token);
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // ------------------------------
//   // Logout function
//   // ------------------------------
//   const logout = async () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setAuthUsers(null);
//     setOnlineUsers([]);
//     delete axios.defaults.headers.common["token"];
//     if (socket) socket.disconnect();
//     toast.success("Logout Successfully");
//   };

//   // ------------------------------
//   // Update profile
//   // ------------------------------
//   const updateProfile = async (body) => {
//     try {
//       const { data } = await axios.put("/api/auth/update-profile", body);
//       if (data.success) {
//         setAuthUsers(data.user);
//         toast.success("Profile updated Successfully");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // ------------------------------
//   // Connect Socket.IO
//   // ------------------------------
//   const connectSocket = (userData) => {
//     if (!userData || socket?.connected) return;

//     // ✅ Use auth instead of query for newer socket.io versions
//     const newSocket = io(backendUrl, {
//       auth: { userId: userData._id },
//     });

//     setSocket(newSocket);

//     // Listen for online users
//     newSocket.on("getOnlineUsers", (userIds) => {
//       setOnlineUsers(userIds);
//     });
//   };

//   // ------------------------------
//   // Set token headers and check auth on mount
//   // ------------------------------
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["token"] = token;
//     }
//     checkAuth();
//   }, []);

//   // ------------------------------
//   // Context value
//   // ------------------------------
//   const value = {
//     axios,
//     authUser,
//     onlineUsers,
//     socket,
//     login,
//     logout,
//     updateProfile,
//   };

//   return (
//     <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//   );
// };

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUsers(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUsers(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUsers(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["token"];
    if (socket) socket.disconnect();
    toast.success("Logout Successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUsers(data.user);
        toast.success("Profile updated Successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData) => {
    if (!userData?._id) {
      console.error("❌ No userId found, cannot connect socket");
      return;
    }

    if (socket?.connected) socket.disconnect();

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      // Convert IDs to strings to match MongoDB _id format
      setOnlineUsers(userIds.map(id => id.toString()));
      console.log("✅ Online Users from server:", userIds);
    });

    newSocket.on("connect", () => {
      console.log("🔗 Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  };

  useEffect(() => {
    if (token) axios.defaults.headers.common["token"] = token;
    checkAuth();
  }, []);

  useEffect(() => {
    return () => {
      if (socket?.connected) socket.disconnect();
    };
  }, [socket]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

