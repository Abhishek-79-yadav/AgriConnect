import { Sprout, Users, TrendingUp } from "lucide-react";

const PILLARS = [
  { icon: Sprout, title: "Direct from farm", text: "Produce listed straight by farmers — no middlemen, fairer prices for everyone." },
  { icon: TrendingUp, title: "Smart tools", text: "AI crop recommendations, weather forecasts and market insights for farmers." },
  { icon: Users, title: "Built on trust", text: "Verified farmer profiles, ratings and government scheme access." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-ink">About AgriConnect</h1>
      <p className="mt-4 max-w-2xl text-ink/70">
        AgriConnect is a digital agriculture platform designed to connect farmers, buyers and
        agricultural experts. Our goal is to make farming more profitable and accessible through
        technology.
      </p>

      <h2 className="mt-10 font-display text-xl text-ink">Our mission</h2>
      <p className="mt-2 max-w-2xl text-ink/70">
        Empower farmers using AI, weather forecasting, digital marketplaces and government
        schemes.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-line bg-card p-5">
            <Icon className="h-7 w-7 text-gold-dark" />
            <h3 className="mt-3 font-display text-ink">{title}</h3>
            <p className="mt-1 text-sm text-ink/60">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
