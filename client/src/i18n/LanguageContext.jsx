import { createContext, useContext, useState } from 'react'
import t from './translations.json'
import { FlagRU, FlagEN, FlagTR } from './FlagIcons'

const LanguageContext = createContext(null)

export const LANGUAGES = [
  { code: 'ru', label: 'RU', Flag: FlagRU },
  { code: 'en', label: 'EN', Flag: FlagEN },
  { code: 'tr', label: 'TR', Flag: FlagTR },
]

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru')

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
