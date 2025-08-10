export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  imgUrl: string;
  cloudId: string;
}

export type ACTION_TYPE =
  | {
      type: "fetch-products";
      payload: Product[];
    }
  | {
      type: "add-product";
      payload: Product;
    }
  | {
      type: "delete-product";
      payload: Product;
    };
