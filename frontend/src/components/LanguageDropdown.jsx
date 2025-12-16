import { useLanguage } from "../hooks/useLanguage";

export default function LanguageDropdown() {
    const [language, setLanguage, availableLanguages] = useLanguage();

    const handleChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="relative inline-flex items-center bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
            {/* Language Icon */}
            <div className="pl-3 pr-2 py-2 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
            </div>

            <select
                id="language"
                value={language}
                onChange={handleChange}
                className="
                    appearance-none
                    bg-transparent
                    px-2 py-2 pr-8
                    text-gray-700
                    focus:outline-none
                    focus:ring-2 focus:ring-teal-500
                    rounded-r-lg
                    cursor-pointer
                "
            >
                {availableLanguages.map((lang) => (
                    <option key={lang._id} value={lang.shortCode}>
                        {lang.fullName}
                    </option>
                ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}