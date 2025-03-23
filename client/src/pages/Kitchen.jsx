import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../redux/orderSlice";
import { IoSearch } from "react-icons/io5";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Kitchen = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`
        );
        dispatch(setOrders(response.data));
      } catch (error) {
        toast.error("Failed to fetch orders!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.on("orderUpdate", (updatedOrder) => {
      dispatch(
        setOrders(
          orders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        )
      );
      toast.info(`Order ${updatedOrder._id.slice(-6)}: ${updatedOrder.status}`);
    });

    return () => socket.disconnect();
  }, [dispatch, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        { status: newStatus }
      );
      dispatch(
        setOrders(orders.map((o) => (o._id === orderId ? response.data : o)))
      );
    } catch (error) {
      toast.error("Failed to update status!");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.tableNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Kitchen Dashboard
      </h2>
      <div className="space-y-4 mb-6">
        <div className="relative flex items-center bg-gray-200 rounded-full p-2">
          <IoSearch className="text-gray-600 ml-2" />
          <input
            type="text"
            placeholder="Search by table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none px-2 text-gray-900 placeholder-gray-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full p-3 bg-gray-200 rounded-lg text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Table: {order.tableNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Items: {order.items.length}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="p-2 bg-gray-100 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
