// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arabicTranslations from './locales/arabic.json';
const resources = {
    arabic: {
        translation: arabicTranslations,
      },
  // Add more languages as needed
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    keySeparator: false, // Disable key separator for nested translations
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

// import i18next from "i18next";
// import HttpBackend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";
// import { initReactI18next } from "react-i18next";

// const apiKey = "ZgltAZonRCM9tYhOG4vj5A";
// const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;

// i18next
//   .use(HttpBackend)
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: "en",

//     ns: ["default"],
//     defaultNS: "default",

//     supportedLngs: ["en","ar-SA"],
    
//     backend: {
//       loadPath: loadPath
//     }
    
//   })