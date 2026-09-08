import { ChevronRight, LayoutDashboard, UsersRound } from "lucide-react";

export function Sidebar({
  page,
  onNavigate
}: {
  page: "dashboard" | "users";
  onNavigate: (page: "dashboard" | "users") => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">U</div>
        <div>
          <strong>UserFlow</strong>
          <span>Admin Portal</span>
        </div>
      </div>

      <div className="nav-label">Workspace</div>
      <nav>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => onNavigate("dashboard")}>
          <LayoutDashboard size={18} /> Dashboard
          {page === "dashboard" && <ChevronRight size={15} />}
        </button>
        <button className={page === "users" ? "active" : ""} onClick={() => onNavigate("users")}>
          <UsersRound size={18} /> Users
          {page === "users" && <ChevronRight size={15} />}
        </button>
      </nav>
    </aside>
  );
}