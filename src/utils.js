import { useState } from "react";

export const money = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));

export const dateTime = (v) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export const getList = (data, key) => (Array.isArray(data) ? data : data?.[key] || []);

export function useToast() {
  const [toast, setToast] = useState("");
  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }
  return [toast, notify];
}
