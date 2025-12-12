import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "APP_THEME";
const LANG_STORAGE_KEY = "APP_LANGUAGE";

export const ThemeContext = createContext();

const themes = {
    light: {
        name: "Light",
        primary: "#6C4AB6",
        background: "#FFFFFF",
        cardBackground: "#FFFFFF",
        text: "#333333",
        textSecondary: "#666666",
        border: "#E0E0E0",
    },
    dark: {
        name: "Dark",
        primary: "#8B6FD4",
        background: "#121212",
        cardBackground: "#1E1E1E",
        text: "#FFFFFF",
        textSecondary: "#B0B0B0",
        border: "#333333",
    },
};

const languages = {
    en: {
        code: "en",
        name: "English",
        flag: "🇺🇸",
    },
    zh: {
        code: "zh",
        name: "中文",
        flag: "🇨🇳",
    },
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            const savedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY);
            
            if (savedTheme && themes[savedTheme]) {
                setTheme(savedTheme);
            }
            if (savedLang && languages[savedLang]) {
                setLanguage(savedLang);
            }
        } catch (error) {
            if (__DEV__) {
                console.error("Load theme/lang error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const changeTheme = async (newTheme) => {
        if (!themes[newTheme]) return;
        
        try {
            setTheme(newTheme);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            if (__DEV__) {
                console.error("Save theme error:", error);
            }
        }
    };

    const changeLanguage = async (newLang) => {
        if (!languages[newLang]) return;
        
        try {
            setLanguage(newLang);
            await AsyncStorage.setItem(LANG_STORAGE_KEY, newLang);
        } catch (error) {
            if (__DEV__) {
                console.error("Save language error:", error);
            }
        }
    };

    const value = {
        theme: themes[theme],
        themeName: theme,
        language: languages[language],
        languageCode: language,
        changeTheme,
        changeLanguage,
        loading,
        themes,
        languages,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

