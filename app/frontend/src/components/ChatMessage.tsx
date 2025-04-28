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
    <div
      key={`msg-${timestamp}`}
      className={`chat-msg ${
        role === "user"
          ? "float-end justify-content-end"
          : "justify-content-start"
      }`}
    >
      <div className="msg-img-container rounded-circle">
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
          // <svg
          //   xmlns="http://www.w3.org/2000/svg"
          //   width="30"
          //   height="30"
          //   fill="currentColor"
          //   className="bi bi-person-circle msg-img"
          //   viewBox="0 0 16 16"
          // >
          //   <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          //   <path
          //     fill-rule="evenodd"
          //     d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          //   />
          // </svg>
          <img src={gemini} className="msg-img" />
        )}
      </div>

      <div className="">
        <span className="">
          <small className="msg-role">{role}</small>
          <small className="msg-time">{timestamp}</small>
        </span>
        <div className="msg-text">
          {isPlaceholder ? (
            <div className="placeholder-glow">
              <span
                className="placeholder d-block mb-2"
                style={{ width: "300%" }}
              ></span>
              <span
                className="placeholder d-block mb-2"
                style={{ width: "250%" }}
              ></span>
              <span
                className="placeholder d-block mb-2"
                style={{ width: "175%" }}
              ></span>
              <span
                className="placeholder d-block mb-2"
                style={{ width: "225%" }}
              ></span>
              <span
                className="placeholder d-block"
                style={{ width: "275%" }}
              ></span>
            </div>
          ) : (
            <small>{content}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
