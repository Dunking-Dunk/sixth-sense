import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
      translation:  require('./en.json'),
    },
    hi: {
      translation: require('./hi.json'),
    }
  }
  
  i18next.use(initReactI18next).init({
    debug: false,
    lng: 'en',
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources,
  })
  
  export default i18next;