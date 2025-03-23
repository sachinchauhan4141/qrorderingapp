import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItems } from "../redux/menuSlice";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import ItemModal from "../components/ItemModal";
import LoadingSpinner from "../components/LoadingSpinner";
import CartSummary from "../components/CartSummary";

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.menu);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    isVeg: "",
    inStock: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/menu`
        );
        dispatch(setMenuItems(response.data));
      } catch (error) {
        toast.error("Failed to fetch menu!");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [dispatch]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category
      ? item.category === filters.category
      : true;
    const matchesVeg = filters.isVeg
      ? item.isVeg === parseInt(filters.isVeg)
      : true;
    const matchesStock = filters.inStock
      ? item.inStock === parseInt(filters.inStock)
      : true;
    return matchesSearch && matchesCategory && matchesVeg && matchesStock;
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <div className="relative flex items-center bg-gray-200 rounded-full p-2 mb-4">
          <IoSearch className="text-gray-600 ml-2" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none px-2 text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="p-2 bg-gray-200 rounded-lg text-sm text-gray-700"
          >
            <option value="">All</option>
            <option value="Main">Main</option>
            <option value="Dessert">Dessert</option>
            <option value="Drinks">Drinks</option>
          </select>
          <select
            value={filters.isVeg}
            onChange={(e) => setFilters({ ...filters, isVeg: e.target.value })}
            className="p-2 bg-gray-200 rounded-lg text-sm text-gray-700"
          >
            <option value="">Veg/Non</option>
            <option value="1">Veg</option>
            <option value="0">Non-Veg</option>
          </select>
          <select
            value={filters.inStock}
            onChange={(e) =>
              setFilters({ ...filters, inStock: e.target.value })
            }
            className="p-2 bg-gray-200 rounded-lg text-sm text-gray-700"
          >
            <option value="">Stock</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4 pb-20">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-600">No items found.</p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-2 text-xs mt-1">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        item.isVeg
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        item.inStock
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <CartSummary />
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Menu;
