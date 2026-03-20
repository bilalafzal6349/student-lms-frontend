import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORIES, COURSES_PAGE_LIMIT } from "../constants";

/**
 * Public course catalog with search, category filter, and pagination.
 */
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = { page, limit: COURSES_PAGE_LIMIT };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get("/courses", { params });
      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setFetchError("");
    } catch (err) {
      setFetchError(
        err.response?.data?.error ||
          "Failed to load courses. Is the backend running?",
      );
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, category]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Courses</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          {["", ...COURSE_CATEGORIES].map((c) => (
            <option key={c} value={c}>
              {c || "All Categories"}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {["", ...COURSE_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
          >
            <Badge
              variant={category === c ? "default" : "secondary"}
              className="cursor-pointer"
            >
              {c || "All"}
            </Badge>
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : fetchError ? (
        <p className="text-center text-red-500 py-20">{fetchError}</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              onClick={() => setPage(p)}
              className="w-9 h-9"
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
