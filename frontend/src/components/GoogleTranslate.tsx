'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

const GoogleTranslate: React.FC = () => {
  useEffect(() => {
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
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    if (!window.google) {
      addScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="google-translate-container flex items-center">
      <div id="google_translate_element" className="rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md"></div>
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
        #google_translate_element {
          display: block !important;
        }
        
        /* Style the gadget to look like a simple globe icon */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        
        /* Replace text with a Globe icon using a pseudo-element */
        .goog-te-menu-value span:first-child {
          display: none !important;
        }
        .goog-te-menu-value:before {
          content: '🌐';
          font-size: 20px;
          margin-right: 4px;
        }
        .goog-te-menu-value img, .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-menu-value span {
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;
