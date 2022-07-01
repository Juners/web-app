import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import PlayerBoard from "./views/BoardView";
import ChoosePlayer from "./views/ChoosePlayer/ChoosePlayer";
import ChangeBoard from "./views/ChangeBoard";
import GlobalView from "./views/GlobalView";
import SimplePlayerBoard from "./views/SimpleBoard";

import { useAppDispatch } from "./hooks";
import { changeBoardGeneration, changeOutdated } from "./playerSlice";
import {
  changeBoardGeneration as changeGlobalViewBoardGen,
  changeOutdated as changeGlobalOutdated,
} from "./globalViewSlice";

import { PlayerObject } from "./views/ChoosePlayer/interface";

import "./App.scss";

function App() {
  const dispatch = useAppDispatch();

  const [player, setPlayer] = useState<PlayerObject>();

  const socket = useRef<Socket>();

  useEffect(() => {
    if (!socket.current) {
      console.info("Opening socket");
      socket.current = io(`ws://${window.location.hostname}:3001`);

      socket.current.on("newGeneration", function (event) {
        dispatch(changeBoardGeneration(event.data.generation));
        dispatch(changeGlobalViewBoardGen(event.data.generation));
      });

      socket.current.on("boardUpdated", function (event) {
        console.log("boardUpdated");
        dispatch(changeOutdated(event.data.user));
        dispatch(changeGlobalOutdated());
      });
    }
    // return () => {
    //   if (socket.current?.active) {
    //     socket.current?.close();
    //     console.info("Closing socket");
    //   }
    // };
  }, [dispatch]);

  return (
    <div className="App" style={{ maxHeight: `${window.innerHeight}px` }}>
      <Routes>
        {player ? (
          <>
            <Route
              path="/boards"
              element={<ChangeBoard logedPlayer={player} />}
            />
            <Route
              path="/boards/:user"
              element={<PlayerBoard logedPlayer={player} />}
            />
            <Route
              path="/boards/:user/simple"
              element={<SimplePlayerBoard logedPlayer={player} />}
            />
          </>
        ) : (
          <>
            <Route path="/spectator" element={<GlobalView />} />
            <Route
              path="/*"
              element={
                <ChoosePlayer
                  onPlayerSelected={(player) => setPlayer(player)}
                />
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
