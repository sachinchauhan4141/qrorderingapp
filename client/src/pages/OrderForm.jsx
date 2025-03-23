import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderForm = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!tableNumber.trim()) newErrors.tableNumber = "Table number is required";
    if (items.length === 0) newErrors.cart = "Cart is empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        tableNumber,
        items: items.map((item) => ({ itemId: item._id, quantity: 1 })),
        notes,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData
      );
      toast.success("Order placed!");
      navigate("/payment", { state: { orderId: response.data._id } });
    } catch (error) {
      toast.error("Failed to save order!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Details</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        <div>
          <label className="block font-semibold text-gray-900 mb-2">
            Table Number
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.tableNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., T1"
            disabled={loading}
          />
          {errors.tableNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.tableNumber}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">
            Special Requests
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., No onions, extra spicy"
            rows="4"
            disabled={loading}
          />
        </div>
        {errors.cart && (
          <p className="text-red-500 text-sm text-center">{errors.cart}</p>
        )}
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
