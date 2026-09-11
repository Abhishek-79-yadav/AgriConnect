import { CloudSun, Droplets, Wind } from "lucide-react";

export default function WeatherCard({ weather }) {
  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">{weather.city}</h3>
        <CloudSun className="h-8 w-8 text-slate" />
      </div>

      <p className="mt-2 font-display text-3xl text-ink">{weather.temperature}°C</p>

      <div className="mt-4 flex gap-4 text-sm text-ink/60">
        <span className="flex items-center gap-1">
          <Droplets className="h-4 w-4" /> {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="h-4 w-4" /> {weather.windSpeed} km/h
        </span>
      </div>
    </div>
  );
}
