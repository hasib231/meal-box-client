import { baseApi } from "../../api/baseApi";
import { AUTH_ROUTES } from "@/routes/api-routes";

// Define response and request types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "provider";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider";
}

// Create API service as an extension of the base API
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: AUTH_ROUTES.LOGIN,
        method: "POST",
        body: credentials,
      }),
      // Invalidate the 'User' tag to refetch user data after login
      invalidatesTags: ["User"],
    }),

    // Registration mutation
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: AUTH_ROUTES.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),

    // Get current user query
    getCurrentUser: builder.query<User, void>({
      query: () => AUTH_ROUTES.CURRENT_USER,
      providesTags: ["User"],
    }),

    // Logout mutation
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: AUTH_ROUTES.LOGOUT,
        method: "POST",
      }),
      // Invalidate the 'User' tag after logout
      invalidatesTags: ["User"],
    }),
  }),
});

// Export the auto-generated hooks for the endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
