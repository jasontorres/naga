import { Factory } from "fishery";
import type { Unit, Sector, Rollup } from "../../types/internal.js";
import type {
  Cluster,
  Agency,
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { agencyToUnitFactory } from "./agencyToUnit.js";
import { sumRollups } from "../../util/calc.js";

type ClusterToSectorTransientParams = {
  agencies: Agency[];
  programs: ProgramExternal[];
  amounts: Amount[];
} & Cluster;

type ClusterToSectorParams = {
  id: number;
  name: string;
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

  const units: Unit[] = [];
  for (const agency of agencies) {
    const unit = agencyToUnitFactory
      .params({ name: agency.name })
      .transient({ ...agency, programs, amounts })
      .build();
    units.push(unit);
  }

  const unitRollups = units.map((unit) => unit.rollup);
  const sectorRollups = sumRollups(unitRollups);

  return {
    id: params.id,
    name: params.name,
    units,
    rollup: sectorRollups,
  };
});
