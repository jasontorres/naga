import { Factory } from "fishery";
import { rollupFactory } from "../index.js";
import type { Unit, Sector, Rollup } from "../../types/internal.js";
import type {
  Cluster,
  Agency,
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { agencyToUnitFactory } from "./agencyToUnit.js";
import { EMPTY_ROLLUP } from "../../temp-data/index.js";

type ClusterToSectorTransientParams = {
  agencies: Agency[];
  programs: ProgramExternal[];
  amounts: Amount[];
} & Cluster;

type ClusterToSectorParams = {
  id: number;
  name: string;
  rollup: Rollup;
};

export const clusterToSectorFactory = Factory.define<
  Sector,
  ClusterToSectorTransientParams,
  Sector,
  ClusterToSectorParams
>(({ params, transientParams }) => {
  const agencies = transientParams.agencies ?? [];
  const programs = transientParams.programs;
  const amounts = transientParams.amounts;
  // NOTE: hard-code these for now, this should be provided by the database
  const unitRollup: Rollup = rollupFactory.params(EMPTY_ROLLUP).build();

  const units: Unit[] = [];
  for (const agency of agencies) {
    const unit = agencyToUnitFactory
      .params({ name: agency.name, rollup: unitRollup })
      .transient({ ...agency, programs, amounts })
      .build();
    units.push(unit);
  }

  return {
    id: params.id,
    name: params.name,
    units,
    rollup: params.rollup,
  };
});
