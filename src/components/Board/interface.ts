import { PlayerViewState } from "@/playerSlice";
import { ResourceType } from "./components/Resource/interface";

export interface PlayerBoardProps {
  resources: PlayerViewState;
  editable?: boolean;
  loading?: boolean;
  onClickCallback?: (data: {
    resource: ResourceType;
    disableGen?: boolean;
    minGen?: number;
  }) => void;
}
