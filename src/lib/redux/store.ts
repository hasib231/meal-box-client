import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";

// Create the Redux store with all the reducers
export const store = configureStore({
  reducer: {
    // Add the API reducer to the store
    [baseApi.reducerPath]: baseApi.reducer,
    // Add the auth slice reducer
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
