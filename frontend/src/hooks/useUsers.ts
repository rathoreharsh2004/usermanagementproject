import { useCallback, useEffect, useState } from "react";
import { userApi } from "../services/api";
import type { User, UserInput, UserStats } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [userData, statsData] = await Promise.all([userApi.list(), userApi.stats()]);
      setUsers(userData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (payload: UserInput) => {
    const created = await userApi.create(payload);
    await refresh();
    return created;
  };

  const update = async (id: string, payload: UserInput) => {
    const updated = await userApi.update(id, payload);
    await refresh();
    return updated;
  };

  const remove = async (id: string) => {
    await userApi.remove(id);
    await refresh();
  };

  return { users, stats, loading, error, refresh, create, update, remove };
}