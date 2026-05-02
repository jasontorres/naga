import React, { useState, useEffect, useMemo } from 'react';
import {
  type AIPData, type Item, type Rollup,
  flattenData, rollup, isOutlier,
  fmtPeso, fmtInt,
  shortSector, shortFL,
  FINISH_LINES, FINISH_LINE_COLORS,
} from './utils.tsx';
import { type Filters, initialFilters, applyFilters, hasAnyFilter, FilterRail, Breadcrumb } from './filters.tsx';
import { Treemap, type DrillLevel } from './charts.tsx';
import { BandA, BandB, BandD } from './bands.tsx';
import { BandE } from './overlays.tsx';
import { TweaksPanel } from './tweaks.tsx';
import { Landing } from './landing.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { useLocale } from './i18n.tsx';

interface Page {
  id: string;
  kind: string;
  label: string;
  cluster?: string;
  sector?: string;
  color?: string;
}

function buildPages(_allItems: Item[]): Page[] {
  const pages: Page[] = [
    { id: 'landing', kind: 'landing', label: 'Home' },
    { id: 'overview', kind: 'overview', label: 'Data' },
  ];
  for (const fl of FINISH_LINES) {
    pages.push({ id: 'cluster:' + fl, kind: 'cluster', label: shortFL(fl), cluster: fl, color: FINISH_LINE_COLORS[fl] });
  }
  return pages;
}

