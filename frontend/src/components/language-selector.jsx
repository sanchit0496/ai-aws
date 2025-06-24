import React from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  {code: 'en', lang: 'English'},
  {code: 'hi', lang: 'Hindi'},
  {code: 'fr', lang: 'French'}
]

const LanguageSelector = () => {
  const {i18n} = useTranslation()
  const changeLangugage = (item) => {
    console.log(item.code)
    i18n.changeLanguage(item.code)
  }
  return (
    <div>
      {
      languages.map((item) => {
          return(
              <button onClick={() => changeLangugage(item)} key= {item.code}>{item.lang}</button>
          )
      })}
    </div>
  )
}

export default LanguageSelector