import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { verifyEmail } from "../../api/authApi";
import Logo from "../../components/common/Logo";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Your email is verified.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "This verification link is invalid or has expired.");
      });
  }, [token]);

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-card p-8 text-center shadow-sm">
      <Logo />

      <div className="mt-6 flex flex-col items-center gap-3">
        {status === "verifying" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-ink/40" />
            <p className="text-sm text-ink/60">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-10 w-10 text-field-dark" />
            <p className="font-display text-lg text-ink">Email verified</p>
            <p className="text-sm text-ink/60">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-10 w-10 text-rust" />
            <p className="font-display text-lg text-ink">Verification failed</p>
            <p className="text-sm text-ink/60">{message}</p>
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-ink/60">
        <Link to="/login" className="font-medium text-gold-dark hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
