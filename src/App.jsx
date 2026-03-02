import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

// ✅ REPLACE THIS WITH YOUR FREE KEY FROM https://www.weatherapi.com/
const API_KEY = "41e924b706264534ab3171908262702";

function processHourly(forecastDay) {
  if (!forecastDay) return [];
  const now = new Date();
  const currentHour = now.getHours();
  const all = forecastDay.hour || [];

  // grab up to 7 future hours starting from current
  const result = [];
  let count = 0;
  for (let i = 0; i < 24 && count < 7; i++) {
    const slot = all[(currentHour + i) % 24];
    if (!slot) continue;
    result.push({
      label: count === 0 ? "Now" : `+${count}h`,
      temp: Math.round(slot.temp_c),
      humidity: slot.humidity,
      conditionCode: slot.condition.code,
      conditionText: slot.condition.text,
      isDay: slot.is_day,
    });
    count++;
  }
  return result;
}

export default function App() {
  const [city, setCity] = useState("New York");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [forecastDays, setForecastDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = useCallback(async (searchCity) => {
    if (!searchCity.trim()) return;
    if (API_KEY === "YOUR_WEATHERAPI_KEY_HERE") {
      setError("⚠️ Please add your WeatherAPI key in src/App.jsx line 7");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(searchCity)}&days=7&aqi=no&alerts=no`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "City not found");
      }
      const data = await res.json();
      setWeatherData(data);
      setHourlyData(processHourly(data.forecast?.forecastday?.[0]));
      setForecastDays(data.forecast?.forecastday || []);
      setCity(data.location.name);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather("New York");
  }, []); // eslint-disable-line

  const handleSearch = (q) => {
    setCity(q);
    fetchWeather(q);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 md:p-6" style={{ background: "#cde4f5" }}>
      {/* Error Toast */}
      {error && (
        <div
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-red-500 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
          onClick={() => setError("")}
          style={{ maxWidth: "90vw" }}
        >
          <span>⚠️ {error}</span>
          <span className="ml-2 opacity-70 text-xs">✕ tap to dismiss</span>
        </div>
      )}

      {/* Dashboard Card */}
      <div
        className="w-full flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl"
        style={{
          maxWidth: 1100,
          minHeight: 660,
          background: "transparent",
        }}
      >
        {/* SIDEBAR — 32% on desktop, full-width on mobile */}
        <div className="w-full md:w-[32%] flex-shrink-0" style={{ minHeight: 280 }}>
          <Sidebar weatherData={weatherData} loading={loading} onCityChange={handleSearch} />
        </div>

        {/* MAIN — 68% */}
        <div className="w-full md:w-[68%] flex-1 overflow-hidden rounded-b-3xl md:rounded-b-none md:rounded-r-3xl" style={{ background: "#eaf3fb" }}>
          <MainContent
            weatherData={weatherData}
            hourlyData={hourlyData}
            forecastDays={forecastDays}
            onSearch={handleSearch}
            loading={loading}
            searchValue={city}
          />
        </div>
      </div>
    </div>
  );
}
