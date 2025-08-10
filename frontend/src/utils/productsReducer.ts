import type { Product, ACTION_TYPE } from "../types/types";

export default function productsReducer(state: Product[], action: ACTION_TYPE) {
  switch (action.type) {
    case "fetch-products":
      return action.payload;
    case "add-product":
      return [action.payload, ...state];
    case "delete-product":
      return state.filter((product) => {
        return product.id !== action.payload.id;
      });
    case "update-product":
      return state.map((product) => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
  }
}
