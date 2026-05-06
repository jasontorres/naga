import dotenv from "dotenv";
dotenv.config();

import {
  Agency,
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";

export const getAllowedFieldsForDomain = (table: string) => {
  switch (table) {
    case "clusters":
      return [
        "id",
        "description",
        "name",
        "offices",
        "paps_count",
        "subtitle",
        "theme",
        "title",
        "total",
        "year",
      ];
    case "agencies":
      return [
        "id",
        "abbreviation",
        "cluster_id",
        "description",
        "title",
        "year",
      ];
    case "programs":
      return [
        "id",
        "agency_id",
        "aip_reference_code",
        "description",
        "implementation_start",
        "implementation_end",
        "name",
      ];
    case "amounts":
      return ["id", "amount", "category", "program_id"];
    default:
      return [];
  }
};

export const fetchAllDataFor = async (
  domain: "clusters" | "agencies" | "programs" | "amounts",
) => {
  const host = process.env.API_HOST;
  const fields = getAllowedFieldsForDomain(domain);
  return fetch(`${host}/api/data/all/${domain}?fields=${fields.join(",")}`)
    .then((data) => data.json())
    .then(({ result }) => result)
    .catch((e) => {
      console.log(`Error while fetching ${domain}: ${e}`);

      return [];
    });
};

export const externalPromises: [
  Promise<Agency[]>,
  Promise<ProgramExternal[]>,
  Promise<Amount[]>,
] = [
  fetchAllDataFor("agencies"),
  fetchAllDataFor("programs"),
  fetchAllDataFor("amounts"),
];
