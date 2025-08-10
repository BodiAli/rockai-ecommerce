import { Link } from "react-router";
import styles from "./CreateProductButton.module.css";

export default function CreateProduct() {
  return (
    <Link className={styles.createProduct} to="create">
      Create Product
    </Link>
  );
}
