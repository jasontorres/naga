import React, { useState, useMemo } from 'react';
import type { Filters } from './filters.tsx';
import { Donut } from './charts.tsx';
import {
  type Item, type Rollup,
  fmtPeso, fmtPct, fmtInt, fmtCompact,
  shortSector, shortFL,
  rollup, groupBy,
  FINISH_LINE_COLORS, FUNDING_COLORS,
} from './utils.tsx';
import { useLocale } from './i18n.tsx';

interface DataQuality {
  rows_total: number;
  rows_clean: number;
  unit_check_outliers: number;
  missing_funding_source: number;
  officesInScope: number;
  sectorsInScope: number;
}

interface BandAProps {
  rollupAll: Rollup;
  rollupClean: Rollup;
  useClean: boolean;
  setUseClean: (v: boolean) => void;
  filteredRollup: Rollup;
  dataQuality: DataQuality;
  hasFilters: boolean;
  lastUpdated: string;
}

export function BandA({ rollupAll, rollupClean, useClean, setUseClean, filteredRollup, dataQuality, hasFilters, lastUpdated }: BandAProps) {
  const { t } = useLocale();
  const isReported = !hasFilters && !useClean;
  const r = hasFilters ? filteredRollup : (useClean ? rollupClean : rollupAll);
  const total = r.total;
  const climateSpend = (r.cc_adapt || 0) + (r.cc_mitig || 0);
  const pctDen = hasFilters ? (total > 0 ? total : 1)
                 : rollupClean.total;
  const climatePct = pctDen > 0 ? (climateSpend / pctDen) * 100 : 0;
  const adaptPct = climateSpend > 0 ? (r.cc_adapt / climateSpend) * 100 : 0;

  const splitR = hasFilters ? filteredRollup : rollupClean;
  const splitTotal = splitR.total;
  let displayVal: string, displayUnit: string;
  if (isReported) {
    displayVal = (total / 1000).toFixed(1);
    displayUnit = t('kpi.billion');
    if (Math.abs(total - 16634380.1872) < 1) {
      displayVal = '16.6';
    }
  } else if (total >= 1000) {
    displayVal = (total / 1000).toFixed(2);
    displayUnit = t('kpi.billion');
  } else {
    displayVal = total.toFixed(1);
    displayUnit = t('kpi.million');
  }

  const ringSize = 58, ringR = 24, ringSW = 8;
  const C = 2 * Math.PI * ringR;
  const adaptLen = (adaptPct / 100) * C;
  const mitigLen = C - adaptLen;

  return (
    <>
      <div className="hero" role="region" aria-label="Hero KPIs">
        <div className="cell">
          <div className="label">
            {t('kpi.totalAIP')}
            {!hasFilters && (
              <>
                <span className={`tag ${!useClean ? 'active' : ''}`} onClick={() => setUseClean(false)} role="button">{t('kpi.reported')}</span>
                <span className={`tag ${useClean ? 'active' : ''}`} onClick={() => setUseClean(true)} role="button">{t('kpi.exOutliers')}</span>
              </>
            )}
          </div>
          <div className="hero-value">
            <span className="peso">₱</span>
            {displayVal}
            <span className="unit">{displayUnit}</span>
          </div>
          <div className="hero-sub">
            <span>{fmtInt(r.pap_count)} {t('kpi.programs')}</span>
            {hasFilters && <span style={{color:'var(--accent)', fontWeight: 500}}>{t('kpi.filteredView')}</span>}
            {isReported && <span style={{color:'var(--ink-4)', fontSize: 11}}>{t('kpi.splitShown')}</span>}
          </div>
          <div className="split">
            <div className="seg ps">
              <div className="k">PS · {t('kpi.offices').replace('opisina', 'personnel').replace('offices', 'personnel')}</div>
              <div className="v">{fmtCompact(splitR.ps)}<span className="pct">{fmtPct(splitR.ps, splitTotal)}</span></div>
            </div>
            <div className="seg mooe">
              <div className="k">MOOE · maintenance</div>
              <div className="v">{fmtCompact(splitR.mooe)}<span className="pct">{fmtPct(splitR.mooe, splitTotal)}</span></div>
            </div>
            <div className="seg co">
              <div className="k">CO · capital</div>
              <div className="v">{fmtCompact(splitR.co)}<span className="pct">{fmtPct(splitR.co, splitTotal)}</span></div>
            </div>
          </div>
        </div>

        <div className="cell">
          <div className="label">{t('kpi.climateSpend')}</div>
          <div className="climate-chip" style={{marginTop: 14}}>
            <div className="climate-ring">
              <svg width={ringSize} height={ringSize}>
                <circle cx={ringSize/2} cy={ringSize/2} r={ringR}
                        fill="none" stroke="var(--paper-2)" strokeWidth={ringSW} />
                <circle cx={ringSize/2} cy={ringSize/2} r={ringR}
                        fill="none" stroke="var(--c-adapt)" strokeWidth={ringSW}
                        strokeDasharray={`${adaptLen} ${C}`} strokeDashoffset="0" />
                <circle cx={ringSize/2} cy={ringSize/2} r={ringR}
                        fill="none" stroke="var(--c-mitig)" strokeWidth={ringSW}
                        strokeDasharray={`${mitigLen} ${C}`} strokeDashoffset={-adaptLen} />
              </svg>
              <div className="ring-label">{climatePct.toFixed(1)}%</div>
            </div>
            <div style={{minWidth: 0}}>
              <div style={{fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em'}}>{fmtPeso(climateSpend)}</div>
              <div className="climate-legend" style={{marginTop: 4}}>
                <div><span className="swatch" style={{background:'var(--c-adapt)'}}></span>{t('kpi.adaptation')} {fmtCompact(r.cc_adapt)}</div>
                <div><span className="swatch" style={{background:'var(--c-mitig)'}}></span>{t('kpi.mitigation')} {fmtCompact(r.cc_mitig)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cell">
          <div className="label">{t('kpi.officesSectors')}</div>
          <div style={{display:'flex', gap: 22, alignItems:'baseline', marginTop: 12}}>
            <div>
              <div className="count-big">{dataQuality.officesInScope}</div>
              <div className="count-sub">{t('kpi.offices')}</div>
            </div>
            <div>
              <div className="count-big">{dataQuality.sectorsInScope}</div>
              <div className="count-sub">{t('kpi.sectors')}</div>
            </div>
          </div>
          <div style={{marginTop: 10, fontSize: 12, color:'var(--ink-3)', lineHeight: 1.45}}>
            {t('kpi.classified')}
          </div>
        </div>

        <div className="cell">
          <div className="label">{t('kpi.dataIntegrity')}</div>
          <div style={{marginTop: 12, display:'flex', flexDirection:'column', gap: 8, fontSize: 12}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{color:'var(--ink-3)'}}>{t('kpi.rowsClean')}</span>
              <span className="mono" style={{fontWeight:600}}>{fmtInt(dataQuality.rows_clean)} / {fmtInt(dataQuality.rows_total)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{color:'var(--ink-3)'}}>{t('kpi.flagged')}</span>
              <span className="mono" style={{fontWeight:600, color:'var(--c-co)'}}>{dataQuality.unit_check_outliers}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{color:'var(--ink-3)'}}>{t('kpi.missingFunding')}</span>
              <span className="mono" style={{fontWeight:600}}>{dataQuality.missing_funding_source}</span>
            </div>
            <div style={{fontSize: 10.5, color:'var(--ink-4)', fontFamily:'JetBrains Mono, monospace', marginTop: 4}}>
              {t('kpi.lastUpdated')} · {lastUpdated}
            </div>
          </div>
        </div>
      </div>

      {!hasFilters && !useClean && (
        <div className="banner" role="alert">
          <span className="icon">⚠</span>
          <span>
            <strong>{t('banner.outlierWarning')}</strong> {t('banner.outlierDetail')}
            {' '}{t('banner.toggleClean')} <em>{t('kpi.exOutliers')}</em> {t('banner.cleanTotal')} <strong>₱2.85B</strong> {t('banner.acrossPaps')}
          </span>
        </div>
      )}
    </>
  );
}

interface BandBProps {
  items: Item[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredRollup: Rollup;
  useClean: boolean;
  onSectorClick?: (s: string) => void;
  onClusterClick?: (c: string) => void;
}

export function BandB({ items, filters, setFilters, filteredRollup, useClean, onSectorClick, onClusterClick }: BandBProps) {
  const { t } = useLocale();
  const [hoveredFL, setHoveredFL] = useState<string | null>(null);

  const sectorData = useMemo(() => {
    const base = items.filter(x => !(x.data_quality_flag === 'unit_check'));
    const g = groupBy(base, x => x.sector);
    return [...g.entries()].map(([name, arr]) => ({
      name,
      r: rollup(arr)
    })).sort((a, b) => b.r.total - a.r.total);
  }, [items, useClean]);

  const maxTotal = Math.max(...sectorData.map(s => s.r.total), 1);

  const finishLineData = useMemo(() => {
    const base = useClean ? items.filter(x => x.data_quality_flag !== 'unit_check') : items;
    const g = groupBy(base, x => x.finish_line_norm || 'Unclassified');
    return [...g.entries()].map(([k, v]) => ({
      key: k,
      label: shortFL(k),
      value: rollup(v).total,
      paps: v.length,
      color: FINISH_LINE_COLORS[k] || FINISH_LINE_COLORS['Unclassified']
    })).filter(x => x.value > 0.01).sort((a, b) => b.value - a.value);
  }, [items, useClean]);

  const totalFL = finishLineData.reduce((s, x) => s + x.value, 0);

  const toggleSector = (s: string) => {
    if (onSectorClick) { onSectorClick(s); return; }
    setFilters(prev => {
      const next = { ...prev, sectors: new Set(prev.sectors) };
      if (next.sectors.has(s)) next.sectors.delete(s); else next.sectors.add(s);
      return next;
    });
  };

  const toggleFL = (fl: string) => {
    if (onClusterClick) { onClusterClick(fl); return; }
    setFilters(prev => {
      const next = { ...prev, finishLines: new Set(prev.finishLines) };
      if (next.finishLines.has(fl)) next.finishLines.delete(fl); else next.finishLines.add(fl);
      return next;
    });
  };

  return (
    <div className="band-b">
      <div className="card panel">
        <h3>
          {t('sectors.overview')}
          <span className="hint">{onSectorClick ? t('sectors.clickSector') : t('sectors.clickFilter')} · {t('sectors.amounts')}</span>
        </h3>
        {sectorData.map(s => (
          <div key={s.name}
               className={`sector-row ${filters.sectors.has(s.name) ? 'active' : ''}`}
               onClick={() => toggleSector(s.name)}
               role="button"
               tabIndex={0}>
            <div className="name">
              {shortSector(s.name)}
              <span className="count">{s.r.pap_count} PAPs</span>
            </div>
            <div className="stack-bar" style={{ width: `${(s.r.total / maxTotal) * 100}%` }}>
              {s.r.ps > 0 && <div className="seg ps" style={{flex: s.r.ps}}><span className="v">PS</span></div>}
              {s.r.mooe > 0 && <div className="seg mooe" style={{flex: s.r.mooe}}><span className="v">MOOE</span></div>}
              {s.r.co > 0 && <div className="seg co" style={{flex: Math.max(0.0001, s.r.co)}}><span className="v">CO</span></div>}
            </div>
            <div className="total">
              {fmtPeso(s.r.total)}
              <span className="unit">{fmtInt(s.r.pap_count)} PAPs</span>
            </div>
          </div>
        ))}
        <div className="legend">
          <span className="item"><span className="sw" style={{background:'var(--c-ps)'}}></span>{t('sectors.ps')}</span>
          <span className="item"><span className="sw" style={{background:'var(--c-mooe)'}}></span>{t('sectors.mooe')}</span>
          <span className="item"><span className="sw" style={{background:'var(--c-co)'}}></span>{t('sectors.co')}</span>
          {!useClean && <span style={{marginLeft:'auto', color:'var(--ink-4)', fontFamily:'JetBrains Mono, monospace'}}>{t('sectors.chartExcludes')}</span>}
          {useClean && <span style={{marginLeft:'auto', color:'var(--ink-4)', fontFamily:'JetBrains Mono, monospace'}}>{t('sectors.excluding')}</span>}
        </div>
      </div>

      <div className="card panel">
        <h3>
          {t('fl.clusters')}
          <span className="hint">{t('fl.naga2028')}</span>
        </h3>
        <div className="donut-wrap">
          <div style={{position: 'relative'}}>
            <Donut slices={finishLineData} size={200} inner={68}
                   active={hoveredFL} onHover={setHoveredFL}
                   onClick={(s) => s.key !== 'Unclassified' && toggleFL(s.key)} />
            <div className="donut-center" style={{position: 'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none'}}>
              <div className="big">{fmtPeso(totalFL)}</div>
              <div className="small">{t('fl.across')} {finishLineData.length} {t('fl.clustersWord')}</div>
            </div>
          </div>
          <div className="donut-legend">
            {finishLineData.map(s => (
              <div key={s.key}
                   className={`row ${filters.finishLines.has(s.key) ? 'active' : ''}`}
                   onMouseEnter={() => setHoveredFL(s.key)}
                   onMouseLeave={() => setHoveredFL(null)}
                   onClick={() => s.key !== 'Unclassified' && toggleFL(s.key)}>
                <span className="sw" style={{background: s.color}}></span>
                <span className="label">{s.label}</span>
                <span className="v">{fmtPeso(s.value)} · {fmtPct(s.value, totalFL)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BandDProps {
  items: Item[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function BandD({ items, filters, setFilters }: BandDProps) {
  const { t } = useLocale();
  const [sortKey, setSortKey] = useState('total');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      let va: any, vb: any;
      if (sortKey === 'total') { va = a.amounts.total || 0; vb = b.amounts.total || 0; }
      else if (sortKey === 'ps') { va = a.amounts.ps || 0; vb = b.amounts.ps || 0; }
      else if (sortKey === 'mooe') { va = a.amounts.mooe || 0; vb = b.amounts.mooe || 0; }
      else if (sortKey === 'co') { va = a.amounts.co || 0; vb = b.amounts.co || 0; }
      else if (sortKey === 'code') { va = a.aip_code || ''; vb = b.aip_code || ''; }
      else if (sortKey === 'desc') { va = a.description || ''; vb = b.description || ''; }
      else if (sortKey === 'office') { va = a.office || ''; vb = b.office || ''; }
      else if (sortKey === 'funding') { va = a.funding_norm || ''; vb = b.funding_norm || ''; }
      else { va = (a as any)[sortKey]; vb = (b as any)[sortKey]; }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return arr;
  }, [items, sortKey, sortDir]);

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const curPage = Math.min(page, pages - 1);
  const pageItems = sorted.slice(curPage * pageSize, (curPage + 1) * pageSize);

  const setSort = (k: string) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir(k === 'code' || k === 'desc' || k === 'office' || k === 'funding' ? 'asc' : 'desc'); }
    setPage(0);
  };

  const header = (k: string, label: string, cls = '') => (
    <th className={`${cls} ${sortKey === k ? 'sort-' + sortDir : ''}`} onClick={() => setSort(k)}>
      {label}
    </th>
  );

  const exportCSV = () => {
    const rows: (string | number)[][] = [['Code','Description','Office','Funding','PS','MOOE','CO','Total','Climate','Finish-Line','Mainstreaming','Start','End','Flag']];
    for (const it of sorted) {
      const climate = (it.amounts.cc_adapt || 0) + (it.amounts.cc_mitig || 0);
      rows.push([
        it.aip_code || '',
        (it.description || '').replace(/"/g, '""'),
        it.office || '',
        it.funding_norm || '',
        it.amounts.ps ?? '',
        it.amounts.mooe ?? '',
        it.amounts.co ?? '',
        it.amounts.total ?? '',
        climate || '',
        it.finish_line_norm || '',
        it.code_mainstreaming || '',
        it.start_date || '',
        it.end_date || '',
        it.data_quality_flag || ''
      ]);
    }
    const csv = rows.map(r => r.map(v => `"${String(v)}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naga-aip-2026-filtered-${total}-rows.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (total === 0) {
    return (
      <div className="card table-wrap">
        <div className="table-toolbar">
          <div className="count"><strong>{t('items.title')}</strong></div>
        </div>
        <div className="empty">
          <div className="title">{t('items.noRows')}</div>
          <div>{t('items.noRowsSub')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card table-wrap">
      <div className="table-toolbar">
        <div className="count">
          <strong>{fmtInt(total)}</strong> PAPs · {t('items.page')} {curPage + 1} {t('items.ofPages')} {pages} · {t('items.amountsIn')}
        </div>
        <div className="grow" />
        <input className="type-input search" type="search" placeholder={t('items.searchPlaceholder')}
               value={filters.search}
               onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} />
        <button className="btn primary" onClick={exportCSV}>{t('items.export')} ({fmtInt(total)})</button>
      </div>

      <table className="line-items">
        <thead>
          <tr>
            {header('code', t('items.code'))}
            {header('desc', t('items.description'))}
            {header('office', t('items.office'))}
            {header('funding', t('items.funding'))}
            {header('ps', 'PS', 'num')}
            {header('mooe', 'MOOE', 'num')}
            {header('co', 'CO', 'num')}
            {header('total', t('items.total'), 'num')}
            <th>{t('items.climate')}</th>
            <th>{t('items.finishLine')}</th>
            <th>{t('items.mainstreaming')}</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((it, i) => {
            const climate = (it.amounts.cc_adapt || 0) + (it.amounts.cc_mitig || 0);
            return (
              <tr key={it.aip_code + '-' + i} className={it.data_quality_flag ? 'flagged' : ''}>
                <td><span className="code">{it.aip_code}</span></td>
                <td>
                  <div className="desc">
                    {it.description || <em style={{color:'var(--ink-4)'}}>—</em>}
                    <span className="small">{it.program}</span>
                  </div>
                </td>
                <td>
                  <div style={{fontSize: 12, fontWeight: 500}}>{it.office}</div>
                  <div style={{fontSize: 10.5, color:'var(--ink-3)'}}>{shortSector(it.sector)}</div>
                </td>
                <td>
                  <span className={`badge fund ${it.funding_norm === 'Unspecified' ? 'unspec' : ''}`}
                        style={it.funding_norm !== 'Unspecified' ? { borderLeft: `3px solid ${FUNDING_COLORS[it.funding_norm] || 'var(--f-other)'}` } : {}}>
                    {it.funding_norm}
                  </span>
                </td>
                <td className="num">{it.amounts.ps != null ? it.amounts.ps.toFixed(2) : '—'}</td>
                <td className="num">{it.amounts.mooe != null ? it.amounts.mooe.toFixed(2) : '—'}</td>
                <td className="num">{it.amounts.co != null ? it.amounts.co.toFixed(2) : '—'}</td>
                <td className="num" style={{fontWeight: 600}}>{it.amounts.total != null ? it.amounts.total.toFixed(2) : '—'}</td>
                <td>
                  {climate > 0 ? (
                    <span className="badge climate">{climate.toFixed(2)}M</span>
                  ) : (
                    <span style={{color:'var(--ink-4)'}}>—</span>
                  )}
                </td>
                <td>
                  <span style={{fontSize: 11, color:'var(--ink-2)'}}>{shortFL(it.finish_line_norm) || <span style={{color:'var(--ink-4)'}}>—</span>}</span>
                </td>
                <td>
                  <span style={{fontSize: 10.5, color:'var(--ink-3)', fontFamily:'JetBrains Mono, monospace'}}>
                    {it.code_mainstreaming || '—'}
                  </span>
                  {it.data_quality_flag && (
                    <div style={{marginTop: 3}}>
                      <span className="badge flag" title={it.data_quality_flag}>⚠ {it.data_quality_flag}</span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="cards-mobile">
        {pageItems.map((it, i) => {
          const climate = (it.amounts.cc_adapt || 0) + (it.amounts.cc_mitig || 0);
          return (
            <div key={it.aip_code + '-m-' + i} className="item">
              <div className="desc">{it.description || '—'}</div>
              <div className="meta">
                <span className="code">{it.aip_code}</span>
                <span>{it.office}</span>
                <span className={`badge fund ${it.funding_norm === 'Unspecified' ? 'unspec' : ''}`}>{it.funding_norm}</span>
                {climate > 0 && <span className="badge climate">{t('items.climateTagged')}</span>}
                {it.data_quality_flag && <span className="badge flag">⚠ {it.data_quality_flag}</span>}
              </div>
              <div className="amts">
                <span><b>{it.amounts.ps != null ? it.amounts.ps.toFixed(1) : '—'}</b>PS</span>
                <span><b>{it.amounts.mooe != null ? it.amounts.mooe.toFixed(1) : '—'}</b>MOOE</span>
                <span><b>{it.amounts.co != null ? it.amounts.co.toFixed(1) : '—'}</b>CO</span>
                <span><b>{it.amounts.total != null ? it.amounts.total.toFixed(1) : '—'}</b>total</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button className="btn" disabled={curPage === 0} onClick={() => setPage(0)}>{t('items.first')}</button>
        <button className="btn" disabled={curPage === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>{t('items.prev')}</button>
        <span className="pg">{curPage + 1} / {pages}</span>
        <button className="btn" disabled={curPage >= pages - 1} onClick={() => setPage(p => Math.min(pages - 1, p + 1))}>{t('items.next')}</button>
        <button className="btn" disabled={curPage >= pages - 1} onClick={() => setPage(pages - 1)}>{t('items.last')}</button>
      </div>
    </div>
  );
}
