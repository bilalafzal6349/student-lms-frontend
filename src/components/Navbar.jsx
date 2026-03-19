import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  LogOut,
  UserCircle,
  ChevronDown,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleBadgeVariant = {
  admin: "destructive",
  instructor: "info",
  student: "success",
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-violet-600  font-bold text-lg"
        >
          <BookOpen className="w-5 h-5" />
          LearnHub
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/courses">Courses</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about">
              <Info className="w-4 h-4" />
              About
            </Link>
          </Button>

          {isAuthenticated ? (
            <>
              {user?.role === "student" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/my-courses">
                    <GraduationCap className="w-4 h-4" />
                    My Learning
                  </Link>
                </Button>
              )}
              {user?.role === "instructor" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/instructor/courses">
                    <BookOpen className="w-4 h-4" />
                    My Courses
                  </Link>
                </Button>
              )}
              {user?.role === "admin" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
              )}

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 ml-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      {user?.email}
                    </span>
                    <Badge
                      variant={roleBadgeVariant[user?.role] || "secondary"}
                      className="w-fit mt-1"
                    >
                      {user?.role}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserCircle className="w-4 h-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="text-white border-violet-700  hover:bg-white hover:text-violet-600"
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
