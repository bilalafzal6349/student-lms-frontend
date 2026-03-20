import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, GraduationCap, BookOpenCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROLES, MIN_PASSWORD_LENGTH } from "../constants";

const ROLE_OPTIONS = [
  {
    value: ROLES.STUDENT,
    label: "Student",
    description: "I want to learn and enroll in courses",
    Icon: GraduationCap,
  },
  {
    value: ROLES.INSTRUCTOR,
    label: "Instructor",
    description: "I want to create and sell courses",
    Icon: BookOpenCheck,
  },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.STUDENT,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="LearnHub" className="h-10 w-auto" />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Choose your role to get started</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Role selector cards */}
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map(
                (
                  { value, label, description, Icon }, // eslint-disable-line no-unused-vars
                ) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: value }))}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
                      form.role === value
                        ? "border-violet-600 bg-violet-50"
                        : "border-gray-200 bg-white hover:border-gray-300",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        form.role === value
                          ? "text-violet-600"
                          : "text-gray-400",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        form.role === value
                          ? "text-violet-700"
                          : "text-gray-700",
                      )}
                    >
                      {label}
                    </span>
                    <span className="text-xs leading-tight text-gray-500">
                      {description}
                    </span>
                  </button>
                ),
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  placeholder={`Min. ${MIN_PASSWORD_LENGTH} characters`}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  `Sign up as ${form.role === ROLES.INSTRUCTOR ? "Instructor" : "Student"}`
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
