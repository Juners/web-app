import Bedge from "./assets/Bedge.png";
import Pedant from "./assets/pedant.jpg";
import Money from "./assets/Money.png";
import Steel from "./assets/Steel.png";
import Titanium from "./assets/Titanium.png";
import Plants from "./assets/Plants.png";
import Energy from "./assets/Energy.png";
import Heat from "./assets/Heat.png";
import Terraformation from "./assets/Terraformation.png";
import Forest from "./assets/Forest.png";
import Temperature from "./assets/Temperature.png";

import { ResourceType } from "../Board/components/Resource/interface";

import { IconProps, MiscIcons, TileType } from "./interface";

import "./style.scss";

function Icon({ type }: IconProps) {
  let icon = (
    <div className="icon" style={{ backgroundColor: "white" }}>
      ?
    </div>
  );
  switch (type) {
    case ResourceType.MONEY:
      icon = (
        <div className="icon">
          <img alt="Money ammount" src={Money} />
        </div>
      );
      break;
    case ResourceType.STEEL:
      icon = (
        <div className="icon">
          <img alt="Steel ammount" src={Steel} />
        </div>
      );
      break;
    case ResourceType.TITANIUM:
      icon = (
        <div className="icon">
          <img alt="Titanium ammount" src={Titanium} />
        </div>
      );
      break;
    case ResourceType.PLANTS:
      icon = (
        <div className="icon">
          <img alt="Plants ammount" src={Plants} />
        </div>
      );
      break;
    case ResourceType.ENERGY:
      icon = (
        <div className="icon">
          <img alt="Energy ammount" src={Energy} />
        </div>
      );
      break;
    case ResourceType.HEAT:
      icon = (
        <div className="icon">
          <img alt="Heat ammount" src={Heat} />
        </div>
      );
      break;
    case ResourceType.TERRAFORMATION:
      icon = (
        <div className="icon">
          <img alt="Terraformation ammount" src={Terraformation} />
        </div>
      );
      break;
    case TileType.FOREST:
      icon = (
        <div className="icon">
          <img alt="Forest ammount" src={Forest} />
        </div>
      );
      break;
    case TileType.OCEAN:
      icon = <div className="icon" style={{ backgroundColor: "blue" }} />;
      break;
    case TileType.CITY:
      icon = <div className="icon" style={{ backgroundColor: "darkgray" }} />;
      break;
    case MiscIcons.MONEY_PRODUCTION:
      icon = (
        <div className="icon" style={{ backgroundColor: "gold" }}>
          1
        </div>
      );
      break;
    case MiscIcons.TEMPERATURE:
      icon = (
        <div className="icon">
          <img alt="Temperature ammount" src={Temperature} />
        </div>
      );
      break;
    case MiscIcons.PLAYING_GEN:
      icon = (
        <div className="icon">
          <img alt="Playing generation" src={Pedant} />
        </div>
      );
      break;
    case MiscIcons.ENDED_GEN:
      icon = (
        <div className="icon">
          <img alt="Generation ended" src={Bedge} />
        </div>
      );
      break;

    default:
      break;
  }

  return icon;
}

export default Icon;
