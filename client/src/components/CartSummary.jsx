import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoCart } from "react-icons/io5";

const CartSummary = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.selectedVariant?.price || item.variants[0].price) *
        (item.quantity || 1),
    0
  );

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-16 left-0 w-full max-w-md mx-auto p-4 bg-white rounded-t-xl shadow-lg z-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <IoCart className="text-xl text-gray-900" />
          <span className="font-semibold text-gray-900">
            {items.length} Item{items.length > 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-lg font-bold text-red-500">${total.toFixed(2)}</p>
      </div>
      <button
        onClick={() => navigate("/order-details")}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex justify-center items-center gap-2"
      >
        <IoCart className="text-xl" />
        <span>View Cart</span>
      </button>
    </div>
  );
};

export default CartSummary;
