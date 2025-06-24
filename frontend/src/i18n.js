import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'
import Backend from 'i18next-http-backend'

i18n.
    use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: true,
    fallbackLng: 'en',
    returnObjects: true,

  });


  export default i18n