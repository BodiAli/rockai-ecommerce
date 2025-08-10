import { useState, type ActionDispatch, type FormEvent } from "react";
import styles from "./CreatePage.module.css";
import { toast } from "react-toastify";
import type { ACTION_TYPE, Product } from "../../types/types";
import { useNavigate, useOutletContext } from "react-router";

export default function CreatePage() {
  const { dispatch } = useOutletContext<{
    dispatch: ActionDispatch<[action: ACTION_TYPE]>;
  }>();
  const [errorsArr, setErrorsArr] = useState<[] | { msg: string }[]>([]);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const form: HTMLFormElement = e.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const handler = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/products`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          if (res.status === 400) {
            const { errors } = (await res.json()) as { errors: { msg: string }[] };
            setErrorsArr(errors);
            return;
          }
          throw new Error("Failed to create product, please try again later.");
        }

        const { msg, createdProduct } = (await res.json()) as { msg: string; createdProduct: Product };

        dispatch({ type: "add-product", payload: createdProduct });
        toast.success(msg);
        void navigate("/manage", { viewTransition: true });
      } catch {
        toast.error("Failed to create product, please try again later.");
      }
    };

    void handler();
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <ul className={`${styles.errors} ${errorsArr.length !== 0 ? styles.visible : ""}`}>
          {errorsArr.map((error) => {
            return <li key={error.msg}>{error.msg}</li>;
          })}
        </ul>
        <label>
          Title
          <input type="text" name="title" maxLength={255} />
        </label>
        <label>
          Description
          <input type="text" name="description" />
        </label>
        <label>
          Category
          <input type="text" name="category" maxLength={100} />
        </label>
        <label>
          Price
          <input type="number" name="price" step=".01" />
        </label>
        <label>
          Product Image (Max size: 3MB)
          <input type="file" name="productImage" />
        </label>

        <button type="submit">Create Product</button>
      </form>
    </main>
  );
}
