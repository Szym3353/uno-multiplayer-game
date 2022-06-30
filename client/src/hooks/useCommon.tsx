import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";

export default function useCommon() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.userReducer.user);
  const lobby = useSelector((state: RootState) => state.lobbyReducer.lobby);
  const game = useSelector((state: RootState) => state.gameReducer.game);

  return { navigate, location, dispatch, user, lobby, game };
}
