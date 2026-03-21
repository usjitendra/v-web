/**
 * Country flag utilities using https://flagcdn.com
 * Maps country slugs/names to ISO 3166-1 alpha-2 codes
 */

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
  return `https://flagcdn.com/w${width}/${code}.png`;
}

/**
 * Inline country flag image component
 */
export function CountryFlag({ name, slug, width = 24, className = "" }) {
  const url = getFlagUrl(slug || name, width);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={`${name || slug} flag`}
      width={width}
      height={Math.round(width * 0.67)}
      className={`inline-block rounded-sm object-cover flex-shrink-0 ${className}`}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}
