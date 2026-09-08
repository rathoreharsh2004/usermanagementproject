import { useEffect, useState } from "react";
import type { User, UserInput } from "../types";

const empty: UserInput = {
  name: "",
  email: "",
  phone: "",
  role: "Member",
  status: "Active"
};

export function UserForm({
  user,
  onSubmit,
  onCancel
}: {
  user?: User | null;
  onSubmit: (payload: UserInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<UserInput>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status
          }
        : empty
    );
    setErrors({});
  }, [user]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.phone.trim()) next.phone = "Phone is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (error) {
      const err = error as Error & { details?: Record<string, string> };
      setErrors(err.details || { form: err.message || "Could not save user." });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof UserInput, value: string) =>
    setForm((current) => ({ ...current, [key]: value } as UserInput));

  return (
    <form onSubmit={submit} className="form">
      {errors.form && <div className="alert">{errors.form}</div>}
      <div className="form-grid">
        <label>
          Full name
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Aarav Sharma" />
          {errors.name && <small>{errors.name}</small>}
        </label>

        <label>
          Email
          <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@example.com" type="email" />
          {errors.email && <small>{errors.email}</small>}
        </label>

        <label>
          Phone
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
          {errors.phone && <small>{errors.phone}</small>}
        </label>

        <label>
          Role
          <select value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option>Member</option>
            <option>Manager</option>
            <option>Admin</option>
          </select>
        </label>

        <label>
          Status
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? "Saving…" : user ? "Save changes" : "Create user"}
        </button>
      </div>
    </form>
  );
}