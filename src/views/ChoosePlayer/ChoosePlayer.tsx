import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./style.scss";

interface ChoosePlayerProperties {
  onPlayerSelected: (player: string) => void;
}

function ChoosePlayer({ onPlayerSelected }: ChoosePlayerProperties) {
  const [player, setPlayer] = useState<string>();
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    player && onPlayerSelected(player);
  }, [onPlayerSelected, player]);

  return (
    <div className="choose-player">
      <div className="top">
        <h1>Choose user{simple ? " (Simple mode)" : ""}</h1>
        <button className="simpleModeToggle" onClick={() => setSimple(!simple)}>
          {simple ? "Disable" : "Enable"} Simple mode
        </button>
      </div>
      <ul>
        <Link
          onClick={() => setPlayer("javier")}
          to={`/boards/javier${simple ? "/simple" : ""}`}
        >
          <li>Javier</li>
        </Link>
        <Link
          onClick={() => setPlayer("ivan")}
          to={`/boards/ivan${simple ? "/simple" : ""}`}
        >
          <li>Ivan</li>
        </Link>
        <Link
          onClick={() => setPlayer("alex")}
          to={`/boards/alex${simple ? "/simple" : ""}`}
        >
          <li>Alex</li>
        </Link>
        <Link
          onClick={() => setPlayer("marc")}
          to={`/boards/marc${simple ? "/simple" : ""}`}
        >
          <li>Marc</li>
        </Link>
        <Link
          onClick={() => setPlayer("sergi")}
          to={`/boards/sergi${simple ? "/simple" : ""}`}
        >
          <li>Sergi</li>
        </Link>
      </ul>
    </div>
  );
}

export default ChoosePlayer;
