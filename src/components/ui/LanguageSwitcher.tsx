'use client';

import React, { useState } from 'react';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'toggle' | 'buttons';
  showFlags?: boolean;
  showLabels?: boolean;
}

export default function LanguageSwitcher({ 
  className = '',
  variant = 'dropdown',
  showFlags = true,
  showLabels = true 
}: LanguageSwitcherProps) {
  const { changeLanguage, currentLanguage, isInitialized } = useClientTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isInitialized) {
    return <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>;
  }

  const handleLanguageChange = async (locale: Locale) => {
    await changeLanguage(locale);
    setIsOpen(false);
  };

  if (variant === 'toggle') {
    const otherLanguage = currentLanguage === 'es' ? 'en' : 'es';
    return (
      <button
        onClick={() => handleLanguageChange(otherLanguage as Locale)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 ${className}`}
        title={`Switch to ${localeNames[otherLanguage as Locale]}`}
      >
        {showFlags && <span className="text-sm">{localeFlags[otherLanguage as Locale]}</span>}
        {showLabels && <span className="text-sm font-medium text-gray-700">{localeNames[otherLanguage as Locale]}</span>}
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-1 p-1 bg-gray-100 rounded-lg ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              currentLanguage === locale
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {showFlags && <span>{localeFlags[locale]}</span>}
            {showLabels && <span>{localeNames[locale]}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
      >
        {showFlags && <span className="text-sm">{localeFlags[currentLanguage as Locale]}</span>}
        {showLabels && <span className="text-sm font-medium text-gray-700">{localeNames[currentLanguage as Locale]}</span>}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                currentLanguage === locale ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
              }`}
            >
              <span>{localeFlags[locale]}</span>
              <span className="font-medium">{localeNames[locale]}</span>
              {currentLanguage === locale && (
                <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
