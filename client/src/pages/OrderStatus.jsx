import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { setCurrentOrder } from "../redux/orderSlice";
import { toast } from "react-toastify";

const OrderStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!currentOrder) {
      toast.error("No order found!");
      navigate("/");
      return;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.emit("joinOrder", currentOrder._id);

    socket.on("orderUpdate", (updatedOrder) => {
      dispatch(setCurrentOrder(updatedOrder));
      toast.info(`Order status: ${updatedOrder.status}`);
    });

    return () => socket.disconnect();
  }, [currentOrder, dispatch, navigate]);

  if (!currentOrder) return null;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Status</h2>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Order ID:</span>
            <span className="text-gray-700">{currentOrder._id.slice(-6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                currentOrder.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {currentOrder.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Payment:</span>
            <span className="text-gray-700">{currentOrder.paymentMethod}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/feedback")}
          className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          Leave Feedback
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;
