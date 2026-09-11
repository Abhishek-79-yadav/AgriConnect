import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerAdmin } from "../../api/authApi";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const EMPTY = { name: "", email: "", password: "" };

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await registerAdmin(form);
      toast.success("Application received — a super admin needs to approve you before you can log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-md items-stretch">
      <div className="w-full rounded-lg border border-line bg-card p-8 shadow-sm">
        <Logo />

        <h1 className="mt-4 font-display text-2xl text-ink">Apply for admin access</h1>
        <p className="mt-1 text-sm text-ink/60">
          Your account will stay disabled until a super admin approves it.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Input label="Name" required value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" required value={form.email} onChange={set("email")} />
          <Input label="Password" type="password" required minLength={8} value={form.password} onChange={set("password")} />

          <Button type="submit" loading={submitting} className="mt-2">
            Submit for approval
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-gold-dark hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
