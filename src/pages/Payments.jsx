/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { paymentsApi } from "../../services/salonApi";
import { PAGE_SIZE } from "../../services/apiConfig";
import { dateTime, getList, money, useToast } from "../utils";
import { PageState } from "../components/PageState";
import { EmptyState } from "../components/EmptyState";
import { StatusBadge } from "../components/StatusBadge";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/ui/Button";
import { SelectField } from "../components/ui/SelectField";
import { Text } from "../components/ui/Text";

export function Payments() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [filter, setFilter] = useState(""),
    [page, setPage] = useState(1),
    [pagination, setPagination] = useState(null),
    [toast, notify] = useToast();
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data, pagination: pageInfo } = await paymentsApi.list(filter, {
        page,
        limit: PAGE_SIZE,
      });
      setRows(getList(data, "payments"));
      setPagination(pageInfo);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [filter, page]);
  async function update(id, status, method) {
    try {
      await paymentsApi.updateStatus(id, status, method);
      notify("Payment updated.");
      load();
    } catch (e) {
      notify(e.message);
    }
  }
  return (
    <>
      <div className="toolbar">
        <div className="filter-select">
          <Text as="span">Category</Text>
          <SelectField
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All payments</option>
            <option value="appointments">Appointments</option>
          </SelectField>
        </div>
        <Text as="span" className="result-count">
          {pagination?.total ?? rows.length} payments
        </Text>
        <Button variant="secondary" onClick={load}>
          ↻ Refresh
        </Button>
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
                  <th>PAYMENT</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>METHOD</th>
                  <th>PAID AT</th>
                  <th>UPDATE</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.type || "Payment"}</strong>
                      <small className="cell-sub">
                        {p._id?.slice(-8).toUpperCase()}
                      </small>
                    </td>
                    <td>
                      <strong>{money(p.amount)}</strong>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>{p.method || "—"}</td>
                    <td>{dateTime(p.paidAt)}</td>
                    <td>
                      <div className="payment-actions">
                        <SelectField
                          defaultValue={p.status}
                          id={`status-${p._id}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </SelectField>
                        <SelectField
                          defaultValue={p.method || "upi"}
                          id={`method-${p._id}`}
                        >
                          <option value="upi">UPI</option>
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                        </SelectField>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() =>
                            update(
                              p._id,
                              document.getElementById(`status-${p._id}`).value,
                              document.getElementById(`method-${p._id}`).value,
                            )
                          }
                        >
                          Save
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <EmptyState
                icon="◈"
                title="No payments found"
                description="Payments are created when an appointment is booked."
              />
            )}
          </div>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </section>
      )}
    </>
  );
}
