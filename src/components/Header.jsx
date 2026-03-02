import React, { useState } from "react";
import { Search, MoreHorizontal, X } from "lucide-react";

export default function Header({ onSearch, loading, searchValue }) {
  const [query, setQuery] = useState(searchValue || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) onSearch(q);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
      {/* Left: Greeting */}
      <div className="flex-1 min-w-0">
        <h1 className="text-gray-800 font-extrabold text-xl md:text-2xl leading-tight truncate">
          Welcome back Afif!
        </h1>
        <p className="text-gray-400 font-medium text-sm mt-0.5">
          Check out today's weather information
        </p>
      </div>

      {/* Right: Search + avatar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search form */}
        <form onSubmit={handleSubmit} className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city…"
            className="pl-8 pr-8 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm text-gray-700 font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-36 sm:w-44"
          />
          {/* Clear button */}
          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={12}/>
            </button>
          )}
          {/* Spinner when loading */}
          {loading && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/>
          )}
        </form>

        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1 rounded-xl hover:bg-gray-100">
          <MoreHorizontal size={19}/>
        </button>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-md select-none"
          style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
        >
          IS
        </div>
      </div>
    </div>
  );
}
