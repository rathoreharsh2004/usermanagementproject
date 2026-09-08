import { Activity, ArrowUpRight, UserCheck, UserRound, UserX } from "lucide-react";
import type { User, UserStats } from "../types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard({
  stats,
  users,
  onUsers
}: {
  stats: UserStats;
  users: User[];
  onUsers: () => void;
}) {
  const recent = users.slice(0, 5);

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>
            {getGreeting()}<span className="title-dot">.</span>
          </h1>
          <p>Here’s an overview of your team and member activity.</p>
        </div>
        <button className="button primary" onClick={onUsers}>
          Manage users <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">
            <UserRound size={20} />
          </div>
          <span>Total users</span>
          <strong>{stats.total}</strong>
          <small>
            <Activity size={13} /> Real-time directory
          </small>
        </article>
        <article className="stat-card">
          <div className="stat-icon green">
            <UserCheck size={20} />
          </div>
          <span>Active users</span>
          <strong>{stats.active}</strong>
          <small>
            {stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% of all users
          </small>
        </article>
        <article className="stat-card">
          <div className="stat-icon amber">
            <UserX size={20} />
          </div>
          <span>Inactive users</span>
          <strong>{stats.inactive}</strong>
          <small>Can be reactivated anytime</small>
        </article>
      </div>

      <section className="content-card">
        <div className="card-head">
          <div>
            <span className="eyebrow">Directory</span>
            <h2>Recent users</h2>
          </div>
          <button className="text-button" onClick={onUsers}>
            View all
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="empty">No users yet. Create your first user from the Users page.</div>
        ) : (
          <div className="recent-list">
            {recent.map((user) => (
              <div className="recent-row" key={user._id}>
                <div className="avatar">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="person">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <span className={`badge ${user.status.toLowerCase()}`}>{user.status}</span>
                <span className="role">{user.role}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}