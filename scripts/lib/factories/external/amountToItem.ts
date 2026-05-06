import { Factory } from "fishery";
import { Item } from "../../types/internal.js";

type AmountToItemParams = {
  ps: number;
  mooe: number;
  co: number;
};

export const amountToItemFactory = Factory.define<
  Item,
  {},
  Item,
  AmountToItemParams
>(({ params }) => {
  return {
    name: "Amount",
    amount: {
      ps: params.ps,
      mooe: params.mooe,
      co: params.co,
    },
  };
});
