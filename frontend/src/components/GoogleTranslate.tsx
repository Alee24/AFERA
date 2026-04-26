'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

const GoogleTranslate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr,pt,sw',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    if (!window.google) {
      addScript();
    }

    // Check for existing translation cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const googTrans = getCookie('googtrans');
    if (googTrans) {
      const langCode = googTrans.split('/').pop();
      if (langCode) setCurrentLang(langCode);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // Set the cookie for Google Translate
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.aferainnov.africa`;
    
    // Reload to apply translation
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left">
      {/* Hidden Google Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-100 dark:border-slate-700 group"
      >
        <Globe size={18} className="text-primary group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-bold uppercase text-gray-700 dark:text-gray-200">
          {languages.find(l => l.code === currentLang)?.code || 'en'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    currentLang === lang.code 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {currentLang === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        /* Hide the top Google Translate banner */
        iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;
