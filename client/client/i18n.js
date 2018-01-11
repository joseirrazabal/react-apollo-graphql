import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'

const options = {
    // loadPath: 'locales/{{lng}}/{{ns}}.json',
    // addPath: '../locales/add/{{lng}}/{{ns}}',
    // allowMultiLoading: false, // set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading

    fallbackLng: 'es',
    load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false,
    debug: false,

    cache: {
        enabled: false
    },

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ',',
        format: (value, format, lng) => {
            if (format === 'uppercase') return value.toUpperCase()
            return value
        }
    },

    parse: function(data) {
        return data
    },
    crossDomain: false,
    withCredentials: false,
    // ajax: function(url, options, callback, data) {},
    // ajax: loadLocales
    // queryStringParams: { v: '1.3.5' }
    react: {
        wait: true
    }
}

if (process && !process.release) {
    i18n
        .use(XHR)
        .use(LanguageDetector)
        // .use(reactI18nextModule) // if not using I18nextProvider
        .init(options)
}

export default i18n
