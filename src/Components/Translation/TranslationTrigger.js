// LanguageSwitcher.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
const[lang,setlang]=useState( i18n.language);
  const changeLanguage = (event) => {
    if(event.target.value==='en'){
      document.body.dir = 'ltr';
    }else{
      document.body.dir = 'rtl';
    }
    i18n.changeLanguage(event.target.value);
    setlang( i18n.language);
  };

  return (
    // <button className='btn btn-primary currency-btn' onClick={() => changeLanguage(language)}>
    //   {language}
    // </button>
    <select value={lang} style={{color:'black'}} onChange={changeLanguage}>
      <option  value='en'>
        English
      </option>
      <option  value='arabic'>
        Arabic
      </option>
    {/* {languages.map((lang, index) => (
      <option key={index} value={lang}>
        {lang}
      </option>
    ))} */}
  </select>
  );
}

export default LanguageSwitcher;
