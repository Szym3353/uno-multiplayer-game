import { useEffect, useState } from "react";
import { socket } from "../socketio";
import { receiveMessageGame } from "../store/gameSlice";
import { receiveMessageLobby } from "../store/lobbySlice";
import useCommon from "./useCommon";

export default function useChat(
  username: string,
  lobbyId: string,
  gameChatCheck: boolean
) {
  const [chatMessage, setChatMessage] = useState<string>("");
  const { dispatch } = useCommon();

  useEffect(() => {
    socket.on("receive-message", (socketData) => {
      gameChatCheck
        ? dispatch(receiveMessageGame(socketData))
        : dispatch(receiveMessageLobby(socketData));
    });
    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setChatMessage("");
    socket.emit("send-message", {
      username,
      lobbyId,
      chatMessage,
    });
  };

  return { setChatMessage, sendMessage, chatMessage };
}
