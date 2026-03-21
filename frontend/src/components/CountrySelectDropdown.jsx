import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { CountryFlag } from "@/helper/countryFlags";

/**
 * Custom country dropdown that shows flag images.
 * Drop-in replacement for a plain <select> for country filtering.
 *
 * Props:
 *  countries   - array of { _id, country_name, slug }
 *  value       - current selected slug
 *  onChange    - called with the selected slug (or "" for "All")
 *  placeholder - string shown when nothing is selected
 */
export default function CountrySelectDropdown({
  countries = [],
  value = "",
  onChange,
  placeholder = "All Countries",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = countries.find((c) => c.slug === value) || null;

  const handleSelect = (slug) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <CountryFlag
                name={selected.country_name}
                slug={selected.slug}
                width={20}
                className="shadow-sm flex-shrink-0"
              />
              <span className="truncate">{selected.country_name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0 ml-2">
          {selected && (
            <X
              size={13}
              className="text-gray-400 hover:text-gray-600"
              onClick={(e) => { e.stopPropagation(); handleSelect(""); }}
            />
          )}
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {/* All option */}
          <div
            onClick={() => handleSelect("")}
            className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm transition-colors ${
              !value ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="w-5 h-3.5 rounded-sm bg-gray-200 flex-shrink-0" />
            {placeholder}
          </div>

          {countries.map((c) => (
            <div
              key={c._id}
              onClick={() => handleSelect(c.slug)}
              className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                value === c.slug
                  ? "bg-teal-50 text-teal-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CountryFlag
                name={c.country_name}
                slug={c.slug}
                width={20}
                className="shadow-sm flex-shrink-0"
              />
              <span className="truncate">{c.country_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
