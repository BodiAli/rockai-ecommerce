import { useNavigate, useOutletContext } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import type { Product } from "../../types/types";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Cart.module.css";
import getTotalPrice from "../../utils/getTotalPrice";

export default function Cart() {
  const { cart, setCart } = useOutletContext<{
    cart: Product[];
    setCart: Dispatch<SetStateAction<Product[]>>;
  }>();

  const navigate = useNavigate();

  function handleCheckout() {
    setCart(() => {
      const newCart: Product[] = [];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    toast.success("Checked out successfully!");
    void navigate("/", { viewTransition: true });
  }

  return (
    <main className={styles.main}>
      {cart.length !== 0 ? (
        cart.map((product) => {
          return <ProductCard key={product.id} {...product} />;
        })
      ) : (
        <p>Cart is empty!</p>
      )}

      {cart.length !== 0 ? (
        <div className={styles.buttonContainer}>
          <button type="button" onClick={handleCheckout}>
            Checkout <br /> <b>Total: </b>
            {`${getTotalPrice(cart)}$`}
          </button>
        </div>
      ) : null}
    </main>
  );
}
