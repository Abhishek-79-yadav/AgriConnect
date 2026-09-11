import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerBrand } from "../../api/authApi";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PasswordStrengthHint, { isStrongPassword } from "../../components/common/PasswordStrengthHint";

const EMPTY = {
  name: "",
  email: "",
  password: "",
  mobile: "",
  companyName: "",
  gstNumber: "",
  category: "",
  city: "",
  state: "",
};

export default function RegisterBrand() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(form.password)) {
      toast.error("Password must be at least 8 characters and include a letter, a number, and a special character");
      return;
    }

    setSubmitting(true);
    try {
      await registerBrand(form);
      toast.success("Registration received — you'll be able to log in once an admin approves your account.");
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

        <h1 className="mt-4 font-display text-2xl text-ink">Register your company</h1>
        <p className="mt-1 text-sm text-ink/60">
          List fertilizers, pesticides, or other agri-inputs on AgriConnect. Your account will
          be reviewed by our team before you can log in.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Input label="Company name" required value={form.companyName} onChange={set("companyName")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="GST number (optional)" value={form.gstNumber} onChange={set("gstNumber")} />
            <Input label="Category" placeholder="Fertilizer / Pesticide" value={form.category} onChange={set("category")} />
          </div>

          <Input label="Contact person name" required value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" required value={form.email} onChange={set("email")} />
          <Input label="Password" type="password" required minLength={8} value={form.password} onChange={set("password")} />
          <PasswordStrengthHint password={form.password} />
          <Input label="Mobile (optional)" value={form.mobile} onChange={set("mobile")} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="City (optional)" value={form.city} onChange={set("city")} />
            <Input label="State (optional)" value={form.state} onChange={set("state")} />
          </div>

          <Button type="submit" loading={submitting} className="mt-2">
            Submit for review
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
