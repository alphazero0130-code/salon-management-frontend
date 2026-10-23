import { API_BASE_URL, PAGE_SIZE } from "./apiConfig";
import { clearSession, getToken } from "./sessionStore";

function buildPaginatedPath(path, { page = 1, limit = PAGE_SIZE, params = {} } = {}) {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(path, baseUrl);
  const requestedLimit = Number(limit);
  const pageLimit = Number.isFinite(requestedLimit)
    ? Math.min(PAGE_SIZE, Math.max(1, Math.floor(requestedLimit)))
    : PAGE_SIZE;
  const search = new URLSearchParams(url.search);

  search.set("page", String(page));
  search.set("limit", String(pageLimit));
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  url.search = search.toString();
  return `${url.pathname}${url.search}`;
}

async function requestResult(path, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const result = await response.json().catch(() => null);

  if (response.status === 401) {
    clearSession();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.assign("/login");
    }
  }

  if (!response.ok || result?.success === false) {
    const error = new Error(
      result?.message ||
        result?.errors?.join?.(", ") ||
        `Request failed (${response.status})`,
    );
    error.status = response.status;
    const retryAfter = Number(response.headers.get("Retry-After"));
    if (response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
      error.retryAfterSeconds = retryAfter;
    }
    throw error;
  }

  return result;
}

export async function get(path) {
  const result = await requestResult(path);
  return result?.data ?? result;
}

export async function post(path, body) {
  const result = await requestResult(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return result?.data ?? result;
}

export async function patch(path, body) {
  const result = await requestResult(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return result?.data ?? result;
}

export async function put(path, body) {
  const result = await requestResult(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return result?.data ?? result;
}

export async function remove(path) {
  const result = await requestResult(path, { method: "DELETE" });
  return result?.data ?? result;
}

export async function getPage(path, options = {}) {
  const result = await requestResult(
    buildPaginatedPath(path, options),
  );
  const data = result?.data ?? result;
  const pagination =
    result?.pagination ??
    result?.meta?.pagination ??
    result?.metadata?.pagination ??
    data?.pagination ??
    data?.meta?.pagination ??
    data?.metadata?.pagination;

  if (
    !pagination ||
    !Number.isInteger(pagination.page) ||
    !Number.isInteger(pagination.limit) ||
    !Number.isInteger(pagination.total) ||
    !Number.isInteger(pagination.totalPages)
  ) {
    return { data, pagination: null };
  }

  return { data, pagination };
}
