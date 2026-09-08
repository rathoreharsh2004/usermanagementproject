import { useState } from "react";
import { Palette, RefreshCw } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { ThemeDrawer } from "./components/ThemeDrawer";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { useUsers } from "./hooks/useUsers";

export default function App() {
  const [page, setPage] = useState<"dashboard" | "users">("dashboard");
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);
  const { users, stats, loading, error, refresh, create, update, remove } = useUsers();

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} />

      <main className="main">
        <header className="topbar">
          <div className="breadcrumbs">
            Workspace <span>/</span> {page === "dashboard" ? "Dashboard" : "Users"}
          </div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={refresh} title="Refresh data">
              <RefreshCw size={17} />
            </button>
            <button
              className="theme-button"
              onClick={() => setThemeDrawerOpen(true)}
              title="Customize theme & font"
            >
              <Palette size={16} />
              <span>Theme</span>
            </button>
            <div className="top-avatar">HR</div>
          </div>
        </header>

        {page === "dashboard" ? (
          <Dashboard stats={stats} users={users} onUsers={() => setPage("users")} />
        ) : (
          <Users
            users={users}
            loading={loading}
            error={error}
            create={create}
            update={update}
            remove={remove}
          />
        )}
      </main>

      <ThemeDrawer isOpen={themeDrawerOpen} onClose={() => setThemeDrawerOpen(false)} />
    </div>
  );
}