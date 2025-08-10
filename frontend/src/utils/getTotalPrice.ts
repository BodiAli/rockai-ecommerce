import type { Product } from "../types/types";

export default function getTotalPrice(cart: Product[]) {
  return cart.reduce((initialValue, currentValue) => {
    const currentValuePrice = Number.parseFloat(currentValue.price);

    return currentValuePrice + initialValue;
  }, 0);
}
