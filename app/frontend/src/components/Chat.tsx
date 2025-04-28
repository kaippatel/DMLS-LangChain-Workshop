import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Message } from "../types/types";
import ChatMessage from "./ChatMessage";
import DragDropFile from "./DragDropFile";
import FilePreview from "./FilePreview";

const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  // const [response, setResponse] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isResponseLoading, setResponseLoading] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Generate session
  const generateSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/session/`);
      console.log(response);
      localStorage.setItem("session_id", response.data.sessionId);
    } catch (error) {
      console.log("Error encountered generating session", error);
    }
  };

  // Fetch session, refresh if not found in localStorage
  const fetchSession = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      console.log("Session dead... Generating new session");
      generateSession();
      sessionId = localStorage.getItem("session_id");
    }
    return sessionId;
  };

  useEffect(() => {
    // Generate session on initial render
    generateSession();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of messages
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Upload user's file to temporary file directory
  const handleUpload = async (uploadedFile: File) => {
    setFiles((prevState) => [...prevState, uploadedFile]); // add file to local state

    if (!uploadedFile) return;

    const fileData = new FormData();
    fileData.append("file", uploadedFile);

    // Fetch session ID from localStorage
    const sessionId = fetchSession();
    fileData.append("session_id", sessionId as string);

    console.log(fileData);

    try {
      setIsUploading(true); // Set loading state

      // Upload file
      const response = await axios.post(`${API_URL}/upload/`, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // setResponse(response.data.message || "Error uploading file!");
    } catch (error) {
      console.log("Prompt error:", error);
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  // Prompt LLM and get response
  const handlePrompt = async () => {
    try {
      // Set user's message in local state
      const userTimestamp = new Date().toISOString();
      setMessages((prevState) => [
        ...prevState,
        {
          role: "user",
          content: prompt,
          timestamp: userTimestamp,
          isPlaceholder: false,
        },
      ]);

      setPrompt(""); // Clear input field
      setResponseLoading(true); // Set loading state

      // Fetch session ID from localStorage
      const sessionId = fetchSession();

      // Prompt LLM
      const response = await axios.post(`${API_URL}/prompt/`, {
        session_id: sessionId,
        prompt,
        timestamp: userTimestamp,
      });

      // Set LLM's message in local state
      const { llmResponse, timestamp } = response.data;
      setMessages((prevState) => [
        ...prevState,
        {
          role: "assistant",
          content: llmResponse,
          timestamp: timestamp,
          isPlaceholder: false,
        },
      ]);
    } catch (error) {
      console.log("Prompt error:", error);
    } finally {
      setResponseLoading(false); // Reset loading state
    }
  };

  // Format timestamp for message display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) return `Today ${timeStr}`;
    if (isYesterday) return `Yesterday ${timeStr}`;

    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()} ${timeStr}`;
  };

  return (
    <>
      <DragDropFile
        handleUpload={handleUpload}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      <main id="pg-main">
        <h1>How can I help you today?</h1>
        <section id="chat-section">
          <div id="chat-messages">
            <hr id="msg-border" />
            {messages.length !== 0 &&
              messages.map((message) => (
                <ChatMessage
                  {...message}
                  timestamp={formatTimestamp(message.timestamp)}
                />
              ))}
            {messages.length !== 0 && isResponseLoading && (
              <ChatMessage
                role="assistant"
                content=""
                timestamp=""
                isPlaceholder={true}
              />
            )}
            <div ref={messageEndRef}></div>
          </div>
          <hr className="text-light" />
        </section>
        <section className="chat-section">
          <div className="chat-input-container">
            <input
              className="chat-input"
              type="text"
              placeholder="Type your message..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  prompt.trim() !== "" &&
                  !isResponseLoading
                ) {
                  handlePrompt();
                }
              }}
            />
            <div id="btn-row">
              <button
                id="paperclip-icon-wrapper"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  id="paperclip-icon"
                  className="bi bi-paperclip"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                </svg>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleUpload(selectedFile);
                      e.target.value = "";
                    }
                  }}
                />
              </button>
              <button
                id="send-message-btn"
                onClick={handlePrompt}
                disabled={!prompt || isResponseLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-arrow-up-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                </svg>
              </button>
            </div>
          </div>
        </section>
        <section id="files-section">
          {files &&
            files.map((file) => (
              <FilePreview
                file={file}
                isUploading={isUploading}
                progress={isUploading ? undefined : 100}
              />
            ))}
        </section>
      </main>
      <footer id="pg-footer"></footer>
    </>
  );
};

export default Chat;
