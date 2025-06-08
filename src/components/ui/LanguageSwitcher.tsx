'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/app/i18n/hooks';

export default function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const { language, changeLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    // Only change if different from current
    if (langCode !== language) {
      // Save to localStorage first
      localStorage.setItem('i18nextLng', langCode);
      
      // Then change language in i18n
      changeLanguage(langCode);
      
      // Force a hard reload to ensure language change is applied everywhere
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  if (variant === "full") {
    return (
      <div className="relative inline-block text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-700"
            >
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="font-medium text-sm">{currentLanguage.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {languages.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center px-2 py-2 text-sm ${
                  currentLanguage.code === lang.code ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <span className="mr-2 text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <span className="sr-only">Change language</span>
          <span className="flex items-center justify-center text-base font-medium">
            {currentLanguage.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center px-2 py-2 text-sm ${
              currentLanguage.code === lang.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 