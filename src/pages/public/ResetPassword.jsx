import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "../../api/axios";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PasswordStrengthHint, { isStrongPassword } from "../../components/common/PasswordStrengthHint";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: location.state?.otp || "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(form.password)) {
      toast.error("Password must be at least 8 characters and include a letter, a number, and a special character");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/auth/reset-password", {
        email: form.email,
        otp: form.otp,
        newPassword: form.password,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-card p-8 shadow-sm">
      <Logo />

      <h1 className="mt-4 font-display text-2xl text-ink">Reset password</h1>

      <form onSubmit={submitHandler} className="mt-6 flex flex-col gap-4">
        <Input label="Email" required value={form.email} onChange={set("email")} />
        <Input label="OTP" required value={form.otp} onChange={set("otp")} />
        <Input label="New password" type="password" required minLength={8} value={form.password} onChange={set("password")} />
        <PasswordStrengthHint password={form.password} />

        <Button type="submit" loading={submitting}>Reset password</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        <Link to="/login" className="font-medium text-gold-dark hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
