import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2, UsersRound } from "lucide-react";
import { Modal } from "../components/Modal";
import { UserForm } from "../components/UserForm";
import type { User, UserInput } from "../types";

export function Users({
  users,
  loading,
  error,
  create,
  update,
  remove
}: {
  users: User[];
  loading: boolean;
  error: string;
  create: (payload: UserInput) => Promise<unknown>;
  update: (id: string, payload: UserInput) => Promise<unknown>;
  remove: (id: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<"create" | "edit" | "view" | "delete" | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [actionError, setActionError] = useState("");

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const matchesQuery = `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "All" || user.status === status;
        return matchesQuery && matchesStatus;
      }),
    [users, query, status]
  );

  const open = (type: typeof modal, user?: User) => {
    setActionError("");
    setSelected(user || null);
    setModal(type);
  };

  const close = () => {
    setModal(null);
    setSelected(null);
    setActionError("");
  };

  const save = async (payload: UserInput) => {
    try {
      if (selected) await update(selected._id, payload);
      else await create(payload);
      close();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save user.");
      throw err;
    }
  };

  const deleteSelected = async () => {
    if (!selected) return;
    try {
      await remove(selected._id);
      close();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete user.");
    }
  };

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Directory</span>
          <h1>User management<span className="title-dot">.</span></h1>
          <p>Manage user accounts, roles, and access permissions.</p>
        </div>
        <button className="button primary" onClick={() => open("create")}><Plus size={17} /> Add user</button>
      </div>

      <section className="content-card">
        <div className="toolbar">
          <div className="search">
            <Search size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or phone…" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        {error && <div className="alert">{error}</div>}
        {loading ? (
          <div className="empty">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <UsersRound size={30} />
            <strong>No matching users</strong>
            <span>Try a different search or create a new user.</span>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id}>
                    <td><div className="person table-person"><div className="avatar small">{user.name.slice(0, 2).toUpperCase()}</div><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
                    <td>{user.phone}</td>
                    <td><span className="role-pill">{user.role}</span></td>
                    <td><span className={`badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-button" onClick={() => open("view", user)} title="View"><Eye size={16} /></button>
                        <button className="icon-button" onClick={() => open("edit", user)} title="Edit"><Pencil size={16} /></button>
                        <button className="icon-button danger" onClick={() => open("delete", user)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal === "create" && <Modal title="Create user" onClose={close}><UserForm onSubmit={save} onCancel={close} /></Modal>}
      {modal === "edit" && <Modal title="Edit user" onClose={close}><UserForm user={selected} onSubmit={save} onCancel={close} /></Modal>}

      {modal === "view" && selected && (
        <Modal title="User details" onClose={close}>
          <div className="detail-profile">
            <div className="avatar large">{selected.name.slice(0, 2).toUpperCase()}</div>
            <h3>{selected.name}</h3><p>{selected.email}</p>
          </div>
          <div className="detail-grid">
            <div><span>Phone</span><strong>{selected.phone}</strong></div>
            <div><span>Role</span><strong>{selected.role}</strong></div>
            <div><span>Status</span><strong>{selected.status}</strong></div>
            <div><span>Joined</span><strong>{new Date(selected.createdAt).toLocaleString()}</strong></div>
          </div>
        </Modal>
      )}

      {modal === "delete" && selected && (
        <Modal title="Delete user" onClose={close}>
          <div className="confirm">
            <div className="danger-circle"><Trash2 size={22} /></div>
            <h3>Delete {selected.name}?</h3>
            <p>This action cannot be undone. This will permanently remove the user from the organization directory.</p>
            {actionError && <div className="alert">{actionError}</div>}
            <div className="form-actions">
              <button className="button secondary" onClick={close}>Cancel</button>
              <button className="button danger-button" onClick={deleteSelected}>Delete user</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}