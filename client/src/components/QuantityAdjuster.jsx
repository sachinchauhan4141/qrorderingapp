const QuantityAdjuster = ({ quantity, onQuantityChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
      >
        −
      </button>
      <span className="text-gray-900 font-semibold w-6 text-center">
        {quantity}
      </span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default QuantityAdjuster;
