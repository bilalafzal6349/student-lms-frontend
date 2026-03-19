import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import api from "../api/axios";
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

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/password-reset", { email });
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/password-reset/confirm", {
        email,
        otp,
        newPassword,
      });
      setMessage("Password updated. You can now log in.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6 text-violet-600">
          <BookOpen className="w-6 h-6" />
          <span className="text-xl font-bold">LearnHub</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>
              {step === 1 && "Enter your email to receive a one-time code"}
              {step === 2 && "Enter the OTP and your new password"}
              {step === 3 && "Password updated successfully"}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={requestOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={confirmReset} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="otp">One-time code</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center">
            <Link
              to="/login"
              className="text-sm text-violet-600 hover:underline"
            >
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
