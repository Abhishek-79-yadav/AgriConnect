import { useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Sprout,
  ShoppingCart,
  Landmark,
  CloudSun,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

import { fetchProducts } from "../../redux/thunks/productThunk";
import { isTokenExpired } from "../../utils/jwt";
import ROLES from "../../constants/roles";
import Logo from "../../components/common/Logo";
import ProductCard from "../../components/cards/ProductCard";
import AgriInputBanner from "../../components/common/AgriInputBanner";
import CampaignBanner from "../../components/common/CampaignBanner";
import Loader from "../../components/ui/Loader";

const ROLE_HOME_PATH = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.FARMER]: "/farmer/dashboard",
  [ROLES.BUYER]: "/buyer/dashboard",
  [ROLES.GOVERNMENT]: "/government/dashboard",
};

// Mirrors the four pillars of the platform — each maps to a real feature
// a visitor can go use, not just marketing copy.
const PILLARS = [
  { icon: Sprout, label: "Smart Crop Suggestion", to: "/farmer/smart-crop" },
  { icon: ShoppingCart, label: "Buy & Sell Products", to: "/products" },
  { icon: Landmark, label: "Government Schemes", to: "/login" },
  { icon: CloudSun, label: "Weather Updates", to: "/farmer/weather" },
];

const FEATURES = [
  {
    icon: Sprout,
    title: "Direct marketplace",
    body: "Buy straight from the farmer who grew it — no middlemen taking a cut.",
  },
  {
    icon: CloudSun,
    title: "Live weather & crop tips",
    body: "Farmers get local forecasts and AI-backed crop recommendations before they plant.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    body: "Every order is paid through Razorpay with verified, tracked transactions.",
  },
  {
    icon: Users,
    title: "Built on trust",
    body: "Ratings and reviews follow every farmer, so buyers know who they're buying from.",
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.products);
  const isAuthenticated = !!token && !isTokenExpired(token);

  useEffect(() => {
    if (!isAuthenticated) dispatch(fetchProducts());
  }, [dispatch, isAuthenticated]);

  // Real numbers derived from the public product catalog — not filler
  // copy. Once a public /api/public/stats endpoint exists on the
  // backend, swap this for total farmers/orders/schemes too.
  const stats = useMemo(() => {
    const farmerSet = new Set(products.map((p) => p.farmerName).filter(Boolean));
    const categorySet = new Set(products.map((p) => p.category).filter(Boolean));
    return [
      { label: "Products listed", value: products.length },
      { label: "Farmers onboarded", value: farmerSet.size },
      { label: "Categories", value: categorySet.size },
    ];
  }, [products]);

  // Logged-in users land straight on their role's dashboard instead of
  // the marketing page — a farmer or buyer coming back to "/" wants
  // their orders/products, not a sales pitch for a platform they
  // already joined.
  if (isAuthenticated && ROLE_HOME_PATH[user?.role]) {
    return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <CampaignBanner role="ALL" />
        <AgriInputBanner />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(47,107,62,0.10), transparent 45%), radial-gradient(circle at 85% 15%, rgba(107,127,63,0.10), transparent 40%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-12 text-center sm:px-6 sm:pt-20">
        <Logo size="lg" to={null} className="mx-auto justify-center" />

        <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl leading-tight text-ink sm:text-5xl">
          Empowering Agriculture. Enriching Lives.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-ink/70">
          Connecting farmers, buyers and the future of farming — fair prices,
          fresh produce, and tools that help crops (and businesses) grow.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded bg-gold px-5 py-3 font-medium text-white transition hover:bg-gold-dark"
          >
            Get started <ArrowRight size={18} />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded border border-line bg-card px-5 py-3 font-medium text-ink transition hover:border-ink/30"
          >
            Browse products
          </Link>
        </div>

        {/* Pillar icons */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {PILLARS.map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="group flex flex-col items-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-sm transition group-hover:-translate-y-1 group-hover:bg-gold-dark group-hover:shadow-md">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium text-ink/80">{label}</span>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Stats */}
      {!loading && products.length > 0 && (
        <section className="border-y border-line bg-card">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 py-8 text-center sm:px-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-gold-dark">{stat.value}+</p>
                <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular products */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Popular products</h2>
          <Link to="/products" className="text-sm font-medium text-gold-dark hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading products..." />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Process strip */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:grid-cols-3">
          {[
            { step: "01", title: "Farmer lists produce", body: "With price, quantity, and location." },
            { step: "02", title: "Buyer orders directly", body: "Pay securely, no negotiation needed." },
            { step: "03", title: "Delivered fresh", body: "Track your order from farm to door." },
          ].map((item) => (
            <div key={item.step}>
              <span className="font-display text-sm text-gold-dark">{item.step}</span>
              <h3 className="mt-1 font-medium text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl text-ink">Why AgriConnect</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-line bg-card p-5">
              <Icon size={22} className="text-field" />
              <h3 className="mt-3 font-medium text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual role CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-field/30 bg-field-light p-8">
            <h3 className="font-display text-xl text-field-dark">For Farmers</h3>
            <p className="mt-2 text-sm text-ink/70">
              List your produce, reach buyers directly, and get paid securely
              — plus weather and crop guidance built in.
            </p>
            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 rounded bg-field px-4 py-2.5 text-sm font-medium text-white transition hover:bg-field-dark"
            >
              Start selling <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-lg border border-slate/30 bg-slate-light p-8">
            <h3 className="font-display text-xl text-slate-dark">For Buyers</h3>
            <p className="mt-2 text-sm text-ink/70">
              Order fresh produce directly from verified farmers, at prices
              set by the people who grew it.
            </p>
            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 rounded bg-slate px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-dark"
            >
              Start shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
