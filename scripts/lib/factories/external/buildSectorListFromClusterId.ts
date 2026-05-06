import type {
  Agency,
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { clusterToSectorFactory } from "./clusterToSector.js";

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
      (agency) => agency.cluster_id === clusterId,
    );
    const clusterAgenciesIds = clusterAgencies.map(({ id }) => id);
    const clusterPrograms: ProgramExternal[] = programs.filter((program) =>
      clusterAgenciesIds.includes(program.agency_id),
    );
    const clusterProgramsIds = clusterPrograms.map(({ id }) => id);
    const clusterAmounts: Amount[] = amounts.filter((amount) =>
      clusterProgramsIds.includes(amount.program_id),
    );

    const sector = await clusterToSectorFactory
      .params({
        id: clusterId,
        name: clusterName,
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
