import { API_URL } from "./boards";

export async function GetGeneration(): Promise<number> {
  const call = await fetch(`${API_URL}/currentGeneration`);
  const data = await call.json();
  return data;
}
