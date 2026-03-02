import React from "react";
import {
  Droplets, Wind, CloudRain, Sun, Thermometer, CloudDrizzle
} from "lucide-react";

/* ── Humidity Card ── */
function HumidityCard({ value = 82 }) {
  const v = Math.min(Math.max(value, 0), 100);
  const label = v < 40 ? "good" : v < 70 ? "normal" : "bad";
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 font-semibold text-sm">Humidity</span>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Droplets size={15} className="text-blue-400"/>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-gray-800 font-extrabold text-3xl">{v}%</span>
        <span className="text-gray-400 text-sm font-semibold ml-2">{label}</span>
      </div>
      {/* Gradient bar */}
      <div className="relative h-2 rounded-full overflow-hidden" style={{background:"#E5E7EB"}}>
        <div
          className="h-full rounded-full"
          style={{
            width:`${v}%`,
            background:"linear-gradient(90deg,#22C55E 0%,#F59E0B 55%,#EF4444 100%)",
            transition:"width 0.7s ease"
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {["good","normal","bad"].map(l=>(
          <span key={l} className="text-[10px] text-gray-400 font-semibold">{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Wind Speedometer Card ── */
function WindCard({ speed = 8 }) {
  const s = Math.min(Math.max(speed, 0), 60);
  /* 180° sweep: -90° = 0 km/h, +90° = 60 km/h */
  const angle = (s / 60) * 180 - 90;
  const RAD   = Math.PI / 180;
  const cx = 52, cy = 52, r = 34;
  const needleX = cx + (r - 6) * Math.cos(angle * RAD);
  const needleY = cy + (r - 6) * Math.sin(angle * RAD);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 font-semibold text-sm">Wind</span>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Wind size={15} className="text-blue-400"/>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* SVG gauge */}
        <svg width="105" height="62" viewBox="0 0 105 62">
          {/* Arc track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round"
          />
          {/* Arc fill */}
          {s > 0 && (
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(s/60)*107} 107`}
            />
          )}
          {/* Tick marks */}
          {[0,0.25,0.5,0.75,1].map((t,i)=>{
            const a = (t*180 - 90) * RAD;
            return (
              <line
                key={i}
                x1={cx + (r+5)*Math.cos(a)} y1={cy + (r+5)*Math.sin(a)}
                x2={cx + (r+10)*Math.cos(a)} y2={cy + (r+10)*Math.sin(a)}
                stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"
              />
            );
          })}
          {/* Labels */}
          {[[0,"0"],[0.25,"15"],[0.5,"30"],[0.75,"45"],[1,"60"]].map(([t,lb],i)=>{
            const a = (t*180-90)*RAD;
            return (
              <text
                key={i}
                x={cx+(r+18)*Math.cos(a)}
                y={cy+(r+18)*Math.sin(a)+3}
                textAnchor="middle" fontSize="7" fill="#9CA3AF" fontWeight="600"
                fontFamily="Plus Jakarta Sans"
              >{lb}</text>
            );
          })}
          {/* Needle */}
          <line
            x1={cx} y1={cy}
            x2={needleX} y2={needleY}
            stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="4" fill="#1D4ED8"/>
        </svg>
        <div>
          <span className="text-gray-800 font-extrabold text-3xl">{s}</span>
          <span className="text-gray-500 font-semibold text-sm ml-1">km/h</span>
        </div>
      </div>
    </div>
  );
}

/* ── Precipitation Card ── */
function PrecipitationCard({ value = 1.4 }) {
  const max = 90;
  const pct = Math.min((value / max) * 100, 100);
  const ticks = [0,10,20,30,40,50,60,70,80,90];
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 font-semibold text-sm">Precipitation</span>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <CloudRain size={15} className="text-blue-400"/>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-gray-800 font-extrabold text-3xl">{Number(value).toFixed(1)}</span>
        <span className="text-gray-500 font-semibold text-base ml-1">cm</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full"
          style={{ width:`${pct}%`, transition:"width 0.7s ease" }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {ticks.map(t=>(
          <span key={t} className="text-[9px] text-gray-300 font-semibold">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── UV Index Card ── */
function UVIndexCard({ value = 4 }) {
  const segs = [
    { label:"0-2",  color:"#22C55E", max:2  },
    { label:"3-5",  color:"#84CC16", max:5  },
    { label:"6-7",  color:"#F59E0B", max:7  },
    { label:"8-10", color:"#F97316", max:10 },
    { label:"11+",  color:"#EF4444", max:20 },
  ];
  const activeIdx = segs.findIndex(s => value <= s.max);
  const levelNames = ["Low","Moderate","High","Very High","Extreme"];
  const active = activeIdx === -1 ? 4 : activeIdx;
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 font-semibold text-sm">UV index</span>
        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
          <Sun size={15} className="text-orange-400"/>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-gray-800 font-extrabold text-3xl">{value}</span>
        <span className="text-gray-400 text-sm font-semibold ml-2">{levelNames[active]}</span>
      </div>
      <div className="flex gap-1">
        {segs.map((s, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full"
            style={{
              background: i <= active ? s.color : "#E5E7EB",
              opacity: i > active ? 0.5 : 1,
              transition: "background 0.5s ease"
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {segs.map((s,i)=>(
          <span key={i} className="text-[9px] font-semibold" style={{color: i===active ? s.color : "#9CA3AF"}}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Feels Like Card ── */
function FeelsLikeCard({ value = 30 }) {
  const min = 0, max = 50;
  const pct = ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 font-semibold text-sm">Feels like</span>
        <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
          <Thermometer size={15} className="text-red-400"/>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-gray-800 font-extrabold text-3xl">{value}°</span>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden" style={{background:"#E5E7EB"}}>
        <div
          className="h-full rounded-full"
          style={{
            width:`${pct}%`,
            background:"linear-gradient(90deg,#60A5FA 0%,#FBBF24 50%,#EF4444 100%)",
            transition:"width 0.7s ease"
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-500 shadow"
          style={{ left:`calc(${pct}% - 6px)`, transition:"left 0.7s ease" }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-gray-400 font-semibold">{min}°</span>
        <span className="text-[10px] text-gray-400 font-semibold">25°</span>
        <span className="text-[10px] text-gray-400 font-semibold">{max}°</span>
      </div>
    </div>
  );
}

/* ── Chance of Rain Card ── */
function ChanceOfRainCard({ value = 42 }) {
  const v = Math.min(Math.max(value, 0), 100);
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 font-semibold text-sm">Chance of rain</span>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <CloudDrizzle size={15} className="text-blue-400"/>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-gray-800 font-extrabold text-3xl">{v}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-400"
          style={{ width:`${v}%`, transition:"width 0.7s ease" }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {["0%","25%","50%","75%","100%"].map(t=>(
          <span key={t} className="text-[9px] text-gray-400 font-semibold">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Grid ── */
export default function WeatherDetailsGrid({ weatherData }) {
  const cur      = weatherData?.current;
  const foreDay  = weatherData?.forecast?.forecastday?.[0]?.day;

  return (
    <div>
      <h2 className="text-gray-700 font-bold text-base mb-4">
        More details of today's weather
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <HumidityCard   value={cur?.humidity              ?? 82}  />
        <WindCard       speed={Math.round(cur?.wind_kph   ?? 8)}  />
        <PrecipitationCard value={foreDay?.totalprecip_cm ?? 1.4} />
        <UVIndexCard    value={Math.round(cur?.uv         ?? 4)}  />
        <FeelsLikeCard  value={Math.round(cur?.feelslike_c?? 30)} />
        <ChanceOfRainCard value={foreDay?.daily_chance_of_rain ?? 42} />
      </div>
    </div>
  );
}
