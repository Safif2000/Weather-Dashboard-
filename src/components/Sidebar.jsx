import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Sunrise, Sunset, Plus, X } from "lucide-react";

/* ─── condition code → emoji ─── */
function getWeatherEmoji(code, isDay = 1) {
  if (!code) return isDay ? "☀️" : "🌙";
  if (code === 1000) return isDay ? "☀️" : "🌙";
  if (code <= 1003) return "⛅";
  if (code <= 1009) return "☁️";
  if (code <= 1030) return "🌫️";
  if (code <= 1063) return "🌦️";
  if (code <= 1117) return "🌨️";
  if (code <= 1135) return "🌫️";
  if (code <= 1147) return "🌁";
  if (code <= 1201) return "🌧️";
  if (code <= 1225) return "❄️";
  if (code <= 1237) return "🌨️";
  if (code <= 1282) return "⛈️";
  return "⛅";
}

/* ─── City Skyline SVG ─── */
function CitySkyline() {
  return (
    <svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg"
      className="w-full" preserveAspectRatio="xMidYMax meet">
      <circle cx="340" cy="108" r="42" fill="#F4B942" opacity="0.92"/>
      <circle cx="340" cy="108" r="54" fill="#F4B942" opacity="0.15"/>
      <rect x="0"   y="130" width="28" height="70" fill="rgba(255,255,255,0.10)" rx="2"/>
      <rect x="24"  y="115" width="22" height="85" fill="rgba(255,255,255,0.09)" rx="2"/>
      <rect x="42"  y="125" width="30" height="75" fill="rgba(255,255,255,0.08)" rx="2"/>
      <rect x="72"  y="38"  width="64" height="162" fill="rgba(210,220,235,0.80)" rx="3"/>
      <rect x="84"  y="18"  width="40" height="28"  fill="rgba(210,220,235,0.80)" rx="2"/>
      <rect x="96"  y="4"   width="16" height="18"  fill="rgba(210,220,235,0.80)"/>
      <rect x="101" y="0"   width="6"  height="8"   fill="rgba(210,220,235,0.80)"/>
      {[48,64,80,96,112,128,144,160].map((y,i)=>(
        <g key={i}>
          {[80,92,104,116,124].map((x,j)=>(
            <rect key={j} x={x} y={y} width="7" height="8" fill="rgba(160,200,255,0.35)" rx="1"/>
          ))}
        </g>
      ))}
      <rect x="144" y="72"  width="52" height="128" fill="rgba(195,210,228,0.72)" rx="3"/>
      {[85,100,115,130,145,160,175].map((y,i)=>(
        <g key={i}>
          {[150,162,174,184].map((x,j)=>(
            <rect key={j} x={x} y={y} width="7" height="8" fill="rgba(160,200,255,0.30)" rx="1"/>
          ))}
        </g>
      ))}
      <rect x="200" y="92"  width="38" height="108" fill="rgba(190,205,225,0.68)" rx="3"/>
      <rect x="242" y="105" width="32" height="95"  fill="rgba(185,200,220,0.65)" rx="3"/>
      <rect x="278" y="118" width="44" height="82"  fill="rgba(180,195,215,0.62)" rx="3"/>
      <rect x="325" y="128" width="36" height="72"  fill="rgba(185,200,220,0.65)" rx="3"/>
      <rect x="364" y="115" width="56" height="85"  fill="rgba(190,205,225,0.68)" rx="3"/>
      <rect x="0" y="196" width="420" height="8" fill="rgba(255,255,255,0.12)" rx="2"/>
    </svg>
  );
}

