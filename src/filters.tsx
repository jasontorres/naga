import React, { useState, useMemo } from 'react';
import {
  type Item, shortSector, shortFL, groupBy,
  FINISH_LINES, FINISH_LINE_COLORS, isOutlier,
  fmtInt,
} from './utils.tsx';

export interface Filters {
  sectors: Set<string>;
  units: Set<string>;
  fundingSources: Set<string>;
  subcategories: Set<string>;
  finishLines: Set<string>;
  climateOnly: boolean;
  hideFlagged: boolean;
  search: string;
  unitQuery: string;
}

export const initialFilters: Filters = {
  sectors: new Set(),
  units: new Set(),
  fundingSources: new Set(),
  subcategories: new Set(),
  finishLines: new Set(),
  climateOnly: false,
  hideFlagged: true,
  search: '',
  unitQuery: '',
};

export function applyFilters(items: Item[], f: Filters): Item[] {
  return items.filter(it => {
    if (f.sectors.size && !f.sectors.has(it.sector)) return false;
    if (f.units.size && !f.units.has(it.unit)) return false;
    if (f.fundingSources.size && !f.fundingSources.has(it.funding_norm)) return false;
    if (f.subcategories.size && !f.subcategories.has(it.subcategory)) return false;
    if (f.finishLines.size) {
      if (!it.finish_line_norm) return false;
      if (!f.finishLines.has(it.finish_line_norm)) return false;
    }
    if (f.climateOnly) {
      const hasClimate = (it.amounts.cc_adapt || 0) + (it.amounts.cc_mitig || 0) > 0;
      if (!hasClimate) return false;
    }
    if (f.hideFlagged && isOutlier(it)) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      if (!(it.description || '').toLowerCase().includes(q) &&
          !(it.aip_code || '').toLowerCase().includes(q) &&
          !(it.office || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function hasAnyFilter(f: Filters): boolean {
  return !!(f.sectors.size || f.units.size || f.fundingSources.size ||
         f.subcategories.size || f.finishLines.size ||
         f.climateOnly || f.search);
}

interface FilterRailProps {
  items: Item[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  allUnits: string[];
}

export function FilterRail({ items, filters, setFilters, allUnits }: FilterRailProps) {
  const [showMore, setShowMore] = useState(false);

  const update = (fn: (next: Filters) => void) => setFilters(prev => {
    const next: Filters = { ...prev,
      sectors: new Set(prev.sectors),
      units: new Set(prev.units),
      fundingSources: new Set(prev.fundingSources),
      subcategories: new Set(prev.subcategories),
      finishLines: new Set(prev.finishLines),
    };
    fn(next);
    return next;
  });

  const toggle = (setKey: keyof Pick<Filters, 'sectors' | 'units' | 'fundingSources' | 'subcategories' | 'finishLines'>, val: string) => update(n => {
    if (n[setKey].has(val)) n[setKey].delete(val); else n[setKey].add(val);
  });

  const sectors = useMemo(() => {
    const g = groupBy(items, x => x.sector);
    return [...g.entries()].map(([k, v]) => [k, v.length] as [string, number]).sort((a,b) => b[1]-a[1]);
  }, [items]);

  const fundingSources = useMemo(() => {
    const g = groupBy(items, x => x.funding_norm);
    return [...g.entries()].map(([k, v]) => [k, v.length] as [string, number]).sort((a,b) => b[1]-a[1]);
  }, [items]);

  const subs = useMemo(() => {
    const g = groupBy(items, x => x.subcategory);
    return [...g.entries()].map(([k, v]) => [k, v.length] as [string, number]).sort((a,b) => b[1]-a[1]);
  }, [items]);

  const fls = FINISH_LINES;

  const filteredUnits = useMemo(() => {
    const q = filters.unitQuery.toLowerCase().trim();
    if (!q) return [];
    return allUnits.filter(u => u.toLowerCase().includes(q)).slice(0, 8);
  }, [allUnits, filters.unitQuery]);

  const hasAdvancedFilters = filters.fundingSources.size > 0 || filters.subcategories.size > 0 ||
    filters.finishLines.size > 0 || filters.climateOnly || !filters.hideFlagged;

  return (
    <div className="filter-rail" role="region" aria-label="Filters">
      <div className="group span-6">
        <div className="glabel">Sector</div>
        <div className="chip-row">
          {sectors.map(([s, count]) => (
            <button key={s} className={`chip ${filters.sectors.has(s) ? 'active' : ''}`}
                    onClick={() => toggle('sectors', s)}>
              {shortSector(s)}<span className="count">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="group span-6">
        <div className="glabel">Search</div>
        <input className="type-input" type="text"
               placeholder="Search projects, offices…"
               value={filters.unitQuery}
               onChange={(e) => update(n => { n.unitQuery = e.target.value; })} />
        {filteredUnits.length > 0 && (
          <div className="chip-row" style={{marginTop: 4}}>
            {filteredUnits.map(u => (
              <button key={u} className={`chip ${filters.units.has(u) ? 'active' : ''}`}
                      onClick={() => toggle('units', u)}>
                {u}
              </button>
            ))}
          </div>
        )}
        {filters.units.size > 0 && filters.unitQuery === '' && (
          <div className="chip-row" style={{marginTop: 4}}>
            {[...filters.units].map(u => (
              <button key={u} className="chip active" onClick={() => toggle('units', u)}>
                {u}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="group span-12">
        <button className="more-filters-toggle" onClick={() => setShowMore(!showMore)}
                aria-expanded={showMore}>
          {showMore ? 'Fewer filters' : 'More filters'}{hasAdvancedFilters && !showMore ? ' (active)' : ''}
          <span className={`chevron ${showMore ? 'open' : ''}`}>&#9662;</span>
        </button>
      </div>

      {showMore && (
        <>
          <div className="group span-4">
            <div className="glabel">Funding Source</div>
            <div className="chip-row">
              {fundingSources.map(([f, count]) => (
                <button key={f} className={`chip ${filters.fundingSources.has(f) ? 'active' : ''}`}
                        onClick={() => toggle('fundingSources', f)}>
                  {f}<span className="count">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="group span-4">
            <div className="glabel">Subcategory</div>
            <div className="chip-row">
              {subs.map(([s, count]) => (
                <button key={s} className={`chip ${filters.subcategories.has(s) ? 'active' : ''}`}
                        onClick={() => toggle('subcategories', s)}>
                  {s}<span className="count">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="group span-4">
            <div className="glabel">2028 Finish-Line Cluster</div>
            <div className="chip-row">
              {fls.map(fl => (
                <button key={fl} className={`chip ${filters.finishLines.has(fl) ? 'active' : ''}`}
                        onClick={() => toggle('finishLines', fl)}
                        style={filters.finishLines.has(fl) ? { background: FINISH_LINE_COLORS[fl], borderColor: FINISH_LINE_COLORS[fl] } : {}}>
                  {shortFL(fl)}
                </button>
              ))}
            </div>
          </div>

          <div className="group span-12">
            <div className="glabel">Options</div>
            <div className="switch-row">
              <label className="switch-label">
                <span className={`switch ${filters.climateOnly ? 'on' : ''}`}
                      role="switch" aria-checked={filters.climateOnly}
                      tabIndex={0}
                      onClick={() => update(n => { n.climateOnly = !n.climateOnly; })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update(n => { n.climateOnly = !n.climateOnly; }); } }}>
                  <span className="switch-thumb" />
                </span>
                Climate projects only
              </label>
              <label className="switch-label">
                <span className={`switch ${filters.hideFlagged ? 'on' : ''}`}
                      role="switch" aria-checked={filters.hideFlagged}
                      tabIndex={0}
                      onClick={() => update(n => { n.hideFlagged = !n.hideFlagged; })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update(n => { n.hideFlagged = !n.hideFlagged; }); } }}>
                  <span className="switch-thumb" />
                </span>
                Hide flagged items
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface BreadcrumbProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredCount: number;
  totalCount: number;
}

export function Breadcrumb({ filters, setFilters, filteredCount, totalCount }: BreadcrumbProps) {
  const crumbs: { label: string; remove: () => void }[] = [];
  const update = (fn: (next: Filters) => void) => setFilters(prev => {
    const next: Filters = { ...prev,
      sectors: new Set(prev.sectors),
      units: new Set(prev.units),
      fundingSources: new Set(prev.fundingSources),
      subcategories: new Set(prev.subcategories),
      finishLines: new Set(prev.finishLines),
    };
    fn(next);
    return next;
  });

  filters.sectors.forEach(s => crumbs.push({ label: `Sector: ${shortSector(s)}`, remove: () => update(n => n.sectors.delete(s)) }));
  filters.units.forEach(u => crumbs.push({ label: `Office: ${u}`, remove: () => update(n => n.units.delete(u)) }));
  filters.fundingSources.forEach(f => crumbs.push({ label: `Source: ${f}`, remove: () => update(n => n.fundingSources.delete(f)) }));
  filters.subcategories.forEach(s => crumbs.push({ label: `${s}`, remove: () => update(n => n.subcategories.delete(s)) }));
  filters.finishLines.forEach(fl => crumbs.push({ label: `Cluster: ${shortFL(fl)}`, remove: () => update(n => n.finishLines.delete(fl)) }));
  if (filters.climateOnly) crumbs.push({ label: 'Climate projects only', remove: () => update(n => { n.climateOnly = false; }) });
  if (filters.hideFlagged === false) crumbs.push({ label: 'Flagged items shown', remove: () => update(n => { n.hideFlagged = true; }) });
  if (filters.search) crumbs.push({ label: `"${filters.search}"`, remove: () => update(n => { n.search = ''; }) });

  const clearAll = () => setFilters({ ...initialFilters,
    sectors: new Set(), units: new Set(), fundingSources: new Set(),
    subcategories: new Set(), finishLines: new Set() });

  return (
    <div className="breadcrumb" aria-live="polite">
      <span style={{fontFamily:'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink-3)', marginRight: 4}}>
        {fmtInt(filteredCount)} of {fmtInt(totalCount)} projects
      </span>
      {crumbs.length === 0 ? (
        <span className="none">Showing all {fmtInt(totalCount)} projects</span>
      ) : (
        <>
          {crumbs.map((c, i) => (
            <span key={i} className="crumb">
              {c.label}
              <span className="x" onClick={c.remove} role="button" aria-label={`Remove ${c.label}`}>×</span>
            </span>
          ))}
          <span className="clear" onClick={clearAll} role="button">clear all</span>
        </>
      )}
    </div>
  );
}
