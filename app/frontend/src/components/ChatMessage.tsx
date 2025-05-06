import React from "react";
import gemini from "../assets/gemini.png";
import { Message } from "../types/types";

const ChatMessage: React.FC<Message> = ({
  role,
  content,
  timestamp,
  isPlaceholder,
}) => {
  return (
    <div className={`chat-msg ${role}`}>
      <div className="msg-img-container">
        {role === "user" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-person-fill msg-img"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        ) : (
          <img src={gemini} className="msg-img" />
        )}
      </div>

      <div>
        <span>
          <small className="msg-role">{role}</small>
          <small className="msg-time">{timestamp}</small>
        </span>

        <div className="msg-text">
          {isPlaceholder ? (
            <small className="glow-word">thinking&nbsp;…</small>
          ) : (
            <small>{content}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
