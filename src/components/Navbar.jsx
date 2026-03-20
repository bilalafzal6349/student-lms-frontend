import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  LogOut,
  UserCircle,
  ChevronDown,
  Info,
  Menu,
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

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

  // Role-based nav link
  const roleLink =
    isAuthenticated &&
    (user?.role === "student"
      ? { to: "/my-courses", label: "My Learning", Icon: GraduationCap }
      : user?.role === "instructor"
        ? { to: "/instructor/courses", label: "My Courses", Icon: BookOpen }
        : user?.role === "admin"
          ? { to: "/admin", label: "Dashboard", Icon: LayoutDashboard }
          : null);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-violet-600 font-bold text-lg"
        >
          <BookOpen className="w-5 h-5" />
          LearnHub
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
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
              {roleLink && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to={roleLink.to}>
                    <roleLink.Icon className="w-4 h-4" />
                    {roleLink.label}
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
              <Button size="sm" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-violet-600">
                  <BookOpen className="w-4 h-4" /> LearnHub
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4 py-4">
                {/* User info */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </span>
                      <Badge
                        variant={roleBadgeVariant[user?.role] || "secondary"}
                        className="w-fit mt-1 text-xs"
                      >
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                <SheetClose asChild>
                  <Link
                    to="/courses"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" /> Courses
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                  >
                    <Info className="w-4 h-4" /> About
                  </Link>
                </SheetClose>

                {isAuthenticated && roleLink && (
                  <SheetClose asChild>
                    <Link
                      to={roleLink.to}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                    >
                      <roleLink.Icon className="w-4 h-4" /> {roleLink.label}
                    </Link>
                  </SheetClose>
                )}

                {isAuthenticated && (
                  <SheetClose asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                    >
                      <UserCircle className="w-4 h-4" /> My Profile
                    </Link>
                  </SheetClose>
                )}

                <div className="pt-4 border-t border-gray-100 mt-4">
                  {isAuthenticated ? (
                    <SheetClose asChild>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </SheetClose>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Log in
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/register">
                          <Button className="w-full">Sign up</Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