/* ─── Add City Modal ─── */
function AddCityModal({ onAdd, onClose }) {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (val) { onAdd(val); onClose(); }
  };
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", borderRadius: "inherit" }}>
      <div className="bg-white rounded-2xl p-5 w-64 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-bold text-sm">Add a City</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16}/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Lahore, Tokyo…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
          />
          <button type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm py-2 rounded-xl transition-all">
            Add City
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Sidebar ─── */
export default function Sidebar({ weatherData, loading, onCityChange }) {
  const [now, setNow]         = useState(new Date());
  const [unit, setUnit]       = useState("C");          // "C" or "F"
  const [cities, setCities]   = useState([]);           // saved cities list
  const [cityIdx, setCityIdx] = useState(0);            // which saved city showing
  const [showModal, setShowModal] = useState(false);

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* when API data arrives, store the current city name */
  useEffect(() => {
    if (weatherData?.location?.name && cities.length === 0) {
      setCities([weatherData.location.name]);
      setCityIdx(0);
    }
  }, [weatherData]); // eslint-disable-line

  /* ── derived values ── */
  const loc   = weatherData?.location;
  const cur   = weatherData?.current;
  const astro = weatherData?.forecast?.forecastday?.[0]?.astro;

  const cityName  = loc ? `${loc.name}, ${loc.country}` : "New York, USA";
  const dateStr   = now.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
  const condCode  = cur?.condition?.code;
  const isDay     = cur?.is_day ?? 1;
  const emoji     = getWeatherEmoji(condCode, isDay);
  const condition = cur?.condition?.text || "---";
  const sunrise   = astro?.sunrise || "---";
  const sunset    = astro?.sunset  || "---";

  /* temperature with unit conversion */
  const tempC = cur ? Math.round(cur.temp_c) : null;
  const displayTemp = tempC === null
    ? "—"
    : unit === "C"
      ? `${tempC}°`
      : `${Math.round(tempC * 9/5 + 32)}°`;

  /* arrows: cycle through saved cities */
  const goLeft = () => {
    if (cities.length === 0) return;
    const newIdx = (cityIdx - 1 + cities.length) % cities.length;
    setCityIdx(newIdx);
    onCityChange && onCityChange(cities[newIdx]);
  };
  const goRight = () => {
    if (cities.length === 0) return;
    const newIdx = (cityIdx + 1) % cities.length;
    setCityIdx(newIdx);
    onCityChange && onCityChange(cities[newIdx]);
  };

  /* add city */
  const handleAddCity = (name) => {
    if (!cities.includes(name)) {
      const updated = [...cities, name];
      setCities(updated);
      const newIdx = updated.length - 1;
      setCityIdx(newIdx);
      onCityChange && onCityChange(name);
    }
  };

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background: "linear-gradient(165deg,#5aaee8 0%,#2176c7 45%,#1558a8 100%)",
        minHeight: 280,
        borderRadius: "1.5rem 0 0 1.5rem",
      }}
    >
      {/* ── Add City Modal ── */}
      {showModal && (
        <AddCityModal onAdd={handleAddCity} onClose={() => setShowModal(false)}/>
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        {/* + button → opens modal */}
        <button
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/35 active:scale-90 flex items-center justify-center text-white transition-all"
          title="Add city"
        >
          <Plus size={18} strokeWidth={2.5}/>
        </button>

        <div className="flex items-center gap-3">
          {/* Dot indicators for saved cities */}
          <div className="flex gap-1.5">
            {(cities.length > 0 ? cities : [""]).map((_,i) => (
              <button
                key={i}
                onClick={() => { setCityIdx(i); onCityChange && onCityChange(cities[i]); }}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i===cityIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)" }}
              />
            ))}
          </div>

          {/* °C / °F toggle — FULLY FUNCTIONAL */}
          <div className="flex items-center bg-white/20 rounded-full px-1 py-0.5 gap-0.5">
            <button
              onClick={() => setUnit("C")}
              className="text-xs font-bold px-2 py-0.5 rounded-full transition-all"
              style={{
                background: unit==="C" ? "rgba(255,255,255,0.35)" : "transparent",
                color: unit==="C" ? "white" : "rgba(255,255,255,0.5)",
              }}
            >°C</button>
            <button
              onClick={() => setUnit("F")}
              className="text-xs font-bold px-2 py-0.5 rounded-full transition-all"
              style={{
                background: unit==="F" ? "rgba(255,255,255,0.35)" : "transparent",
                color: unit==="F" ? "white" : "rgba(255,255,255,0.5)",
              }}
            >°F</button>
          </div>
        </div>
      </div>

      {/* ── Location & Date ── */}
      <div className="px-5 mt-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <MapPin size={13} className="text-white" strokeWidth={2.5}/>
          <span className="text-white font-bold text-[15px] leading-tight">{cityName}</span>
        </div>
        <p className="text-white/65 text-xs font-medium ml-5">Today {dateStr}</p>
        <div className="flex gap-4 mt-2 ml-5">
          <div className="flex items-center gap-1.5">
            <Sunrise size={12} className="text-white/75"/>
            <span className="text-white/75 text-xs font-semibold">{sunrise}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sunset size={12} className="text-white/75"/>
            <span className="text-white/75 text-xs font-semibold">{sunset}</span>
          </div>
        </div>
      </div>

      {/* ── Temp + Condition with working arrows ── */}
      <div className="flex items-center justify-between px-3 mt-3 mb-1">
        <button
          onClick={goLeft}
          disabled={cities.length <= 1}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            color: cities.length > 1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
            background: cities.length > 1 ? "rgba(255,255,255,0.12)" : "transparent",
          }}
        >
          <ChevronLeft size={20}/>
        </button>

        <div className="text-center flex-1">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-9 h-9 border-[3px] border-white/30 border-t-white rounded-full animate-spin"/>
            </div>
          ) : (
            <>
              <div
                className="text-white leading-none font-extrabold"
                style={{ fontSize:"clamp(3.8rem,9vw,5.5rem)", letterSpacing:"-2px" }}
              >
                {displayTemp}
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span style={{ fontSize:24 }}>{emoji}</span>
                <span className="text-white font-bold text-lg">{condition}</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={goRight}
          disabled={cities.length <= 1}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            color: cities.length > 1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
            background: cities.length > 1 ? "rgba(255,255,255,0.12)" : "transparent",
          }}
        >
          <ChevronRight size={20}/>
        </button>
      </div>

      {/* ── Skyline ── */}
      <div className="mt-auto px-0 pb-0 flex items-end">
        <CitySkyline />
      </div>
    </div>
  );
}
