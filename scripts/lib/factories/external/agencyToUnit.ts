import { Factory } from "fishery";
import type { Unit, Rollup } from "../../types/internal.js";
import type {
  Agency,
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { subcategoryFactory } from "./subcategory.js";
import { sumRollups } from "../../util/calc.js";

type AgencyToUnitTransientParams = {
  programs: ProgramExternal[];
  amounts: Amount[];
} & Agency;

type AgencyToUnitParams = {
  name: string;
};

export const agencyToUnitFactory = Factory.define<
  Unit,
  AgencyToUnitTransientParams,
  Unit,
  AgencyToUnitParams
>(({ transientParams, params }) => {
  const programs = transientParams.programs || [];
  const amounts = transientParams.amounts;

  const subcategories = [
    subcategoryFactory.transient({ programs, amounts }).build(),
  ];

  const subcategoryRollups = subcategories.map(
    (subcategory) => subcategory.rollup,
  );
  const unitRollups = sumRollups(subcategoryRollups);

  return {
    name: params.name,
    rollup: unitRollups,
    subcategories,
  };
});
