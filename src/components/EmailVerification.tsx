import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import logo from "@/assets/logo.JPEG";

export default function EmailVerification() {
  const [status, setStatus] = useState<"success" | "error">("error");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorFromUrl = urlParams.get("error");

    // Better Auth only adds error param on failure
    // If there's no error and we're on this page, verification succeeded
    if (errorFromUrl === "INVALID_TOKEN" || errorFromUrl === "invalid_token") {
      setStatus("error");
      setMessage(
        "Invalid or expired verification link. Please request a new one.",
      );
    } else if (errorFromUrl) {
      setStatus("error");
      setMessage("Verification failed. Please try again.");
    } else {
      // No error param means success (user was redirected here after successful verification)
      setStatus("success");
      setMessage("Email verified successfully! You can now sign in.");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src={logo.src} className="w-12 h-12 rounded-md" />
              <span className="text-2xl">Fueled Forward</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              {status === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              {status === "success" ? "Email Verified!" : "Verification Failed"}
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            {status === "success"
              ? "Your email has been successfully verified."
              : "There was a problem verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={status === "error" ? "destructive" : "default"}>
            <AlertDescription className="text-center">
              {message}
            </AlertDescription>
          </Alert>

          {status === "success" ? (
            <Alert>
              <AlertDescription className="text-center">
                <p className="font-semibold mb-2">
                  Your email has been verified!
                </p>
                <p>You can now return to the app and sign in.</p>
              </AlertDescription>
            </Alert>
          ) : (
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              onClick={() => (window.location.href = "/resend-verification")}
            >
              Request New Link
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
