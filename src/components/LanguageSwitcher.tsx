import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from '../hooks/useRouter';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { i18n } = useTranslation();
  const { changeLanguage } = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (language: any) => {
    setLanguage(language);
    i18n.changeLanguage(language.code);
    changeLanguage(language.code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 micro-bounce focus-visible"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[140px] z-20 animate-scale-in">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  handleLanguageChange(language);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 micro-bounce ${
                  currentLanguage.code === language.code 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700'
                }`}
              >
                <span>{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};