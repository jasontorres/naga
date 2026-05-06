// NOTE: These types are "internal" to this app

export type Item = {
  amount: {
    ps: number;
    mooe: number;
    co: number;
  };
};
export type Program = {
  name: string;
  items: Item[];
};

export type Subcategory = {
  name: string;
  programs: Program[];
};

export type Unit = {
  name: string;
  subcategories: Subcategory[];
};

export type Sector = {
  name?: string;
  units: Unit[];
};

export type PageData = {
  metadata: Metadata;
  rollup: Rollup;
  rollup_clean_excluding_outliers: Rollup;
  data_quality: DataQuality;
  sectors: Sector[];
};

export type Rollup = {
  ps: number;
  mooe: number;
  co: number;
  total: number;
  cc_adapt: number;
  cc_mitig: number;
  pap_count: number;
};

export type DataQuality = {
  rows_total: number;
  rows_clean: number;
  unit_check_outliers: number;
  missing_funding_source: number;
  non_canonical_funding_source: number;
};

export type Metadata = {
  title: string;
  version: string;
  source_workbook: string;
  currency_unit: string;
  fiscal_year: number;
  generated_by: string;
  schema_version: string;
  hierarchy: string[];
};
