export type PlayerObject = {
  name: string;
  color: string;
};

export interface ChoosePlayerProperties {
  onPlayerSelected: (player: PlayerObject) => void;
}
