import { ResourceType } from "../Board/components/Resource/interface";

export enum TileType {
  FOREST = "FOREST",
  OCEAN = "OCEAN",
  CITY = "CITY",
}

export enum MiscIcons {
  MONEY_PRODUCTION = "MONEY_PRODUCTION",
  TEMPERATURE = "TEMPERATURE",
  PLAYING_GEN = "PLAYING_GEN",
  ENDED_GEN = "ENDED_GEN",
}

export interface IconProps {
  type: ResourceType | TileType | MiscIcons;
}
