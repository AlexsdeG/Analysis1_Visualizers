import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Calculator } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
            {t('app.title')}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{i18n.language}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};