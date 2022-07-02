import { PlayerViewState } from "@/playerSlice";

const { protocol, hostname } = window.location;
export const API_URL = `${protocol}//${hostname}:3001`;

export async function GetBoards(): Promise<PlayerViewState[]> {
  const call = await fetch(`${API_URL}/boards`);
  const data = await call.json();
  return data;
}

export async function GetBoardByPlayer(
  player: string
): Promise<PlayerViewState> {
  const call = await fetch(`${API_URL}/boards/${player}`);
  const data = await call.json();
  return data;
}

export async function FinishGen(player: string): Promise<PlayerViewState> {
  const call = await fetch(`${API_URL}/users/${player}/board/finishGen`, {
    method: "POST",
  });
  const data = await call.json();
  return data;
}

export async function EndTurn(player: string): Promise<PlayerViewState> {
  const call = await fetch(`${API_URL}/users/${player}/board/endTurn`, {
    method: "POST",
  });
  const data = await call.json();
  return data;
}
