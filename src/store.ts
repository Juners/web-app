import { configureStore } from "@reduxjs/toolkit";
import globalViewSlice from "./globalViewSlice";
import playerSlice from "./playerSlice";

const store = configureStore({
  reducer: {
    globalView: globalViewSlice,
    playerView: playerSlice,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
