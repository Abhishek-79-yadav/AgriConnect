import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "../../api/axios";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-card p-8 shadow-sm">
      <Logo />

      <h1 className="mt-4 font-display text-2xl text-ink">Forgot password</h1>
      <p className="mt-1 text-sm text-ink/60">We'll send a one-time code to your email.</p>

      <form onSubmit={submitHandler} className="mt-6 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" loading={submitting}>Send OTP</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Remembered your password?{" "}
        <Link to="/login" className="font-medium text-gold-dark hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
