import React from 'react';
import { useLocale } from './i18n.tsx';

interface TweaksPanelProps {
  visible: boolean;
  accent: string;
  setAccent: (v: string) => void;
  density: string;
  setDensity: (v: string) => void;
}

export function TweaksPanel({ visible, accent, setAccent, density, setDensity }: TweaksPanelProps) {
  const { t } = useLocale();
  if (!visible) return null;
  const palettes = [
    { key: 'indigo',  label: t('tweaks.warmIndigo'),   colors: ['#2f3e7a', '#2f827a', '#c47a2a'] },
    { key: 'teal',    label: t('tweaks.monsoonTeal'),  colors: ['#1f5b57', '#7a6f3b', '#c47a2a'] },
    { key: 'sunrise', label: t('tweaks.bicolSunrise'), colors: ['#a23b3b', '#c4582a', '#6b5a9a'] },
  ];
  return (
    <div className="tweaks-panel" role="region" aria-label={t('tweaks.ariaLabel')}>
      <h4>
        <span>{t('tweaks.title')}</span>
        <span style={{fontFamily:'JetBrains Mono, monospace', fontSize: 10, color:'var(--ink-4)'}}>v1</span>
      </h4>
      <div className="group">
        <div className="g-lab">{t('tweaks.accentPalette')}</div>
        <div className="swatch-row">
          {palettes.map(p => (
            <button key={p.key}
                    className={`swatch-btn ${accent === p.key ? 'active' : ''}`}
                    onClick={() => setAccent(p.key)}>
              <div className="bar">
                {p.colors.map((c, i) => <span key={i} style={{background: c}}></span>)}
              </div>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="group" style={{marginBottom: 0}}>
        <div className="g-lab">{t('tweaks.density')}</div>
        <div className="swatch-row">
          <button className={`swatch-btn ${density === 'comfortable' ? 'active' : ''}`}
                  onClick={() => setDensity('comfortable')}>
            <span>{t('tweaks.comfortable')}</span>
          </button>
          <button className={`swatch-btn ${density === 'compact' ? 'active' : ''}`}
                  onClick={() => setDensity('compact')}>
            <span>{t('tweaks.compact')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
