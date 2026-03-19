import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, BookOpen, Trash2, Star } from "lucide-react";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const InstructorCoursesPage = () => {
  const confirm = useConfirm();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses/my");
      setCourses(data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id, title) => {
    const ok = await confirm({
      title: `Delete "${title}"?`,
      description:
        "This will permanently remove the course and all its lessons. This action cannot be undone.",
    });
    if (!ok) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses((c) => c.filter((course) => course._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link to="/instructor/courses/new">
            <Plus className="w-4 h-4" />
            New Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
            <BookOpen className="w-10 h-10 text-gray-300" />
            <p className="text-gray-500">
              No courses yet. Create your first one!
            </p>
            <Button asChild size="sm">
              <Link to="/instructor/courses/new">
                <Plus className="w-4 h-4" /> Create Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <Card key={course._id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {course.category && (
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    {course.averageRating > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                        <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                        {course.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/instructor/courses/${course._id}/edit`}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/instructor/courses/${course._id}/lessons`}>
                      <BookOpen className="w-3.5 h-3.5" /> Lessons
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(course._id, course.title)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCoursesPage;
