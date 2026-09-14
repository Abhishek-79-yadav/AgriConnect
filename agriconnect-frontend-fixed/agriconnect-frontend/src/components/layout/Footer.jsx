import { Link } from "react-router-dom";

import Logo from "../common/Logo";

export default function Footer() {
  return (
    <footer className="hidden border-t border-line bg-card md:block">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <Logo size="sm" to={null} />
            <p className="mt-2 max-w-xs text-sm text-ink/60">
              Connecting farmers directly with buyers — fair prices, fresh
              produce, no middlemen.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Marketplace
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/70">
                <li>
                  <Link to="/products" className="hover:text-ink">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="hover:text-ink">
                    Search
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Company
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/70">
                <li>
                  <Link to="/about" className="hover:text-ink">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-ink">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/help-center" className="hover:text-ink">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Account
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/70">
                <li>
                  <Link to="/login" className="hover:text-ink">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-ink">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-xs text-ink/50">
          © {new Date().getFullYear()} AgriConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
