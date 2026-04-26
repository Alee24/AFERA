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
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 8px 12px !important;
          border-radius: 12px !important;
          display: flex !important;
          align-items: center !important;
          cursor: pointer !important;
          font-family: inherit !important;
          font-weight: 600 !important;
          color: #334155 !important;
          transition: all 0.2s ease !important;
        }
        .goog-te-gadget-simple:hover {
          background-color: rgba(0, 0, 0, 0.03) !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-menu-value {
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-menu-value span {
          color: #334155 !important;
          font-size: 13px !important;
        }
        .goog-te-menu-value img {
          display: none !important;
        }
        .goog-te-menu-frame {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
        }
        iframe.goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;
