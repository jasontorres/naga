export function fmtPeso(val: number | null | undefined, opts: { decimals?: number } = {}): string {
  if (val == null || isNaN(val)) return '—';
  const abs = Math.abs(val);
  if (abs >= 1000) {
    return '₱' + (val / 1000).toFixed(2) + 'B';
  }
  if (abs >= 1) {
    return '₱' + val.toFixed(opts.decimals ?? 1) + 'M';
  }
  if (abs >= 0.001) {
    return '₱' + (val * 1000).toFixed(0) + 'K';
  }
  return '₱' + val.toFixed(3) + 'M';
}

export function fmtPct(v: number, total: number): string {
  if (!total || total === 0) return '—';
  return (100 * v / total).toFixed(1) + '%';
}

export function fmtInt(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return '—';
  return Math.round(v).toLocaleString();
}

export function fmtCompact(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return '—';
  if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1) + 'B';
  if (Math.abs(v) >= 1) return v.toFixed(1) + 'M';
  return (v * 1000).toFixed(0) + 'K';
}

export function normalizeFunding(f: string | null | undefined): string {
  if (!f) return 'Unspecified';
  const u = f.trim().toUpperCase();
  if (u.includes('DONATION') || u.includes('GRANT')) return 'Donations/Grants';
  if (u.startsWith('GAD')) return 'GAD';
  if (u === 'GF') return 'GF';
  if (u === 'SEF') return 'SEF';
  if (u === 'LDF') return 'LDF';
  if (u === 'LDRRMF') return 'LDRRMF';
  if (u === 'SPA') return 'SPA';
  if (u === 'PPP') return 'PPP';
  if (u === 'NGA') return 'NGA';
  if (u.includes('PHILHEALTH')) return 'PhilHealth Trust';
  return f;
}

export const FINISH_LINES = [
  'Inclusive and Thriving Economy',
  'Envi, Infra and Housing',
  'Transparent, Digital, and Accountable Governance',
  'Safe, Secure, and Humane Communities',
  'Culture, Arts, and Heritage',
  'Empowered and Educated Citizens',
  'Social Protection and Inclusion',
  'Healthy Nagueños',
];

export function normalizeFinishLine(fl: string | null | undefined): string | null {
  if (!fl) return null;
  const s = fl.trim();
  const canon: [string, string][] = [
    ['Inclusive', 'Inclusive and Thriving Economy'],
    ['Envi', 'Envi, Infra and Housing'],
    ['Transparent', 'Transparent, Digital, and Accountable Governance'],
    ['Safe, Secure', 'Safe, Secure, and Humane Communities'],
    ['Culture', 'Culture, Arts, and Heritage'],
    ['Educated', 'Empowered and Educated Citizens'],
    ['Empowered', 'Empowered and Educated Citizens'],
    ['Social Protection', 'Social Protection and Inclusion'],
    ['Healthy', 'Healthy Nagueños'],
  ];
  const m = canon.find(([pat]) => s.toLowerCase().includes(pat.toLowerCase()));
  return m ? m[1] : s;
}

export const FUNDING_COLORS: Record<string, string> = {
  'GF': 'var(--f-gf)',
  'SEF': 'var(--f-sef)',
  'LDF': 'var(--f-ldf)',
  'LDRRMF': 'var(--f-ldrrmf)',
  'SPA': 'var(--f-spa)',
  'PPP': 'var(--f-ppp)',
  'NGA': 'var(--f-nga)',
  'Donations/Grants': 'var(--f-donations)',
  'GAD': 'var(--f-gad)',
  'PhilHealth Trust': 'var(--f-other)',
  'Unspecified': 'var(--f-unspec)',
};

export const FINISH_LINE_COLORS: Record<string, string> = {
  'Inclusive and Thriving Economy': '#c47a2a',
  'Envi, Infra and Housing': '#2f827a',
  'Transparent, Digital, and Accountable Governance': '#2f3e7a',
  'Safe, Secure, and Humane Communities': '#a23b3b',
  'Culture, Arts, and Heritage': '#b0568a',
  'Empowered and Educated Citizens': '#6b5a9a',
  'Social Protection and Inclusion': '#7a6f3b',
  'Healthy Nagueños': '#3d6b3b',
  'Unclassified': '#bfb6a4',
};

export function shortFL(fl: string | null | undefined): string {
  if (!fl) return '—';
  const map: Record<string, string> = {
    'Inclusive and Thriving Economy': 'Economy',
    'Envi, Infra and Housing': 'Environment',
    'Transparent, Digital, and Accountable Governance': 'Governance',
    'Safe, Secure, and Humane Communities': 'Safety',
    'Culture, Arts, and Heritage': 'Culture',
    'Empowered and Educated Citizens': 'Education',
    'Social Protection and Inclusion': 'Social',
    'Healthy Nagueños': 'Health',
  };
  return map[fl] || fl;
}

export function shortSector(s: string | null | undefined): string {
  if (!s) return '';
  if (s === 'Environment/Infrastructure/Housing') return 'Environment';
  if (s === 'General Public Services') return 'Public Services';
  return s;
}

export interface Amounts {
  ps: number | null;
  mooe: number | null;
  co: number | null;
  total: number | null;
  cc_adapt: number | null;
  cc_mitig: number | null;
}

export interface RawItem {
  aip_code: string;
  description: string;
  office: string;
  funding_source: string;
  amounts: Amounts;
  finish_line: string;
  code_mainstreaming: string;
  start_date: string;
  end_date: string;
  data_quality_flag: string;
}

export interface Item extends RawItem {
  sector: string;
  unit: string;
  subcategory: string;
  program: string;
  funding_norm: string;
  finish_line_norm: string | null;
}

export interface Rollup {
  ps: number;
  mooe: number;
  co: number;
  total: number;
  cc_adapt: number;
  cc_mitig: number;
  pap_count: number;
}

export interface AIPData {
  sectors: {
    name: string;
    units: {
      name: string;
      subcategories: {
        name: string;
        programs: {
          name: string;
          items: RawItem[];
        }[];
      }[];
    }[];
  }[];
  rollup: Rollup;
  rollup_clean_excluding_outliers: Rollup;
  data_quality: {
    rows_total: number;
    rows_clean: number;
    unit_check_outliers: number;
    missing_funding_source: number;
  };
}

export function flattenData(json: AIPData): Item[] {
  const items: Item[] = [];
  for (const sector of json.sectors) {
    for (const unit of sector.units) {
      for (const sub of unit.subcategories) {
        for (const prog of sub.programs) {
          for (const item of prog.items) {
            items.push({
              ...item,
              sector: sector.name,
              unit: unit.name,
              subcategory: sub.name || 'Unspecified',
              program: prog.name,
              funding_norm: normalizeFunding(item.funding_source),
              finish_line_norm: normalizeFinishLine(item.finish_line),
            });
          }
        }
      }
    }
  }
  return items;
}

export function rollup(items: Item[]): Rollup {
  const r: Rollup = { ps: 0, mooe: 0, co: 0, total: 0, cc_adapt: 0, cc_mitig: 0, pap_count: items.length };
  for (const it of items) {
    r.ps += it.amounts.ps || 0;
    r.mooe += it.amounts.mooe || 0;
    r.co += it.amounts.co || 0;
    r.total += it.amounts.total || 0;
    r.cc_adapt += it.amounts.cc_adapt || 0;
    r.cc_mitig += it.amounts.cc_mitig || 0;
  }
  return r;
}

export function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const k = keyFn(it);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(it);
  }
  return m;
}

export function isOutlier(it: Item): boolean {
  return (it.data_quality_flag || '').startsWith('unit_check');
}
