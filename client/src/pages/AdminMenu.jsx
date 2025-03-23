import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItems } from "../redux/menuSlice";
import { IoSearch, IoAdd, IoClose, IoPencil } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminMenu = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.menu);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    isVeg: "",
    inStock: "",
    isTopItem: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageFile: null,
    inStock: 1,
    isVeg: 0,
    variants: [{ type: "", size: "", price: 0 }],
    isTopItem: false,
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/menu`
        );
        dispatch(setMenuItems(response.data));
      } catch (error) {
        toast.error("Failed to fetch menu items!");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [dispatch]);

  const filteredItems = items?.filter((item) => {
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
    const matchesTop = filters.isTopItem
      ? item.isTopItem === (filters.isTopItem === "true")
      : true;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesVeg &&
      matchesStock &&
      matchesTop
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { type: "", size: "", price: 0 }],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.imageFile) data.append("image", formData.imageFile);
    data.append("inStock", formData.inStock);
    data.append("isVeg", formData.isVeg);
    data.append("variants", JSON.stringify(formData.variants));
    data.append("isTopItem", formData.isTopItem);

    try {
      if (editItem) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/menu/${editItem._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        dispatch(
          setMenuItems(
            items.map((item) =>
              item._id === editItem._id ? response.data : item
            )
          )
        );
        toast.success("Item updated!");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/menu`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        dispatch(setMenuItems([...items, response.data]));
        toast.success("Item added!");
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save item!");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/menu/${id}`);
      dispatch(setMenuItems(items?.filter((item) => item._id !== id)));
      toast.success("Item deleted!");
    } catch (error) {
      toast.error("Failed to delete item!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      imageFile: null,
      inStock: 1,
      isVeg: 0,
      variants: [{ type: "", size: "", price: 0 }],
      isTopItem: false,
    });
    setEditItem(null);
    setModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      imageFile: null,
      inStock: item.inStock,
      isVeg: item.isVeg,
      variants: item.variants,
      isTopItem: item.isTopItem,
    });
    setModalOpen(true);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Manage Menu</h2>
      <div className="space-y-4 mb-6">
        <div className="relative flex items-center bg-gray-200 rounded-full p-2">
          <IoSearch className="text-gray-600 ml-2" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none px-2 text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
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
          <select
            value={filters.isTopItem}
            onChange={(e) =>
              setFilters({ ...filters, isTopItem: e.target.value })
            }
            className="p-2 bg-gray-200 rounded-lg text-sm text-gray-700"
          >
            <option value="">Top</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2 mb-6"
      >
        <IoAdd className="text-xl" /> Add Item
      </button>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition-all"
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
                    {item.category} • {item.isVeg ? "Veg" : "Non-Veg"} •{" "}
                    {item.inStock ? "In Stock" : "Out"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <IoPencil />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <IoClose />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {editItem ? "Edit Item" : "Add Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={formLoading}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={formLoading}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  disabled={formLoading}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 text-gray-700"
                  disabled={formLoading}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  In Stock
                </label>
                <select
                  name="inStock"
                  value={formData.inStock}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={formLoading}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Vegetarian
                </label>
                <select
                  name="isVeg"
                  value={formData.isVeg}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={formLoading}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Variants
                </label>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Type"
                      value={variant.type}
                      onChange={(e) =>
                        handleVariantChange(index, "type", e.target.value)
                      }
                      className="w-1/3 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={formLoading}
                    />
                    <input
                      type="text"
                      placeholder="Size"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                      className="w-1/3 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={formLoading}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-1/3 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={formLoading}
                    />
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        disabled={formLoading}
                      >
                        <IoClose />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors mt-2"
                  disabled={formLoading}
                >
                  Add Variant
                </button>
              </div>
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    name="isTopItem"
                    checked={formData.isTopItem}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isTopItem: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 text-red-500 focus:ring-red-500"
                    disabled={formLoading}
                  />
                  Top Item
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex justify-center items-center"
                disabled={formLoading}
              >
                {formLoading ? (
                  <LoadingSpinner />
                ) : editItem ? (
                  "Update Item"
                ) : (
                  "Add Item"
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full text-gray-600 hover:text-gray-900 transition-colors py-2"
                disabled={formLoading}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
