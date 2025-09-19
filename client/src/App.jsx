import React, { useContext, useRef, useCallback } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Loader from "./components/ui/Loader";

const App = () => {
  const { authUser, loading } = useContext(AuthContext);
  const videoRef = useRef(null);

  const handleVideoError = useCallback(() => {
    console.warn("Video failed to load");
    if (videoRef.current) {
      videoRef.current.style.display = "none";
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={handleVideoError}
      >
        <source src="/bgVideoWEBM.webm" type="video/webm" />
        <source src="/bgVideoMP4.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay for better UI contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/10 to-gray-900/40 z-10"></div>

      {/* Content with glassmorphism */}
      <div className="relative z-20 min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "bg-gray-900/90 backdrop-blur-xl text-white border border-gray-600/30",
          }}
        />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
