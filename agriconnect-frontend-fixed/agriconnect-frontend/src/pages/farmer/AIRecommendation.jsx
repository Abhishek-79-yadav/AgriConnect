import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Bot, Info, NotebookPen } from "lucide-react";

import { aiRecommendationApi } from "../../api/aiApi";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

// The backend's GET /api/ai/recommend looks at THIS farmer's own crop
// history + soil profile (via farmerId) plus current temp/humidity — it's
// not a free-text Q&A endpoint, so the form only needs those two numbers.
export default function AIRecommendation() {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ temp: "", humidity: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const askAI = async (e) => {
    e.preventDefault();

    if (form.temp === "" || form.humidity === "") {
      toast.error("Enter both temperature and humidity");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await aiRecommendationApi({
        farmerId: user.id,
        temp: Number(form.temp),
        humidity: Number(form.humidity),
      });
      setResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not get a recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI crop recommendation" subtitle="Based on your farm's history, soil profile and current weather." />

      <div className="mb-6 flex gap-3 rounded-lg border border-slate/30 bg-slate-light/40 p-4 text-sm text-ink/70">
        <Info className="h-5 w-5 shrink-0 text-slate-dark" />
        <p>
          This looks at what you've logged in your <Link to="/farmer/farm-log" className="font-medium text-slate-dark hover:underline">Farm Log</Link> and
          your soil profile, combined with the temperature and humidity you enter below, to suggest what to plant next.
          The more records you log, the better the suggestion.
        </p>
      </div>

      <form onSubmit={askAI} className="max-w-sm rounded-lg border border-line bg-card p-6">
        <div className="flex flex-col gap-4">
          <Input label="Current temperature (°C)" type="number" required value={form.temp} onChange={set("temp")} />
          <Input label="Current humidity (%)" type="number" required min="0" max="100" value={form.humidity} onChange={set("humidity")} />
          <Button type="submit" loading={loading}>Get AI recommendation</Button>
        </div>
      </form>

      {result && (
        <div className="mt-6 flex max-w-sm flex-col gap-4">
          <div className="rounded-lg border border-gold/30 bg-gold-light/40 p-5">
            <div className="flex items-start gap-3">
              <Bot className="h-8 w-8 shrink-0 text-gold-dark" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-xl text-ink">{result.recommendedCrop}</p>
                  {typeof result.confidence === "number" && (
                    <span className="rounded-full bg-gold-dark/10 px-2 py-0.5 text-xs font-medium text-gold-dark">
                      {result.confidence}% match
                    </span>
                  )}
                </div>
                {result.reason && <p className="mt-1 text-sm text-ink/60">{result.reason}</p>}
              </div>
            </div>

            <Link to="/farmer/farm-log" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-dark hover:underline">
              <NotebookPen className="h-4 w-4" /> Log this crop in Farm Log
            </Link>
          </div>

          {result.alternatives?.length > 0 && (
            <div className="rounded-lg border border-line bg-card p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">Other options</p>
              <div className="flex flex-col gap-2">
                {result.alternatives.map((alt) => (
                  <div key={alt.crop} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{alt.crop}</span>
                    <span className="text-ink/50">{alt.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
