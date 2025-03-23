import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoTrash } from "react-icons/io5";
import { clearCart } from "../redux/cartSlice";
import QuantityAdjuster from "../components/QuantityAdjuster";

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleQuantityChange = (index, newQuantity) => {
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    if (newItems[index].quantity <= 0) {
      newItems.splice(index, 1);
    }
    dispatch(clearCart());
    newItems.forEach((item) =>
      dispatch({ type: "cart/addToCart", payload: item })
    );
  };

  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.selectedVariant?.price || item.variants[0].price) *
        (item.quantity || 1),
    0
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Cart</h2>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            Your cart is empty. Add some delicious items!
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/60"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.selectedVariant?.type || item.variants[0].type} • $
                    {(
                      item.selectedVariant?.price || item.variants[0].price
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <QuantityAdjuster
                  quantity={item.quantity || 1}
                  onQuantityChange={(newQty) =>
                    handleQuantityChange(index, newQty)
                  }
                />
                <IoTrash
                  className="text-red-500 text-xl cursor-pointer hover:text-red-700 transition-colors ml-2"
                  onClick={() => handleQuantityChange(index, 0)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 sticky bottom-16">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-gray-900">Total</p>
            <p className="text-lg font-bold text-red-500">
              ${total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => navigate("/order-form")}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
