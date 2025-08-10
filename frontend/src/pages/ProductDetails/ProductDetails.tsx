import { useOutletContext, useParams } from "react-router";
import { type Dispatch, type JSX, type MouseEvent, type SetStateAction } from "react";
import type { Product } from "../../types/types";
import { useGetProduct } from "../../utils/customHooks";
import styles from "./ProductDetails.module.css";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { cart, setCart } = useOutletContext<{
    cart: Product[];
    setCart: Dispatch<SetStateAction<Product[]>>;
  }>();

  const params = useParams<{ id: string }>();
  const product = useGetProduct("/", params.id);

  function handleAddToCart(e: MouseEvent, product: Product | null) {
    e.stopPropagation();
    if (!product) {
      return;
    }
    setCart((prevCart) => {
      const newCart = [product, ...prevCart];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    toast.success(`${product.title} is added to cart`);
  }

  function handleRemoveFromCart(e: MouseEvent, product: Product | null) {
    e.stopPropagation();
    if (!product) {
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.filter((value) => {
        return value.id !== product.id;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    toast.success(`${product.title} is removed from cart`);
  }

  let cartButtonJSX: JSX.Element;

  if (
    cart.some((value) => {
      return value.id === product?.id;
    })
  ) {
    cartButtonJSX = (
      <button
        onClick={(e) => {
          handleRemoveFromCart(e, product);
        }}
        type="button"
      >
        Remove from cart
      </button>
    );
  } else {
    cartButtonJSX = (
      <button
        onClick={(e) => {
          handleAddToCart(e, product);
        }}
        type="button"
      >
        Add to cart
      </button>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.productContainer}>
        <div className={styles.textContainer}>
          <div className={styles.titleContainer}>
            <p>
              <b>{product?.title}</b>
            </p>
            <p className={styles.category}>{product?.category}</p>
          </div>
          <div className={styles.priceContainer}>
            <p>
              <b>Price:</b> {`${product?.price}$`}
            </p>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img src={product?.imgUrl} alt={`${product?.title} image`} />
        </div>
        <div className={styles.descriptionContainer}>
          <p>{product?.description}</p>
        </div>
        <div className={styles.addToCartContainer}>{cartButtonJSX}</div>
      </div>
    </main>
  );
}
