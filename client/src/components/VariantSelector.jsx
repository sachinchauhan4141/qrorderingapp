const VariantSelector = ({ variants, selectedVariant, onVariantChange }) => {
  return (
    <div className="w-full">
      <label className="block font-semibold text-gray-900 mb-2">
        Select Variant
      </label>
      <select
        value={`${selectedVariant.type}-${selectedVariant.size}`}
        onChange={(e) => {
          const [type, size] = e.target.value.split("-");
          onVariantChange(
            variants.find((v) => v.type === type && v.size === size)
          );
        }}
        className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {variants.map((variant, index) => (
          <option key={index} value={`${variant.type}-${variant.size}`}>
            {variant.type} ({variant.size}) - ${variant.price.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VariantSelector;
