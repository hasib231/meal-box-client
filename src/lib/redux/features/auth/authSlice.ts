import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "next-auth";

// Define the state type for auth
interface AuthState {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: "customer" | "provider";
  } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
};

// Create the auth slice with reducers
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set credentials when user logs in or session is restored
    setCredentials: (
      state,
      action: PayloadAction<{
        user: Session["user"];
        accessToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // Clear credentials when user logs out
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Update user details (e.g. after profile update)
    updateUserDetails: (
      state,
      action: PayloadAction<Partial<AuthState["user"]>>
    ) => {
      if (state.user && action.payload) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

// Export actions for use in components
export const {
  setCredentials,
  clearCredentials,
  setLoading,
  updateUserDetails,
} = authSlice.actions;

// Export the reducer for the store
export default authSlice.reducer;
