/**
 * NOTE: These types are "external" to this app
 *
 * Cluster - overall goal & theme of the annual investment program
 * Agency - agency which implements programs
 * Program - Program, Activity, Projects (PAPs)
 * Amount - amount invested into a PAP
 *
 */

export type Cluster = {
  id: number;
  name: string;
  year: number;
};

export type Agency = {
  id: string;
  name: string;
  year: number;
  cluster_id: string;
  abbreviation: string;
};

export type Program = {
  id: string;
  name: string;
  implementation_start: string;
  implementation_end: string;
  aip_reference_code: string;
  agency_id: string;
};

export type Amount = {
  id: string;
  category: string;
  amount: number;
  program_id: string;
};
