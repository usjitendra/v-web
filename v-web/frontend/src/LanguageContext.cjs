// src/context/LanguageContext.js
import { createContext, useContext, useState } from "react";

// 1. Create Context
const LanguageContext = createContext();

// 2. Provider Component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en"); // default = English

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// 3. Custom Hook for easy usage
export const useLanguage = () => useContext(LanguageContext);
