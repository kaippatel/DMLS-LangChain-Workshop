import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Message } from "../types/types";
import ChatMessage from "./ChatMessage";
import DragDropFile from "./DragDropFile";
import FileCycler from "./FileCycler";

const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const fileUploadingRef = useRef(isFileUploading);
  const [isResponseLoading, setResponseLoading] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const waitUntil = (check: () => boolean) =>
    new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (check()) {
          clearInterval(id);
          resolve();
        }
      }, 50); // poll every 50 ms – light and responsive
    });

  useEffect(() => {
    // Maintain r
    fileUploadingRef.current = isFileUploading;
  }, [isFileUploading]);

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

  useEffect(() => {
    // Reset height of textarea
    if (prompt === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [prompt]);

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
      setIsFileUploading(true); // Set loading state

      // Upload file
      await axios.post(`${API_URL}/upload/`, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log("Prompt error:", error);
    } finally {
      setIsFileUploading(false); // Reset loading state
    }
  };

  // Prompt LLM and stream response
  const handlePrompt = async () => {
    const plainPrompt = prompt.trim();
    if (!plainPrompt) return;

    const userTimestamp = new Date().toISOString();
    const sessionId = fetchSession();

    // Add user message and LLM thinking placeholder
    setMessages((prevState) => [
      ...prevState,
      {
        role: "user",
        content: plainPrompt,
        timestamp: userTimestamp,
        isPlaceholder: false,
      },
      {
        role: "assistant",
        content: "",
        timestamp: userTimestamp,
        isPlaceholder: true,
      },
    ]);

    setPrompt(""); // clear input
    setResponseLoading(true); // set LLM response loading

    // Wait until file has uploaded
    if (fileUploadingRef.current) {
      await waitUntil(() => fileUploadingRef.current === false);
    }

    try {
      // Prompt LLM and stream tokens
      console.log("here");
      const response = await fetch(`${API_URL}/prompt-stream/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          prompt,
          timestamp: userTimestamp,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          // Decode
          accumulated += decoder
            .decode(value, { stream: true })
            .replace(/^data:\s*/, "");

          // Update assistant message as streaming
          setMessages((prevState) => {
            const messages = [...prevState];
            const lastIdx = messages.length - 1;
            if (messages[lastIdx]?.role === "assistant") {
              messages[lastIdx] = {
                ...messages[lastIdx],
                content: accumulated,
                isPlaceholder: false,
              };
            }
            return messages;
          });
        }
      }
    } catch (error) {
      console.log("Prompt stream error:", error);
    } finally {
      setResponseLoading(false);
    }
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

            <div ref={messageEndRef}></div>
          </div>
          <hr className="text-light" />
        </section>
        <section className="chat-section">
          <div className="chat-input-container">
            <textarea
              ref={textareaRef}
              className="chat-input"
              rows={1}
              placeholder="Type your message..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  prompt.trim() !== "" &&
                  !isResponseLoading
                ) {
                  e.preventDefault();
                  handlePrompt();
                }
              }}
            />
            <div id="btn-row">
              <button
                id="paperclip-icon-wrapper"
                className="icon-btn"
                data-tip="Attach a file"
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
          <FileCycler files={files} />
        </section>
      </main>
    </>
  );
};

export default Chat;
