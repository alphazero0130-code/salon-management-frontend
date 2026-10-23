import { API_ENDPOINTS } from "./apiConfig";
import { get, getPage, patch, post, put, remove } from "./httpClient";

export const authApi = {
  register: (user) => post(API_ENDPOINTS.auth.register, user),
  login: (credentials) => post(API_ENDPOINTS.auth.login, credentials),
  listUsers: (options) => getPage(API_ENDPOINTS.auth.users, options),
  updateRole: (userId, roleType) =>
    patch(API_ENDPOINTS.auth.userRole, { userId, roleType }),
  updatePassword: (passwordUpdate) =>
    patch(API_ENDPOINTS.auth.userPassword, passwordUpdate),
};

export const dashboardApi = {
  getStats: () => get(API_ENDPOINTS.dashboardStats),
  listAppointments: (options) => getPage(API_ENDPOINTS.appointments, options),
  listServices: (options) => getPage(API_ENDPOINTS.services, options),
};

export const appointmentsApi = {
  list: (options) => getPage(API_ENDPOINTS.appointments, options),
  create: (appointment) => post(API_ENDPOINTS.appointments, appointment),
  updateStatus: (id, status) =>
    patch(API_ENDPOINTS.appointment(id), { status }),
  remove: (id) => remove(API_ENDPOINTS.appointment(id)),
};

const resourceEndpoints = {
  customers: { path: API_ENDPOINTS.auth.users },
  services: { path: API_ENDPOINTS.services, key: "services" },
  staff: { path: API_ENDPOINTS.staff, key: "staff" },
};

export const resourcesApi = {
  list: (kind, options) => {
    const resource = resourceEndpoints[kind];
    if (!resource) throw new Error(`Unsupported resource: ${kind}`);
    return getPage(resource.path, options);
  },
  save: (kind, id, data) => {
    if (kind === "services") {
      return id
        ? put(API_ENDPOINTS.service(id), data)
        : post(API_ENDPOINTS.services, data);
    }
    if (kind === "staff") {
      return id
        ? put(API_ENDPOINTS.staffMember(id), data)
        : post(API_ENDPOINTS.staff, data);
    }
    throw new Error(`The ${kind} resource is read-only or unsupported.`);
  },
  remove: (kind, id) => {
    if (kind === "services") return remove(API_ENDPOINTS.service(id));
    if (kind === "staff") return remove(API_ENDPOINTS.staffMember(id));
    throw new Error(`The ${kind} resource is read-only or unsupported.`);
  },
};

export const paymentsApi = {
  list: (filter, options) =>
    getPage(
      filter ? API_ENDPOINTS.appointmentPayments : API_ENDPOINTS.payments,
      options,
    ),
  updateStatus: (id, status, method) =>
    patch(API_ENDPOINTS.paymentStatus(id), {
      status,
      ...(status === "paid" ? { method } : {}),
    }),
};

export const reportsApi = {
  getRevenue: () => get(API_ENDPOINTS.reports.revenue),
  getAppointmentRevenue: () => get(API_ENDPOINTS.reports.appointmentRevenue),
  listServiceRevenue: (options) =>
    getPage(API_ENDPOINTS.reports.serviceRevenue, options),
};
