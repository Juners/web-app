import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ResourceType } from "./components/Board/components/Resource/interface";

import { RootState } from "./store";

// Define a type for the slice state
export type ResourceState = {
  [K in ResourceType]: {
    ammount: number;
    generation: number;
  };
};

export interface PlayerViewState extends ResourceState {
  doneGen: boolean;
  fetch: boolean;
  generation: number;
  outdated: boolean;
  user: string;
  playerColor: string;
}

// Define the initial state using that type
const initialState: PlayerViewState = {
  doneGen: false,
  fetch: false,
  generation: 1,
  outdated: false,
  user: "",
  playerColor: "",
  TERRAFORMATION: {
    ammount: 20,
    generation: 0,
  },
  MONEY: {
    ammount: 0,
    generation: 0,
  },
  STEEL: {
    ammount: 0,
    generation: 0,
  },
  TITANIUM: {
    ammount: 0,
    generation: 0,
  },
  PLANTS: {
    ammount: 0,
    generation: 0,
  },
  ENERGY: {
    ammount: 0,
    generation: 0,
  },
  HEAT: {
    ammount: 0,
    generation: 0,
  },
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    changeGeneration: (
      state,
      action: PayloadAction<{ resource: ResourceType; value: number }>
    ) => {
      const { resource, value } = action.payload;
      state[resource].generation = value;
      state.fetch = false;
    },
    changeAmmount: (
      state,
      action: PayloadAction<{ resource: ResourceType; value: number }>
    ) => {
      const { resource, value } = action.payload;
      state[resource].ammount = value;
      state.fetch = false;
    },
    changeBoardGeneration: (state, action: PayloadAction<number>) => {
      state.generation = action.payload;
    },
    changeState: (
      state,
      action: PayloadAction<{
        state: ResourceState;
        user: string;
        generation?: number;
        fetch?: boolean;
      }>
    ) => {
      state = Object.assign(state, action.payload.state);
      state.outdated = false;

      state.user = action.payload.user;

      if (action.payload.fetch) {
        state.fetch = action.payload.fetch;
      }
      if (action.payload.generation) {
        state.generation = action.payload.generation;
      }
    },
    changeOutdated: (state, action: PayloadAction<string>) => {
      if (state.user === action.payload) {
        state.outdated = true;
      }
    },
  },
});

export const {
  changeAmmount,
  changeBoardGeneration,
  changeGeneration,
  changeState,
  changeOutdated,
} = playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectResource = (state: RootState) => (resource: ResourceType) =>
  state.playerView[resource];
export const selectPlayerViewState = (state: RootState) => state.playerView;
export const selectBoardGenerationState = (state: RootState) =>
  state.playerView.generation;
export const selectIsOutdated = (state: RootState) => state.playerView.outdated;

export default playerSlice.reducer;
