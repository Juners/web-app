import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PlayerViewState, ResourceState } from "./playerSlice";

import { ResourceType } from "./components/Board/components/Resource/interface";

import { RootState } from "./store";

// Define a type for the slice state
export type ResourceStateType = {
  [K in ResourceType]: {
    ammount: number;
    generation: number;
  };
};

export type GlobalBoardType = {
  user: string;
  playerColor: string;
  resourceState: PlayerViewState & ResourceState;
};

export interface GlobalViewState {
  doneGen: boolean;
  generation: number;
  outdated: boolean;
  boards: {
    [key: string]: GlobalBoardType;
  };
}

// Define the initial state using that type
const initialState: GlobalViewState = {
  doneGen: false,
  outdated: true,
  generation: 1,
  boards: {},
};

export const globalViewSlice = createSlice({
  name: "globalView",
  initialState,
  reducers: {
    changeBoardGeneration: (state, action: PayloadAction<number>) => {
      state.generation = action.payload;
    },
    updateBoards: (
      state,
      action: PayloadAction<{
        boards: [string, PlayerViewState & ResourceState][];
        generation: number;
      }>
    ) => {
      state.boards = Object.fromEntries(
        action.payload.boards.map(([k, v]) => [
          k,
          { user: k, playerColor: v.playerColor, resourceState: v },
        ])
      );
      state.outdated = false;

      if (action.payload.generation) {
        state.generation = action.payload.generation;
      }
    },
    changeOutdated: (state) => {
      state.outdated = true;
    },
  },
});

export const { changeBoardGeneration, changeOutdated, updateBoards } =
  globalViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBoards = (state: RootState) => state.globalView.boards;
export const selectBoardOf = (state: RootState) => (owner: string) =>
  state.globalView.boards[owner];
export const selectBoardGenerationState = (state: RootState) =>
  state.globalView.generation;
export const selectIsOutdated = (state: RootState) => state.globalView.outdated;

export default globalViewSlice.reducer;
