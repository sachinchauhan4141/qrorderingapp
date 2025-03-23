import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoHome, IoCart, IoRestaurant, IoSettings } from "react-icons/io5";

// Placeholder role logic (replace with your auth system)
const getUserRole = () => {
  // Example: Could be 'customer', 'kitchen', or 'admin' based on your auth
  return "customer"; // Default to 'customer' for now
};

const Navbar = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const role = getUserRole();

  const navItems = {
    customer: [
      { to: "/", icon: <IoHome className="text-2xl" />, label: "Home" },
      {
        to: "/order-details",
        icon: <IoCart className="text-2xl" />,
        label: "Cart",
        badge: cartItems.length,
      },
    ],
    kitchen: [
      {
        to: "/kitchen",
        icon: <IoRestaurant className="text-2xl" />,
        label: "Kitchen",
      },
    ],
    admin: [
      {
        to: "/admin",
        icon: <IoSettings className="text-2xl" />,
        label: "Admin",
      },
    ],
  };

  const visibleItems = navItems[role] || navItems.customer; // Fallback to customer if role is undefined

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-2 shadow-lg z-10">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? "bg-red-500 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            <div className="relative">
              {item.icon}
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
