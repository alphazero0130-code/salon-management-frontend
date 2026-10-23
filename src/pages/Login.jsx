import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { authApi } from "../../services/salonApi";
import { saveSession } from "../../services/sessionStore";
import { useUser } from "../context/UserContext";
import { Field } from "../components/Field";

export function Login() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);
  useEffect(() => {
    if (retryAfter <= 0) return undefined;
    const timer = window.setTimeout(
      () => setRetryAfter((seconds) => seconds - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [retryAfter]);
  const retryTime = `${Math.floor(retryAfter / 60)}m ${String(retryAfter % 60).padStart(2, "0")}s`;
  async function submit(e) {
    e.preventDefault();
    if (busy || retryAfter > 0) return;
    setBusy(true);
    setError("");
    try {
      if (register) {
        await authApi.register(form);
        setRegister(false);
        setError("Account created. Sign in with your new credentials.");
        setForm({ ...form, password: "" });
      } else {
        const result = await authApi.login({
          email: form.email,
          password: form.password,
        });
        if (!result?.token || !result?.user)
          throw new Error("Login response did not include a token and user.");
        saveSession(result.token, result.user);
        setUser(result.user);
        navigate(result.user.role === "admin" ? "/" : "/appointments");
      }
    } catch (err) {
      if (err.status === 429 && err.retryAfterSeconds) {
        setRetryAfter(err.retryAfterSeconds);
        setError("Too many requests. Please wait before trying again.");
      } else {
        setError(err.message || "Unable to connect to the server.");
      }
    } finally {
      setBusy(false);
    }
  }
  if (user) return <Navigate to="/" replace />;
  return (
    <div className="login-screen">
      <div className="login-art">
        <div className="login-logo">
          <div className="brand-mark">G</div>
          <strong>glow.</strong>
        </div>
        <div className="art-copy">
          <p className="eyebrow">GLOW SALON / STUDIO MANAGEMENT</p>
          <h1>A better day at the salon starts here.</h1>
          <p>
            Appointments, clients, services and your team—together in one
            easy-to-run workspace.
          </p>
        </div>
        <div className="art-footer">
          APPOINTMENTS &nbsp; · &nbsp; CLIENTS &nbsp; · &nbsp; SERVICES &nbsp; ·
          &nbsp; TEAM
        </div>
      </div>
      <div className="login-form-side">
        <form className="login-card" onSubmit={submit}>
          <span className="login-kicker">
            {register ? "JOIN YOUR WORKSPACE" : "WELCOME BACK"}
          </span>
          <h2>{register ? "Create your account" : "Sign in to Glow"}</h2>
          <p className="muted">
            {register
              ? "Register a staff account to get started."
              : "Enter your details to access your salon dashboard."}
          </p>
          {register && (
            <Field
              label="Full name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
              placeholder="Your name"
              disabled={retryAfter > 0}
            />
          )}
          <Field
            label="Email address"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
            placeholder="you@salon.com"
            disabled={retryAfter > 0}
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required
            minLength={register ? 8 : undefined}
            placeholder={
              register ? "At least 8 characters" : "Enter your password"
            }
            disabled={retryAfter > 0}
          />
          {error && (
            <div
              className={
                error.startsWith("Account created")
                  ? "notice success"
                  : "notice error"
              }
            >
              {error}
              {retryAfter > 0 && ` Retry in ${retryTime}.`}
            </div>
          )}
          <button
            className="btn btn-primary btn-wide"
            disabled={busy || retryAfter > 0}
          >
            {busy
              ? "Please wait…"
              : retryAfter > 0
                ? `Try again in ${retryTime}`
                : register
                  ? "Create account →"
                  : "Sign in →"}
          </button>
          <p className="switch-auth">
            {register ? "Already have an account?" : "New to this workspace?"}{" "}
            <button
              type="button"
              className="text-btn"
              disabled={retryAfter > 0}
              onClick={() => {
                setRegister(!register);
                setError("");
              }}
            >
              {" "}
              {register ? "Sign in" : "Create staff account"}
            </button>
          </p>
          <p className="login-note">
            Admin access is assigned by an existing administrator.
          </p>
        </form>
      </div>
    </div>
  );
}
