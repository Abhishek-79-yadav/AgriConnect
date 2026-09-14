import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { registerThunk } from "../../redux/thunks/authThunk";
import ROLES from "../../constants/roles";
import PasswordStrengthHint, { isStrongPassword } from "../common/PasswordStrengthHint";

const inputClass =
  "w-full rounded border border-line bg-card px-3 py-2 text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    city: "",
    state: "",
    role: ROLES.BUYER,
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();

    // Mirrors the backend's own constraints so the person finds out
    // before submitting, not after a 400 comes back.
    if (!isStrongPassword(form.password)) {
      toast.error("Password must be at least 8 characters and include a letter, a number, and a special character");
      return;
    }
    if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(registerThunk(form));
    setSubmitting(false);

    if (registerThunk.fulfilled.match(result)) {
      toast.success("Account created — please sign in");
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-4">
      <div>
        <span className="block text-sm font-medium text-ink mb-1.5">I am a</span>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: ROLES.BUYER, label: "Buyer", hint: "I want to buy produce" },
            { value: ROLES.FARMER, label: "Farmer", hint: "I want to sell produce" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setForm({ ...form, role: option.value })}
              className={`rounded border px-3 py-2.5 text-left transition ${
                form.role === option.value
                  ? option.value === ROLES.FARMER
                    ? "border-field bg-field-light"
                    : "border-slate bg-slate-light"
                  : "border-line bg-card hover:border-ink/30"
              }`}
            >
              <span className="block font-medium text-ink">{option.label}</span>
              <span className="block text-xs text-ink/60">{option.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
          Full name
        </label>
        <input
          id="name"
          required
          minLength={3}
          maxLength={50}
          placeholder="Your name"
          value={form.name}
          onChange={set("name")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-ink mb-1">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-ink mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={set("password")}
            className={`${inputClass} pr-10`}
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
        <PasswordStrengthHint password={form.password} />
      </div>

      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-ink mb-1">
          Mobile <span className="font-normal text-ink/50">(optional)</span>
        </label>
        <input
          id="mobile"
          placeholder="10-digit mobile number"
          value={form.mobile}
          onChange={set("mobile")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-ink mb-1">
            City <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input id="city" value={form.city} onChange={set("city")} className={inputClass} />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-ink mb-1">
            State <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input id="state" value={form.state} onChange={set("state")} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded bg-gold px-4 py-2.5 font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {submitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
