import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Sprout } from "lucide-react";

import { recommendCropThunk } from "../../redux/thunks/cropThunk";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function SmartCrop() {
  const dispatch = useDispatch();
  const recommendation = useSelector((state) => state.crop.recommendation);
  const [submitting, setSubmitting] = useState(false);

  // Matches the backend's CropSuggestionRequest exactly: city, state,
  // soilType, temperature and humidity are all required fields.
  const [form, setForm] = useState({
    city: "",
    state: "",
    soilType: "",
    temperature: "",
    humidity: "",
  });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await dispatch(
      recommendCropThunk({
        ...form,
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
      })
    );

    setSubmitting(false);

    if (!recommendCropThunk.fulfilled.match(result)) {
      toast.error(result.error?.message || "Could not get a recommendation");
    }
  };

  return (
    <div>
      <PageHeader title="Smart crop recommendation" subtitle="Get a crop suggestion based on your field conditions." />

      <form onSubmit={submit} className="max-w-sm rounded-lg border border-line bg-card p-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" required value={form.city} onChange={set("city")} />
            <Input label="State" required value={form.state} onChange={set("state")} />
          </div>
          <Input label="Soil type" required placeholder="e.g. Loamy" value={form.soilType} onChange={set("soilType")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Temperature (°C)" type="number" required min="-50" max="60" value={form.temperature} onChange={set("temperature")} />
            <Input label="Humidity (%)" type="number" required min="0" max="100" value={form.humidity} onChange={set("humidity")} />
          </div>
          <Button type="submit" loading={submitting}>Get recommendation</Button>
        </div>
      </form>

      {recommendation && (
        <div className="mt-6 flex max-w-sm flex-col gap-4">
          <div className="flex items-start gap-3 rounded-lg border border-field/40 bg-field-light/50 p-5">
            <Sprout className="h-8 w-8 shrink-0 text-field-dark" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-xl text-field-dark">{recommendation.recommendedCrop}</p>
                {typeof recommendation.confidence === "number" && (
                  <span className="rounded-full bg-field-dark/10 px-2 py-0.5 text-xs font-medium text-field-dark">
                    {recommendation.confidence}% match
                  </span>
                )}
              </div>
              {recommendation.reason && (
                <p className="mt-1 text-sm text-ink/60">{recommendation.reason}</p>
              )}
            </div>
          </div>

          {recommendation.alternatives?.length > 0 && (
            <div className="rounded-lg border border-line bg-card p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">Other options</p>
              <div className="flex flex-col gap-2">
                {recommendation.alternatives.map((alt) => (
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
