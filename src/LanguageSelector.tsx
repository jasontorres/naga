import React, { useState, useRef, useEffect } from 'react';
import { useLocale, type Locale } from './i18n';

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options: { key: Locale; label: string; flag: string }[] = [
    { key: 'en', label: 'English', flag: '🇵🇭' },
    { key: 'bik', label: 'Bikolano', flag: '🌐' },
  ];

  const current = options.find(o => o.key === locale) || options[0];

  return (
    <div className="lang-selector" ref={ref}>
      <button
        className="lang-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${current.label}`}
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{locale === 'en' ? 'EN' : 'BIK'}</span>
        <span className={`lang-chevron ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="lang-dropdown" role="listbox">
          {options.map(opt => (
            <button
              key={opt.key}
              className={`lang-option ${locale === opt.key ? 'active' : ''}`}
              onClick={() => { setLocale(opt.key); setOpen(false); }}
              role="option"
              aria-selected={locale === opt.key}
            >
              <span className="lang-opt-flag">{opt.flag}</span>
              <span className="lang-opt-label">{opt.label}</span>
              {locale === opt.key && <span className="lang-opt-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
