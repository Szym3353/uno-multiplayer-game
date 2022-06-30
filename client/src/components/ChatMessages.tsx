import React from "react";
import { message } from "../store/lobbySlice";

type props = {
  lobbyChat: message[];
};

const ChatMessages = ({ lobbyChat }: props) => {
  return (
    <>
      {lobbyChat
        .slice(0)
        .reverse()
        .map((message: message, i: number) => {
          return (
            <p
              key={i}
              className={`lobby-chat-message message-${message.messageType}`}
            >
              {message.messageType === "user" && (
                <>
                  <span className="chat-message-time">{`[${
                    message.createdAt.split("T")[1].split(".")[0]
                  }]`}</span>
                  <span className="chat-message-author">
                    {" "}
                    {message.author}:
                  </span>
                </>
              )}
              <span className="chat-message-message">{` ${message.message}`}</span>
            </p>
          );
        })}
    </>
  );
};

export default ChatMessages;
