import type { Product, ACTION_TYPE } from "../types/types";

export default function productsReducer(state: Product[], action: ACTION_TYPE) {
  switch (action.type) {
    case "fetch-products":
      return action.payload;
    case "add-product":
      return [action.payload, ...state];

    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
