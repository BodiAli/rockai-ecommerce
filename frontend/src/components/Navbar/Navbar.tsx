import { NavLink } from "react-router";
import homeIcon from "../../assets/images/home-icon.svg";
import cartIcon from "../../assets/images/cart-icon.svg";
import manageIcon from "../../assets/images/manage-icon.svg";

export default function NavBar() {
  return (
    <ul>
      <li>
        <NavLink to="/" viewTransition>
          <img src={homeIcon} alt="Home page" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/cart" viewTransition>
          <img src={cartIcon} alt="Cart page" />
          Cart
        </NavLink>
      </li>
      <li>
        <NavLink to="/manage" viewTransition>
          <img src={manageIcon} alt="Manage products page" />
          Manage
        </NavLink>
      </li>
    </ul>
  );
}
