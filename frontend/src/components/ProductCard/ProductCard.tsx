import { useNavigate, useOutletContext } from "react-router";
import type { Product } from "../../types/types";
import styles from "./ProductCard.module.css";
import type { Dispatch, JSX, MouseEvent, SetStateAction } from "react";

export default function ProductCard(product: Product) {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext<{
    cart: Product[];
    setCart: Dispatch<SetStateAction<Product[]>>;
  }>();

  function handleAddToCart(e: MouseEvent, product: Product) {
    e.stopPropagation();
    setCart((prevCart) => {
      const newCart = [product, ...prevCart];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  }

  function handleRemoveFromCart(e: MouseEvent, product: Product) {
    e.stopPropagation();
    setCart((prevCart) => {
      const newCart = prevCart.filter((value) => {
        return value.id !== product.id;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  }
  let cartButtonJSX: JSX.Element;

  if (
    cart.some((value) => {
      return value.id === product.id;
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
    <div
      onClick={() => {
        void navigate(`/product/${product.id}`, { viewTransition: true });
      }}
      key={product.id}
      className={styles.product}
    >
      <div className={styles.text}>
        <div className={styles.titleContainer}>
          <p>
            <b>Title:</b> {product.title}
          </p>
          <p className={styles.category}>{product.category}</p>
        </div>
        <div className={styles.priceContainer}>
          <p>
            <b>Price:</b> {product.price}
          </p>
          {cartButtonJSX}
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={product.imgUrl} alt={`${product.title} image`} />
      </div>
    </div>
  );
}
