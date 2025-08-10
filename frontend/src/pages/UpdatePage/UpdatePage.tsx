import { useNavigate, useOutletContext, useParams } from "react-router";
import { useEffect, useState, type ActionDispatch, type FormEvent } from "react";
import type { ACTION_TYPE, Product } from "../../types/types";
import styles from "./UpdatePage.module.css";
import { toast } from "react-toastify";

export default function UpdatePage() {
  const { dispatch } = useOutletContext<{
    dispatch: ActionDispatch<[action: ACTION_TYPE]>;
  }>();

  const [errorsArr, setErrorsArr] = useState<[] | { msg: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const form: HTMLFormElement = e.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const handler = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/products/${params.id}`, {
          method: "PUT",
          body: formData,
        });

        if (!res.ok) {
          if (res.status === 400) {
            const { errors } = (await res.json()) as { errors: { msg: string }[] };
            setErrorsArr(errors);
            return;
          }
          throw new Error("Failed to update product, please try again later.");
        }

        const { msg, updatedProduct } = (await res.json()) as { msg: string; updatedProduct: Product };

        dispatch({ type: "update-product", payload: updatedProduct });
        toast.success(msg);
        void navigate(`/manage?page=1`, { viewTransition: true });
      } catch {
        toast.error("Failed to update product, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    void handler();
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/products/${params.id}`);

        if (!res.ok) {
          if (res.status === 404) {
            const { error } = (await res.json()) as { error: string };

            toast.error(error);

            void navigate("/manage", { viewTransition: true });
            return;
          }

          throw new Error("Failed to fetch product, please try again later.");
        }

        const { product } = (await res.json()) as { product: Product };

        setProduct(product);
      } catch {
        toast.error("Failed to fetch product, please try again later.");
        void navigate("/manage", { viewTransition: true, replace: true });
      }
    }

    void fetchProduct();
  }, [navigate, params.id]);

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.updateForm}>
        <ul className={`${styles.errors} ${errorsArr.length !== 0 ? styles.visible : ""}`}>
          {errorsArr.map((error) => {
            return <li key={error.msg}>{error.msg}</li>;
          })}
        </ul>
        <label>
          Title
          <input type="text" name="title" maxLength={255} defaultValue={product?.title} />
        </label>
        <label>
          Description
          <input type="text" name="description" defaultValue={product?.description} />
        </label>
        <label>
          Category
          <input type="text" name="category" maxLength={100} defaultValue={product?.category} />
        </label>
        <label>
          Price
          <input type="number" name="price" step=".01" defaultValue={product?.price} />
        </label>
        <label>
          Product Image (Max size: 3MB)
          <input type="file" name="productImage" />
        </label>

        <button disabled={loading} type="submit">
          Update Product
        </button>
      </form>
    </main>
  );
}
