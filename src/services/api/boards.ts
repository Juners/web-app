import { PlayerViewState } from "@/playerSlice";

const { protocol, hostname } = window.location;
export const API_URL = `${protocol}//${hostname}:3001`;

export async function GetBoards(): Promise<PlayerViewState[]> {
  const call = await fetch("http://192.168.0.27:3001/boards");
  const data = await call.json();
  return data;
}

export async function GetBoardByPlayer(
  player: string
): Promise<PlayerViewState> {
  const call = await fetch(`http://192.168.0.27:3001/boards/${player}`);
  const data = await call.json();
  return data;
}
