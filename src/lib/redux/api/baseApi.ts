import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Create a base API to use throughout the app with authentication
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth slice
      const token = (getState() as RootState).auth.accessToken;

      // Add auth header if token exists
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Auth",
    "MenuItem",
    "Order",
    "Category",
    "Provider",
    "Customer",
  ],
  endpoints: () => ({}),
});
