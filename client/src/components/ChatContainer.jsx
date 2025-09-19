import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import assets from "../assets/assets";
import { cn, formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { FaTrashAlt, FaEllipsisV } from "react-icons/fa";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    deleteMessage,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const messagesContainerRef = useRef();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileMenuMsg, setMobileMenuMsg] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      // flex-col-reverse means scrollTop=0 is bottom
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      setShowScrollButton(scrollTop > 100);
      setAutoScrollEnabled(scrollTop === 0); // enable auto-scroll only if at bottom
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
    if (autoScrollEnabled) {
      scrollToBottom();
    }
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
      if (autoScrollEnabled) {
        scrollToBottom();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteClick = (msg) => {
    setMessageToDelete(msg);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete._id);
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  let longPressTimer = null;
  const handleTouchStart = (msg) => {
    longPressTimer = setTimeout(() => {
      setMobileMenuMsg(msg);
      setShowMobileMenu(true);
    }, 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
  };

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      getMessages(selectedUser._id).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (autoScrollEnabled) {
            scrollToBottom();
          }
        }, 50);
      });
    }
  }, [selectedUser, getMessages, scrollToBottom, autoScrollEnabled]);

  // Scroll when messages change but only if autoScrollEnabled
  useEffect(() => {
    if (autoScrollEnabled) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, autoScrollEnabled]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900/50">
        <div
          className={cn(
            "animate-spin w-10 h-10 border-4 border-neutral-50/50",
            "border-t-transparent rounded-full mx-2.5"
          )}
        ></div>
      </div>
    );
  }

  return selectedUser ? (
    <div className="h-full flex flex-col bg-gray-900/50">
      {/* Header - Fixed position */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500 bg-gray-900/80">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt=""
          className="hidden md:block max-w-5"
        />
      </div>

      {/* Messages - Scrollable area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse relative"
      >
        {messages.map((msg, index) => {
          const isSender = msg.sender === authUser._id;
          const isDeleted = msg.deleted;
          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 ${
                isSender ? "justify-end" : "justify-start"
              } group relative`}
              onTouchStart={
                isSender && !isDeleted ? () => handleTouchStart(msg) : undefined
              }
              onTouchEnd={isSender && !isDeleted ? handleTouchEnd : undefined}
            >
              {/* Message bubble or deleted placeholder */}
              {isDeleted ? (
                <div className="flex flex-col items-end w-full">
                  <div className="italic text-xs text-gray-400 bg-gray-800/70 rounded px-3 py-2 select-none">
                    This message was deleted
                  </div>
                </div>
              ) : msg.image ? (
                <div className="flex flex-col items-end relative group">
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  />
                  {isSender && (
                    <span className="text-[10px] text-gray-400 mt-1">
                      {msg.seen ? "Seen" : ""}
                    </span>
                  )}
                  {isSender && !isDeleted && (
                    <button
                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setShowDropdown(
                          msg._id === showDropdown ? null : msg._id
                        )
                      }
                    >
                      <FaEllipsisV size={12} />
                    </button>
                  )}
                  {showDropdown === msg._id && (
                    <div className="absolute top-6 right-0 w-20 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                      <button
                        className="block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-gray-700"
                        onClick={() => handleDeleteClick(msg)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end relative group">
                  <p
                    className={`p-2 max-w-[200px] md:max-w-[300px] text-sm font-light rounded-lg break-all ${
                      isSender
                        ? "bg-violet-600 rounded-br-none text-white"
                        : "bg-gray-700 rounded-bl-none text-white"
                    }`}
                  >
                    {msg.text}
                  </p>
                  {isSender && (
                    <span className="text-[10px] text-gray-400 mt-1">
                      {msg.seen ? "Seen" : ""}
                    </span>
                  )}
                  {isSender && !isDeleted && (
                    <button
                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setShowDropdown(
                          msg._id === showDropdown ? null : msg._id
                        )
                      }
                    >
                      <FaEllipsisV size={12} />
                    </button>
                  )}
                  {showDropdown === msg._id && (
                    <div className="absolute top-6 right-0 w-20 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                      <button
                        className="block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-gray-700"
                        onClick={() => handleDeleteClick(msg)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col items-center">
                <img
                  src={
                    isSender
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd} />

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-4 bg-violet-600 hover:bg-violet-700 text-white rounded-full p-2 shadow-lg transition-opacity duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Input Box - Fixed position */}
      <div className="p-3 border-t border-gray-600 bg-gray-900/80">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-700 px-3 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Send a message"
              className="flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400"
            />
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />
            <label htmlFor="image" className="cursor-pointer">
              <img
                src={assets.gallery_icon}
                alt="Send image"
                className="w-5 h-5"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2 rounded-full ${
              input.trim() ? "bg-violet-600" : "bg-gray-600"
            }`}
          >
            <img src={assets.send_button} alt="Send" className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-72 text-center">
            <div className="mb-4 text-white">Delete this message?</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu for long press */}
      {showMobileMenu && mobileMenuMsg && (
        <div
          className="fixed inset-0 z-50 flex items-end md:hidden bg-black/40"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="w-full bg-gray-800 rounded-t-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700"
              onClick={() => {
                handleDeleteClick(mobileMenuMsg);
                setShowMobileMenu(false);
              }}
            >
              Delete
            </button>
            <button
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-700"
              onClick={() => setShowMobileMenu(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="hidden md:flex flex-col items-center justify-center gap-2 h-full bg-gray-900/50">
      <img src={assets.logo_icon} alt="" className="w-16 h-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
