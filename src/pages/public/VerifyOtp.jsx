import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState({ email: location.state?.email || "", otp: "" });
  const set = (field) => (e) => setData({ ...data, [field]: e.target.value });

  // The backend has no standalone OTP-verification route — it checks the
  // OTP as part of the single POST /api/auth/reset-password call. Carry
  // the email + OTP forward so ResetPassword can send them together.
  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/reset-password", { state: data });
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-card p-8 shadow-sm">
      <Logo />

      <h1 className="mt-4 font-display text-2xl text-ink">Verify OTP</h1>
      <p className="mt-1 text-sm text-ink/60">Enter the code sent to your email.</p>

      <form onSubmit={submitHandler} className="mt-6 flex flex-col gap-4">
        <Input label="Email" type="email" required value={data.email} onChange={set("email")} />
        <Input label="OTP" required placeholder="6-digit code" value={data.otp} onChange={set("otp")} />

        <Button type="submit">Verify</Button>
      </form>
    </div>
  );
}
