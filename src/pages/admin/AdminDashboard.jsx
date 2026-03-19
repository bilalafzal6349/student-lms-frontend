import React, { useState, useEffect } from "react";
import {
  Users,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  BarChart2,
  Star,
} from "lucide-react";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import { useConfirm } from "../../components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ROLES = ["student", "instructor", "admin"];
const roleBadgeVariant = {
  admin: "destructive",
  instructor: "info",
  student: "success",
};
const TABS = ["Users", "Courses", "Analytics"];

const AdminDashboard = () => {
  const [tab, setTab] = useState("Users");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage users, courses, and view platform analytics
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              tab === t
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Users" && <UsersTab />}
      {tab === "Courses" && <CoursesTab />}
      {tab === "Analytics" && <AnalyticsTab />}
    </div>
  );
};

/* ─── Users Tab ─────────────────────────────────────────────── */
const UsersTab = () => {
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", { params: { page, limit: 15 } });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoleChange = async (id, newRole) => {
    try {
      const { data } = await api.patch(`/users/${id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const handleDelete = async (id, name) => {
    const ok = await confirm({
      title: `Delete "${name}"?`,
      description:
        "This user will be permanently removed. This cannot be undone.",
    });
    if (!ok) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((u) => u.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const counts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Users",
            value: total,
            color: "text-violet-600 bg-violet-50",
          },
          {
            label: "Instructors",
            value: counts.instructor || 0,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Students",
            value: counts.student || 0,
            color: "text-green-600 bg-green-50",
          },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`p-2 rounded-lg ${color}`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Spinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Email</th>
                    <th className="px-5 py-3 text-left">Role</th>
                    <th className="px-5 py-3 text-left">Change Role</th>
                    <th className="px-5 py-3 text-left">Joined</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={roleBadgeVariant[user.role] || "secondary"}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="flex h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user._id, user.name)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

/* ─── Courses Tab ────────────────────────────────────────────── */
const CoursesTab = () => {
  const confirm = useConfirm();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/courses", {
        params: { page, limit: 15 },
      });
      setCourses(data.courses);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id, title) => {
    const ok = await confirm({
      title: `Delete "${title}"?`,
      description:
        "This course and all its lessons will be permanently removed.",
    });
    if (!ok) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses((c) => c.filter((course) => course._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-base">All Courses</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Instructor</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-left">Rating</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {course.title}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {course.instructor?.name || "—"}
                    </td>
                    <td className="px-5 py-3">
                      {course.category && (
                        <Badge variant="secondary">{course.category}</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </td>
                    <td className="px-5 py-3 text-gray-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                      {course.averageRating?.toFixed(1) || "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(course._id, course.title)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Analytics Tab ──────────────────────────────────────────── */
const AnalyticsTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses/analytics")
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data)
    return (
      <p className="text-gray-500 text-sm py-10 text-center">
        Failed to load analytics.
      </p>
    );

  const statCards = [
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Total Courses",
      value: data.totalCourses,
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Enrollments",
      value: data.totalEnrollments,
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Students",
      value: data.students,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Instructors",
      value: data.instructors,
      icon: Users,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Admins",
      value: data.admins,
      icon: Users,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`p-2 rounded-lg ${color}`}>
                {React.createElement(icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top courses */}
      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-violet-600" /> Top 5 Most
            Enrolled Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {data.topCourses.length === 0 ? (
            <p className="text-gray-500 text-sm">No enrollment data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.topCourses.map((course, i) => {
                const maxEnrollments = data.topCourses[0].enrollments;
                const pct = Math.round(
                  (course.enrollments / maxEnrollments) * 100,
                );
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800 truncate max-w-xs">
                        {course.title}
                      </span>
                      <span className="text-gray-500 shrink-0 ml-2">
                        {course.enrollments} enrolled
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-violet-600 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
