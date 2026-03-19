import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Users, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    Icon: BookOpen,
    title: "100+ Courses",
    desc: "Expert-led content across every discipline",
  },
  {
    Icon: Users,
    title: "Community",
    desc: "Learn alongside thousands of students",
  },
  {
    Icon: Zap,
    title: "Learn at your pace",
    desc: "Access lessons anytime, anywhere",
  },
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <Badge variant="secondary" className="mb-4 gap-1">
          <GraduationCap className="w-3 h-3" /> Learning Management System
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight max-w-2xl">
          Learn anything, <span className="text-violet-600">anytime</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl">
          Browse courses taught by expert instructors. Start learning today —
          free or paid.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="lg" asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
          {!isAuthenticated && (
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
          )}
          {isAuthenticated && user?.role === "student" && (
            <Button size="lg" variant="outline" asChild>
              <Link to="/my-courses">My Learning</Link>
            </Button>
          )}
          {isAuthenticated && user?.role === "instructor" && (
            <Button size="lg" variant="outline" asChild>
              <Link to="/instructor/courses">My Courses</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3 shadow-sm"
          >
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
