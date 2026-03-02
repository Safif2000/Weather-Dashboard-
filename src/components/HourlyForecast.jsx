import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import { ChevronRight, ChevronDown } from "lucide-react";

/* Weather code → emoji */
function codeToEmoji(code, isDay = 1) {
  if (!code) return isDay ? "☀️" : "🌙";
  if (code === 1000) return isDay ? "☀️" : "🌙";
  if (code <= 1003) return "⛅";
  if (code <= 1009) return "☁️";
  if (code <= 1030) return "🌫️";
  if (code <= 1063) return "🌦️";
  if (code <= 1201) return "🌧️";
  if (code <= 1225) return "❄️";
  if (code <= 1282) return "⛈️";
  return "⛅";
}

/* Default demo data */
const DEFAULT = [
  { label:"Now",  temp:27, humidity:23, conditionCode:800, isDay:1 },
  { label:"+1h",  temp:28, humidity:29, conditionCode:801, isDay:1 },
  { label:"+2h",  temp:28, humidity:58, conditionCode:802, isDay:1 },
  { label:"+3h",  temp:29, humidity:75, conditionCode:500, isDay:1 },
  { label:"+4h",  temp:30, humidity:33, conditionCode:800, isDay:1 },
  { label:"+5h",  temp:29, humidity:20, conditionCode:801, isDay:1 },
  { label:"+6h",  temp:29, humidity:73, conditionCode:803, isDay:0 },
];

/* Custom dot on the line */
const Dot = (props) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={5} fill="#3B82F6" stroke="white" strokeWidth={2} />
  );
};

/* Custom tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-blue-100 text-xs font-bold text-blue-600">
      {label}: {payload[0].value}%
    </div>
  );
};

export default function HourlyForecast({ hourlyData, forecastDays }) {
  const data = hourlyData?.length ? hourlyData : DEFAULT;
  const [showForecast, setShowForecast] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gray-700 font-bold text-base">Upcoming hours</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-1.5 font-semibold border border-gray-100 active:scale-95">
            Rain precipitation <ChevronDown size={11} className="ml-0.5"/>
          </button>
          <button
            onClick={() => setShowForecast(v => !v)}
            className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-1.5 font-semibold border border-blue-100 active:scale-95"
          >
            {showForecast ? "Hide days" : "Next days"} <ChevronRight size={11}/>
          </button>
        </div>
      </div>

      {/* Weather icon row + temps */}
      <div className="flex justify-around mb-1 px-2">
        {data.map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 min-w-0">
            <span style={{ fontSize: 20 }}>{codeToEmoji(h.conditionCode, h.isDay)}</span>
            <span className="text-gray-700 text-xs font-bold">{h.temp}°</span>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div style={{ height: 90 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.30}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.03}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600, fontFamily:"Plus Jakarta Sans" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis hide domain={[0, 100]}/>
            <Tooltip content={<CustomTooltip />}/>
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#humGrad)"
              dot={<Dot />}
              activeDot={{ r: 6, fill: "#2563EB", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity % row */}
      <div className="flex justify-around mt-1 px-2">
        {data.map((h, i) => (
          <span key={i} className="text-[11px] font-semibold text-gray-400">{h.humidity}%</span>
        ))}
      </div>

      {/* 7-day forecast panel (toggled) */}
      {showForecast && forecastDays?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-500 text-xs font-bold mb-3 uppercase tracking-wider">7-Day Forecast</p>
          <div className="grid grid-cols-7 gap-1">
            {forecastDays.map((day, i) => {
              const date = new Date(day.date);
              const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US",{weekday:"short"});
              const icon = codeToEmoji(day.day.condition.code, 1);
              const hi = Math.round(day.day.maxtemp_c);
              const lo = Math.round(day.day.mintemp_c);
              return (
                <div key={i} className="flex flex-col items-center gap-1 bg-blue-50 rounded-2xl py-2 px-1">
                  <span className="text-[10px] font-bold text-blue-600 text-center">{dayName}</span>
                  <span style={{fontSize:18}}>{icon}</span>
                  <span className="text-[11px] font-bold text-gray-700">{hi}°</span>
                  <span className="text-[10px] font-medium text-gray-400">{lo}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
