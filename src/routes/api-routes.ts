/**
 * API Routes Configuration
 *
 * This file centralizes all API endpoints used in the application
 * to make it easier to maintain and update them.
 */

// Base API URL
const API_BASE = "/api/v1";

// Auth related endpoints
export const AUTH_ROUTES = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  LOGOUT: `${API_BASE}/auth/logout`,
  CURRENT_USER: `${API_BASE}/auth/me`,
};

// User related endpoints
export const USER_ROUTES = {
  PROFILE: `${API_BASE}/users/profile`,
};

// Provider specific endpoints (for restaurant owners/providers)
export const PROVIDER_ROUTES = {
  DASHBOARD: `${API_BASE}/provider/dashboard`,
  MENU_ITEMS: `${API_BASE}/provider/menu-items`,
  ORDERS: `${API_BASE}/provider/orders`,
  STATS: `${API_BASE}/provider/stats`,
};

// Customer specific endpoints
export const CUSTOMER_ROUTES = {
  ORDERS: `${API_BASE}/customer/orders`,
  FAVORITES: `${API_BASE}/customer/favorites`,
  RECOMMENDATIONS: `${API_BASE}/customer/recommendations`,
};

// General food/menu related endpoints
export const FOOD_ROUTES = {
  MENU_ITEMS: `${API_BASE}/menu-items`,
  MENU_ITEM_DETAILS: (id: string) => `${API_BASE}/menu-items/${id}`,
  CATEGORIES: `${API_BASE}/categories`,
  SEARCH: `${API_BASE}/search`,
};

// Order related endpoints
export const ORDER_ROUTES = {
  CREATE: `${API_BASE}/orders`,
  DETAILS: (id: string) => `${API_BASE}/orders/${id}`,
  CANCEL: (id: string) => `${API_BASE}/orders/${id}/cancel`,
  PAYMENT: (id: string) => `${API_BASE}/orders/${id}/payment`,
};
