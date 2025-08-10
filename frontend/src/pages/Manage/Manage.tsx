import { useNavigate, useOutletContext } from "react-router";
import { useState } from "react";
import type { Product } from "../../types/types";
import CreateProduct from "../../components/CreateProductButton/CreateProductButton";
import styles from "./Manage.module.css";
import { toast } from "react-toastify";

export default function Manage() {
  const { products, pages, currentPage, fetchProducts } = useOutletContext<{
    products: Product[];
    pages: number;
    currentPage: number;
    fetchProducts: () => Promise<void>;
  }>();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleDelete(product: Product) {
    const handler = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/products/${product.id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete product, please try again later");
        }

        await fetchProducts();
        toast.success("Product deleted successfully!");
      } catch {
        toast.error("Failed to delete product, please try again later");
      } finally {
        setLoading(false);
      }
    };

    void handler();
  }

  return (
    <main className={styles.main}>
      <CreateProduct />
      <div className={styles.productsContainer}>
        {products.length !== 0 ? (
          products.map((product) => {
            return (
              <div key={product.id} className={styles.product}>
                <div className={styles.text}>
                  <div className={styles.titleContainer}>
                    <p>
                      <b>Title:</b> {product.title}
                    </p>
                    <p className={styles.category}>{product.category}</p>
                  </div>
                  <div className={styles.descriptionContainer}>
                    <p>
                      <b>Description:</b> {product.description}
                    </p>
                  </div>
                  <div className={styles.priceContainer}>
                    <p>
                      <b>Price:</b> {product.price}
                    </p>
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <img src={product.imgUrl} alt={`${product.title} image`} />
                </div>
                <div className={styles.manageButtons}>
                  <button
                    onClick={() => {
                      void navigate(`/manage/update/${product.id}`, { viewTransition: true });
                    }}
                    type="button"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      handleDelete(product);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ fontSize: "1.5rem" }}>No products yet!</p>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={currentPage <= 1 ? styles.disabled : ""}
          disabled={currentPage <= 1}
          onClick={() => {
            void navigate(`?page=${currentPage - 1}`, { viewTransition: true });
          }}
        >
          Back
        </button>
        {Array.from({ length: pages }, (_val, i) => i + 1).map((pageNumber) => {
          return (
            <button
              type="button"
              onClick={() => {
                void navigate(`?page=${pageNumber}`, { viewTransition: true });
              }}
              key={pageNumber}
              className={currentPage === pageNumber ? styles.active : ""}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          type="button"
          className={currentPage >= pages ? styles.disabled : ""}
          disabled={currentPage >= pages}
          onClick={() => {
            void navigate(`?page=${currentPage + 1}`, { viewTransition: true });
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
}
