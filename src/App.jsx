import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ConfirmProvider } from "./components/ui/confirm-dialog";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import ProfilePage from "./pages/ProfilePage";
import InstructorCoursesPage from "./pages/instructor/InstructorCoursesPage";
import CourseFormPage from "./pages/instructor/CourseFormPage";
import LessonsPage from "./pages/instructor/LessonsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ConfirmProvider>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Authenticated — all roles */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["student", "instructor", "admin"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Student */}
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute roles={["student"]}>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor */}
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/new"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <CourseFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <CourseFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/lessons"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <LessonsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ConfirmProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
