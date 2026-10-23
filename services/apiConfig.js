export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
export const PAGE_SIZE = 15;

export const API_ENDPOINTS = Object.freeze({
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    users: "/api/auth/user",
    userRole: "/api/auth/user/role",
    userPassword: "/api/auth/user/password",
  },
  dashboardStats: "/api/admin/dashboard/stats",
  appointments: "/api/appointments",
  appointment: (id) => `/api/appointments/${encodeURIComponent(id)}`,
  services: "/api/services",
  service: (id) => `/api/services/${encodeURIComponent(id)}`,
  staff: "/api/staff",
  staffMember: (id) => `/api/staff/${encodeURIComponent(id)}`,
  payments: "/api/payment",
  appointmentPayments: "/api/payment/appointments",
  paymentStatus: (id) => `/api/payment/${encodeURIComponent(id)}/status`,
  reports: {
    revenue: "/api/reports/revenue",
    appointmentRevenue: "/api/appointments/reports/revenue",
    serviceRevenue: "/api/appointments/reports/services",
  },
});
