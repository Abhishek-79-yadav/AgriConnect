import { Link } from "react-router-dom";

import RegisterForm from "../../components/forms/RegisterForm";
import Logo from "../../components/common/Logo";
import AuthIllustration from "../../components/common/AuthIllustration";

export default function Register() {
  return (
    <div className="flex w-full max-w-4xl items-stretch gap-8">
      <AuthIllustration />

      <div className="w-full max-w-md rounded-lg border border-line bg-card p-8 shadow-sm">
        <Logo />

        <h1 className="mt-4 font-display text-2xl text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink/60">
          Join the marketplace connecting farmers directly with buyers.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-gold-dark hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-ink/60">
          Registering a company instead?{" "}
          <Link to="/register-brand" className="font-medium text-gold-dark hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
