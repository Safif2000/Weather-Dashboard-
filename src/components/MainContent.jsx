import React from "react";
import Header from "./Header";
import HourlyForecast from "./HourlyForecast";
import WeatherDetailsGrid from "./WeatherDetailsGrid";

export default function MainContent({
  weatherData, hourlyData, forecastDays, onSearch, loading, searchValue
}) {
  return (
    <div
      className="h-full overflow-y-auto p-4 md:p-6"
      style={{ background: "#eaf3fb" }}
    >
      <Header
        onSearch={onSearch}
        loading={loading}
        searchValue={searchValue}
      />
      <HourlyForecast hourlyData={hourlyData} forecastDays={forecastDays} />
      <WeatherDetailsGrid weatherData={weatherData} />
    </div>
  );
}
