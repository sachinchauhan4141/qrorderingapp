import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import VariantSelector from "./VariantSelector";
import QuantityAdjuster from "./QuantityAdjuster";

const ItemModal = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState(item.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, selectedVariant, quantity }));
    toast.success(
      `${item.name} (${selectedVariant.type}) x${quantity} added to cart!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src={item?.imageUrl || "https://via.placeholder.com/150"}
            alt={item?.name}
            className="w-32 h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{item?.name}</h2>
          <p className="text-gray-600 text-center mb-4">{item?.description}</p>
          <div className="w-full space-y-4 mb-6">
            <VariantSelector
              variants={item.variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
            <div>
              <label className="block font-semibold text-gray-900 mb-2">
                Quantity
              </label>
              <QuantityAdjuster
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Add to Cart
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-900 transition-colors py-2 mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
