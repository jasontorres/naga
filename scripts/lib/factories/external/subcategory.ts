import { Factory } from "fishery";
import type { Subcategory, Program } from "../../types/internal.js";
import type {
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { programFactory } from "./program.js";
import { sumRollups } from "../../util/calc.js";

type SubcategoryTransientParams = {
  amounts: Amount[];
  programs: ProgramExternal[];
};

type SubcategoryParams = {};

export const subcategoryFactory = Factory.define<
  Subcategory,
  SubcategoryTransientParams,
  Subcategory,
  SubcategoryParams
>(({ transientParams }) => {
  const amounts: Amount[] = transientParams.amounts
    ? transientParams.amounts
    : [];
  const externalPrograms = transientParams.programs || [];

  const programs: Program[] = [];
  for (const externalProgram of externalPrograms) {
    const program = programFactory
      .transient({ ...externalProgram, amounts })
      .params({ name: externalProgram.name })
      .build();
    programs.push(program);
  }

  const programRollups = programs.map((program) => program.rollup);
  const subcategoryRollups = sumRollups(programRollups);

  // NOTE: Hard-coding Operations; but aip2026.json has "Operations", "General Administration Support", "Support to Operations", etc.
  return {
    name: "Operations",
    programs,
    rollup: subcategoryRollups,
  };
});
