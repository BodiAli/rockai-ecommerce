import { useNavigate, useOutletContext } from "react-router";
import type { Product } from "../../types/types";
import styles from "./Home.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function Home() {
  const { products, pages, currentPage } = useOutletContext<{
    products: Product[];
    pages: number;
    currentPage: number;
  }>();

  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <div className={styles.productsContainer}>
        {products.length !== 0 ? (
          products.map((product) => {
            return <ProductCard key={product.id} {...product} />;
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
