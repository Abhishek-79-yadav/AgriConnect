import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { loginThunk } from "../../redux/thunks/authThunk";

const ROLE_HOME_PATH = {
  ADMIN: "/admin/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
  FARMER: "/farmer/dashboard",
  BUYER: "/buyer/dashboard",
  BRAND: "/brand/dashboard",
  GOVERNMENT: "/government/dashboard",
};

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await dispatch(loginThunk(form));

    setSubmitting(false);

    if (loginThunk.fulfilled.match(result)) {
      toast.success("Welcome back");

      // Send them back wherever they were headed (RoleRoute stashes
      // this), falling back to their role's dashboard.
      const from = location.state?.from?.pathname;
      const fallback = ROLE_HOME_PATH[result.payload.role] || "/";

      navigate(from || fallback, { replace: true });
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded border border-line bg-card px-3 py-2 text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Password
          </label>
          <Link to="/forgot-password" className="text-sm text-gold-dark hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded border border-line bg-card px-3 py-2 pr-10 text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink/40 hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded bg-gold px-4 py-2.5 font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
