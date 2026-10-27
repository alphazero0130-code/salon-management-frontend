const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://salon-management-backend-1t3o.onrender.com/api";
const normalizedApiBaseUrl = configuredApiBaseUrl.trim().replace(/\/+$/, "");

export const API_BASE_URL = /\/api$/i.test(normalizedApiBaseUrl)
  ? normalizedApiBaseUrl
  : `${normalizedApiBaseUrl}/api`;
export const PAGE_SIZE = 15;

export const API_ENDPOINTS = Object.freeze({
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    users: "/auth/user",
    userRole: "/auth/user/role",
    userPassword: "/auth/user/password",
  },
  dashboardStats: "/admin/dashboard/stats",
  appointments: "/appointments",
  appointment: (id) => `/appointments/${encodeURIComponent(id)}`,
  services: "/services",
  service: (id) => `/services/${encodeURIComponent(id)}`,
  staff: "/staff",
  staffMember: (id) => `/staff/${encodeURIComponent(id)}`,
  payments: "/payment",
  appointmentPayments: "/payment/appointments",
  paymentStatus: (id) => `/payment/${encodeURIComponent(id)}/status`,
  reports: {
    revenue: "/reports/revenue",
    appointmentRevenue: "/appointments/reports/revenue",
    serviceRevenue: "/appointments/reports/services",
  },
});
