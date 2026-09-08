import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloudSun } from "lucide-react";

import { fetchWeatherThunk } from "../../redux/thunks/weatherThunk";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import WeatherCard from "../../components/cards/WeatherCard";
import EmptyState from "../../components/ui/EmptyState";

export default function Weather() {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const { data: weather, loading } = useSelector((state) => state.weather);

  return (
    <div>
      <PageHeader title="Weather" subtitle="Check conditions before planning fieldwork." />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (city.trim()) dispatch(fetchWeatherThunk(city.trim()));
        }}
        className="mb-6 flex max-w-sm items-end gap-3"
      >
        <Input label="City" placeholder="e.g. Indore" value={city} onChange={(e) => setCity(e.target.value)} />
        <Button type="submit" loading={loading}>Get weather</Button>
      </form>

      {weather ? (
        <div className="max-w-sm">
          <WeatherCard weather={weather} />
        </div>
      ) : (
        <EmptyState icon={CloudSun} title="No weather data yet" description="Enter a city to see the forecast." />
      )}
    </div>
  );
}
