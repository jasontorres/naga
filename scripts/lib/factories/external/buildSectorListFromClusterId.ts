import type {
  Agency,
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { clusterToSectorFactory } from "./clusterToSector.js";
import { rollupFactory } from "../internal/rollup.js";
import type { Rollup } from "../../types/internal.js";
import { EMPTY_ROLLUP } from "../../temp-data/index.js";

export const buildSectorListFromClusterIds = async (
  clusterName: string,
  clusterIds: number[],
  agencies: Agency[],
  programs: ProgramExternal[],
  amounts: Amount[],
) => {
  const sectors = [];

  for (const clusterId of clusterIds) {
    const clusterAgencies: Agency[] = agencies.filter(
      (agency) => agency.cluster_id === clusterId.toString(),
    );
    const clusterAgenciesIds = clusterAgencies.map(({ id }) => id);
    const clusterPrograms: ProgramExternal[] = programs.filter((program) =>
      clusterAgenciesIds.includes(program.agency_id),
    );
    const clusterProgramsIds = clusterPrograms.map(({ id }) => id);
    const clusterAmounts: Amount[] = amounts.filter((amount) =>
      clusterProgramsIds.includes(amount.program_id),
    );

    // TODO: implement sector rollup
    const emptyRollup: Rollup = rollupFactory.params(EMPTY_ROLLUP).build();

    const sector = await clusterToSectorFactory
      .params({
        id: clusterId,
        name: clusterName,
        rollup: emptyRollup,
      })
      .transient({
        agencies: clusterAgencies,
        programs: clusterPrograms,
        amounts: clusterAmounts,
      })
      .build();

    sectors.push(sector);
  }

  return sectors;
};
