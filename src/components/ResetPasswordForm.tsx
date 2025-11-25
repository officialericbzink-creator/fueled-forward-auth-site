import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logo from "@/assets/logo.JPEG";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Extract token from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const errorFromUrl = urlParams.get("error");

    if (errorFromUrl === "INVALID_TOKEN") {
      setMessage({
        type: "error",
        text: "Invalid or expired reset link. Please request a new one.",
      });
      return;
    }

    setToken(tokenFromUrl);

    if (!tokenFromUrl) {
      setMessage({
        type: "error",
        text: "Invalid or missing reset token.",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage({
        type: "error",
        text: "Invalid reset token.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match!",
      });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      setLoading(false);
      return;
    }

    try {
      await authClient.resetPassword({
        newPassword: password,
        token, // Pass the token from URL
      });
      setMessage({
        type: "success",
        text: "Password reset successful! Redirecting...",
      });

      setTimeout(() => {
        window.location.href = "/"; // or your app URL
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error resetting password. Link may be expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src={logo.src} className="w-12 h-12 rounded-md" />
              <span className="text-2xl">Fueled Forward</span>
            </div>
            Set New Password
          </CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading || !token}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading || !token}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !token}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
