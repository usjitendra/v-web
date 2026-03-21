/**
 * Country flag utilities using https://flagcdn.com
 * Maps country slugs/names to ISO 3166-1 alpha-2 codes
 */

import { useState } from 'react';

const COUNTRY_CODE_MAP = {
  // South Asia
  india: "in",
  bangladesh: "bd",
  pakistan: "pk",
  nepal: "np",
  "sri-lanka": "lk",
  bhutan: "bt",
  maldives: "mv",

  // Southeast Asia
  thailand: "th",
  singapore: "sg",
  malaysia: "my",
  indonesia: "id",
  philippines: "ph",
  vietnam: "vn",
  myanmar: "mm",
  cambodia: "kh",
  laos: "la",

  // East Asia
  china: "cn",
  japan: "jp",
  "south-korea": "kr",
  korea: "kr",
  taiwan: "tw",
  "hong-kong": "hk",

  // Middle East
  uae: "ae",
  "united-arab-emirates": "ae",
  "saudi-arabia": "sa",
  jordan: "jo",
  israel: "il",
  iran: "ir",
  iraq: "iq",
  kuwait: "kw",
  bahrain: "bh",
  oman: "om",
  qatar: "qa",
  lebanon: "lb",
  syria: "sy",
  turkey: "tr",
  turkiye: "tr",

  // Europe
  germany: "de",
  "united-kingdom": "gb",
  uk: "gb",
  france: "fr",
  spain: "es",
  italy: "it",
  netherlands: "nl",
  belgium: "be",
  sweden: "se",
  norway: "no",
  denmark: "dk",
  finland: "fi",
  switzerland: "ch",
  austria: "at",
  portugal: "pt",
  greece: "gr",
  poland: "pl",
  ukraine: "ua",
  russia: "ru",
  "czech-republic": "cz",
  hungary: "hu",
  romania: "ro",

  // Americas
  "united-states": "us",
  usa: "us",
  canada: "ca",
  mexico: "mx",
  brazil: "br",
  argentina: "ar",
  colombia: "co",
  chile: "cl",
  peru: "pe",

  // Oceania
  australia: "au",
  "new-zealand": "nz",

  // Africa
  "south-africa": "za",
  nigeria: "ng",
  kenya: "ke",
  ethiopia: "et",
  ghana: "gh",
  egypt: "eg",
  morocco: "ma",
  tanzania: "tz",
  uganda: "ug",
};

/**
 * Get flag image URL from flagcdn.com
 * @param {string} nameOrSlug - Country name or URL slug
 * @param {number} width - Available: 16, 20, 24, 32, 40, 48, 64, 96, 160, 240, 320
 * @returns {string|null}
 */
export function getFlagUrl(nameOrSlug, width = 24) {
  if (!nameOrSlug) return null;
  const key = nameOrSlug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  const code = COUNTRY_CODE_MAP[key];
  if (!code) return null;
  const height = Math.round(width * 0.75);
  return `https://flagcdn.com/${width}x${height}/${code}.png`;
}

/**
 * Get flag emoji for a country
 */
const COUNTRY_EMOJI_MAP = {
  "in": "🇮🇳",
  "de": "🇩🇪",
  "us": "🇺🇸",
  "gb": "🇬🇧",
  "sg": "🇸🇬",
  "ae": "🇦🇪",
  "tr": "🇹🇷",
  "th": "🇹🇭",
  "es": "🇪🇸",
  "fr": "🇫🇷",
  "bd": "🇧🇩",
  "pk": "🇵🇰",
  "np": "🇳🇵",
  "lk": "🇱🇰",
  "bt": "🇧🇹",
  "mv": "🇲🇻",
  "my": "🇲🇾",
  "id": "🇮🇩",
  "ph": "🇵🇭",
  "vn": "🇻🇳",
  "mm": "🇲🇲",
  "kh": "🇰🇭",
  "la": "🇱🇦",
  "cn": "🇨🇳",
  "jp": "🇯🇵",
  "kr": "🇰🇷",
  "tw": "🇹🇼",
  "hk": "🇭🇰",
  "sa": "🇸🇦",
  "jo": "🇯🇴",
  "il": "🇮🇱",
  "ir": "🇮🇷",
  "iq": "🇮🇶",
  "kw": "🇰🇼",
  "bh": "🇧🇭",
  "om": "🇴🇲",
  "qa": "🇶🇦",
  "lb": "🇱🇧",
  "sy": "🇸🇾",
  "it": "🇮🇹",
  "nl": "🇳🇱",
  "be": "🇧🇪",
  "se": "🇸🇪",
  "no": "🇳🇴",
  "dk": "🇩🇰",
  "fi": "🇫🇮",
  "ch": "🇨🇭",
  "at": "🇦🇹",
  "pt": "🇵🇹",
  "gr": "🇬🇷",
  "pl": "🇵🇱",
  "ua": "🇺🇦",
  "ru": "🇷🇺",
  "cz": "🇨🇿",
  "hu": "🇭🇺",
  "ro": "🇷🇴",
  "ca": "🇨🇦",
  "mx": "🇲🇽",
  "br": "🇧🇷",
  "ar": "🇦🇷",
  "co": "🇨🇴",
  "cl": "🇨🇱",
  "pe": "🇵🇪",
  "au": "🇦🇺",
  "nz": "🇳🇿",
  "za": "🇿🇦",
  "ng": "🇳🇬",
  "ke": "🇰🇪",
  "et": "🇪🇹",
  "gh": "🇬🇭",
  "eg": "🇪🇬",
  "ma": "🇲🇦",
  "tz": "🇹🇿",
  "ug": "🇺🇬",
};

/**
 * Inline country flag image component with emoji fallback
 */
export function CountryFlag({ name, slug, width = 24, className = "" }) {
  const url = getFlagUrl(slug || name, width);
  const key = (slug || name || "").toLowerCase().trim().replace(/\s+/g, "-");
  const code = COUNTRY_CODE_MAP[key];
  const emoji = code ? COUNTRY_EMOJI_MAP[code] : "🏳️";
  const [imageError, setImageError] = useState(false);
  
  // If no URL found or image failed, show emoji with proper styling
  if (!url || imageError) {
    return (
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{
          width: `${width}px`,
          height: `${Math.round(width * 0.75)}px`,
          fontSize: `${width * 0.8}px`,
          lineHeight: '1',
        }}
        title={name || slug}
      >
        {emoji}
      </div>
    );
  }
  
  // Try to load image, fallback to emoji on error
  return (
    <img
      src={url}
      alt={`${name || slug} flag`}
      width={width}
      height={Math.round(width * 0.75)}
      style={{ display: 'block' }}
      className={`inline-block rounded-sm object-cover flex-shrink-0 ${className}`}
      onError={() => setImageError(true)}
      decoding="async"
      loading="lazy"
    />
  );
}
