import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import PlayerBoard from "./views/Board";
import ChoosePlayer from "./views/ChoosePlayer/ChoosePlayer";
import ChangeBoard from "./views/ChangeBoard";
import SimplePlayerBoard from "./views/SimpleBoard";

import { useAppDispatch } from "./hooks";
import { changeBoardGeneration, changeOutdated } from "./resourceSlice";

import "./App.scss";

function App() {
  const dispatch = useAppDispatch();
  // const resources = useAppSelector(selectResourceState);

  const [player, setPlayer] = useState<string>();

  const socket = useRef<Socket>();

  useEffect(() => {
    if (!socket.current) {
      console.info("Opening socket");
      socket.current = io("ws://localhost:3001");
      // Connection opened
      socket.current.on("connect", () => {
        console.log("connected!");
        socket.current?.send("Hello Server!");
      });
      // Listen for messages
      socket.current.on("message", function (event) {
        console.log("Message from server ", event.data);
      });

      socket.current.on("newGeneration", function (event) {
        dispatch(changeBoardGeneration(event.data.generation));
      });

      socket.current.on("boardUpdated", function (event) {
        dispatch(changeOutdated(event.data.user));
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
          <Route
            path="/*"
            element={
              <ChoosePlayer onPlayerSelected={(player) => setPlayer(player)} />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
