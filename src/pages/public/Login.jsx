import { Link } from "react-router-dom";

import LoginForm from "../../components/forms/LoginForm";
import Logo from "../../components/common/Logo";
import AuthIllustration from "../../components/common/AuthIllustration";

export default function Login() {
  return (
    <div className="flex w-full max-w-4xl items-stretch gap-8">
      <AuthIllustration />

      <div className="w-full max-w-md rounded-lg border border-line bg-card p-8 shadow-sm">
        <Logo />

        <h1 className="mt-4 font-display text-2xl text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-ink/60">
          Welcome back — pick up where you left off.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          New to AgriConnect?{" "}
          <Link to="/register" className="font-medium text-gold-dark hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
