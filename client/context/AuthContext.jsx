import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  // Check if user is authenticated and if so, set the user data and connect to socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("api/auth/check"); // FIXED
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // NEW
    }
  };

  // Login function to handle user login and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(
          state === "signup"
            ? "Account created successfully"
            : "Logged in successfully"
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function to handle user logout and disconnect from socket
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      axios.defaults.headers.common["token"] = null;
      toast.success("Logged out successfully");
      socket?.disconnect();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update profile function to handle user profile update
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.userData);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Connect socket function to handle socket connection and online user updates
  const connectSocket = (userData) => {
    if (!userData) return;

    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      setLoading(false);
    }

    // Cleanup socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
