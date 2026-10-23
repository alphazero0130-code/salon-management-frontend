/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { resourcesApi } from "../../services/salonApi";
import { PAGE_SIZE } from "../../services/apiConfig";
import { useUser } from "../context/UserContext";
import { getList, money, useToast } from "../utils";
import { Field } from "../components/Field";
import { PageState } from "../components/PageState";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { StatusBadge } from "../components/StatusBadge";
import { PersonCell } from "../components/PersonCell";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/ui/Button";
import { Text } from "../components/ui/Text";
import { TextField } from "../components/ui/TextField";

export function ResourcePage({ kind }) {
  const config = {
    customers: {
      title: "Users",
      key: "user",
      readOnly: true,
      fields: [
        ["name", "Full name", "text", true],
        ["email", "Email address", "email", true],
        ["role", "Role", "text", true],
      ],
      columns: [
        ["name", "User"],
        ["email", "Email"],
        ["role", "Role"],
      ],
    },
    services: {
      title: "Services",
      key: "services",
      fields: [
        ["name", "Service name", "text", true],
        ["description", "Description", "text", false],
        ["price", "Price (₹)", "number", true],
        ["duration", "Duration (minutes)", "number", true],
      ],
      columns: [
        ["name", "Service"],
        ["description", "Description"],
        ["price", "Price"],
        ["duration", "Duration"],
        ["isActive", "Status"],
      ],
    },
    staff: {
      title: "Team",
      key: "staff",
      fields: [
        ["name", "Full name", "text", true],
        ["email", "Email address", "email", true],
        ["jobTitle", "Job title", "text", true],
      ],
      columns: [
        ["name", "Team member"],
        ["email", "Email"],
        ["jobTitle", "Job title"],
        ["isAvailable", "Availability"],
      ],
    },
  }[kind];
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    [pagination, setPagination] = useState(null),
    [modal, setModal] = useState(false),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState({}),
    [busy, setBusy] = useState(false),
    [toast, notify] = useToast();
  const { user } = useUser();
  const admin = user?.role === "admin";
  const canMutate = admin && !config.readOnly;
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data, pagination: pageInfo } = await resourcesApi.list(kind, {
        page,
        limit: PAGE_SIZE,
        params: { search: search || undefined },
      });
      setRows(getList(data, config.key));
      setPagination(pageInfo);
      if (pageInfo && page > Math.max(pageInfo.totalPages, 1)) {
        setPage(Math.max(pageInfo.totalPages, 1));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [search, page]);
  function open(row = null) {
    setEditing(row);
    const init = {};
    config.fields.forEach(
      ([k]) => (init[k] = row?.[k] ?? (k === "status" ? "active" : "")),
    );
    setForm(init);
    setModal(true);
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { ...form };
      if (kind === "services") {
        body.price = Number(body.price);
        body.duration = Number(body.duration);
      }
      await resourcesApi.save(kind, editing?._id, body);
      setModal(false);
      notify(
        `${config.title.slice(0, -1) || config.title} ${editing ? "updated" : "created"} successfully`,
      );
      load();
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(row) {
    if (!window.confirm(`Delete ${row.name}? This cannot be undone.`)) return;
    try {
      await resourcesApi.remove(kind, row._id);
      notify("Record deleted.");
      load();
    } catch (e) {
      notify(e.message);
    }
  }
  const visible = rows.filter((r) =>
    config.fields.some(([k]) =>
      String(r[k] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
  );
  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Text as="span">⌕</Text>
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${config.title.toLowerCase()}…`}
          />
        </div>
        <Text as="span" className="result-count">
          {pagination?.total ?? rows.length} records
        </Text>
        {canMutate && (
          <Button onClick={() => open()}>
            ＋ Add{" "}
            {kind === "staff"
              ? "team member"
              : kind === "services"
                ? "service"
                : "customer"}
          </Button>
        )}
      </div>
      {toast && <div className="notice success">{toast}</div>}
      {error ? (
        <PageState error={error} onRetry={load} />
      ) : loading ? (
        <PageState loading />
      ) : (
        <section className="panel table-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {config.columns.map((c) => (
                    <th key={c[0]}>{c[1].toUpperCase()}</th>
                  ))}
                  {canMutate && <th>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row._id}>
                    {config.columns.map(([key]) => (
                      <td key={key}>
                        {key === "name" ? (
                          <PersonCell name={row.name} />
                        ) : key === "price" ? (
                          money(row[key])
                        ) : key === "status" ? (
                          <StatusBadge status={row[key]} />
                        ) : key === "isActive" ? (
                          <StatusBadge
                            status={row[key] ? "active" : "inactive"}
                          >
                            {row[key] ? "Active" : "Inactive"}
                          </StatusBadge>
                        ) : key === "isAvailable" ? (
                          <span
                            className={`availability ${row[key] ? "available" : "unavailable"}`}
                          >
                            {row[key] ? "● Available" : "○ Unavailable"}
                          </span>
                        ) : (
                          (row[key] ?? "—")
                        )}
                      </td>
                    ))}
                    {canMutate && (
                      <td>
                        <div className="row-actions">
                          <Button
                            variant="icon"
                            title="Edit"
                            onClick={() => open(row)}
                          >
                            ✎
                          </Button>
                          <Button
                            variant="danger"
                            title="Delete"
                            onClick={() => remove(row)}
                          >
                            ⌫
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && (
              <EmptyState
                title="No matching records"
                description={
                  config.readOnly
                    ? "Try another search."
                    : "Try another search or add a new record."
                }
              />
            )}
          </div>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </section>
      )}
      {modal && (
        <Modal
          eyebrow={editing ? "UPDATE RECORD" : "NEW RECORD"}
          title={`${editing ? "Edit" : "Add"} ${kind === "staff" ? "team member" : kind === "services" ? "service" : "customer"}`}
          onClose={() => setModal(false)}
          onSubmit={save}
        >
            <div className="form-grid">
              {config.fields.map(([key, label, type, required]) =>
                key === "status" ? (
                  <Field
                    key={key}
                    label={label}
                    value={form[key]}
                    onChange={(v) => setForm({ ...form, [key]: v })}
                    required
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                  />
                ) : (
                  <Field
                    key={key}
                    label={label}
                    type={type}
                    value={form[key]}
                    onChange={(v) => setForm({ ...form, [key]: v })}
                    required={required}
                    min={type === "number" ? 1 : undefined}
                    placeholder={label}
                  />
                ),
              )}
            </div>
            <div className="modal-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : editing ? "Save changes" : "Create record"}
              </Button>
            </div>
        </Modal>
      )}
    </>
  );
}
