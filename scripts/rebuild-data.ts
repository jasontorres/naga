import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { Factory } from "fishery";
import type {
  Item,
  Program,
  Subcategory,
  Unit,
  PageData,
  Sector,
} from "./types/internal.js";
import type {
  Cluster,
  Agency,
  Program as ProgramExternal,
  Amount,
} from "./types/external.js";
import { getAllowedFieldsForDomain } from "./util/index.js";

type AmountToItemParams = {
  ps: number;
  mooe: number;
  co: number;
};

const amountToItemFactory = Factory.define<Item, {}, Item, AmountToItemParams>(
  ({ sequence, params }) => {
    return {
      name: "Amount",
      amount: {
        ps: params.ps,
        mooe: params.mooe,
        co: params.co,
      },
    };
  },
);

type ProgramExternalToProgramTransientParams = {
  amounts: Amount[];
} & ProgramExternal;

type ProgramExternalToProgramParams = {
  name: string;
};

const programFactory = Factory.define<
  Program,
  ProgramExternalToProgramTransientParams,
  Program,
  ProgramExternalToProgramParams
>(({ sequence, params, transientParams }) => {
  const amounts = transientParams.amounts || [];

  let ps = 0.0;
  let mooe = 0.0;
  let co = 0.0;

  // NOTE: There are three categories per amounts
  for (const amount of amounts) {
    const category = amount.category;
    switch (category) {
      case "Personal Services (PS) (9)":
        ps = amount.amount;
        break;
      case "Capital Outlay (CO) (11)":
        co = amount.amount;
        break;
      case "Maintenance and Other Operating Expenses (MOOE) (10)":
        mooe = amount.amount;
        break;
      default:
        break;
    }
  }

  // NOTE: There is only one item per program and it contains all allocations, personal services, maintenance, capital outlay, etc.
  return {
    name: params.name,
    items: [amountToItemFactory.params({ ps, co, mooe }).build()],
  };
});

type SubcategoryTransientParams = {
  amounts: Amount[];
  programs: ProgramExternal[];
};

type SubcategoryParams = {};

const subcategoryFactory = Factory.define<
  Subcategory,
  SubcategoryTransientParams,
  Subcategory,
  SubcategoryParams
>(({ sequence, params, transientParams }) => {
  const fake: Amount = transientParams!.amounts![1];
  const amounts: Amount[] = [fake];
  const externalPrograms = transientParams.programs || [];

  const programs: Program[] = [];
  for (const externalProgram of externalPrograms) {
    const program = programFactory
      .transient({ ...externalProgram, amounts })
      .params({ name: externalProgram.name })
      .build();
    programs.push(program);
  }

  return {
    id: sequence,
    name: "Subcategory",
    programs,
  };
});

type AgencyToUnitTransientParams = {
  programs: ProgramExternal[];
  amounts: Amount[];
} & Agency;

type AgencyToUnitParams = {
  id: number;
  name: string;
};

const agencyToUnitFactory = Factory.define<
  Unit,
  AgencyToUnitTransientParams,
  Unit,
  AgencyToUnitParams
>(({ sequence, transientParams, params }) => {
  const programs = transientParams.programs || [];
  const amounts = transientParams.amounts;

  const subcategories = [
    subcategoryFactory.transient({ programs, amounts }).build(),
  ];

  return {
    id: params.id,
    name: params.name,
    subcategories,
  };
});

type ClusterToSectorTransientParams = {
  agencies: Agency[];
  programs: ProgramExternal[];
  amounts: Amount[];
} & Cluster;

type ClusterToSectorParams = {
  id: number;
  name: string;
};

const clusterToSectorFactory = Factory.define<
  Sector,
  ClusterToSectorTransientParams,
  Sector,
  ClusterToSectorParams
>(({ sequence, params, transientParams }) => {
  const agencies = transientParams.agencies ?? [];
  const programs = transientParams.programs;
  const amounts = transientParams.amounts;

  const units: Unit[] = [];
  for (const agency of agencies) {
    const unit = agencyToUnitFactory
      .params({ name: agency.name, id: agency.id })
      .transient({ ...agency, programs, amounts })
      .build();
    units.push(unit);
  }

  return {
    id: sequence,
    name: params.name,
    units,
  };
});

const pageDataFactory = Factory.define<PageData, {}, PageData, PageData>(
  ({ params }) => ({
    sectors: params.sectors,
  }),
);

const fetchAllDataFor = async (
  domain: "clusters" | "agencies" | "programs" | "amounts",
) => {
  const host = process.env.API_HOST;
  const fields = getAllowedFieldsForDomain(domain);
  return fetch(`${host}/api/data/all/${domain}?fields=${fields.join(",")}`)
    .then((data) => data.json())
    .then(({ result }) => result)
    .catch((e) => {
      console.log(`Error while fetching clusters: ${e}`);

      return [];
    });
};

const main = async () => {
  // NOTE: fetch all data then filter by cluster, no need to fetch inside factories
  const [clusters, agencies, programs, amounts] = await Promise.all([
    fetchAllDataFor("clusters") as Promise<Cluster[]>,
    fetchAllDataFor("agencies") as Promise<Agency[]>,
    fetchAllDataFor("programs") as Promise<ProgramExternal[]>,
    fetchAllDataFor("amounts") as Promise<Amount[]>,
  ]);

  const sectors = [];
  for (const cluster of clusters) {
    const clusterAgencies: Agency[] = agencies.filter(
      (agency) => agency.cluster_id === cluster.id,
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
        id: cluster.id,
        name: cluster.name,
      })
      .transient({
        agencies: clusterAgencies,
        programs: clusterPrograms,
        amounts: clusterAmounts,
      })
      .build();
    sectors.push(sector);
  }

  const data = pageDataFactory.params({ sectors }).build();

  const fileName = "aip2026-new.json";
  const savePath = path.join("public", "data", fileName);

  fs.writeFileSync(savePath, JSON.stringify(data));
};

main();
