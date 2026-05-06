import type { Rollup, DataQuality, Metadata } from "./internal.js";
import type {
  Cluster,
  Agency,
  Program as ProgramExternal,
  Amount,
} from "./external.js";

export type LegacyItemTransientFields = Partial<
  Record<
    | "aip_code"
    | "description"
    | "office"
    | "funding_source"
    | "start_date"
    | "end_date"
    | "finish_line"
    | "output_indicators"
    | "outcome_indicators"
    | "code_mainstreaming"
    | "code_climate"
    | "data_quality_flag"
    | "amounts",
    unknown
  >
>;

export type MigrationTransient = {
  metadata?: Metadata;
  rollup?: Rollup;
  rollupCleanExcludingOutliers?: Rollup;
  dataQuality?: DataQuality;
};

export type ProgramExternalToProgramTransientParams = {
  amounts: Amount[];
  rollup?: Rollup;
  item?: LegacyItemTransientFields;
} & ProgramExternal;

export type SubcategoryTransientParams = {
  amounts: Amount[];
  programs: ProgramExternal[];
  rollup?: Rollup;
  itemByProgramId?: Record<number, LegacyItemTransientFields>;
  programRollupByProgramId?: Record<number, Rollup>;
};

export type AgencyToUnitTransientParams = {
  programs: ProgramExternal[];
  amounts: Amount[];
  rollup?: Rollup;
  subcategoryRollup?: Rollup;
  itemByProgramId?: Record<number, LegacyItemTransientFields>;
  programRollupByProgramId?: Record<number, Rollup>;
} & Agency;
