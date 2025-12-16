// src/hooks/useLanguage.js
import { useEffect, useState } from "react";
import url_prefix from "../data/variable";

let globalLanguage = "EN"; // default language
let listeners = [];

export function useLanguage() {
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || 'EN');
    const [availableLanguages, setAvailableLanguages] = useState([]); // <-- added

    // function to update global + local state
    const changeLanguage = (lang) => {
        globalLanguage = lang;
        localStorage.setItem("language", lang); // persist
        listeners.forEach((listener) => listener(lang));
        window.location.reload(); // reload whole site
    };

    useEffect(() => {
        // Restore from localStorage
        const savedLang = localStorage.getItem("language");
        if (savedLang) {
            globalLanguage = savedLang;
            setLanguage(savedLang);
        }

        // Fetch available languages
        const fetchLanguages = async () => {

            try {
                const response = await fetch(`${url_prefix}/api/language/`);
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setAvailableLanguages(result.data);

                    // if no saved language, set default from API
                    if (!savedLang) {
                        const defaultLang = result.data.find((l) => l.isDefault);
                        if (defaultLang) {
                            globalLanguage = defaultLang.shortCode;
                            setLanguage(defaultLang.shortCode);
                            localStorage.setItem("language", defaultLang.shortCode);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching languages:", err);
            }
        };

        fetchLanguages();

        const listener = (lang) => setLanguage(lang);
        listeners.push(listener);

        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    }, []);

    // console.log(language);

    return [language, changeLanguage, availableLanguages]; // <-- return languages too
}
