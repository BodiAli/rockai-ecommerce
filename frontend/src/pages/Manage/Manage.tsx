import { useNavigate, useOutletContext } from "react-router";
import type { ActionDispatch } from "react";
import type { ACTION_TYPE, Product } from "../../types/types";
import CreateProduct from "../../components/CreateProductButton/CreateProductButton";
import styles from "./Manage.module.css";

export default function Manage() {
  const { products, pages, dispatch, currentPage } = useOutletContext<{
    products: Product[];
    pages: number;
    dispatch: ActionDispatch<[action: ACTION_TYPE]>;
    currentPage: number;
  }>();

  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <CreateProduct />
      <div className={styles.productsContainer}>
        {products.map((value) => {
          return (
            <div key={value.id} className={styles.product}>
              <div className={styles.text}>
                <div className={styles.titleContainer}>
                  <p>
                    <b>Title:</b> {value.title}
                  </p>
                  <p className={styles.category}>{value.category}</p>
                </div>
                <div className={styles.descriptionContainer}>
                  <p>
                    <b>Description:</b> {value.description}
                  </p>
                </div>
                <div className={styles.priceContainer}>
                  <p>
                    <b>Price:</b> {value.price}
                  </p>
                </div>
              </div>
              <div className={styles.imageContainer}>
                <img src={value.imgUrl} alt={`${value.title} image`} />
              </div>
              <div className={styles.manageButtons}>
                <button type="button">Update</button>
                <button type="button">Delete</button>
              </div>
            </div>
          );
        })}
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
