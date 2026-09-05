import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield, UserCheck } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Input } from "../../components/ui/input";
import { api } from "../../lib/api";
import type { Contest } from "../../types";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [selectedContest, setSelectedContest] = useState("all");

  const { data: contests = [] } = useQuery({
    queryKey: ["admin-contests"],
    queryFn: () => api.get<Contest[]>("/admin/contests"),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", selectedContest],
    queryFn: () => {
      const qs =
        selectedContest === "all" ? "" : `?contest_id=${selectedContest}`;
      return api.get<AdminUser[]>(`/admin/users${qs}`);
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">
            {users.length} registered users
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Users",
              value: users.filter((u) => u.role === "user").length,
              icon: UserCheck,
              color: "text-primary",
            },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "admin").length,
              icon: Shield,
              color: "text-warning",
            },
            {
              label: "Total Accounts",
              value: users.length,
              icon: UserCheck,
              color: "text-success",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-glow rounded-xl p-4 text-center">
              <Icon size={16} className={`mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted border-border"
            />
          </div>
          <select
            value={selectedContest}
            onChange={(e) => setSelectedContest(e.target.value)}
            className="h-9 w-full sm:w-auto text-sm bg-muted border border-border rounded-md px-3 outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Contests</option>
            {contests.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="card-glow rounded-xl overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-center">Role</th>
                <th className="text-right hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        u.role === "admin"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="text-right text-xs text-muted-foreground hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
