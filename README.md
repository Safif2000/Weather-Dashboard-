# 🌤️ Weather Dashboard v2.0

A pixel-perfect, fully responsive Weather Dashboard.  
**React 18 · Tailwind CSS · Recharts · Lucide React · WeatherAPI.com**

---

## 📁 File Structure

```
weather-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx            ← Blue sidebar: temp, city, skyline SVG, live clock
│   │   ├── Header.jsx             ← Greeting + working search bar
│   │   ├── HourlyForecast.jsx     ← Recharts area chart + 7-day toggle
│   │   ├── WeatherDetailsGrid.jsx ← 6 detail cards (all live)
│   │   └── MainContent.jsx        ← Right-panel wrapper
│   ├── App.jsx                    ← API logic, state management
│   ├── index.js
│   └── index.css
├── tailwind.config.js
└── package.json
```

---

## 🔑 Step 1 — Get FREE API Key

1. Go to → **https://www.weatherapi.com/**
2. Sign up for a **FREE** account
3. Copy your API key from the dashboard

---

## ✏️ Step 2 — Add Key to Code

Open `src/App.jsx` and replace line 7:

```js
// ❌ Before:
const API_KEY = "YOUR_WEATHERAPI_KEY_HERE";

// ✅ After:
const API_KEY = "a1b2c3d4e5f6your_actual_key";
```

---

## 🚀 Step 3 — Run

```bash
npm install
npm start
```

Opens at **http://localhost:3000**

---

## ✅ What Works

| Feature | Status |
|---|---|
| Live weather fetch | ✅ WeatherAPI.com |
| City search (Enter key) | ✅ Real-time update |
| Error toast on wrong city | ✅ Tap to dismiss |
| Live clock in sidebar | ✅ Updates every second |
| Sunrise / Sunset times | ✅ From API |
| Hourly area chart | ✅ Recharts |
| 7-day forecast toggle | ✅ Click "Next days" |
| Humidity progress bar | ✅ Live value |
| Wind speedometer gauge | ✅ Animated SVG |
| Precipitation scale | ✅ Live value |
| UV index segmented bar | ✅ Live value |
| Feels like slider | ✅ Animated marker |
| Chance of rain bar | ✅ Live value |
| Responsive (mobile/tablet/desktop) | ✅ Full |

---

## 📱 Responsive Breakpoints

- **Mobile** → Sidebar stacks on top, cards 1-column  
- **Tablet** → Cards 2-column  
- **Desktop** → Full split-screen, cards 3-column  
