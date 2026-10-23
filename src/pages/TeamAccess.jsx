/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { authApi } from "../../services/salonApi";
import { PAGE_SIZE } from "../../services/apiConfig";
import { getList, useToast } from "../utils";
import { Field } from "../components/Field";
import { PageState } from "../components/PageState";
import { Modal } from "../components/Modal";
import { StatusBadge } from "../components/StatusBadge";
import { PersonCell } from "../components/PersonCell";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/ui/Button";
import { SelectField } from "../components/ui/SelectField";
import { Text } from "../components/ui/Text";

export function TeamAccess() {
  const [users, setUsers] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [page, setPage] = useState(1),
    [pagination, setPagination] = useState(null),
    [toast, notify] = useToast(),
    [passwordUser, setPasswordUser] = useState(null),
    [passwords, setPasswords] = useState({
      newPassword: "",
      confirmPassword: "",
    });
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data, pagination: pageInfo } = await authApi.listUsers({
        page,
        limit: PAGE_SIZE,
      });
      setUsers(getList(data, "user"));
      setPagination(pageInfo);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [page]);
  async function role(id, roleType) {
    try {
      await authApi.updateRole(id, roleType);
      notify("User role updated.");
      load();
    } catch (e) {
      notify(e.message);
    }
  }
  async function password(e) {
    e.preventDefault();
    try {
      await authApi.updatePassword({
        userId: passwordUser._id,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
      notify("Password updated.");
      setPasswordUser(null);
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (e) {
      notify(e.message);
    }
  }
  return (
    <>
      {toast && <div className="notice success">{toast}</div>}
      {error ? (
        <PageState error={error} onRetry={load} />
      ) : loading ? (
        <PageState loading />
      ) : (
        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <Text as="h3">Registered accounts</Text>
              <Text as="p">Only promote trusted users to administrator.</Text>
            </div>
            <Text as="span" className="result-count">
              {pagination?.total ?? users.length} accounts
            </Text>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>ACCESS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <PersonCell name={u.name} />
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <StatusBadge status="booked">{u.role}</StatusBadge>
                    </td>
                    <td>
                      <div className="row-actions">
                        <SelectField
                          className="mini-select"
                          value={u.role}
                          onChange={(e) => role(u._id, e.target.value)}
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </SelectField>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => setPasswordUser(u)}
                        >
                          Reset password
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </section>
      )}
      {passwordUser && (
        <Modal
          eyebrow="ACCOUNT SECURITY"
          title="Reset password"
          subtitle={passwordUser.email}
          onClose={() => setPasswordUser(null)}
          onSubmit={password}
        >
            <Field
              label="New password"
              type="password"
              value={passwords.newPassword}
              minLength={8}
              required
              onChange={(v) => setPasswords({ ...passwords, newPassword: v })}
            />
            <Field
              label="Confirm password"
              type="password"
              value={passwords.confirmPassword}
              minLength={8}
              required
              onChange={(v) =>
                setPasswords({ ...passwords, confirmPassword: v })
              }
            />
            <div className="modal-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setPasswordUser(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Update password</Button>
            </div>
        </Modal>
      )}
    </>
  );
}