function PageHero({ page, items, t }: { page: Page; items: Item[]; t: (k: string) => string }) {
  if (page.kind === 'overview') return null;
  const base = items.filter((x) => !isOutlier(x));
  const scoped = base.filter((x) => {
    if (page.kind === 'sector') return x.sector === page.sector;
    if (page.kind === 'cluster') return x.finish_line_norm === page.cluster;
    return true;
  });
  const r = rollup(scoped);
  const blurb = page.kind === 'sector' ?
  `All ${r.pap_count} programs, projects & activities in the ${shortSector(page.sector!)} sector. Drill into offices, line items, and strategic overlays filtered to this lens.` :
  `PAPs aligned to the 2028 Finish-Line cluster — ${page.cluster}. Cross-sectoral view of programs advancing this theme.`;

  const accentColor = page.kind === 'cluster' ? page.color : 'var(--accent)';

  return (
    <div className="page-hero" style={page.kind === 'cluster' ? {
      borderTop: `4px solid ${accentColor}`
    } : {}}>
      <div>
        <div className="eyebrow">
          {page.kind === 'sector' ? t('hero.sector') : t('hero.2028cluster')}
        </div>
        <h1>{page.kind === 'cluster' ? page.cluster : shortSector(page.sector!)}</h1>
        <div className="blurb">{blurb}</div>
      </div>
      <div className="stats">
        <div>
          <div className="k">{t('hero.total')}</div>
          <div className="v">{fmtPeso(r.total)}</div>
        </div>
        <div>
          <div className="k">{t('hero.paps')}</div>
          <div className="v">{fmtInt(r.pap_count)}</div>
        </div>
        <div>
          <div className="k">{t('hero.offices')}</div>
          <div className="v">{new Set(scoped.map((x) => x.unit)).size}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useLocale();
  const [data, setData] = useState<AIPData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [useClean, setUseClean] = useState(false);
  const [level, setLevel] = useState<DrillLevel>({ type: 'sector' });
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [accent, setAccent] = useState('indigo');
  const [density, setDensity] = useState('comfortable');

  const [pageId, setPageId] = useState(() => {
    try {return localStorage.getItem('naga.page') || 'landing';}
    catch {return 'landing';}
  });
  useEffect(() => {
    try {localStorage.setItem('naga.page', pageId);} catch {}
  }, [pageId]);

  useEffect(() => {
    fetch('data/aip2026.json').then((r) => r.json()).then(setData).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    document.documentElement.setAttribute('data-density', density);
  }, [accent, density]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksVisible(true);
      else if (e.data.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [headerOnDark, setHeaderOnDark] = useState(false);
  useEffect(() => {
    let raf: number | null = null;
    const check = () => {
      raf = null;
      setHeaderScrolled(window.scrollY > 8);
      const darkEls = document.querySelectorAll('.L-digin');
      let onDark = false;
      for (const el of darkEls) {
        const r = el.getBoundingClientRect();
        if (r.top < 130 && r.bottom > 0) { onDark = true; break; }
      }
      setHeaderOnDark(onDark);
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pageId]);

  const allItems = useMemo(() => data ? flattenData(data) : [], [data]);
  const allUnits = useMemo(() => [...new Set(allItems.map((x) => x.unit))].sort(), [allItems]);
  const pages = useMemo(() => buildPages(allItems), [allItems]);
  const page = pages.find((p) => p.id === pageId) || pages[0];

  const pageItems = useMemo(() => {
    if (!page || page.kind === 'overview') return allItems;
    if (page.kind === 'sector') return allItems.filter((x) => x.sector === page.sector);
    if (page.kind === 'cluster') return allItems.filter((x) => x.finish_line_norm === page.cluster);
    return allItems;
  }, [allItems, page]);

  const filtered = useMemo(() => applyFilters(pageItems, filters), [pageItems, filters]);
  const hasFilters = hasAnyFilter(filters);
  const filteredRollup = useMemo(() => rollup(filtered), [filtered]);

  const rollupAll = data?.rollup;
  const rollupClean = data?.rollup_clean_excluding_outliers;
  const dq = data?.data_quality;
  const dataQuality = dq && {
    ...dq,
    officesInScope: new Set(allItems.map((x) => x.unit)).size,
    sectorsInScope: 4
  };

  useEffect(() => {
    if (page?.kind === 'sector') setLevel({ type: 'unit', sector: page.sector });
    else setLevel({ type: 'sector' });
  }, [pageId]);

  if (error) return <div className="shell"><div className="empty"><div className="title">{t('loading.error')}</div><div>{error}</div></div></div>;
  if (!data) return (
    <div className="shell">
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--ink-3)' }}>{t('loading.paps')}</div>
      </div>
    </div>
  );

  const lastUpdated = 'Nov 2025 template';
  const clusterPages = pages.filter((p) => p.kind === 'cluster');

  return (
    <>
      <div className={`topbar ${headerScrolled ? 'scrolled' : ''} ${headerOnDark ? 'on-dark' : ''}`}>
        <div className="wordmark">
          <img className="seal-img" src="assets/naga-seal.png" alt="Naga City" />
          <span className="sep">·</span>
          <span className="title">{t('topbar.title')}</span>
          <span className="badge">{t('topbar.badge')}</span>
        </div>
        <div className="grow" />
        <LanguageSelector />
        <div className="meta">
          <a className="top-link" href="https://www2.naga.gov.ph" target="_blank" rel="noopener noreferrer">naga.gov.ph</a>
          <a className="top-link" href="https://www2.naga.gov.ph/about-naga/" target="_blank" rel="noopener noreferrer">{t('topbar.about')}</a>
          <a className="top-link" href="https://www2.naga.gov.ph/contact-us/" target="_blank" rel="noopener noreferrer">{t('topbar.contact')}</a>
        </div>
        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-menu-nav">
          <button className={`mobile-nav-item ${page.id === 'landing' ? 'active' : ''}`}
            onClick={() => { setPageId('landing'); setMobileMenuOpen(false); }}>
            {t('nav.home')}
          </button>
          <button className={`mobile-nav-item ${page.id === 'overview' ? 'active' : ''}`}
            onClick={() => { setPageId('overview'); setMobileMenuOpen(false); }}>
            {t('nav.overview')}
          </button>
          <div className="mobile-nav-divider" />
          {clusterPages.map((p) => (
            <button key={p.id}
              className={`mobile-nav-item ${page.id === p.id ? 'active' : ''}`}
              onClick={() => { setPageId(p.id); setMobileMenuOpen(false); }}>
              {p.label}
            </button>
          ))}
          <div className="mobile-nav-divider" />
          <a className="mobile-nav-link" href="https://www2.naga.gov.ph" target="_blank" rel="noopener noreferrer">naga.gov.ph</a>
          <a className="mobile-nav-link" href="https://www2.naga.gov.ph/about-naga/" target="_blank" rel="noopener noreferrer">{t('topbar.about')}</a>
          <a className="mobile-nav-link" href="https://www2.naga.gov.ph/contact-us/" target="_blank" rel="noopener noreferrer">{t('topbar.contact')}</a>
        </nav>
      </div>

      <div className={`nav-tabs ${headerScrolled ? 'scrolled' : ''} ${headerOnDark ? 'on-dark' : ''}`} role="tablist">
        <div className="nav-tabs-inner">
          <button className={`nav-tab ${page.id === 'landing' ? 'active' : ''}`}
          onClick={() => setPageId('landing')}
          role="tab">
            {t('nav.home')}
          </button>
          <button className={`nav-tab ${page.id === 'overview' ? 'active' : ''}`}
          onClick={() => setPageId('overview')}
          role="tab">
            {t('nav.overview')}
          </button>
          <div className="nav-divider" />
          {clusterPages.map((p) => <button key={p.id}
            className={`nav-tab ${page.id === p.id ? 'active' : ''}`}
            onClick={() => setPageId(p.id)}
            role="tab">
              {p.label}
            </button>
          )}
        </div>
      </div>

      {page.kind === 'landing' ? (
        <Landing items={allItems} rollupAll={rollupAll!} rollupClean={rollupClean!}
                 setPageId={setPageId} />
      ) : (
      <div className="shell">
        <PageHero page={page} items={allItems} t={t} />

        {page.kind === 'overview' &&
        <div className="band">
            <div className="band-head">
              <span className="eyebrow">{t('headline.eyebrow')}</span>
              <h2>{t('headline.title')}</h2>
              <span className="sub">{t('headline.sub')}</span>
            </div>
            <BandA rollupAll={rollupAll!}
          rollupClean={rollupClean!}
          useClean={useClean}
          setUseClean={setUseClean}
          filteredRollup={filteredRollup}
          dataQuality={dataQuality!}
          hasFilters={hasFilters}
          lastUpdated={lastUpdated} />
          </div>
        }

        <div className="band filter-band">
          <div className="band-head">
            <span className="eyebrow">{t('filters.eyebrow')}</span>
            <h2 style={{ fontSize: 22, color: 'var(--ink-2)' }}>{t('filters.title')}</h2>
            <span className="sub">
              {page.kind === 'overview' ?
              t('filters.clickToFilter') :
              `${t('filters.viewing')} ${page.kind === 'cluster' ? page.cluster : shortSector(page.sector!)} ${t('filters.useFilters')}`}
            </span>
          </div>
          <FilterRail items={pageItems} filters={filters} setFilters={setFilters} allUnits={allUnits} />
          <Breadcrumb filters={filters} setFilters={setFilters}
          filteredCount={filtered.length} totalCount={pageItems.length} />
        </div>

        {page.kind === 'overview' &&
        <div className="band">
            <div className="band-head">
              <span className="eyebrow">{t('sectors.eyebrow')}</span>
              <h2>{t('sectors.title')}</h2>
              <span className="sub">{t('sectors.sub')}</span>
            </div>
            <BandB items={filtered} filters={filters} setFilters={setFilters}
          filteredRollup={filteredRollup} useClean={useClean}
          onClusterClick={(c) => setPageId('cluster:' + c)} />
          </div>
        }

        <div className="band">
          <div className="band-head">
            <span className="eyebrow">{t('offices.eyebrow')}</span>
            <h2>{page.kind === 'sector' ? t('offices.sectorTitle') :
              page.kind === 'cluster' ? t('offices.clusterTitle') :
              t('offices.title')}</h2>
            <span className="sub">{t('offices.sub')}</span>
          </div>
          <div className="card">
            <Treemap items={filtered.filter((x) => !isOutlier(x))} level={level} setLevel={setLevel}
            setFilters={setFilters} filters={filters}
            pinnedSector={page.kind === 'sector' ? page.sector! : null} />
          </div>
        </div>

        <div className="band">
          <div className="band-head">
            <span className="eyebrow">{t('items.eyebrow')}</span>
            <h2>{t('items.title')}</h2>
            <span className="sub">{t('items.sub')}</span>
          </div>
          <BandD items={filtered} filters={filters} setFilters={setFilters} />
        </div>

        <BandE items={filtered} useClean={useClean} pageKind={page.kind} />

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--rule)',
          fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.6,
          display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>{t('dash.aboutTitle')}</div>
            <div>
              {t('dash.aboutText')}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>{t('dash.dataNotesTitle')}</div>
            <div>
              {t('dash.dataNotesText')}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>{t('dash.schemaTitle')}</div>
            <div className="mono" style={{ fontSize: 10.5 }}>
              aip2026.v1 · {t('dash.generated')} {lastUpdated}<br />
              1,216 rows × 23 columns
            </div>
          </div>
        </div>
      </div>
      )}

      <TweaksPanel visible={tweaksVisible}
      accent={accent} setAccent={setAccent}
      density={density} setDensity={setDensity} />
    </>
  );
}
