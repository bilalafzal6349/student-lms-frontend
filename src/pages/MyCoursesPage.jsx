import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/my-courses")
      .then(({ data }) => setCourses(data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Learning</h1>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
            <BookOpen className="w-10 h-10 text-gray-300" />
            <p className="text-gray-500">
              You haven&apos;t enrolled in any courses yet.
            </p>
            <Button asChild size="sm">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex gap-4 items-center py-4">
                  <div className="w-14 h-14 bg-violet-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      by {course.instructor?.name}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-violet-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {course.progress || 0}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
