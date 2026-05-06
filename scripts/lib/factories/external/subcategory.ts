import { Factory } from "fishery";
import type { Subcategory, Program } from "../../types/internal.js";
import type {
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { programFactory } from "./program.js";

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

  // NOTE: Hard-coding Subcategory
  return {
    name: "Subcategory",
    programs,
  };
});
