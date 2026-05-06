import { Factory } from "fishery";
import type { Program } from "../../types/internal.js";
import type {
  Program as ProgramExternal,
  Amount,
} from "../../types/external.js";
import { amountToItemFactory } from "./amountToItem.js";

type ProgramExternalToProgramTransientParams = {
  amounts: Amount[];
} & ProgramExternal;

type ProgramExternalToProgramParams = {
  name: string;
};

export const programFactory = Factory.define<
  Program,
  ProgramExternalToProgramTransientParams,
  Program,
  ProgramExternalToProgramParams
>(({ params, transientParams }) => {
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
