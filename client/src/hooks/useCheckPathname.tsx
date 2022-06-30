import { useEffect } from "react";
import { socket } from "../socketio";
import useCommon from "./useCommon";

//Check pathname. If logged user is in game or lobby change his path to this particular page.

export default function useCheckPathname(data: any) {
  const { navigate, location } = useCommon();
  useEffect(() => {
    if (data?.checkIfInLobby) {
      socket.emit("rejoin-lobby", { rejoinId: data.checkIfInLobby.id });
      if (data.checkIfInLobby.userInGame) {
        if (
          !location.pathname.includes(`/game/${data.checkIfInLobby.gameId}`)
        ) {
          navigate(`/game/${data.checkIfInLobby.gameId}`);
        }
      } else {
        if (data?.checkIfInLobby?.id?.length > 0) {
          if (!location.pathname.includes(`/lobby/${data.checkIfInLobby.id}`)) {
            navigate(`/lobby/${data.checkIfInLobby.id}`);
          }
        }
      }
    }
  }, [data]);
}
